'use client'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventCard from "./EventCard";
import './style.css'
const EventCarousel = ({data = []}) => {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

  return (
    <div className="event-carousel-container">
    <Slider {...settings}>
        {data?.map((item)=> (
            <div key={item?.id} className="event-carousel-item">
                <EventCard image={item?.image} title={item?.title}  />
            </div>
        ))}
    </Slider> 
  
    </div>
  );
};

export default EventCarousel;

