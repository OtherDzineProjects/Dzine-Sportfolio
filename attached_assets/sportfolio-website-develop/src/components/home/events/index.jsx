import FlameIcon from "@/assets/Flame";
import EventCarousel from "@/common/Event/EventCarousel";
import { colors } from "@/utils/colors";
import React from "react";
import EventData from '@/static/events-home.json'

const HomeEvents = () => {
    return (
        <>
           <div className="grid grid-cols-2 gap-2 my-20">
            <div className="flex-grow">
                <h2 className="text-[72px] font-[700] leading-10">EVENTS <span className="opacity-20">VIA</span> <br/><span className="opacity-20">SPORTFOLIO</span></h2>
            </div>
            <div className="flex-grow">
                <h5>Experience live action from your favorite sports, dive into award-winning Original Films and Series, and explore our 24/7 thematic linear channels. With exclusive content spanning drama, comedy, documentaries, and kids shows, there always something for everyone. Stay connected with real-time sports updates and enjoy a vast library of critically acclaimed movies and series, all in one place.</h5>
            </div>
           </div>

           <div className="w-full my-10">
                <h4 className="text-[21px] text-left flex mb-5"><FlameIcon width="30px" height="30px" color={colors.yellow} /><span className="pl-3"> Trending Events</span></h4>
                <EventCarousel data={EventData} />
           </div>
        </>
    )
}

export default HomeEvents;