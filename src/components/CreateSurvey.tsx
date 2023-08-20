import { useForm } from "react-hook-form";
import { createSurveyForm } from "../types";

const CreateSurvey = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: any;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<createSurveyForm>();

  const onSubmit = (data: createSurveyForm) => {
    console.log(data);
  };

  const cancel = () => {
    reset();
    setOpen(false);
  };

  // validate the start and end date of the survey and ensure that the start date is not after the end date and vice versa and change the error message accordingly
  const validateDate = (date: string, type: string) => {
    if (type === "startDate") {
      if (new Date(date) < new Date()) {
        return "Start Date cannot be before the current date and time";
      } else if (new Date(date) > new Date(watch("endDate"))) {
        setError("endDate", {
          type: "manual",
          message: "End Date cannot be before the Start Date",
        });
        return "Start Date cannot be after the End Date";
      } else {
        errors.startDate = undefined;
        errors.endDate = undefined;
        return true;
      }
    } else {
      if (new Date(date) < new Date(watch("startDate"))) {
        setError("startDate", {
          type: "manual",
          message: "Start Date cannot be after the End Date",
        });
        return "End Date cannot be before the Start Date";
      } else {
        errors.startDate = undefined;
        errors.endDate = undefined;
        return true;
      }
    }
  };

  return (
    <div
      className={`h-[90vh] sm:h-[85vh] w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-t-3xl bg-gray-400 fixed z-30 ${
        !isOpen ? "-bottom-full" : "-bottom-0"
      } transition-all ease-out duration-500 left-1/2 -translate-x-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28 rounded-full absolute top-2 left-1/2 -translate-x-1/2'></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full flex justify-between items-center'>
          <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
            Create New Survey
          </h3>
          <div className='flex gap-x-2'>
            <button className='relative px-5 py-2.5 overflow-hidden font-medium text-green-500 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group'>
              <span className='absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-green-400 group-hover:w-full ease'></span>
              <span className='absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-green-400 group-hover:w-full ease'></span>
              <span className='absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-green-400 group-hover:h-full ease'></span>
              <span className='absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-green-400 group-hover:h-full ease'></span>
              <span className='absolute inset-0 w-full h-full duration-300 delay-300 bg-green-500 opacity-0 group-hover:opacity-100'></span>
              <span className='relative transition-colors duration-300 delay-200 group-hover:text-white ease'>
                Create
              </span>
            </button>
            <button
              type='button'
              onClick={() => cancel()}
              className='relative px-5 py-2.5 overflow-hidden font-medium text-red-500 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group'>
              <span className='absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-red-400 group-hover:w-full ease'></span>
              <span className='absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-red-400 group-hover:w-full ease'></span>
              <span className='absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-400 group-hover:h-full ease'></span>
              <span className='absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-400 group-hover:h-full ease'></span>
              <span className='absolute inset-0 w-full h-full duration-300 delay-300 bg-red-500 opacity-0 group-hover:opacity-100'></span>
              <span className='relative transition-colors duration-300 delay-200 group-hover:text-white ease'>
                Cancel
              </span>
            </button>
          </div>
        </div>
        <div className='w-full h-fit flex flex-col gap-y-3 bg-gray-50 rounded-lg p-5 pb-8 mt-5'>
          <p className='text-gray-800 text-sm font-medium'>
            1. Start with setting up your survey information
          </p>
          <div className='flex flex-col gap-y-8'>
            <div className='flex gap-x-5'>
              <div className='w-2/4 relative mt-1'>
                <input
                  className={`peer h-full w-full border-b ${
                    errors.title ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errors.title
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='title'
                  {...register("title", { required: true })}
                />
                <label
                  htmlFor='title'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Survey Title
                </label>
                {errors.title && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    This field is required
                  </p>
                )}
              </div>
              <div className='flex gap-x-5 w-2/4'>
                <div className='w-1/2 relative'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errors.startDate ? "border-red-200" : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errors.startDate
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='datetime-local'
                    id='startDate'
                    {...register("startDate", {
                      required: true,
                      validate: (value) => validateDate(value, "startDate"),
                    })}
                  />
                  <label
                    htmlFor='startDate'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    Start Date
                  </label>
                  {errors.startDate && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errors.startDate.type === "required"
                        ? "This field is required"
                        : errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className='w-1/2 relative'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errors.endDate ? "border-red-200" : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errors.endDate
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='datetime-local'
                    id='endDate'
                    {...register("endDate", {
                      required: true,
                      validate: (value) => validateDate(value, "endDate"),
                    })}
                  />
                  <label
                    htmlFor='endDate'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    End Date
                  </label>
                  {errors.endDate && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errors.endDate.type === "required"
                        ? "This field is required"
                        : errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className='flex gap-x-5'>
              <div className='w-1/2 relative '>
                <input
                  className={`peer h-full w-full border-b ${
                    errors.introPrompt ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errors.introPrompt
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='introPrompt'
                  {...register("introPrompt", { required: true })}
                />
                <label
                  htmlFor='introPrompt'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Intro Prompt
                </label>
                {errors.introPrompt && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Intro Prompt is required
                  </p>
                )}
              </div>
              <div className='w-1/2 relative '>
                <input
                  className={`peer h-full w-full border-b ${
                    errors.outroPrompt ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errors.outroPrompt
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='outroPrompt'
                  {...register("outroPrompt", { required: true })}
                />
                <label
                  htmlFor='outroPrompt'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Outro Prompt
                </label>
                {errors.outroPrompt && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Outro Prompt is required
                  </p>
                )}
              </div>
            </div>
            <div className='w-full relative'>
              <textarea
                className={`peer h-full w-full border-b ${
                  errors.description ? "border-red-200" : "border-gray-200"
                } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                  errors.description
                    ? "placeholder-shown:border-red-200"
                    : "placeholder-shown:border-gray-200"
                } focus:border-green-500 focus:outline-0 disabled:border-0`}
                placeholder=' '
                id='description'
                {...register("description", { required: true })}
              />{" "}
              <label
                htmlFor='description'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Description
              </label>
              {errors.description && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Description is required
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className='mt-8 flex flex-col p-1 bg-gray-100 rounded-lg'>
        <div className='flex justify-between items-center px-5 pt-3'>
          <p className='text-gray-800 text-sm font-medium'>2. Add Questions</p>
        </div>
        <div className='flex flex-col gap-y-3 my-5 px-5'>
          <div className='w-full flex gap-10'>
            <div className='w-2/4 relative '>
              <input
                className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                placeholder=' '
                type='text'
                name='questionText'
                id='questionText'
              />
              <label
                htmlFor='questionText'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Question Text
              </label>
            </div>
            <div className='w-1/4 relative '>
              <input
                className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                placeholder=' '
                type='number'
                name='minValue'
                id='minValue'
              />
              <label
                htmlFor='minValue'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Min Value
              </label>
            </div>
            <div className='w-1/4 relative '>
              <input
                className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                placeholder=' '
                type='number'
                name='maxValue'
                id='maxValue'
              />
              <label
                htmlFor='maxValue'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Max Value
              </label>
            </div>
          </div>
          <button className='self-end relative inline-flex items-center justify-start px-5 py-2.5  overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group'>
            <span className='w-48 h-48 rounded rotate-[-40deg] bg-green-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0'></span>
            <span className='relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white'>
              Add Question
            </span>
          </button>
        </div>
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
                  </tr>
                </thead>
                <tbody className='bg-white'></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
