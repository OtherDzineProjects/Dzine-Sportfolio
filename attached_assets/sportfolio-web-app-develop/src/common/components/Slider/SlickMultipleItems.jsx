import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const SlickMultipleItems = ({
  // content = () => {},
  slides = []
}) => {
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
      <Slider {...settings}>
        {slides?.map((item, index)=> {
          return (
            <div key={item}>
             {index}
            </div>
          );
        })}
      </Slider>
  );
}

export default SlickMultipleItems;
