import { Search, Survey } from "../types";
import CreateSurvey from "./CreateSurvey";
import { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import SurveyActions from "./SurveyActions";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Swal from "sweetalert2";
import SurveyDetails from "./SurveyDetails";

const SurveyTable = () => {
  const [createSurveyOpen, setCreateSurveyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyNames, setSurveyNames] = useState<string[]>([]);
  const [reFetch, setReFetch] = useState(false);
  const [surveyToEdit, setSurveyToEdit] = useState<Survey | undefined>();
  const [surveyToClone, setSurveyToClone] = useState<Survey | undefined>();
  const { register, watch, reset } = useForm<Search>();
  const [tableData, setTableData] = useState<Survey[]>(surveys || []);
  const [openDetails, setOpenDetails] = useState(false);
  const [surveyDetails, setSurveyDetails] = useState<Survey | undefined>();
  const [selectedSurveys, setSelectedSurveys] = useState<Survey[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelectAll(false);
    setSelectedSurveys([]);
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

          const surveyNamesGetter = surveysWithoutContent.map(
            (survey) => survey.surveyName
          );
          setSurveyNames(surveyNamesGetter);
          setLoading(false);
        });
    };
    getSurveys();
  }, [reFetch]);

  useEffect(() => {
    if (surveyToClone) {
      setCreateSurveyOpen(true);
    }
    if (surveyToEdit) {
      setCreateSurveyOpen(true);
    }
  }, [surveyToEdit, surveyToClone]);

  const removeEditSurvey = () => {
    setSurveyToEdit(undefined);
    setSurveyToClone(undefined);
  };

  const searchValue = watch("search");
  const byActive = watch("byActive");
  const byInActive = watch("byInActive");

  useEffect(() => {
    if (searchValue || byActive || byInActive) {
      const filteredSurveys = surveys.filter((survey) => {
        if (searchValue && byActive && byInActive) {
          return Object.keys(survey).some((key) =>
            survey[key as keyof Survey]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue && byActive) {
          return Object.keys(survey).some((key) =>
            survey[key as keyof Survey]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue && byInActive) {
          return Object.keys(survey).some((key) =>
            survey[key as keyof Survey]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue) {
          return Object.keys(survey).some((key) =>
            survey[key as keyof Survey]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (byActive && byInActive) {
          return survey.surveyActive === true || !survey.surveyActive;
        } else if (byActive) {
          return survey.surveyActive === true || survey.surveyActive;
        } else if (byInActive) {
          return survey.surveyActive === false || !survey.surveyActive;
        }
      });
      setTableData([...filteredSurveys]);
    } else {
      setTableData([...surveys]);
    }
  }, [searchValue, surveys, byActive, byInActive]);

  const resetSearch = () => {
    reset({ search: "" });
  };

  const editSurvey = (survey: Survey) => {
    setSurveyToEdit(survey);
  };
  const cloneSurvey = (survey: Survey) => {
    setSurveyToClone(survey);
  };

  const statusBodyTemplate = (survey: Survey) => {
    const status = survey.surveyActive;
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
        {status ? "Active" : "Inactive"}
      </span>
    );
  };

  const onSelectionChange = (e: any) => {
    const value = e.value;
    setSelectedSurveys(value);
    setSelectAll(value.length === tableData.length);
  };
  const onSelectAllChange = (e: any) => {
    const selectAll = e.checked;

    if (selectAll) {
      setSelectedSurveys(tableData);
      setSelectAll(true);
    } else {
      setSelectAll(false);
      setSelectedSurveys([]);
    }
  };

  const deleteAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      confirmButtonText: "Yes, delete all!",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedSurveys.forEach((survey) => {
          axios
            .delete(
              `https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys/${survey.surveyId}`
            )
            .then(() => {
              setSelectedSurveys([]);
              setReFetch(!reFetch);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        Swal.fire(
          "Deleted!",
          "The selected surveys has been deleted.",
          "success"
        );
      }
    });
  };

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-20'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto relative'>
          <div
            className={`flex items-center justify-between gap-x-5 px-5 py-3 max-sm:px-3 max-sm:py-1.5 bg-indigo-500/70 rounded-md absolute bottom-0 max-sm:bottom-3 transition-all ease-linear duration-300 ${
              selectedSurveys.length ? "left-0" : "-left-full"
            }`}>
            <p className='text-white font-semibold'>
              {selectedSurveys.length} Survey{selectedSurveys.length > 1 && "s"}{" "}
              Selected
            </p>
            <button
              onClick={() => deleteAll()}
              className='rounded-md px-3.5 py-1.5 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-white hover:border-red-600 transition-colors duration-150 ease-linear shadow-red-600/60 shadow-md  text-white'>
              <span className='absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-red-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'></span>
              <span className='relative text-white transition duration-300 group-hover:text-white ease'>
                Delete All
              </span>
            </button>
          </div>
        </div>
      </div>

      <SurveyDetails
        survey={surveyDetails}
        isOpen={openDetails}
        setReFetch={() => setReFetch(!reFetch)}
        setOpen={() => setOpenDetails(!openDetails)}
        setSurveyToEdit={editSurvey}
        setSurveyToClone={cloneSurvey}
        setOpenEdit={() => setCreateSurveyOpen(true)}
      />
      <CreateSurvey
        surveyNames={surveyNames}
        isOpen={createSurveyOpen}
        setOpen={() => setCreateSurveyOpen(false)}
        setReFetch={() => setReFetch(!reFetch)}
        surveyToEdit={surveyToEdit}
        surveyToClone={surveyToClone}
        removeDefaultSurvey={removeEditSurvey}
      />
      <div className='w-full flex flex-wrap-reverse justify-between gap-5 mb-5'>
        <div className='w-2/3 sm:w-1/3 mt-2 relative'>
          <MagnifyingGlassIcon className='absolute w-5 h-5 text-gray-400 left-3 translate-y-1/2' />
          {searchValue && (
            <XMarkIcon
              onClick={() => resetSearch()}
              className='absolute w-5 h-5 text-gray-400 right-3 translate-y-1/2 cursor-pointer '
            />
          )}
          <input
            type='text'
            {...register("search")}
            id='search'
            placeholder='Keyword Search'
            className='px-5 pl-10 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6'
          />
        </div>
        <div className='max-w-1/3 max-md:w-fit flex max-md:ml-auto gap-x-8 max-sm:gap-x-5 items-center justify-center'>
          <p className='font-semibold'>Filter by Status:</p>
          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register("byActive")}
              id='byActive'
              className='w-5 h-5'
            />
            <label htmlFor='byActive' className='ml-2 max-sm:ml-1'>
              Active
            </label>
          </div>
          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register("byInActive")}
              id='byInActive'
              className='w-5 h-5'
            />
            <label htmlFor='byInActive' className='ml-2 max-sm:ml-1'>
              Inactive
            </label>
          </div>
        </div>
        <div className='max-w-1/3 max-md:ml-auto'>
          <button
            onClick={() => setCreateSurveyOpen(true)}
            type='button'
            className='relative inline-flex items-end justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-100 group'>
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
      <DataTable
        value={tableData}
        key='surveyId'
        stripedRows
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{}}
        loading={loading}
        emptyMessage='No Surveys Found'
        scrollHeight='500px'
        selection={selectedSurveys}
        onSelectionChange={onSelectionChange}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
        cellSelection={false}
        selectionMode='multiple'>
        <Column selectionMode='multiple' headerStyle={{ width: "3rem" }} />
        <Column
          field='surveyName'
          header='Survey Name'
          sortable
          style={{ maxWidth: "200px" }}
          className='truncate text-sm'></Column>
        <Column
          field='description'
          header='Description'
          sortable
          style={{ maxWidth: "200px" }}
          className='truncate text-sm'></Column>
        <Column
          field='introPrompt'
          header='Intro Prompt'
          sortable
          style={{ maxWidth: "250px" }}
          className='truncate text-sm'></Column>
        <Column
          field='outroPrompt'
          header='Outro Prompt'
          sortable
          style={{ maxWidth: "250px" }}
          className='truncate text-sm'></Column>
        <Column
          field='startDate'
          header='Start_Date'
          body={(rowData: Survey) => {
            return <p>{new Date(rowData.startDate).toDateString()}</p>;
          }}
          sortable
          style={{ minWidth: "104px" }}
          className='text-sm w-fit'></Column>
        <Column
          field='endDate'
          header='End_Date'
          sortable
          body={(rowData: Survey) => {
            return <p>{new Date(rowData.endDate).toDateString()}</p>;
          }}
          className='text-sm'
          style={{ minWidth: "104px" }}></Column>
        <Column
          field='questions.length'
          header='Questions Number'
          sortable
          style={{ minWidth: "104px", textAlign: "center" }}
          className='text-sm'></Column>
        <Column
          field='Status'
          header='Status'
          dataType='boolean'
          body={statusBodyTemplate}
          style={{}}></Column>
        <Column
          field='Actions'
          header='Actions'
          body={(rowData: Survey) => {
            return (
              <SurveyActions
                survey={rowData}
                viewDetails={() => {
                  setSurveyDetails(rowData);
                  setOpenDetails(true);
                }}
                displayDetails={true}
                setReFetch={() => setReFetch(!reFetch)}
                setSurveyToEdit={editSurvey}
                setSurveyToClone={cloneSurvey}
                setOpenEdit={() => setCreateSurveyOpen(true)}
                index={0}
              />
            );
          }}
          style={{ textAlign: "center" }}></Column>
      </DataTable>
    </div>
  );
};

export default SurveyTable;
