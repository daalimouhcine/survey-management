import { useForm } from "react-hook-form";
import {
  Question,
  Survey,
  createQuestionForm,
  createSurveyForm,
} from "../types";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import axios from "axios";
import { CreateSurveyProps } from "../interfaces";

const CreateSurvey: React.FC<CreateSurveyProps> = ({
  surveyNames,
  isOpen,
  setOpen,
  setReFetch,
  surveyToEdit,
  surveyToClone,
  removeDefaultSurvey,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionOnEdit, setQuestionOnEdit] = useState<number>(0);

  const {
    register: registerSurvey,
    handleSubmit: handleSubmitSurvey,
    reset: resetSurvey,
    watch: watchSurvey,
    setError: setErrorSurvey,
    clearErrors: clearErrorsSurvey,
    formState: { errors: errorsSurvey },
  } = useForm<createSurveyForm>();
  const {
    register: registerQuestion,
    handleSubmit: handleSubmitQuestion,
    reset: resetQuestion,
    watch: watchQuestion,
    setError: setErrorQuestion,
    clearErrors: clearErrorsQuestion,
    formState: { errors: errorsQuestion },
  } = useForm<createQuestionForm>();

  useEffect(() => {
    setQuestions(surveyToEdit?.questions || surveyToClone?.questions || []);
    resetSurvey({
      surveyName: surveyToEdit?.surveyName || "",
      startDate: surveyToEdit?.startDate
        ? new Date(surveyToEdit.startDate).toISOString().substr(0, 10)
        : surveyToClone?.startDate
        ? new Date(surveyToClone.startDate).toISOString().substr(0, 10)
        : "",
      endDate: surveyToEdit?.endDate
        ? new Date(surveyToEdit.endDate).toISOString().substr(0, 10)
        : surveyToClone?.endDate
        ? new Date(surveyToClone.endDate).toISOString().substr(0, 10)
        : "",
      introPrompt:
        surveyToEdit?.introPrompt || surveyToClone?.introPrompt || "",
      outroPrompt:
        surveyToEdit?.outroPrompt || surveyToClone?.outroPrompt || "",
      description:
        surveyToEdit?.description || surveyToClone?.description || "",
      surveyActive:
        surveyToEdit?.surveyActive || surveyToClone?.surveyActive || false,
    });
  }, [isOpen]);

  const onSubmitSurvey = (data: createSurveyForm) => {
    if (surveyToEdit) {
      const editedSurvey: Survey = {
        surveyId: surveyToEdit.surveyId,
        surveyName: data.surveyName,
        startDate: data.startDate,
        endDate: data.endDate,
        introPrompt: data.introPrompt,
        outroPrompt: data.outroPrompt,
        CreatedBy: surveyToEdit.CreatedBy,
        description: data.description,
        surveyActive: data.surveyActive,
        questions: [...questions],
      };

      axios
        .patch(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys/" +
            surveyToEdit.surveyId,
          editedSurvey
        )
        .then((res) => {
          setReFetch();
          if (res.data.statusCode == 200) {
            const responseMessage = JSON.parse(res.data.body);
            Swal.fire({
              showClass: {
                popup: "swal2-noanimation",
                backdrop: "swal2-noanimation",
                icon: "swal2-noanimation",
              },
              hideClass: {
                popup: "",
              },
              position: "center",
              icon: "success",
              title: responseMessage.message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              showClass: {
                popup: "swal2-noanimation",
                backdrop: "swal2-noanimation",
                icon: "swal2-noanimation",
              },
              hideClass: {
                popup: "",
              },
              position: "center",
              icon: "error",
              title: "Something Went Wrong",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    } else {
      const newSurvey: Survey = {
        surveyName: data.surveyName,
        surveyActive: true,
        startDate: data.startDate,
        endDate: data.endDate,
        introPrompt: data.introPrompt,
        outroPrompt: data.outroPrompt,
        CreatedBy: "Mouhcine Daali",
        description: data.description,

        questions: [...questions],
      };
      axios
        .post(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys",
          newSurvey
        )
        .then((res) => {
          setReFetch();
          if (res.data.statusCode == 200) {
            const responseMessage = JSON.parse(res.data.body);
            Swal.fire({
              showClass: {
                popup: "swal2-noanimation",
                backdrop: "swal2-noanimation",
                icon: "swal2-noanimation",
              },
              hideClass: {
                popup: "",
              },
              position: "center",
              icon: "success",
              title: responseMessage.message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              showClass: {
                popup: "swal2-noanimation",
                backdrop: "swal2-noanimation",
                icon: "swal2-noanimation",
              },
              hideClass: {
                popup: "",
              },
              position: "center",
              icon: "error",
              title: "Something Went Wrong",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    }
    cancel(false);
  };
  const onSubmitQuestion = (data: createQuestionForm) => {
    if (data.questionNumber) {
      const newQuestion: Question = {
        questionNumber: data.questionNumber,
        questionText: data.questionText,
        minValue: data.minValue,
        maxValue: data.maxValue,
      };

      // edit question in questions array and update the state with the new array of questions with the edited question and the same order
      setQuestions(
        questions.map((question) => {
          if (question.questionNumber === data.questionNumber) {
            return newQuestion;
          } else {
            return question;
          }
        })
      );
      setQuestionOnEdit(0);
    } else {
      const newQuestion: Question = {
        questionNumber: questions.length + 1,
        questionText: data.questionText,
        minValue: data.minValue,
        maxValue: data.maxValue,
      };

      setQuestions([...questions, newQuestion]);
    }
    resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
  };

  const editQuestion = (questionNumber: number) => {
    setQuestionOnEdit(questionNumber);
    const question = questions.find(
      (question) => question.questionNumber === questionNumber
    );
    if (question) {
      resetQuestion({
        questionNumber: question.questionNumber,
        questionText: question.questionText,
        minValue: question.minValue,
        maxValue: question.maxValue,
      });
    }
  };
  const cancelEdit = () => {
    setQuestionOnEdit(0);
    resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
  };
  const removeQuestion = (questionNumber: number) => {
    Swal.fire({
      showClass: {
        popup: "swal2-noanimation",
        backdrop: "swal2-noanimation",
        icon: "swal2-noanimation",
      },
      hideClass: {
        popup: "",
      },
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // remove question from questions array and update the state with the new array of questions with the removed question and the same order and update the question numbers
        const newQuestions = questions.filter(
          (question) => question.questionNumber !== questionNumber
        );
        setQuestions(
          newQuestions.map((question, index) => {
            return { ...question, questionNumber: index + 1 };
          })
        );
        console.log(questions);
        Swal.fire({
          showClass: {
            popup: "swal2-noanimation",
            backdrop: "swal2-noanimation",
            icon: "swal2-noanimation",
          },
          hideClass: {
            popup: "",
          },
          title: "Removed!",
          text: "Your question has been removed.",
          icon: "success",
        });
      }
    });
  };

  const cancel = (validation: boolean) => {
    if (
      validation &&
      (questions.length > 0 ||
        watchSurvey("surveyName") ||
        watchSurvey("startDate") ||
        watchSurvey("endDate") ||
        watchSurvey("introPrompt") ||
        watchSurvey("outroPrompt") ||
        watchSurvey("description"))
    ) {
      Swal.fire({
        showClass: {
          popup: "swal2-noanimation",
          backdrop: "swal2-noanimation",
          icon: "swal2-noanimation",
        },
        hideClass: {
          popup: "",
        },
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          resetSurvey({
            surveyName: "",
            startDate: "",
            endDate: "",
            introPrompt: "",
            outroPrompt: "",
            description: "",
          });
          resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
          setQuestions([]);
          setOpen();
          questionOnEdit && setQuestionOnEdit(0);
          if (surveyToEdit || surveyToClone) {
            removeDefaultSurvey();
          }
          Swal.fire({
            showClass: {
              popup: "swal2-noanimation",
              backdrop: "swal2-noanimation",
              icon: "swal2-noanimation",
            },
            hideClass: {
              popup: "",
            },
            title: "Canceled!",
            text: "Your operation has been canceled.",
            icon: "success",
          });
        }
      });
    } else {
      resetSurvey({
        surveyName: "",
        startDate: "",
        endDate: "",
        introPrompt: "",
        outroPrompt: "",
        description: "",
      });
      resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
      setQuestions([]);
      setOpen();
      questionOnEdit && setQuestionOnEdit(0);
    }
  };

  const validateName = (name: string) => {
    if (surveyNames.includes(name) && !surveyToEdit) {
      return "the name is already exists";
    } else {
      clearErrorsSurvey("surveyName");
    }
  };
  const validateDate = (date: string, type: string) => {
    if (type === "startDate") {
      if (
        new Date(date) < new Date() &&
        new Date(date).getDate() !== new Date().getDate()
      ) {
        return "Start Date cannot be before the current date and time";
      } else if (new Date(date) > new Date(watchSurvey("endDate"))) {
        setErrorSurvey("endDate", {
          type: "manual",
          message: "End Date cannot be before the Start Date",
        });
        return "Start Date cannot be after the End Date";
      } else {
        clearErrorsSurvey("startDate");
        clearErrorsSurvey("endDate");
      }
    } else {
      if (new Date(date) < new Date(watchSurvey("startDate"))) {
        setErrorSurvey("startDate", {
          type: "manual",
          message: "Start Date cannot be after the End Date",
        });
        return "End Date cannot be before the Start Date";
      } else {
        clearErrorsSurvey("startDate");
        clearErrorsSurvey("endDate");
      }
    }
  };
  const validateMinMax = (data: number, type: string) => {
    if (type === "minValue") {
      if (Number(data) > Number(watchQuestion("maxValue").valueOf())) {
        setErrorQuestion("maxValue", {
          type: "manual",
          message: "Max Value cannot be less than Min Value",
        });
        return "Min Value cannot be greater than Max Value";
      } else {
        clearErrorsQuestion("minValue");
        clearErrorsQuestion("maxValue");
      }
    } else {
      if (Number(data) < Number(watchQuestion("minValue"))) {
        setErrorQuestion("minValue", {
          type: "manual",
          message: "Min Value cannot be greater than Max Value",
        });
        return "Max Value cannot be less than Min Value";
      } else {
        clearErrorsQuestion("minValue");
        clearErrorsQuestion("maxValue");
      }
    }
  };

  const validateActive = () => {
    if (
      surveyToEdit &&
      new Date(watchSurvey("endDate")).toString() < new Date().toString()
    ) {
      Swal.fire({
        showClass: {
          popup: "swal2-noanimation",
          backdrop: "swal2-noanimation",
          icon: "swal2-noanimation",
        },
        hideClass: {
          popup: "",
        },
        title: "You can't activate this content",
        text: "The End Date has passed",
      });
      // set surveyActive to false
      resetSurvey({ surveyActive: false });
      return;
    }

    if (watchSurvey("surveyActive")) {
      Swal.fire({
        showClass: {
          popup: "swal2-noanimation",
          backdrop: "swal2-noanimation",
          icon: "swal2-noanimation",
        },
        hideClass: {
          popup: "",
        },
        title: "Only one content can be active at a time",
        text: "If you activate this content, the other active content will be deactivated",
      });
      return;
    }
  };

  return (
    <div
      className={`max-h-[90vh] h-fit w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-sm bg-gray-400 fixed z-30 ${
        !isOpen ? "-top-full" : "top-1/2"
      } left-1/2 transition-all ease-out duration-100 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28  absolute top-2 left-1/2 -translate-x-1/2'></div>
      <form onSubmit={handleSubmitSurvey(onSubmitSurvey)}>
        <div className='w-full flex justify-between items-center'>
          <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
            {surveyToEdit ? "Edit Survey" : "Create Survey"}
          </h3>
          <div className='flex gap-x-2'>
            <button
              type='submit'
              className='relative px-5 py-2.5 overflow-hidden font-medium text-green-500 bg-gray-100 border-2 border-gray-100 hover:border-green-500  shadow-inner group'>
              {surveyToEdit ? "Save" : "Create"}
            </button>
            <button
              type='button'
              onClick={() => cancel(true)}
              className='relative px-5 py-2.5 overflow-hidden font-medium text-red-500 bg-gray-100 border-2 border-gray-100 hover:border-red-500  shadow-inner group'>
              Cancel
            </button>
          </div>
        </div>
        <div className='w-full h-fit flex flex-col gap-y-3 bg-gray-50  p-5 pb-8 mt-5'>
          <p className='text-gray-800 text-sm font-medium'>
            1. Start with setting up your survey information
          </p>
          <div className='flex flex-col gap-y-8'>
            <div className='flex max-md:flex-col gap-x-5'>
              <div className='w-5/5 md:w-3/5 flex gap-x-5'>
                <div className='w-3/4 max-md:w-full relative mt-2'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsSurvey.surveyName
                        ? "border-red-200"
                        : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsSurvey.surveyName
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='text'
                    id='surveyName'
                    {...registerSurvey("surveyName", {
                      required: true,
                      validate: (value) => validateName(value),
                    })}
                  />
                  <label
                    htmlFor='surveyName'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    Survey Name
                  </label>
                  {errorsSurvey.surveyName && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsSurvey.surveyName.type === "required"
                        ? "This field is required"
                        : errorsSurvey.surveyName.message}
                    </p>
                  )}
                </div>
                <div className='w-1/4'>
                  <label className='flex flex-col gap-y-1 cursor-pointer select-none items-center'>
                    <i className='text-gray-800 text-sm font-medium'>
                      Is Active
                    </i>
                    <div className='relative'>
                      <input
                        type='checkbox'
                        id='surveyActive'
                        {...registerSurvey("surveyActive", {
                          onChange: () => {
                            validateActive();
                          },
                        })}
                        className='sr-only'
                      />
                      <div className='h-5 w-14  bg-[#E5E7EB] shadow-inner'></div>
                      <div
                        className={`shadow-md absolute -top-1 flex h-7 w-7 items-center justify-center  transition-all ease-linear duration-200 ${
                          watchSurvey("surveyActive")
                            ? "!bg-white left-1/2"
                            : "bg-white left-0"
                        }`}>
                        <span
                          className={`active h-4 w-4   ${
                            watchSurvey("surveyActive")
                              ? "bg-blue-500"
                              : "bg-[#E5E7EB]"
                          }`}></span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className='w-2/5 flex max-md:mt-10 gap-x-5  max-md:w-full'>
                <div className='w-1/2 relative'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsSurvey.startDate
                        ? "border-red-200"
                        : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsSurvey.startDate
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='date'
                    id='startDate'
                    {...registerSurvey("startDate", {
                      valueAsDate: true,
                      required: true,
                      validate: (value) =>
                        validateDate(value.toLocaleString(), "startDate"),
                    })}
                  />
                  <label
                    htmlFor='startDate'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    Start Date
                  </label>
                  {errorsSurvey.startDate && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsSurvey.startDate.type === "required"
                        ? "This field is required"
                        : errorsSurvey.startDate.message}
                    </p>
                  )}
                </div>
                <div className='w-1/2 relative'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsSurvey.endDate
                        ? "border-red-200"
                        : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsSurvey.endDate
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='date'
                    id='endDate'
                    {...registerSurvey("endDate", {
                      valueAsDate: true,
                      required: true,
                      validate: (value) =>
                        validateDate(value.toString(), "endDate"),
                    })}
                  />
                  <label
                    htmlFor='endDate'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    End Date
                  </label>
                  {errorsSurvey.endDate && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsSurvey.endDate.type === "required"
                        ? "This field is required"
                        : errorsSurvey.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className='flex gap-x-5'>
              <div className='w-1/2 relative '>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsSurvey.introPrompt
                      ? "border-red-200"
                      : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsSurvey.introPrompt
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='introPrompt'
                  {...registerSurvey("introPrompt", { required: true })}
                />
                <label
                  htmlFor='introPrompt'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Intro Prompt
                </label>
                {errorsSurvey.introPrompt && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Intro Prompt is required
                  </p>
                )}
              </div>
              <div className='w-1/2 relative '>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsSurvey.outroPrompt
                      ? "border-red-200"
                      : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsSurvey.outroPrompt
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='outroPrompt'
                  {...registerSurvey("outroPrompt", { required: true })}
                />
                <label
                  htmlFor='outroPrompt'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Outro Prompt
                </label>
                {errorsSurvey.outroPrompt && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Outro Prompt is required
                  </p>
                )}
              </div>
            </div>
            <div className='w-full relative'>
              <textarea
                className={`peer h-full w-full border-b ${
                  errorsSurvey.description
                    ? "border-red-200"
                    : "border-gray-200"
                } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                  errorsSurvey.description
                    ? "placeholder-shown:border-red-200"
                    : "placeholder-shown:border-gray-200"
                } focus:border-green-500 focus:outline-0 disabled:border-0`}
                placeholder=' '
                id='description'
                {...registerSurvey("description", { required: true })}
              />{" "}
              <label
                htmlFor='description'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Description
              </label>
              {errorsSurvey.description && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Description is required
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className='mt-8 flex flex-col p-1 bg-gray-100 '>
        <div className='flex justify-between items-center px-5 pt-3'>
          <p className='text-gray-800 text-sm font-medium'>2. Add Questions</p>
        </div>
        <form
          onSubmit={handleSubmitQuestion(onSubmitQuestion)}
          className='flex flex-col gap-y-3 my-5 px-5'>
          <div className='w-full flex max-sm:flex-col gap-10'>
            <div className='w-2/4 max-sm:w-full relative '>
              <input
                className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                placeholder=' '
                type='text'
                id='questionText'
                {...registerQuestion("questionText", { required: true })}
              />
              <label
                htmlFor='questionText'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Question Text
              </label>
              {errorsQuestion.questionText && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Question Text is required
                </p>
              )}
            </div>
            <div className='w-2/4 max-sm:w-full flex'>
              <div className='w-1/2 relative '>
                <input
                  className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                  placeholder=' '
                  type='number'
                  id='minValue'
                  {...registerQuestion("minValue", {
                    required: true,
                    validate: (value) => validateMinMax(value, "minValue"),
                  })}
                />
                <label
                  htmlFor='minValue'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Min Value
                </label>
                {errorsQuestion.minValue && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsQuestion.minValue.type === "required"
                      ? "Min Value is required"
                      : errorsQuestion.minValue.message}
                  </p>
                )}
              </div>
              <div className='w-1/2 relative '>
                <input
                  className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                  placeholder=' '
                  type='number'
                  id='maxValue'
                  {...registerQuestion("maxValue", {
                    required: true,
                    validate: (value) => validateMinMax(value, "maxValue"),
                  })}
                />
                <label
                  htmlFor='maxValue'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Max Value
                </label>
                {errorsQuestion.maxValue && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsQuestion.maxValue.type === "required"
                      ? "Max Value is required"
                      : errorsQuestion.maxValue.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='self-end relative inline-flex items-center justify-start px-5 py-2.5 mt-5 overflow-hidden font-medium transition-all bg-white  hover:bg-gray-100 border-2 border-gray-800 group'>
            {questionOnEdit ? "Edit Question" : "Add Question"}
          </button>
        </form>
        <div className='w-full'>
          <div className='w-full p-3 '>
            <div className='overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 md:'>
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
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {questions.length > 0 ? (
                    questions.map((question: Question) => (
                      <tr
                        key={question.questionNumber}
                        className={`${
                          questionOnEdit === question.questionNumber &&
                          "border-4 border-gray-700"
                        }`}>
                        <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {question.questionNumber}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {question.questionText}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {question.minValue}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {question.maxValue}
                        </td>
                        <td className='flex gap-x-3 px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <button
                            onClick={() => {
                              removeQuestion(question.questionNumber);
                            }}
                            className='text-red-600 hover:text-red-900'>
                            <TrashIcon className='w-5 h-5' />
                          </button>
                          <button
                            onClick={() => {
                              questionOnEdit === question.questionNumber
                                ? cancelEdit()
                                : editQuestion(question.questionNumber);
                            }}
                            className={`${
                              questionOnEdit === question.questionNumber
                                ? "text-gray-600 hover:text-gray-900"
                                : "text-green-600 hover:text-green-900"
                            }`}>
                            {questionOnEdit === question.questionNumber ? (
                              <XMarkIcon className='w-5 h-5 bg-gray-200/70 ' />
                            ) : (
                              <PencilIcon className='w-5 h-5' />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        align='center'
                        colSpan={5}
                        className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        No Questions
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

export default CreateSurvey;
