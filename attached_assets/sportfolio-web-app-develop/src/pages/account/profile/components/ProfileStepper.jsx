import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Stepper } from 'common'
import StepBasic from './Steps/StepBasic'
import StepQualification from './Steps/StepQualification'
import Step4 from './Steps/Step4'
import StepContact from './Steps/StepContact'
import StepFamily from './Steps/StepFamily'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUserBasicDetails } from 'pages/account/users/api'
import { profileSteps } from '../constants'

const ProfileStepper = () => {

const params = useParams()
const dispatch = useDispatch()
const [completed] = useState(['StepBasic'])
const [activeStep, setActiveStep] = useState(0)
const navigate = useNavigate()

const handleNavigate = (step) => {
    navigate(profileSteps[step])
}

const nextStep = () => {
  setActiveStep(activeStep + 1)
  handleNavigate(activeStep + 1)
}

const prevStep = () => {
  setActiveStep(activeStep - 1)
  handleNavigate(activeStep - 1)
}

const steps = [{ id: 'StepBasic', title: 'Basic Details', subTitles: '0% Completed', content: <StepBasic next={nextStep} prev={prevStep}/>, isDisabled: false},
{ id: 'stepContact', title: 'Contact Details', subTitles: '0% Completed', content: <StepContact next={nextStep} prev={prevStep} />, isDisabled: false},
{ id: 'stepQuaifications', title: 'Quaifications', subTitles: '0% Completed', content: <StepQualification next={nextStep} prev={prevStep} />, isDisabled: false},
{ id: 'stepFamily', title: 'Family Details', subTitles: '0% Completed', content: <StepFamily next={nextStep} prev={prevStep} />, isDisabled: false},
{ id: 'stepSkills', title: 'Skills', subTitles: '0% Completed', content: <Step4 next={nextStep} prev={prevStep} />, isDisabled: false},
{ id: 'stepServices', title: 'Services', subTitles: '0% Completed', content: <Step4 next={nextStep} prev={prevStep} />, isDisabled: false},
{ id: 'stepAchivements', title: 'Achivements', subTitles: '0% Completed', content: <Step4 next={nextStep} prev={prevStep} />, isDisabled: false},
{ id: 'stepAwards', title: 'Awards', subTitles: '0% Completed', content: <Step4 next={nextStep} prev={prevStep} />, isDisabled: false},
{ id: 'stepDocuments', title: 'Documents', subTitles: '0% Completed', content: <Step4 next={nextStep} prev={prevStep} />, isDisabled: false}
]
const handleNavigateClose = () =>{
  navigate('/account/users')
}

useEffect(() => {
  if(params?.userId){
    dispatch(getUserBasicDetails(params?.userId))
  }
}, [params])




const toolbar = (
  <div className="flex gap-3 justify-end bg-slate-100 py-5 px-[20px]">
  <Button type='submit' size="lg" variant='ghost' colorScheme='primary' onClick={handleNavigateClose}>
    Close
  </Button>
  <Button type='submit' size="lg" variant='outline' colorScheme='primary'>
    Save
  </Button>
  <Button type='submit' size="lg" variant='solid'colorScheme='primary' form='user_basic_details_form'>
    Next
  </Button>
</div>
)

  return (
    <div>
       <Stepper steps={steps} completed={completed} activeStep={activeStep} setActiveStep={setActiveStep} direction='vertical' toolbar={toolbar} />
    </div>
  )
}

export default ProfileStepper
