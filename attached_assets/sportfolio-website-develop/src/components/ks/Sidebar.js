'use client'

import React, { useState } from 'react'
import sportsJson from '@/static/sports.json'
import { useColorModeValue } from '@chakra-ui/react'

const KsSidebar = () => {
  const [search, setSearch] = useState('')
  const bg = useColorModeValue('rgba(42, 63, 248, 0.1)', 'rgba(255, 255, 255, 0.1)')
  return (
    <div className={`border shadow-lg rounded-lg p-5 mt-1`} style={{background: bg}}>
      <input
            type='text'
            value={search}
            placeholder='Search Sports'
            onChange={(e) => setSearch(e.target.value)}
            className='rounded-lg px-3 py-1 mb-3'
            />
        <ul style={{height: 'calc(100vh - 200px)', overflowY: 'auto'}}>
          
            {sportsJson?.filter((item)=>item?.name.toLowerCase()?.includes(search?.toLowerCase()))?.map((item)=> (
                <li key={item?.id} className='mb-1 block'>
                    <a className='w-full block' href={`/knowledge-centre/sports/${item?.id}`}>{item?.name}</a>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default KsSidebar