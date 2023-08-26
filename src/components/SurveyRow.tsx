import { Survey } from "../types";
import { useState } from "react";
import SurveyDetails from "./SurveyDetails";
import SurveyActions from "./SurveyActions";

const SurveyRow = ({
  survey,
  index,
  setReFetch,
  setSurveyToEdit,
  setOpenEdit,
}: {
  survey: Survey;
  index: number;
  setReFetch: any;
  setSurveyToEdit: any;
  setOpenEdit: any;
}) => {
  const [openDetails, setOpenDetails] = useState(false);

  const editSurvey = (survey: Survey) => {
    setSurveyToEdit(survey);
  };

  return (
    <>
      <tr>
        <td>
          <SurveyDetails
            survey={survey}
            isOpen={openDetails}
            setOpen={() => setOpenDetails(!openDetails)}
            surveyTitle={survey.surveyName}
          />
        </td>
      </tr>
      <tr
        className={`hover:bg-gray-100 cursor-pointer ${
          index % 2 === 0 ? undefined : "bg-gray-50"
        }`}>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
          {survey.surveyId}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.surveyName}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {new Date(survey.startDate).toLocaleString()}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {new Date(survey.endDate).toLocaleString()}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{survey.introPrompt}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{survey.outroPrompt}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.questions?.length || 0}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
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
          <SurveyActions
            survey={survey}
            viewDetails={() => setOpenDetails(true)}
            setReFetch={setReFetch}
            setSurveyToEdit={editSurvey}
            setOpenEdit={() => setOpenEdit(true)}
          />
        </td>
      </tr>
    </>
  );
};

export default SurveyRow;
