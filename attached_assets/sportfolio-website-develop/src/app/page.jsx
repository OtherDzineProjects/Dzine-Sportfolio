import React from 'react';
// import Accordian from "@/components/home/Accordian";
// import SearchBar from "@/components/home/SearchBar";
import FadeCarousel from "@/components/home/carousel";
// import HomeEvents from "@/components/home/events";
// import FeaturedProfiles from "@/components/home/featured-profiles";
import HomeAbout from "@/components/home/about";
import CarouselData from '@/static/carousel.json'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <FadeCarousel data={CarouselData} />
    <HomeAbout />
    {/* <SearchBar />  */}
    {/* <HomeEvents /> */}
    {/* <FeaturedProfiles /> */}
    {/* <Accordian /> */}
    </main>
  );
}
