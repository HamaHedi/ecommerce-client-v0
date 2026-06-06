import React, { useEffect, useState, useRef } from "react";
import Product from "../../components/Product";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  clearErrors,
  getProductPromo,
  getNewProduct,
} from "../../actions/productActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Banner from "../../components/Banner";
import BestSellers from "../../components/BestSellers";
import HomeExtras, { AnnounceBar } from "../../components/HomeExtras";
import {
  StatsBand,
  EditorialStory,
  Testimonials,
  InstagramGallery,
} from "../../components/HomeSections";
import { getCategory } from "../../actions/categoryAction";
import Pagination from "react-js-pagination";
import { useGlobalState } from "../../context/context";
import "../../styles/product.css";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getBrands } from "../../actions/brandActions";
import prevArrow from '../../assets/icons/prev.svg';
import nextArrow from '../../assets/icons/next.svg';

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 1000]);
  const navigate = useNavigate();
  const location = useLocation();
  const isShop = location.pathname.startsWith("/products");
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

    newProducts,
  } = useSelector((state) => state.newProducts);
  console.log(newProducts)
  const {
    loading: BrandLoading,
    brands,
    brandsCount,
  } = useSelector((state) => state.brands);
  const { productsPromo } = useSelector((state) => state.productsPromo);
  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, width: '50px', height: '50px', backgroundImage: `url(${prevArrow})`, backgroundRepeat: "no-repeat", zIndex: "99" }}
        onClick={onClick}
      />
    );
  }

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, width: '30px', height: '30px', backgroundImage: `url(${nextArrow})`, backgroundRepeat: "no-repeat", zIndex: "99" }}
        onClick={onClick}
      />
    );
  }
  var settings3 = {
    dots: false,

    slidesToShow: newProducts?.newProducts?.length >= 4 ? 4 : newProducts?.newProducts?.length,
    slidesToScroll: 2,
    initialSlide: 0,
    autoplay: false,
    infinite: false,
    arrows: true,
    accessibility: true,
    speed: 2000,
    autoplaySpeed: 2000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
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
    if (!isShop) navigate("/products");
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
    dispatch(
      getNewProduct(

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

  // On the home route, clear any active filters so the featured grid stays general.
  useEffect(() => {
    if (!isShop) {
      if (keyword !== undefined) setKeyword(undefined);
      if (category) setCategory("");
      if (subcategory) setSubategory("");
      if (brand) setBrand("");
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleHomeCategory = (title) => {
    setKeyword("");
    setCategory(title);
    setSubategory("");
    setBrand("");
    setCurrentPage(1);
    navigate("/products");
  };

  return (
    <section>
      <AnnounceBar />
      <div className="categories-container">
        <span
          onClick={() => {
            navigate("/brands");
          }}
          className="category-title"
          style={{ margin: 0 }}
        >
          MARQUES
        </span>
        {allCategory?.map((category) => (
          <span className="category-title" key={category.title}>
            <Dropdown
              overlayClassName="subcat-dropdown"
              overlay={
                <div className="subcat-menu">
                  <div className="subcat-menu-head">{category.title}</div>
                  <button
                    type="button"
                    className="subcat-item subcat-all"
                    onClick={() => {
                      setKeyword("");
                      setCategory(category.title);
                      setSubategory("");
                      setBrand("");
                      setCurrentPage(1);
                      navigate("/products");
                    }}
                  >
                    <span>Tout voir</span>
                    <i className="fa fa-th-large" aria-hidden="true"></i>
                  </button>
                  {category?.subcategories?.map((subCategory) => (
                    <button
                      type="button"
                      className="subcat-item"
                      key={subCategory}
                      onClick={() => {
                        setKeyword("");
                        setCategory(category.title);
                        setSubategory(subCategory);
                        setBrand("");
                        setCurrentPage(1);
                        navigate("/products");
                      }}
                    >
                      <span>{subCategory}</span>
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </button>
                  ))}
                </div>
              }
              placement="bottom"
            >
              <span
                onClick={() => {
                  setKeyword("");
                  setCategory(category?.title);
                  setSubategory("");
                  setBrand("");
                  setCurrentPage(1);
                  navigate("/products");
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
      <div className="row">
        {isShop && (

          <div className="col-12 col-md-3 filters-sidebar">

            <div className="filters-card">
              <h5 className="filters-title">{t("Filters") !== "Filters" ? t("Filters") : "Filtres"}</h5>
              <form onSubmit={submitHandler} className="filter-group">
                <span className="filter-label">
                  {t("Price Range")}
                  <span className="filter-range-value">{price[0]} - {price[1]} DT</span>
                </span>

                <div className="filter-price-row">
                  <div className="filter-price-field">
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
                  <div className="filter-price-field">
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

                <button type="submit" className="filter-search-btn">
                  {t("Search")}
                </button>
              </form>

              <div className="filter-group">
              <span className="filter-label">{t("Categories")}</span>

              <ul className="filter-list">
                <li
                  className={`filter-item ${!category ? "active" : ""}`}
                  onClick={() => {
                    setCategory("");
                    setSubategory("");
                    setBrand("");
                    setCurrentPage(1);
                  }}
                >
                  {t("All")}
                </li>

                {categoryLoading ? (
                  <div className="text-center my-3">
                    <div className="spinner-border" role="status">
                      <span className="sr-only"> {t("Loading")} </span>
                    </div>
                  </div>
                ) : (
                  allCategory &&
                  allCategory.map((cat) => (
                    <li
                      className={`filter-item ${category === cat?.title ? "active" : ""}`}
                      key={cat._id}
                      onClick={() => {
                        setKeyword("");
                        setCategory(cat?.title);
                        setSubategory("");
                        setBrand("");
                        setCurrentPage(1);
                      }}
                    >
                      {cat.title}
                    </li>
                  ))
                )}
              </ul>
              </div>

              <div className="filter-group">
              <span className="filter-label">{t("Brands")}</span>
              <ul className="filter-list">
                <li
                  className={`filter-item ${!brand ? "active" : ""}`}
                  onClick={() => {
                    setBrand("");
                  }}
                >
                  {t("All")}
                </li>

                {BrandLoading ? (
                  <div className="text-center my-3">
                    <div className="spinner-border" role="status">
                      <span className="sr-only"> {t("Loading")} </span>
                    </div>
                  </div>
                ) : (
                  brands &&
                  brands.map((b) => (
                    <li
                      className={`filter-item ${brand === b?.title ? "active" : ""}`}
                      key={b.id}
                      onClick={() => {
                        setKeyword("");
                        setCurrentPage(1);
                        setBrand(b?.title);
                      }}
                    >
                      {b.title}
                    </li>
                  ))
                )}
              </ul>
              </div>

              <div className="filter-group">
              <span className="filter-label">{t("Ratings")}</span>

              <ul className="filter-ratings">
                {[5, 4, 3, 2, 1, 0].map((star) => (
                  <li
                    className={`filter-rating-item ${rating === star ? "active" : ""}`}
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
          </div>
        )}

        <div className={isShop ? "col-12 col-md-9" : "col"} style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {!isShop && <Banner />}
          {!isShop && (
            <>
              <StatsBand />
              <HomeExtras
                categories={allCategory}
                onCategory={handleHomeCategory}
              />
            </>
          )}
          {/* {keyword === undefined && (
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
          )} */}
          {!isShop && <div className="new-product-container" ><span className="new-products-title">
              Nouveaux produits
            </span>
              {/* {newProducts?.newProducts &&
              newProducts?.newProducts?.map((product) => (
                <Product key={product._id} product={product} />
              ))} */}
              {newProducts?.newProducts?.length > 0 && (
                <div className="promo-products-container" style={{ padding: "50px" }}>
                  <Slider {...settings3}>
                    {newProducts?.newProducts &&
                      newProducts?.newProducts?.map((product) => (
                        <div key={product._id}>
                          <Product product={product} />
                        </div>
                      ))}
                  </Slider>
                </div>
              )}
            </div>}

          {!isShop && <EditorialStory />}

          <section
            className="container my-4"
            style={{ width: "100%", maxWidth: "80%" }}
          >
            {isShop && <form onSubmit={searchHandler}>
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
            </form>}


            {loading ? (
              <Loader />
            ) : products && products?.length === 0 ? (
              <Message color="danger" message={t("No Results Found")} />
            ) : error ? (
              <Message color="danger" message={error} />
            ) : (
              <>
                <span className="new-products-title">
                  {isShop
                    ? keyword
                      ? `Résultats pour « ${keyword} »`
                      : category || "Nos produits"
                    : "Nos produits"}
                </span>
                <div className="products-grid">
                  {products &&
                    products?.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                </div>

                {isShop && resPerPage < count && (
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
      {!isShop && productsPromo?.length > 0 && <span className="nos-marque">Promo</span>}
      {!isShop && productsPromo?.length > 0 && (
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

      {!isShop && <BestSellers />}

      {!isShop && <div className="slider-container" style={{ padding: "25px" }}>
        <Slider {...settings2}>
          <div>
            <img
              src="assets/products_carousel/1.jpeg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img
              src="assets/products_carousel/2.jpeg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img src="assets/products_carousel/3.jpeg" style={{ padding: "5px" }} />
          </div>
          <div>
            <img
              src="assets/products_carousel/4.jpeg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img
              src="assets/products_carousel/5.jpeg"
              style={{ padding: "5px" }}
            />
          </div>
          <div>
            <img
              src="assets/products_carousel/6.jpeg"
              style={{ padding: "5px" }}
            />
          </div>
          {/* <div>
            <img
              src="assets/products_carousel/7.jpeg"
              style={{ padding: "5px" }}
            />
          </div> */}
          <div>
            <img src="assets/products_carousel/8.jpeg" style={{ padding: "5px" }} />
          </div>
        </Slider>
      </div>}

      {!isShop && <Testimonials />}

      {!isShop && <span className="nos-marque">NOS MARQUES</span>}
      {!isShop && <div className="slider-container" style={{ padding: "25px" }}>
        <Slider {...settings}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand2.jpeg" style={{ height: "120px", marginLeft: "50px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img
              src="assets/brand1.jpeg" style={{ height: "120px" }}
            // style={{ height: "60px", marginLeft: "60px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/nevitaly.png" style={{ marginTop: "30px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand3.jpeg" style={{ height: "120px", marginLeft: "50px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand4.jpeg" style={{ height: "120px", marginLeft: "100px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand5.jpeg" style={{ height: "120px", marginLeft: "50px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand6.jpeg" style={{ height: "120px", marginLeft: "0px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand7.jpeg" style={{ height: "120px", marginLeft: "80px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand8.jpeg" style={{ height: "120px", marginLeft: "50px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand9.jpeg" style={{ height: "120px", marginLeft: "50px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src="assets/brand10.jpeg" style={{ height: "120px", marginLeft: "50px" }}
            />
          </div>
        </Slider>
      </div>}

      {!isShop && <InstagramGallery />}
    </section>
  );
};

export default Products;
