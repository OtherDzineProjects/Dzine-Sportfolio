'use client'

import { colors } from '@/utils/colors'
import React from 'react'

const InnerPageBanner = ({
    title = {
        one: 'ONE',
        two: 'TWO',
        three: 'THREE'
    },
    bgImage='../athletics.jpg'
}) => {
    return (
        <div className='h-[400px] relative bg-slate-900' >
            <div className='opacity-30 absolute w-full h-full' style={{ background: `url(${bgImage}) center center` }} />
            <main className="flex min-h-screen flex-col items-center justify-between pb-24 pt-48">
                <h2 className="text-[72px] font-[700] leading-10 text-center text-white">{title?.one} <span className="opacity-50" style={{color: colors?.secondary}}>{title?.two}</span> <br /><span className="opacity-50" style={{color: colors?.secondary}}>{title?.three}</span></h2>
            </main>
        </div>
    )
}

export default InnerPageBanner