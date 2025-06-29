import { RadioBox } from 'assets/InputIcons'
import { useState, useEffect } from 'react'
import './style.css'
import { colors } from 'utils/colors'
import { profileSteps } from 'pages/account/profile/constants'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const Stepper = ({
  steps = [],
  completed = [],
  activeStep = 0,
  setActiveStep = () => { },
  direction = 'vertical',
  toolbar
}) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState([])
  const [completedStep, setCompletedStep] = useState([])

  const handleStep = (index) => {
    setActiveStep(index)
    navigate(`?step=${profileSteps[index]}`)
  }

  useEffect(() => {
    const find = profileSteps.findIndex((step) => step === searchParams?.get('step'))
    if (find > -1) {
      setActiveStep(find)
    }
  }, [searchParams])

  useEffect(() => {
    if (steps) {
      setStep(steps)
    }
  }, [steps])

  useEffect(() => {
    if (completed) {
      setCompletedStep(completed)
    }
  }, [completed])

  return (
    <div className={direction === 'vertical' ? 'vertical-stepper' : 'horizontal-stepper'}>
      <div className='stepper-container bg-slate-100'>
        {step.map((item, index) => (
          <button className={activeStep === index ? 'active-step stepper-item' : 'stepper-item'} key={item.id} disabled={item.isDisabled} onClick={() => handleStep(index)}>
            <div className='icon-stepper'>
              {completedStep.includes(item?.id) ? <RadioBox width='30px' height="30px" color={colors.primary} /> : <div className='step-circle'>{index + 1}</div>}
            </div>
            <div className='content-stepper'>
              <div>{item.title}</div>
              <div style={{ fontSize: '12px' }}>{item.subTitles}</div>
            </div>
          </button>
        ))}
      </div>

      <div className='stepper-content'>
        <div className='content-area'>
          {steps?.length > 0 ? steps[activeStep]?.content : 'no items'}
        </div>
        <div className='toolbar-area'>
          {toolbar}
        </div>

      </div>

    </div>
  )
}

export default Stepper