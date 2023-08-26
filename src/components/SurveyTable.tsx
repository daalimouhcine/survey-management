import SurveyRow from "./SurveyRow";
import { Survey } from "../types";
import CreateSurvey from "./CreateSurvey";
import { useEffect, useState } from "react";
import axios from "axios";

const SurveyTable = () => {
  const [createSurveyOpen, setCreateSurveyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [reFetch, setReFetch] = useState(false);
  const [surveyToEdit, setSurveyToEdit] = useState<Survey | undefined>();

  useEffect(() => {
    setLoading(true);
    const getSurveys = async () => {
      await axios
        .get(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys"
        )
        .then((res: { data: { body: { content: Survey }[] } }) => {
          const surveysWithoutContent = res.data.body
            .filter((item: { content: Survey }) => item.content)
            .map((item: { content: Survey }) => {
              const { content } = item;
              return content;
            });
          setSurveys([...surveysWithoutContent]);
          setLoading(false);
        });
    };
    getSurveys();
  }, [reFetch]);

  useEffect(() => {
    if (surveyToEdit) {
      setCreateSurveyOpen(true);
    }
  }, [surveyToEdit]);

  const removeEditSurvey = () => {
    setSurveyToEdit(undefined);
  };

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-10'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-xl font-semibold text-gray-900'>Surveys</h1>
          <p className='mt-2 text-sm text-gray-700'>
            A list of all the surveys including with this details: Id, Name,
            Start Date, End Date, Status and more.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
          <CreateSurvey
            isOpen={createSurveyOpen}
            setOpen={() => setCreateSurveyOpen(false)}
            setReFetch={() => setReFetch(!reFetch)}
            surveyToEdit={surveyToEdit}
            removeEditSurvey={removeEditSurvey}
          />
          <button
            onClick={() => setCreateSurveyOpen(true)}
            type='button'
            className='relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-100 group'>
            <span className='absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full'></span>
            <span className='absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
              </svg>
            </span>
            <span className='absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
              </svg>
            </span>
            <span className='relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white'>
              Add Survey
            </span>
          </button>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='w-full p-3 '>
            <div className='overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-500'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100 sm:pl-6'>
                      Id
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100 sm:pl-6'>
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Start Date
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      End Date
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Intro Prompt
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Outro Prompt
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Questions Count
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Status
                    </th>
                    <th
                      scope='col'
                      className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center'>
                        Loading...
                      </td>
                    </tr>
                  ) : surveys?.length > 0 ? (
                    surveys.map((survey, index) => (
                      <SurveyRow
                        key={survey.surveyId}
                        index={index}
                        survey={survey}
                        setReFetch={() => setReFetch(!reFetch)}
                        setSurveyToEdit={setSurveyToEdit}
                        setOpenEdit={() => setCreateSurveyOpen(true)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center'>
                        No Surveys Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyTable;
