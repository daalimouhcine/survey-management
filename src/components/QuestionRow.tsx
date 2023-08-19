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
    </tr>
  );
};

export default QuestionRow;
