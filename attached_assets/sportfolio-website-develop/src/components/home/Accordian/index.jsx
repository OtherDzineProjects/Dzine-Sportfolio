import AccordionSlider from '@/common/AccordianSlider'
import React from 'react'
import EventData from '@/static/eventS-home.json'


const Accordian = () => {
  return (
    <div>
        <AccordionSlider data={EventData} />
    </div>
  )
}

export default Accordian