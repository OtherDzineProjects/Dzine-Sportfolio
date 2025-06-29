'use client'

import Image from 'next/image'
import React from 'react'
import './footer.css'
import { useColorMode, Box, useColorModeValue } from '@chakra-ui/react'

const Footer = () => {

    const { colorMode, toggleColorMode } = useColorMode()
    const bg = useColorModeValue('#f3f4f6', '#151415')
    const border = useColorModeValue('#d1d5db', '#1f2937')


    return (
        <Box bg={bg}>
            <div className='w-full pt-[50px] pb-[50px]' style={{borderBottom: `1px dotted ${border}`}}>
            <a
            className='block'
                        href="\"
                    >
                        <Image
                            src={colorMode === 'light' ? "/sportfolio-dark.svg" : "/sportfolio.svg"}
                            alt="Vercel Logo"
                            width={300}
                            height={120}
                            priority
                            style={{margin: 'auto'}}
                        />
                    </a>
            </div>
            <div className='flex sport-container gap-5 py-10 t-0 l-0 r-0 z-10' style={{borderBottom: `1px dotted ${border}`}}>
                <div className='flex-grow'>

                    <nav className='footer-nav left'>
                        <h4>Features</h4>
                        <ul>
                            <li>
                                <a href='/events'>Events</a>
                            </li>
                            <li>
                                <a href='/media'>Media</a>
                            </li>
                            <li>
                                <a href='/sports'>Sports</a>
                            </li>
                            <li>
                                <a href='/knowledge-centre'>Knowledge center</a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className='flex-grow'>
                    <nav className='footer-nav left'>
                        <h4>Sportfolio Events</h4>
                        <ul>
                            <li>
                                <a href='/events/inaguration'>Inaguaral Function</a>
                            </li>
                            <li>
                                <a href='/events/one-million-goal'>One Million Goal</a>
                            </li>
                            <li>
                                <a href='/events/hoopathon'>Hoopathon</a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className='flex-grow'>
                    <nav className='footer-nav left'>
                        <h4>Media</h4>
                        <ul>
                            <li>
                                <a href='/media/news'>News</a>
                            </li>
                            <li>
                                <a href='/media'>Media</a>
                            </li>
                            <li>
                                <a href='/media/advertising'>Advertising</a>
                            </li>
                            <li>
                                <a href='/media/podcast'>Podcast</a>
                            </li>
                            <li>
                                <a href='/sponsor'>Become a Sponsor</a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className='flex-grow'>
                    <nav className='footer-nav left'>
                        <h4>Explore</h4>
                        <ul>
                            <li>
                                <a href='/athletics'>Athletics</a>
                            </li>
                            <li>
                                <a href='/sports'>Sports</a>
                            </li>
                            <li>
                                <a href='/organizations'>Organizations</a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
            <div className='flex sport-container gap-5 py-10 t-0 l-0 r-0 z-10' style={{borderBottom: `1px dotted ${border}`}}>
                <div className='flex-grow'>

                    <nav className='footer-horizontal-nav'>
                        <ul>
                            <li>
                                <a href='/associates'>Sportfolio Associates with:</a>
                            </li>
                            <li>
                                <a href='/associates/csrd'>CSRD</a>
                            </li>
                            <li>
                                <a href='/associates/ksa'>Kerala Sports Association</a>
                            </li>
                            <li>
                                <a href='/associates/dzine'>Dzine Technologies</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </Box>
    )
}

export default Footer