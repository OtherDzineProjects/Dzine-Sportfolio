import { Button } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton, FormController, Table, FileUpload } from "common"
import { Delete, Edit } from "assets/InputIcons"
import { colors } from "utils/colors"
import { useState } from "react";
import { stepQualification } from "../validate";
import { serialNumber } from "utils/serialNumber";
import { status } from "pages/common/helpers";

const qualificationType = [
  { id: 1, name: 'Scondary School' },
  { id: 2, name: 'Higher Secondary' },
  { id: 3, name: 'Graduate' },
  { id: 4, name: 'Post Graduate' }
]

const StepQualification = () => {

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: 'all',
    defaultValues: {
      certificateType: null,
      certificateNumber: null,
      certificateDate: null,
      certificateExpiryDate: null,
      notes: null,
      status: 'pending'
    },
    resolver: yupResolver(stepQualification)
  });

  const [qualificationArray, setQualificationArray] = useState([
    { id: 1, certificateType: 1, certificateNumber: '25485755555', certificateDate: '20-03-2024', certificateExpiryDate: '20-04-2024' },
    { id: 2, certificateType: 2, certificateNumber: '9567541955', certificateDate: '20-04-2024', certificateExpiryDate: '20-04-2024' }
  ])
  const [toggleAdd, setToggleAdd] = useState(false)
  const [editActive, setEditActive] = useState(null)

  const handleChange = (field, data) => {
    if(data){
    switch (field) {
        case 'certificateType':
          setValue('certificateType', data?.id)
          break;
        case 'certificateNumber':
          setValue('certificateNumber', data)
          break;
        default:
          break
      }
    }
  }

  const onSubmit = (data) => {
    if (editActive !== null) {
      qualificationArray[editActive] = data
      setToggleAdd(false)
      setEditActive(null)
      setValue('certificateType', null)
      setValue('certificateNumber', null)
      setValue('certificateDate', null)
      setValue('certificateExpiryDate', null)
      setValue('notes', null)
    } else {
      qualificationArray.push({ id: qualificationArray?.length + 1, ...data })
      setToggleAdd(!toggleAdd)
      setValue('certificateType', null)
      setValue('certificateNumber', null)
      setValue('certificateDate', null)
      setValue('certificateExpiryDate', null)
      setValue('notes', null)
    }
  }

  const handleDelete = (index) => {
    let newArray = qualificationArray.filter((item, ind) => index !== ind)
    setQualificationArray(newArray)
  }

  const handleShowAdd = () => {
    setToggleAdd(!toggleAdd)
  }

  const handleEdit = (item, index) => {
    setToggleAdd(true)
    setValue('certificateType', item?.certificateType)
    setValue('certificateNumber', item?.certificateNumber)
    setValue('certificateDate', item?.certificateDate)
    setValue('certificateExpiryDate', item?.certificateExpiryDate)
    setValue('notes', item?.notes)
    setEditActive(index)
  }

  const handleTableActions = (row) => {

    return (
      <>
        <IconButton onClick={() => handleEdit(row?.row, row?.rowIndex)} variant={'ghost'} icon={<Edit />} />
        <IconButton onClick={() => handleDelete(row?.rowIndex)} variant={'ghost'} icon={<Delete color={colors.secondary} />} />
      </>
    )
  }

  const handleType = (row) => {
    let find = qualificationType.findIndex((item) => item?.id === row?.row?.certificateType)
    if (find > -1) {
      return qualificationType[find].name
    }
  }

  const columns = [
    {
      header: 'Sl No',
      field: 'slNo',
      alignment: 'left',
      cell: (field) => serialNumber(field, 0)
    },
    {
      header: 'Qualification Type',
      field: 'certificateType',
      alignment: 'left',
      cell: (field) => handleType(field)
    },
    {
      header: 'Certficate Number',
      field: 'certificateNumber',
      alignment: 'left'
    },
    {
      header: 'Certficate Date',
      field: 'certificateDate',
      alignment: 'left'
    },
    {
      header: 'Certficate Expiry Date',
      field: 'certificateExpiryDate',
      alignment: 'left'
    },
    {
      header: 'Status',
      field: 'status',
      alignment: 'left',
      cell: (field) => status(field)
    },
    {
      header: 'Actions',
      alignment: 'left',
      cell: (field) => handleTableActions(field)
    }
  ];

  const cancel = () => {
    setToggleAdd(false)
    setValue('contactType', 1)
    setValue('contactValue', '')
  }

  return (
    <div className="px-[20px]">
      <div className="w-full mb-5">
        <Table columns={columns} tableData={qualificationArray} />
      </div>
      {!toggleAdd &&
        <Button variant={'outline'} colorScheme={'primary'} onClick={handleShowAdd}>
          Add New
        </Button>
      }
      {toggleAdd &&
        <form id='user_qualification_form' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-5 py-[20px]'>
            <FormController
              control={control}
              errors={errors}
              type='select'
              name='certificateType'
              label="Certificate Type"
              handleChange={(data) => handleChange('certificateType', data)}
              shrink
              options={qualificationType || []}
            />

            <FormController
              control={control}
              errors={errors}
              type='text'
              name='certificateNumber'
              label="Certificate Number"
              handleChange={(data) => handleChange('certificateNumber', data)}
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type='date'
              name='certificateDate'
              label="Certificate Date"
              handleChange={(data) => handleChange('certificateDate', data)}
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type='date'
              name='certificateExpiryDate'
              label="Certificate Expiry Date"
              handleChange={(data) => handleChange('certificateExpiryDate', data)}
              shrink
            />


          </div>

          <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-5 pb-[20px]'>

          <FormController
              control={control}
              errors={errors}
              type='text-area'
              name='notes'
              label="Notes"
              handleChange={(data) => handleChange('certificateExpiryDate', data)}
              shrink
            />

            <div>
              <FileUpload />
            </div>




            <div className="flex gap-3">
              {editActive !== null ?
                <Button type="submit" size="lg" variant={'solid'} colorScheme="secondary" form="user_qualification_form" >
                  Update Qualification
                </Button>
                :
                <Button type="submit" size="lg" variant={'solid'} colorScheme="secondary" form="user_qualification_form" >
                  Add Qualification
                </Button>
              }

              <Button size="lg" variant={'outline'} onClick={cancel} >
                Cancel
              </Button>
            </div>
          </div>

        </form>
      }

    </div>
  )
}

export default StepQualification