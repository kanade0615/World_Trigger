export interface CharacterData {
  name: string;
  stats: {
    trion: number;
    speed: number;
    range: number;
    attack: number;
    defenseSupport: number;
    special: number;
    technique: number;
  };
  triggers: {
    main: string[];
    sub: string[];
  };
}

export interface TriggerLibrary {
  [category: string]: {
    [subcategory: string]: string[];
  } | string[];
}

export interface SectionProps {
  data: CharacterData;
  onUpdate: (path: string, value: any) => void;
  isVIP?: boolean;
  triggerLibrary?: TriggerLibrary;
}