export type Question = {
  questionNumber: number;
  maxValue: number;
  minValue: number;
  questionText: string;
};

export type Survey = {
  surveyId?: number;
  surveyName: string;
  startDate: string;
  endDate: string;
  description: string;
  introPrompt: string;
  outroPrompt: string;
  surveyActive: boolean;
  CreatedBy?: string;
  questions: Question[];
};

export type createSurveyForm = {
  surveyName: string;
  startDate: string;
  endDate: string;
  introPrompt: string;
  outroPrompt: string;
  description: string;
  surveyActive: boolean;
};

export type createQuestionForm = {
  questionNumber?: number;
  questionText: string;
  minValue: number;
  maxValue: number;
};

export type Search = {
  search: string;
  byActive: boolean;
  byInActive: boolean;
};
