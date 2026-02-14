
        
export enum StepState {
  Completed = '✔',
  InProgress = '⏳',
  Pending = '',
}

export interface ProcessingStep {
  id: number;
  description: string;
  state: StepState;
}

export const MOCK_PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: 1,
    description: 'Extracting clean text',
    state: StepState.Completed,
  },
  {
    id: 2,
    description: 'Estimating reading time',
    state: StepState.Completed,
  },
  {
    id: 3,
    description: 'Creating a short summary',
    state: StepState.InProgress,
  },
];

export const MOCK_PROCESSING_STEPS_COMPLETE: ProcessingStep[] = [
  {
    id: 1,
    description: 'Extracting clean text',
    state: StepState.Completed,
  },
  {
    id: 2,
    description: 'Estimating reading time',
    state: StepState.Completed,
  },
  {
    id: 3,
    description: 'Creating a short summary',
    state: StepState.Completed,
  },
];

export const getProcessingSteps = (status: 'in_progress' | 'complete'): ProcessingStep[] => {
    return status === 'complete' ? MOCK_PROCESSING_STEPS_COMPLETE : MOCK_PROCESSING_STEPS;
}
        
      