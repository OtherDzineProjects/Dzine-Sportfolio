/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import { useColorModeValue, Box, IconButton } from '@chakra-ui/react'
import ShareIcon from '@/assets/Share'
import { ChevronRight } from '@/assets/Chevron'

const EventCard = ({
    image = '', title = ''
}) => {
    const bg = useColorModeValue('gray.200', 'gray.900')
    const buttonBg = useColorModeValue('gray.300', 'gray.800')
  return (
    <div>
        <div className='image-container'>
        <img
              src={image}
              alt={title}
              laz
              fill
            />
            </div>
            <Box bg={bg} rounded={10} mt={5}>
                <div className='flex items-center gap-3'>
                    <div className='flex-grow py-5'>
                        <h3 style={{paddingLeft: '20px'}}>{title}</h3>
                    </div>
                    {/* <div className='flex-auto'>
                        <IconButton variant={'unstyled'} icon={<ShareIcon />} />
                    </div> */}
                    <div className='flex-auto'>
                        <IconButton variant={'unstyled'} bg={buttonBg} style={{height: '60px', width: '50px'}} icon={<ChevronRight />} />
                    </div>
                </div>
                        
            </Box>
    </div>
  )
}

export default EventCard