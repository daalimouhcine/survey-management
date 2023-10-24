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
        className={`px-2 inline-flex text-xs leading-5 font-semibold  ${
          status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
        {status ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-10'>
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
        <div className='w-1/4 max-md:w-2/4 mt-2 relative'>
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
            className='px-5 pl-10 w-3/3 border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6'
          />
        </div>
        <div className='max-w-2/4  max-md:ml-auto flex gap-x-8 max-sm:gap-x-5 items-center justify-center'>
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
        <div className='w-1/4 max-md:w-2/4 flex justify-end max-md:ml-auto'>
          <button
            onClick={() => setCreateSurveyOpen(true)}
            type='button'
            className=' px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-700 text-indigo-700'>
            Add Survey
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
        onRowClick={(event) => {
          // Change the argument to DataTableRowClickEvent
          const rowData = event.data as Survey;
          const excludedColumn = "Actions";
          const target = event.originalEvent.target as HTMLElement;
          // Check if the click event is not on the excluded column
          if (!target || !target.classList.contains(excludedColumn)) {
            setSurveyDetails(rowData);
            setOpenDetails(true);
          }
        }}>
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
          alignHeader='center'
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
          className='Actions'
          alignHeader='center'
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
              />
            );
          }}
          style={{ textAlign: "center" }}></Column>
      </DataTable>
    </div>
  );
};

export default SurveyTable;
