import AccordionSlider from '@/common/AccordianSlider'
import React from 'react'
import CarouselData from '@/static/events-carousel.json'
const EventBanner = () => {
  return (
        <AccordionSlider data={CarouselData} />
  )
}

export default EventBanner