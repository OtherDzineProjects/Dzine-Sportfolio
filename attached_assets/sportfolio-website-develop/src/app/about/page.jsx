import React from 'react';
import AboutContent from "@/components/about/content";
import InnerPageBanner from "@/components/InnerPageBanner";

export default function AboutSportfolio() {
    return (
        <>
        <InnerPageBanner
            title={{
                one: 'KNOW',
                two: 'ABOUT',
                three: 'SPORTFOLIO'
            }}
            bgImage="../athletics.jpg"
        />
        <main className="flex min-h-screen flex-col items-center justify-between px-24 pb-5 pt-5">
            <AboutContent />
        </main>
        </>
    )
}