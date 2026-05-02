
export interface AiTutorial {
  id: string;
  title: string;
  generalDescription: string;
  steps: Step[];
}

export interface Step{
  number: number;
  instruction: string;
  advice?: string;
}