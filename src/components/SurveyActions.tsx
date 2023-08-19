import { useState } from "react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Survey } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";

const SurveyActions = ({
  survey,
  viewDetails,
}: {
  survey: Survey;
  viewDetails: any;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => {
    setOpen(false);
  });
  return (
    <div ref={open ? ref : undefined} className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='p-1 bg-gray-300 rounded-md hover:bg-gray-200 transition-colors ease-linear duration-200'>
        <EllipsisVerticalIcon className='w-5 h-5 text-gray-800' />
      </button>
      <div
        className={`w-fit flex flex-col absolute right-0 -translate-x-1/2 top-0 -translate-y-full mt-8 bg-white rounded-md overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
          open ? "" : "hidden"
        }`}>
        <button
          onClick={() => {
            setOpen(false);
            viewDetails();
          }}
          className='w-full items-center justify-center flex px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Details</span>
          <EyeIcon className='w-4 h-4 ml-2 inline-block text-green-400' />
        </button>
        <button className='w-full items-center justify-center flex px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Edit</span>
          <PencilSquareIcon className='w-4 h-4 ml-2 inline-block text-blue-400' />
        </button>
        <button className='w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Delete</span>
          <TrashIcon className='w-4 h-4 ml-2 inline-block text-red-400' />
        </button>
      </div>
    </div>
  );
};

export default SurveyActions;
