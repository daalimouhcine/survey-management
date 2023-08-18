import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Question } from "../types";

const QuestionRow = ({
  question,
  index,
}: {
  question: Question;
  index: number;
}) => {
  return (
    <tr
      className={`hover:bg-gray-100 ${
        index % 2 === 0 ? undefined : "bg-gray-50"
      }`}>
      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
        {question.questionNumber}
      </td>
      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
        {question.questionText}
      </td>
      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
        {question.minValue}
      </td>
      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
        {question.maxValue}
      </td>
      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
        <button className='p-1 bg-gray-300 rounded-md hover:bg-gray-200 transition-colors ease-linear duration-200'>
          <EllipsisVerticalIcon className='w-5 h-5 text-gray-800' />
        </button>
      </td>
    </tr>
  );
};

export default QuestionRow;
