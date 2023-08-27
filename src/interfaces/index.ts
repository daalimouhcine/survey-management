import { Survey } from "../types";

export interface CreateSurveyProps {
  isOpen: boolean;
  setOpen: () => void;
  setReFetch: () => void;
  surveyToEdit?: Survey; // Assuming Survey is the type for surveyToEdit
  removeEditSurvey: () => void;
}

export interface SurveyActionsProps {
  survey: Survey;
  viewDetails: () => void;
  setReFetch: () => void;
  setSurveyToEdit: (survey: Survey) => void;
  setOpenEdit: () => void;
}

export interface SurveyRowProps {
  survey: Survey;
  index: number;
  setReFetch: () => void;
  setSurveyToEdit: (survey: Survey) => void;
  setOpenEdit: () => void;
}

export interface SurveyDetailsProps {
    isOpen: boolean;
    setOpen: () => void;
    survey: Survey;
    surveyTitle: string;
  
}