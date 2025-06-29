'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@chakra-ui/react";
import React from "react";

const HomeAbout = () => {
    const router = useRouter()
    return (
        <>
            <div className="flex gap-2 mt-20 mb-10 w-full">
                <div className="flex-grow">
                    <h2 className="text-[72px] font-[700] leading-10 text-center">KNOW <span className="opacity-20">ABOUT</span> <br /><span className="opacity-20">SPORTFOLIO</span></h2>
                    
                </div>

            </div>

            <div className="w-full grid grid-cols-2 mb-10 gap-5">
                <div>
                    <img alt='sportfolio' className='w-full rounded-lg opacity-30' src='./athletics.jpg' />
                    </div>
                <div className="flex flex-col gap-3">
                    <p>
                        Sportfolio is an innovative sports portal brought to life by Dzine Technologies, with strong support from the Centre for Sports Research and Development Trust. Envisioned by sports enthusiast Mr. Ahmmad Sukarno, Sportfolio’s mission is to bridge the gap between individuals passionate about sports and the organizations that can foster and develop their skills. With the aim of enhancing skills across all levels and age groups, Sportfolio is designed as an inclusive and engaging platform for sports enthusiasts and professionals alike.
                    </p>
                    <p>
                        The main purpose of Sportfolio is to connect people who are interested in any sport, helping them find organizations, events, and training opportunities that align with their passions. Whether you are a beginner looking to explore a new sport, an experienced player striving to enhance your skills, or an organization wanting to reach out to dedicated athletes, Sportfolio provides tools to facilitate these connections. Through a dynamic user interface, Sportfolio makes it easy to search, find, and engage with local or international sports communities, encouraging active involvement and skill development across various disciplines.
                    </p>
                    <div>
                    <Button colorScheme='blue' variant='outline' className='have-bg-border' onClick={() => router.push('/about')} >
                        Read More..
                    </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeAbout;