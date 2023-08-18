import SurveyRow from "./SurveyRow";
import { Survey } from "../types";

const surveys: Survey[] = [
  {
    SurveyId: 1234,
    SurveyName: "Summer 2023",
    startDate: "2023-01-10T06:14:00Z",
    endDate: "2023-02-10T06:14:00Z",
    description: "This is a short survey to identify your overall satisfaction",
    introPrompt:
      "You will hear 3 short questions related to the service we provide for you. Please answer each question by speaking the corresponding number into your telephone.",
    outroPrompt:
      "Thank you very much for participating. Have a nice day. Good Bye!",
    surveyActive: true,
    CreatedBy: "Anna Rodriques",
    questions: [
      {
        questionNumber: 1,
        maxValue: 5,
        minValue: 1,
        questionText:
          "On a scale of 1 to 5, with 1 being unsatisfied and 5 being very satisfied, how would you rate your overall satisfaction with the support you received?",
      },
      {
        questionNumber: 2,
        maxValue: 5,
        minValue: 1,
        questionText:
          "On a scale of 1 to 5, with 1 being unsatisfied and 5 being very satisfied, how would you rate the knowledge of the agent and their ability to address your issue?",
      },
      {
        questionNumber: 3,
        maxValue: 6,
        minValue: 1,
        questionText:
          "On a scale of 1 to 5, with 1 being unsatisfied and 5 being very satisfied, how would you rate the time it took to resolve your issue?",
      },
    ],
  },
];
const SurveyTable = () => {
  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-10'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-xl font-semibold text-gray-900'>Surveys</h1>
          <p className='mt-2 text-sm text-gray-700'>
            A list of all the surveys in your account including their name,
            Start Date, End Date, Status and more.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
          <button
            type='button'
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'>
            Add survey
          </button>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
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
                  {surveys.map((survey, index) => (
                    <SurveyRow
                      key={survey.SurveyId}
                      index={index}
                      survey={survey}
                    />
                  ))}
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
