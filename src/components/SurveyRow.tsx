import { Survey } from "../types";
import { useState } from "react";
import ListQuestionTable from "./ListQuestionTable";
import SurveyActions from "./SurveyActions";

const SurveyRow = ({ survey, index }: { survey: Survey; index: number }) => {
  const [openQuestions, setOpenQuestions] = useState(false);

  return (
    <>
      <ListQuestionTable
        survey={survey}
        isOpen={openQuestions}
        setOpen={() => setOpenQuestions(!openQuestions)}
        surveyTitle={survey.SurveyName}
      />
      <tr
        className={`hover:bg-gray-100 cursor-pointer ${
          index % 2 === 0 ? undefined : "bg-gray-50"
        }`}>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
          {survey.SurveyId}
        </td>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.SurveyName}
        </td>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.startDate.split("T")[0]}
        </td>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.endDate.split("T")[0]}
        </td>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{survey.introPrompt}</p>
        </td>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{survey.outroPrompt}</p>
        </td>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.questions.length}
        </td>
        <td
          onClick={() => setOpenQuestions(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.surveyActive ? (
            <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
              Active
            </span>
          ) : (
            <span className='inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800'>
              Not Active
            </span>
          )}
        </td>
        <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
          <SurveyActions survey={survey} />
        </td>
      </tr>
    </>
  );
};

export default SurveyRow;
