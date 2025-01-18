
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "./slider.css"
import { Image } from "antd";
const ProductCarousel = ({ images }) => {
  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: thumbSliderRef.current,
    afterChange: (index) => setCurrentSlide(index),
  };

  const thumbSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: mainSliderRef.current,
    focusOnSelect: true,
    centerMode: true,
    centerPadding: "0px",
    arrows: true,
  };

  return (
    <div className="carousel-container">
      {/* Main Image Slider */}
      <Slider {...mainSliderSettings} ref={mainSliderRef} className="main-slider">
        {images?.map((image, index) => (
          <div key={index} className="main-slide">
            <Image src={`https://api.lagha.shop${image.path}`} // Ensure the correct URL
              alt={`Product ${index}`} className="main-image" />
          </div>
        ))}
      </Slider>
      {images?.length > 1 && <Slider {...thumbSliderSettings} ref={thumbSliderRef} className="thumbnail-slider">
        {images?.map((image, index) => (
          <div key={index} className={`thumbnail-slide ${currentSlide === index ? "active" : ""}`}>
            <img src={`https://api.lagha.shop${image.path}`} // Ensure the correct URL
              alt={`Thumbnail ${index}`} className="thumbnail-image" />
          </div>
        ))}
      </Slider>}

    </div>
  );
};

export default ProductCarousel;


