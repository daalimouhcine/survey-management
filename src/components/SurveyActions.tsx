import { useState } from "react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Survey } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";
import Swal from "sweetalert2";
import axios from "axios";

const SurveyActions = ({
  survey,
  viewDetails,
  setReFetch,
}: {
  survey: Survey;
  viewDetails: any;
  setReFetch: any;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => {
    setOpen(false);
  });

  const removeSurvey = (surveyId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys/" +
              surveyId
          )
          .then((res) => {
            if (res.data.statusCode == 200) {
              const responseMessage = JSON.parse(res.data.body);
              Swal.fire("Deleted!", responseMessage.message, "success");
              setReFetch();
            }
          });
      }
    });
  };

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
        <button
          onClick={() => {
            setOpen(false);
            removeSurvey(survey.surveyId!);
          }}
          className='w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Delete</span>
          <TrashIcon className='w-4 h-4 ml-2 inline-block text-red-400' />
        </button>
      </div>
    </div>
  );
};

export default SurveyActions;
