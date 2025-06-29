/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useColorModeValue, Box, IconButton } from '@chakra-ui/react'
import ShareIcon from '@/assets/Share'
import { ChevronRight } from '@/assets/Chevron'

const ProfileCard = ({
    image = '', title = '', sport = ''
}) => {
    const bg = useColorModeValue('gray.200', 'gray.900')
    const buttonBg = useColorModeValue('#d1d5db', '#1f2937')

    const imageStyle = {
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        objectPosition: 'center',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
        margin: '20px auto 0 auto'
      }
  return (
    <div>
 
            <Box bg={bg} rounded={10} mt={5} p={10}>
            <div className='image-container'>
            <img
              src={image}
              alt={title}
              width={100}
              height={100}
              style={imageStyle}
            />
            </div>
                <div className='w-full mb-5' style={{textAlign: 'center'}}>
                        {title}
                    </div>
                <div className='flex items-center' style={{borderTop: `1px dotted ${buttonBg}`}}>
                    <div className='flex-grow py-5'>
                        <h3 style={{paddingLeft: '20px'}}>{sport}</h3>
                    </div>
                    <div className='flex-auto'>
                        <IconButton variant={'unstyled'} icon={<ShareIcon />} />
                    </div>
                    <div className='flex-auto'>
                        <IconButton variant={'unstyled'} style={{height: '60px', width: '50px'}} icon={<ChevronRight />} />
                    </div>
                </div>
                        
            </Box>
    </div>
  )
}

export default ProfileCard