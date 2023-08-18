import { XMarkIcon } from "@heroicons/react/20/solid";
import { Survey } from "../types";
import QuestionRow from "./QuestionRow";

const ListQuestionTable = ({
  isOpen,
  setOpen,
  survey,
  surveyTitle,
}: {
  isOpen: boolean;
  setOpen: any;
  survey: Survey;
  surveyTitle: string;
}) => {
  return (
    <div
      className={`h-[90vh] sm:h-[85vh] w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-t-3xl bg-white xl:bg-gray-400 fixed z-30 ${
        !isOpen ? "-bottom-full" : "-bottom-0"
      } transition-all ease-out duration-500 left-1/2 -translate-x-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-gray-300 xl:bg-white h-3 w-28 rounded-full absolute top-2 left-1/2 -translate-x-1/2'></div>
      <div className='w-full flex justify-between items-center'>
        <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
          List of Questions for {surveyTitle}
        </h3>
        <button
          onClick={() => setOpen()}
          className='p-1 lg:p-2 bg-white rounded-lg grid place-items-center shadow-md hover:shadow-2xl transition'>
          <XMarkIcon className='h-5 w-5 lg:h-6 lg:w-6 text-gray-900' />
        </button>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      N°
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      Question Text
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Min Value
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Max Value
                    </th>
                    <th
                      scope='col'
                      className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {survey.questions.map((question, index) => (
                    <QuestionRow
                      key={question.questionNumber}
                      index={index}
                      question={question}
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

export default ListQuestionTable;
