// type for the question object
export type Question = {
  questionNumber: number;
  maxValue: number;
  minValue: number;
  questionText: string;
};

// type for the survey object
export type Survey = {
  SurveyId: number;
  SurveyName: string;
  startDate: string;
  endDate: string;
  description: string;
  introPrompt: string;
  outroPrompt: string;
  surveyActive: boolean;
  CreatedBy: string;
  questions: Question[];
};

export type createSurveyForm = {
  title: string;
  startDate: string;
  endDate: string;
  introPrompt: string;
  outroPrompt: string;
  description: string;
};

export type createQuestionForm = {
  questionText: string;
  minValue: number;
  maxValue: number;
};