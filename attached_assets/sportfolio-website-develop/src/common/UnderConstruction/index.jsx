/* eslint-disable @next/next/no-img-element */
import Constuction from '@/assets/Constuction'
import React from 'react'

const UnderConstruction = ({ title= "Under constuction", subTitle="" }) => {
  return (
    <div className='p-20'>
            <Constuction width="500px" style={{margin: 'auto'}} />
            <h2 className='text-center font-[700] w-full mb-5' style={{fontSize: '36px'}}>
                {title}
            </h2>
            <h5>
                {subTitle}
            </h5>
    </div>
  )
}

export default UnderConstruction