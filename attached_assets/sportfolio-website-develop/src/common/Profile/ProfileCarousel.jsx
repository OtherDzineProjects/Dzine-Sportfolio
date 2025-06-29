'use client'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProfileCard from "./ProfileCard";
import './style.css'
const ProfileCarousel = ({data = []}) => {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

  return (
    <div className="profile-carousel-container">
    <Slider {...settings}>
        {data?.map((item)=> (
            <div key={item?.id} className="pofile-carousel-item">
                <ProfileCard image={item?.image} title={item?.name} sport={item?.sport} />
            </div>
        ))}
    </Slider> 
  
    </div>
  );
};

export default ProfileCarousel