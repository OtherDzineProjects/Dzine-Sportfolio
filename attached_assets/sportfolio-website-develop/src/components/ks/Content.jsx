import React, { useCallback } from 'react'
import Archery from './items/Archery'
import Welcome from './items/Welcome'

const KsContent = ({
  sportsId = null
}) => {

  const sportsPage = useCallback(() => {
    switch(sportsId){
      case 'archery':
        return <Archery />
      case 'football':
        return <p>Welcome to the Football Sport Knowledge Centre!</p>
      case 'cricket':
        return <p>Welcome to the Cricket Sport Knowledge Centre!</p>
      case 'hockey':
        return <p>Welcome to the Hockey Sport Knowledge Centre!</p>
      default:  
      return <Welcome />
    }
  },[sportsId])

  return (
    <div className='flex justify-center px-5 mt-1 w-full'>
        <div className='shadow-lg p-10 rounded-lg border w-full' style={{height: 'calc(100vh - 115px)', overflowY: 'auto'}}>
          {sportsPage()}
        </div>
    </div>
  )
}

export default KsContent