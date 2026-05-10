
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

export interface AiLimitCheck{
  globalLimitReached: boolean;
  userLimitRemaining: number;
}