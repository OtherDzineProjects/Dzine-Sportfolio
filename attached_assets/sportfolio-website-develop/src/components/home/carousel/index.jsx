'use client'
import React from 'react';
import Slider from "react-slick";
import './style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
const FadeCarousel = ({data = []}) => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  return (
    <div className="carousel-container">
    <Slider {...settings}>
        {data?.map((item)=> (
            <div key={item?.id} className="carousel-item">
            <Image
              src={item.image}
              alt={item.title}
              laz
              fill
            />
                 {/* <div className={`carousel-content ${item?.contentPosition}`}>
                    <h3>{item.title}</h3>
                    <p>{item.description} <br/>
                    <Button colorScheme='primary' variant='outline' mt={5} zIndex={10} >
                        Register
                    </Button>
                    </p>
                    
                </div> */}
            </div>
        ))}
    </Slider> 
  
    </div>
  );
};

export default FadeCarousel;

