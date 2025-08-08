export interface CharacterData {
  name: string;
  stats: {
    trion: number;
    speed: number;
    range: number;
    attack: number;
    defenseSupport: number;
    technique: number;
  };
  triggers: {
    main: string[];
    sub: string[];
  };
}

export interface Trigger {
  name: string;
  type: string;
  option?: string;
  weapon?: string;
  bullet?: string;
}

export type TriggerLibrary = Trigger[];

export interface SectionProps {
  data: CharacterData;
  onUpdate: (path: string, value: any) => void;
  isVIP?: boolean;
  triggerLibrary?: TriggerLibrary;
}