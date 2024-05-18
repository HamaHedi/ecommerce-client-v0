import React, { useEffect, useState, useRef } from "react";
import Product from "../../components/Product";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  clearErrors,
  getProductPromo,
} from "../../actions/productActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Banner from "../../components/Banner";
import { getCategory } from "../../actions/categoryAction";
import Pagination from "react-js-pagination";
import { useGlobalState } from "../../context/context";
import "../../styles/product.css";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Divider, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { getBrands } from "../../actions/brandActions";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 1000]);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  // const [keyword, setKeyword] = useState('')
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
  var settings2 = {
    dots: false,

    slidesToShow: 4,
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

  const {
    keyword,
    setKeyword,
    category,
    setCategory,
    subcategory,
    setSubategory,
    brand,
    setBrand,
  } = useGlobalState();

  const keywordRef = useRef("");
  const minPriceRef = useRef(0);
  const maxPriceRef = useRef(1000);

  const dispatch = useDispatch();

  const {
    loading,
    products,
    error,
    productsCount,
    resPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);
  const {
    loading: BrandLoading,
    brands,
    brandsCount,
  } = useSelector((state) => state.brands);
  const { productsPromo } = useSelector((state) => state.productsPromo);
  var settings3 = {
    dots: false,

    slidesToShow: productsPromo?.length >= 5 ? 5 : productsPromo?.length,
    slidesToScroll: 5,
    initialSlide: 0,
    autoplay: false,
    infinite: false,
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
  const { loading: categoryLoading, category: allCategory } = useSelector(
    (state) => state.categorys
  );

  const submitHandler = (e) => {
    e.preventDefault();
    setPrice([minPriceRef.current.value, maxPriceRef.current.value]);
  };

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  let count = productsCount;
  if (keyword) {
    count = filteredProductsCount;
  }

  const searchHandler = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setPrice([1, 9000]);
    setCategory("");
    setRating(0);

    setKeyword(keywordRef.current.value);
  };

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBrands("", "", category));
    dispatch(getProductPromo());

    dispatch(
      getProducts(
        keyword,
        currentPage,
        price,
        category,
        rating,
        subcategory,
        brand
      )
    );
  }, [
    dispatch,
    keyword,
    category,
    currentPage,
    price,
    rating,
    subcategory,
    brand,
  ]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return (
    <section>
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
                        setBrand("");
                        setCurrentPage(1);
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
                  setBrand("");
                  setCurrentPage(1);
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

        <span
          onClick={() => {
            navigate("/brands");
          }}
          className="category-title"
        >
          MARQUES
        </span>
      </div>
      <div className="row">
        {keyword !== undefined && (
          <div className="col-12 col-md-3" style={{ padding: "30px" }}>
            <div className="p-2 h-100">
              <form onSubmit={submitHandler}>
                <h6>
                  <b>
                    {t("Price Range")} {price[0]}-{price[1]}
                  </b>
                </h6>

                <div className="row mt-3 mb-2">
                  <div className="col">
                    <div className="form-group">
                      <small>Min</small>
                      <input
                        type="number"
                        min={0}
                        max={1000}
                        className="form-control form-control-sm text-center"
                        placeholder="Min"
                        defaultValue={0}
                        required
                        ref={minPriceRef}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <small>Max</small>
                      <input
                        type="number"
                        min={0}
                        max={1000}
                        className="form-control form-control-sm text-center"
                        placeholder="Max"
                        defaultValue={1000}
                        required
                        ref={maxPriceRef}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btnS btn-sm btn-success">
                    {t("Search")}
                  </button>
                </div>
              </form>

              <hr />

              <h6>
                <b> {t("Categories")}</b>
              </h6>

              <ul className="list-group">
                <li className="list-group-item p-2">
                  <b
                    onClick={() => {
                      setCategory("");
                      setSubategory("");
                      setBrand("");
                      setCurrentPage(1);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {t("All")}
                  </b>
                </li>

                {categoryLoading ? (
                  <div className="text-center my-3">
                    <div className="spinner-border" role="status">
                      <span className="sr-only"> {t("Loading")} </span>
                    </div>
                  </div>
                ) : (
                  allCategory &&
                  allCategory.map((category) => (
                    <li className="list-group-item p-2" key={category._id}>
                      <small
                        onClick={() => {
                          setKeyword("");
                          setCategory(category?.title);
                          setSubategory("");
                          setBrand("");
                          setCurrentPage(1);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {category.title}
                      </small>
                    </li>
                  ))
                )}
              </ul>

              <h6>
                <b> {t("Brands")}</b>
              </h6>
              <ul className="list-group">
                <li className="list-group-item p-2">
                  <b
                    onClick={() => {
                      // setCategory("");
                      // setSubategory("");
                      setBrand("");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {t("All")}
                  </b>
                </li>

                {BrandLoading ? (
                  <div className="text-center my-3">
                    <div className="spinner-border" role="status">
                      <span className="sr-only"> {t("Loading")} </span>
                    </div>
                  </div>
                ) : (
                  brands &&
                  brands.map((brand) => (
                    <li className="list-group-item p-2" key={brand.id}>
                      <small
                        onClick={() => {
                          setKeyword("");
                          setCurrentPage(1);

                          setBrand(brand?.title);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {brand.title}
                      </small>
                    </li>
                  ))
                )}
              </ul>
              <hr />

              <h6>
                <b>{t("Ratings")}</b>
              </h6>

              <ul className="pl-0">
                {[5, 4, 3, 2, 1, 0].map((star) => (
                  <li
                    style={{
                      cursor: "pointer",
                      listStyleType: "none",
                    }}
                    key={star}
                    onClick={() => setRating(star)}
                  >
                    <div className="rating-outer">
                      <div
                        className="rating-inner"
                        style={{
                          width: `${star * 20}%`,
                        }}
                      ></div>
                    </div>
                    <small id="no_of_reviews">&nbsp;{star}/5</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className={keyword !== undefined ? "col-12 col-md-9" : "col"}>
          {keyword === undefined && <Banner />}
          {keyword === undefined && (
            <div className="about-container">
              <div className="about-images-container">
                <img src="assets/img1.png" className="about-image-1" />
                <img src="assets/img2.png" className="about-image-2" />
                <img src="assets/bg1.png" />
                <img src="assets/bg2.png" />
              </div>
              <div className="info-container">
                <span className="about-subtitle">{t("ABOUT LAGHA")}</span>
                <span className="about-title">
                  {t("When You Look Good You Feel Good")}
                </span>
                <p className="about-paragraphe">
                  {t("The top three occupations in the Beauty")}
                </p>
              </div>
            </div>
          )}
          <section
            className="container my-4"
            style={{ width: "100%", maxWidth: "80%" }}
          >
            <form onSubmit={searchHandler}>
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("search..")}
                  ref={keywordRef}
                />
                <div className="input-group-append">
                  <span className="input-group-text" id="basic-addon2">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </form>

            {loading ? (
              <Loader />
            ) : products && products?.length === 0 ? (
              <Message color="danger" message={t("No Results Found")} />
            ) : error ? (
              <Message color="danger" message={error} />
            ) : (
              <>
                <div
                  className="row"
                  style={{ gap: "35px", justifyContent: "center" }}
                >
                  {products &&
                    products?.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                </div>

                {resPerPage < count && (
                  <div
                    className="d-flex justify-content-center"
                    style={{ paddingTop: "15px" }}
                  >
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resPerPage}
                      totalItemsCount={productsCount}
                      onChange={setCurrentPageNo}
                      nextPageText={"›"}
                      prevPageText={"‹"}
                      firstPageText={"«"}
                      lastPageText={"»"}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      {productsPromo?.length > 0 && <span className="nos-marque">Promo</span>}
      {productsPromo?.length > 0 && (
        <div className="promo-products-container" style={{ padding: "25px" }}>
          <Slider {...settings3}>
            {productsPromo &&
              productsPromo.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
          </Slider>
        </div>
      )}

      <div className="slider-container" style={{ padding: "25px" }}>
        <Slider {...settings2}>
          <div>
            <img
              src="assets/2-0-seaforce-lotion-100ml.jpg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img
              src="assets/2-0-seaforce-lotion.jpg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img src="assets/20150.jpg" style={{ padding: "5px" }} />
          </div>
          <div>
            <img
              src="assets/20180-purepigments-neutral.jpg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img
              src="assets/colorsave-hairmask250.jpg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img
              src="assets/colorsave-shampoo-2501.jpg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img
              src="assets/newave-perm-kit-web.png"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img src="assets/orange-render.jpg" style={{ padding: "5px" }} />
          </div>
        </Slider>
      </div>
      <span className="nos-marque">NOS MARQUES</span>
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

export default Products;
