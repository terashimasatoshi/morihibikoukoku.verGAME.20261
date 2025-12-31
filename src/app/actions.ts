'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import designData from '@/lib/design.json';
import { AnimalType, MenuTagging, DesignData } from '@/lib/types';

const data = designData as unknown as DesignData;

export interface DiagnosisResult {
    animal: AnimalType;
    primaryMenu: MenuTagging;
    secondaryMenu?: MenuTagging;
    addOns: MenuTagging[];
    advice: string;
    personalityDescription?: string;
}

// Rule-based logic (moved from client-side diagnosis.ts)
function calculateRuleBasedResult(answers: Record<string, any>): DiagnosisResult {
    // 1. Calculate Scores (Tags & Animals)
    const tagScores: Record<string, number> = {};
    const animalScores: Record<string, number> = {};

    // Initialize scores
    data.tags.forEach(t => tagScores[t.id] = 0);
    data.animal_types.forEach(a => animalScores[a.id] = 0);

    // Process answers
    data.question_bank.forEach(q => {
        const answer = answers[q.id];
        if (answer === undefined) return;

        if (q.type === 'single_choice') {
            const scoreMap = q.scoring[answer as string];
            if (scoreMap) {
                Object.entries(scoreMap).forEach(([key, weight]) => {
                    if (tagScores.hasOwnProperty(key)) tagScores[key] += weight;
                    if (animalScores.hasOwnProperty(key)) animalScores[key] += weight;
                });
            }
        } else if (q.type === 'multi_choice') {
            (answer as string[]).forEach(val => {
                const scoreMap = q.scoring[val];
                if (scoreMap) {
                    Object.entries(scoreMap).forEach(([key, weight]) => {
                        if (tagScores.hasOwnProperty(key)) tagScores[key] += weight;
                        if (animalScores.hasOwnProperty(key)) animalScores[key] += weight;
                    });
                }
            });
        } else if (q.type === 'slider_0_10') {
            const val = answer as number;
            if (val >= 7) {
                const scoreMap = q.scoring['high'];
                if (scoreMap) {
                    Object.entries(scoreMap).forEach(([key, weight]) => {
                        if (tagScores.hasOwnProperty(key)) tagScores[key] += weight;
                        if (animalScores.hasOwnProperty(key)) animalScores[key] += weight;
                    });
                }
            } else if (val >= 4) {
                const scoreMap = q.scoring['mid'];
                if (scoreMap) {
                    Object.entries(scoreMap).forEach(([key, weight]) => {
                        if (tagScores.hasOwnProperty(key)) tagScores[key] += weight;
                        if (animalScores.hasOwnProperty(key)) animalScores[key] += weight;
                    });
                }
            }
        }
    });

    // 2. Determine Animal Type
    let bestAnimal = data.animal_types[0];
    let maxAnimalScore = -1;

    data.animal_types.forEach(animal => {
        const score = animalScores[animal.id] || 0;
        if (score > maxAnimalScore) {
            maxAnimalScore = score;
            bestAnimal = animal;
        }
    });

    // 3. Determine Recommended Menu
    const menuScores = data.menu_tagging
        .filter(m => !m.constraints.add_on_only && !m.constraints.requires_spa_with)
        .map(menu => {
            let score = 0;
            menu.tags.forEach(tag => {
                score += (tagScores[tag] || 0);
            });

            if (bestAnimal.recommended.primary_menus.includes(menu.menu_name)) {
                score += 5;
            }

            return { menu, score };
        });

    menuScores.sort((a, b) => b.score - a.score);

    const primaryMenu = menuScores[0].menu;
    const secondaryMenu = menuScores.length > 1 ? menuScores[1].menu : undefined;

    // 4. Determine Add-ons
    const addOns: MenuTagging[] = [];
    if (tagScores['cold_sensitivity'] > 0 || tagScores['eye_strain'] > 0) {
        const hotSpa = data.menu_tagging.find(m => m.menu_id === 'hot_spa_addon');
        if (hotSpa) addOns.push(hotSpa);
    }
    if (tagScores['face_care'] > 0) {
        const lala = data.menu_tagging.find(m => m.menu_id === 'lala_peel_face');
        if (lala) addOns.push(lala);
    }
    if (tagScores['gray_hair'] > 0) {
        const color = data.menu_tagging.find(m => m.menu_id === 'root_color');
        if (color) addOns.push(color);
    }

    return {
        animal: bestAnimal,
        primaryMenu,
        secondaryMenu,
        addOns,
        advice: bestAnimal.one_line_advice
    };
}

export async function diagnoseUserAction(answers: Record<string, any>): Promise<DiagnosisResult> {
    const baseResult = calculateRuleBasedResult(answers);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log('No Gemini API Key found, using rule-based advice.');
        return {
            ...baseResult,
            personalityDescription: "（サンプル）あなたは森の木々のように、静かで芯の強いタイプかもしれません。日々の喧騒の中で、少し自分の根っこを休める時間が必要そうです。"
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
      あなたは「森の日々」というヘッドスパサロンの診断コンシェルジュです。
      ユーザーの回答に基づいて、以下の診断結果が出ました。
      
      【診断結果】
      - お疲れタイプ: ${baseResult.animal.name} (${baseResult.animal.catchphrase})
      - おすすめメニュー: ${baseResult.primaryMenu.menu_name}
      - 理由: ${baseResult.primaryMenu.key_reasons.join(', ')}
      
      【ユーザーの回答状況】
      ${JSON.stringify(answers)}
      
      このユーザーに向けて、以下の2つの項目を含むJSONを出力してください。
      
      1. personality_description (100文字以内):
         「あなたは〇〇なタイプかも？」という形式で、ユーザーの性格や現在の状態を分析して伝えてください。
         動物タイプの特徴を踏まえつつ、回答内容から推測される傾向（頑張り屋さん、気配り上手など）を優しく指摘してください。
      
      2. advice (150文字以内):
         そのタイプであることを踏まえ、「だからこそ、〇〇なケアがおすすめです」という流れで、
         日常生活でできる具体的なケアのアドバイス（断定せず、やさしく提案）と、現在の疲れへの共感を含めてください。
      
      ※口調は丁寧で、少し神秘的かつ癒やされる雰囲気で（「森の賢者」のような）。
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
            try {
                const json = JSON.parse(text);
                return {
                    ...baseResult,
                    advice: json.advice,
                    personalityDescription: json.personality_description
                };
            } catch (e) {
                console.error('Failed to parse Gemini JSON', e);
                // Fallback if JSON parsing fails but we have text (unlikely with responseMimeType but possible)
                return {
                    ...baseResult,
                    advice: text // Might be raw JSON string if parse failed, but better than nothing or maybe just fallback to base
                };
            }
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
    }

    return baseResult;
}
