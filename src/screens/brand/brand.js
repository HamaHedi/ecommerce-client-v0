import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../actions/brandActions";
import { useGlobalState } from "../../context/context";
import "../../styles/product.css";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getBrands } from "../../actions/brandActions";
import "../../styles/brand.css"
import { getCategory } from "../../actions/categoryAction";
import { Divider, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const Brands = () => {
  const { brands: brands } = useSelector((state) => state.brands);
  const navigate = useNavigate()
  const { loading: categoryLoading, category: allCategory } = useSelector(
    (state) => state.categorys
  );
  const { t } = useTranslation("product");
  var settings = {
    dots: false,

    slidesToShow: 6,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    infinite: true,

    speed: 4000,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const { keyword, setKeyword, category, setCategory, subcategory, setSubategory, brand,
    setBrand, } = useGlobalState();
  console.log(subcategory)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategory());

  }, []);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return (
    <section >
      <div className="categories-container">
        {allCategory?.map((category) => (
          <span className="category-title" key={category.title}>
            <Dropdown
              overlay={
                <Menu style={{ borderRadius: "5px" }}>
                  {category?.subcategories?.map((subCategory) => (
                    <Menu.Item
                      onClick={() => {
                        setKeyword("");
                        setCategory(category.title);
                        setSubategory(subCategory);
                        navigate("/")
                      }}
                      key={subCategory}
                      className="gategory-title"
                    >
                      {subCategory} <Divider />
                    </Menu.Item>
                  ))}
                </Menu>
              }
              placement="bottom"
              arrow
            >
              <span
                onClick={() => {
                  setKeyword("");
                  setCategory(category?.title);
                  setSubategory("");
                  navigate("/")

                }}
                className="category-title"
              >
                {category?.title}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="currentColor"
                    d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
                  ></path>
                </svg>
              </span>
            </Dropdown>
          </span>
        ))}


      </div>
      <div className="brands-container">
        <span className="brand-header">Marques</span>
        {brands?.map((brand) => <div className="brand-info-container">
          <img src={"https://api.lagha.shop/" + brand?.images?.[0]?.path} style={{ width: "98px" }} />
          <span className="brand-name">{brand?.title}</span>
          <span className="brand-name">{brand?.productCount} Produits</span>
          <span className="brand-name product-link" onClick={() => {
            navigate('/')
            setBrand(brand?.title)
            setKeyword("");
            setCategory("");
            setSubategory("");
          }}> Voir Les Produits</span>

        </div>)}

      </div>
      <div className="slider-container" style={{ padding: "25px" }}>
        <Slider {...settings}>
          <div>
            <img src="assets/nature.png" />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="assets/logo-anea.png"
              style={{ height: "60px", marginLeft: "60px" }}
            />
          </div>
          <div>
            <img src="assets/nevitaly.png" />
          </div>
          <div>
            <img src="assets/5_x150.webp" />
          </div>
          <div>
            <img src="assets/3_x150.webp" />
          </div>
          <div>
            <img src="assets/5_x150.webp" />
          </div>
          <div>
            <img src="assets/3_x150.webp" />
          </div>
          <div>
            <img src="assets/5_x150.webp" />
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default Brands;
