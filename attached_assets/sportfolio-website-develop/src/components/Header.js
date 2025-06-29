'use client'

import Image from 'next/image'
import React from 'react'
import './header.css'
import { Button, IconButton, useColorMode, Box , useColorModeValue } from '@chakra-ui/react'
import MoonIcon from '@/assets/Moon'
import SunIcon from '@/assets/Sun'
import { colors } from '@/utils/colors'

const Header = () => {

  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('#f3f4f6', '#141214')
  const bgSignUp = useColorModeValue('rgba(42, 63, 248, 0.1)', 'rgba(255, 255, 255, 0.1)')

  return (
    <Box >
    <div className='flex sport-container gap-5 items-center py-5 fixed t-0 l-0 r-0 z-10' style={{background: bg}}>
        <div className='flex-none'>
        <a
            href="\"
          >
            <Image
              src={colorMode === 'light' ? "/sportfolio-dark.svg" : "/sportfolio.svg" }
              alt="Vercel Logo"
              width={200}
              height={80}
              priority
            />
          </a>
          </div>
          <div className='flex-grow'>
            <nav className='header-nav left'>
            <ul>
                <li>
                    <a className='text-xl font-bold' href='/events'>Events</a>
                </li>
                <li>
                    <a className='text-xl font-bold' href='/media'>Media</a>
                </li>
                <li>
                    <a className='text-xl font-bold' href='/sponsors'>Sponsors</a>
                </li>
                <li>
                    <a className='text-xl font-bold' href='/knowledge-centre'>Knowledge centre</a>
                </li>
            </ul>
            </nav>
          </div>
          <div className='flex-none'>
          <nav className='header-nav right'>
            <ul>
              <li>
                <IconButton icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} />
              </li>
                {/* <li>
                  <Button colorScheme='blue' variant='ghost' leftIcon={<GlobeIcon color={colors?.secondary} />} >
                  മലയാളം 
                    </Button>
                </li> */}
                <li>
                    <Button colorScheme='blue' variant='ghost' style={{color: colors.primary}} onClick={()=>  { window.location.href = 'https://app.mysportfolio.in/auth/signin' }} >
                        Signin
                    </Button>
                </li>
                <li>
                    <Button colorScheme='blue' variant='outline' style={{background: bgSignUp, color: colors.primary}} className='have-bg-border' onClick={()=>  { window.location.href = 'https://app.mysportfolio.in/auth/signup' }} >
                        SignUp
                    </Button>
                </li>
            </ul>
            </nav>
          </div>
    </div>
    </Box>
  )
}

export default Header