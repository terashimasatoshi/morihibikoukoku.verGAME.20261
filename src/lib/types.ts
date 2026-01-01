export interface Tag {
  id: string;
  label: string;
  category: string;
  description: string;
  synonyms: string[];
}

export interface MenuConstraints {
  requires_spa_with?: boolean;
  requires_staff?: string;
  add_on_only?: boolean;
  price_note?: string;
}

export interface MenuTagging {
  menu_id: string;
  menu_name: string;
  tags: string[];
  key_reasons: string[];
  constraints: MenuConstraints;
  reservationUrl?: string;
}

export interface AnimalType {
  id: string;
  name: string;
  emoji: string;
  catchphrase: string;
  core_signs: string[];
  recommended: {
    primary_menus: string[];
    add_ons: string[];
    optional: string[];
  };
  one_line_advice: string;
}

export interface QuestionOption {
  label: string;
  value: string | number;
}

export interface QuestionScoring {
  [key: string]: Record<string, number>;
}

export interface Question {
  id: string;
  question: string;
  type: 'single_choice' | 'multi_choice' | 'slider_0_10';
  options: QuestionOption[] | { min: number; max: number; labels: string[] };
  scoring: QuestionScoring;
}

export interface DesignData {
  tags: Tag[];
  menu_tagging: MenuTagging[];
  animal_types: AnimalType[];
  question_bank: Question[];
  routing_rules: any;
}
