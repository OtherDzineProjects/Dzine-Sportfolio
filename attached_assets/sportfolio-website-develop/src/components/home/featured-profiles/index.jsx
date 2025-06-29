import FlameIcon from "@/assets/Flame";
import { colors } from "@/utils/colors";
import React from "react";
import ProfileData from '@/static/profiles.json'
import ProfileCarousel from "@/common/Profile/ProfileCarousel";

const FeaturedProfiles = () => {
    return (
        <>
           <div className="flex gap-2 my-20 w-full items-center">
            <div className="flex-grow">
                <h2 className="text-[72px] font-[700] leading-10">PROFILES <span className="opacity-20">IN</span> <br/><span className="opacity-20">SPORTFOLIO</span></h2>
            </div>
            <div className="flex-none">
                <a className="border rounded-lg p-3 cursor-pointer">View all</a>
            </div>
           </div>

           <div className="w-full my-10">
                <h4 className="text-[21px] text-left flex mb-5"><FlameIcon width="30px" height="30px" color={colors.yellow} /><span className="pl-3"> Featured Profiles</span></h4>
                <ProfileCarousel data={ProfileData} />
           </div>
        </>
    )
}

export default FeaturedProfiles;