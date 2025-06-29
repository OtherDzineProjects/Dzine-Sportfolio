import { Button } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, IconButton, FormController, Table } from "common"
import { Delete, Edit, Open } from "assets/InputIcons"
import { colors } from "utils/colors"
import { stepFamily } from "../validate";
import { useState } from "react";
import { serialNumber } from "utils/serialNumber";
import genderJSON from "common/json/gender.json"
import bloodGroupJSON from "common/json/bloodGroup.json"
import CustomModal from "common/components/Modal";
import { status } from "pages/common/helpers";

const relationType = [
  { id: 1, name: 'Father' },
  { id: 2, name: 'Mother' },
  { id: 3, name: 'Son' },
  { id: 4, name: 'Daughter' },
  { id: 5, name: 'Wife' },
  { id: 6, name: 'Husband' }
]

const StepFamily = () => {

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: null,
      relation: null,
      dob: null,
      phone: null,
      email: null,
      gender: null,
      bloodGroup: null
    },
    resolver: yupResolver(stepFamily)
  });

  const [familyArray, setFamilyArray] = useState([])
  const [toggleAdd, setToggleAdd] = useState(false)
  const [editActive, setEditActive] = useState(null)
  const [open, setOpen] = useState(false)

  const handleChange = (field, data) => {
    if (data) {
      switch (field) {
        case 'relation':
          setValue('relation', data?.id)
          break;
        case 'gender':
          setValue('gender', data?.id)
          break;
        case 'bloodGroup':
          setValue('bloodGroup', data?.id)
          break;
        default:
          break
      }
    }
  }


  const onSubmit = (data) => {
    if (editActive !== null) {
      familyArray[editActive] = data
      setToggleAdd(false)
      setEditActive(null)
      setValue('contactType', {})
      setValue('contactValue', '')
    } else {
      familyArray.push({ id: familyArray?.length + 1, ...data })
      setToggleAdd(!toggleAdd)
      setValue('contactType', {})
      setValue('contactValue', '')
    }
  }

  const handleDelete = (index) => {
    let newArray = familyArray.filter((item, ind) => index !== ind)
    setFamilyArray(newArray)
  }

  const handleShowAdd = () => {
    setToggleAdd(!toggleAdd)
  }



  const handleEdit = (item, index) => {
    setToggleAdd(true)
    setValue('name', item?.name)
    setValue('relation', item?.relation)
    setEditActive(index)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleTableActions = (row) => {
    return (
      <>
        <IconButton onClick={() => handleEdit(row?.row, row?.rowIndex)} variant={'ghost'} icon={<Edit />} />
        <IconButton onClick={() => handleDelete(row?.rowIndex)} variant={'ghost'} icon={<Delete color={colors.gray} />} />
        <IconButton onClick={() => handleOpen(row)} variant={'ghost'} icon={<Open color={colors.primary} />} />
      </>
    )
  }

  const handleType = (row) => {
    let find = relationType.findIndex((item) => item?.id === row?.row?.type)
    if (find > -1) {
      return relationType[find].name
    } return 'ok'
  }


  const columns = [
    {
      header: 'Sl No',
      field: 'slNo',
      alignment: 'left',
      cell: (field) => serialNumber(field, 0)
    },
    {
      header: 'Relation',
      field: 'relation',
      alignment: 'left',
      cell: (field) => handleType(field)
    },
    {
      header: 'Name',
      field: 'name',
      alignment: 'left'
    },
    {
      header: 'Date of Birth',
      field: 'dob',
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
        <Typography text="Contact Communication Details" />
        <Table columns={columns} tableData={familyArray} />
      </div>
      {!toggleAdd &&
        <Button variant={'outline'} colorScheme={'primary'} onClick={handleShowAdd}>
          Add New
        </Button>
      }
      {toggleAdd &&
        <form id='user_family_form' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5 py-[20px]'>
            <FormController
              control={control}
              errors={errors}
              type={'text'}
              name='name'
              label="Full Name"
              handleChange={(data) => handleChange('name', data)}
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type='select'
              name='relation'
              label="Relation"
              handleChange={(data) => handleChange('relation', data)}
              shrink
              options={relationType || []}
            />

            <FormController
              control={control}
              errors={errors}
              type='date'
              name='dob'
              label="Date of Birth"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type={'text'}
              name='phone'
              label="Phone"
              handleChange={(data) => handleChange('phone', data)}
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type={'text'}
              name='email'
              label="Email"
              handleChange={(data) => handleChange('email', data)}
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type='select'
              name='gender'
              label="Gender"
              handleChange={(data) => handleChange('gender', data)}
              shrink
              options={genderJSON || []}
            />


            <FormController
              control={control}
              errors={errors}
              type='select'
              name='bloodGroup'
              label="Blood Group"
              handleChange={(data) => handleChange('bloodGroup', data)}
              shrink
              options={bloodGroupJSON || []}
            />

            <div className="flex gap-3">

              <Button type="submit" size="lg" variant={'solid'} colorScheme="secondary" form="user_family_form" >
                {editActive ? 'Update Member' : 'Add Member'}
              </Button>
              <Button size="lg" variant={'outline'} onClick={cancel} >
                Cancel
              </Button>

            </div>
          </div>

        </form>
      }

      <CustomModal open={open} close={handleClose} footerActionPostion='end' backward = {{text: 'close', action : handleClose, variant: 'outline'}} />

    </div>
  )
}

export default StepFamily