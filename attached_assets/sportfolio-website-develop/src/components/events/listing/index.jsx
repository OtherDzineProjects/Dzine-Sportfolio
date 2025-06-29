import React from 'react'
import EventCard from '@/common/Event/EventCard'


const EventListing = ({data = []}) => {
  return (
    <div className='flex flex-row flex-wrap mt-10 gap-5'>
        {data?.map((item)=> (
            <div key={item?.id}>
                <EventCard image={item?.image} title={item?.title}  />
            </div>
        ))}
    </div>
  )
}

export default EventListing