import { useForm } from "react-hook-form"
import { FormController } from 'common'
import { yupResolver } from '@hookform/resolvers/yup';
import { userStepBasic } from "../validate";
import residenceType from "common/json/residence_type.json"
import stateIndia from "common/json/state_india.json"
import LocalBodyTypeJSON from "common/json/local_body_type.json"
import ContactCommunication from "./components/ContactCommunication";

const StepContact = (props) => {
  const {
    next = () => { }
  } = props;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      bloodGroup: '',
      state: null,
      district: '',
      localBodyType: '',
      localBodyTypeName: '',
      localPlace: ''
    },
    resolver: yupResolver(userStepBasic)
  });

  const handleChange = () =>{
  }


  const onSubmit = () => {
    next()
  }

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <form id='user_basic_details_form' onSubmit={handleSubmit(onSubmit)}>
        <div className='grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5 p-[20px]'>
          <FormController
            control={control}
            errors={errors}
            type='select'
            name='addressType'
            label="Address Type"
            shrink
            options={residenceType || []}
          />

          <FormController
            control={control}
            errors={errors}
            type={'check'}
            name='isAddressType'
            label="Same as Basic Details Address"
            handleChange={(data)=>handleChange('isAddressType', data)}
          />

          <FormController
            control={control}
            errors={errors}
            type='select'
            name='state'
            label="State"
            shrink
            options={stateIndia || []}
          />

          <FormController
            control={control}
            errors={errors}
            type='text'
            name='houseName'
            label="House Name"
            placeholder="Enter House Name"
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type='text'
            name='localPlace'
            label="Local Place"
            placeholder="Enter Local Name"
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type='text'
            name='streetName'
            label="Street Name"
            placeholder="Enter Street Name"
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type='text'
            name='mainPlace'
            label="Main Place"
            placeholder="Enter Main Place"
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type='select'
            name='localBodyType'
            label="Local Body Type"
            shrink
            options={LocalBodyTypeJSON || []}
          />

          <FormController
            control={control}
            errors={errors}
            type='select'
            name='localBody'
            label="Local Body Name"
            shrink
            options={[{ id: 1, name: 'options 1' }, { id: 2, name: 'options 3' }] || []}
          />

          <FormController
            control={control}
            errors={errors}
            type='select'
            name='ward'
            label="Ward Name"
            shrink
            options={[{ id: 1, name: 'options 1' }, { id: 2, name: 'options 3' }] || []}
          />

          <FormController
            control={control}
            errors={errors}
            type='select'
            name='postOffice'
            label="Post Office"
            shrink
            options={[{ id: 1, name: 'options 1' }, { id: 2, name: 'options 3' }] || []}
          />

          <FormController
            control={control}
            errors={errors}
            type='text'
            name='pincode'
            label="Pincode"
            placeholder="Enter your name"
            shrink
          />
        </div>

      </form>
      <ContactCommunication />
    </>
  )
}

export default StepContact;