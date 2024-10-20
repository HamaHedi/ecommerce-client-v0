import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  newReview,
  clearErrors,
} from "../../actions/productActions";
import { addItemToCart } from "../../actions/cartActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Sliders from "../../components/Slider";
import { toast } from "react-toastify";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import ReactStars from "react-rating-stars-component";
import Swal from "sweetalert2";
import ListReviews from "../../components/ListReviews";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Image, Modal, Tooltip } from "antd";
import { Radio } from 'antd';
import "../../styles/productdetails.css";
import { cendre, chaud, dore, froid, irise, naturel, teinteImages, doré, doréCendre, cuivre, acajou, mat, beige, rouge, rougeCuivre, rougeViolin, brun, superr, metalic, metalicViolet, mix } from "./constants";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { t } = useTranslation("product");
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const { id } = useParams();

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );
  const { user } = useSelector((state) => state.auth);
  const { error: reviewError, success } = useSelector(
    (state) => state.newReview
  );

  const decreaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const increaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber >= product.stock) return;

    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const addToCart = () => {
    dispatch(addItemToCart(id, quantity));

    toast.success(t("Item Added to Cart"), {
      position: toast.POSITION.TOP_RIGHT,
      className: "m-2",
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (rating === 0 || comment === "") {
      Swal.fire({
        title: "Error!",
        text: t("Rating and Comment are Required"),
        icon: "error",
        confirmButtonText: t("Ok"),
      });
    } else {
      dispatch(
        newReview({
          rating,
          comment,
          productId: id,
        })
      );
      setComment("");
    }
  };

  useEffect(() => {
    dispatch(getProductDetails(id));

    if (reviewError) {
      toast.error(reviewError, {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch(clearErrors());
    }

    if (success) {
      toast.success(t("Reivew posted successfully"), {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, id, reviewError, success]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);
  var settings = {
    dots: true,

    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    autoplay: true,
    infinite: true,

    speed: 1000,
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
  const [value, setValue] = useState();
  useEffect(() => { setValue(product?.sizes?.[0]?.sizePrice) }, [product])
  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <section className="container my-4">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message color="danger" message={error} />
      ) : (
        <>
          <div className="row d-flex justify-content-around">

            <div className="col-12 col-lg-5 img-fluid mt-4">
              <Sliders images={product?.images} />
              {/* <Sliders images={product?.certificates} width={100} /> */}
              <div style={{ display: "flex", gap: "10px", paddingTop: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                {product?.certificates?.map((cert) => <Image fallback={"https://api.lagha.shop" + cert.path} style={{ width: "80px", height: "80px" }} />)}
              </div>
            </div>

            <div className="col-12 col-lg-5 mt-4">
              <h3>{product.name}</h3>
              <p>
                {" "}
                {t("Product")} code: {product.code}
              </p>

              <hr />

              <div className="d-flex align-items-end">
                <h4 className="mb-0">
                  DT {value ? Number(value).toFixed(2) : product.price && product.price.toFixed(2)}
                </h4>
                &nbsp;
                {product.oldPrice !== 0 && (
                  <h6 className="mb-0 text-muted">
                    <del>DT {product.oldPrice}</del>
                  </h6>
                )}
              </div>

              <hr />

              <div className="ratings mt-auto text-nowrap">
                <div className="rating-outer">
                  <div
                    className="rating-inner"
                    style={{ width: `${(product.ratings / 5) * 100}%` }}
                  ></div>
                </div>
                <small id="no_of_reviews">
                  &nbsp;({product.numOfReviews} {t("Reviews")})
                </small>
              </div>

              <hr />

              <b>
                {t("Status")}&nbsp;
                <span
                  className={product.stock > 0 ? "text-success" : "text-danger"}
                >
                  {product.stock > 0 ? t("In Stock") : t("Out of Stock")}
                </span>
              </b>

              <hr />

              <h4>{t("Description")}</h4>
              <p dangerouslySetInnerHTML={{ __html: product.description }} />

              <hr />
              {/* {product?.colors && (
                <div className="form-group" style={{display:"flex", gap:"5px"}}>
                  {product?.colors?.[0].split(",")?.map((color) => (
           
                  ))}
                </div>
              )} */}
              {product?.colors?.length > 0 && <> {product?.colors && <h4>{t("Colors")}</h4>}

                <div
                  className="promo-products-container"
                  style={{ padding: "25px" }}
                >
                  <Slider {...settings}>
                    {product?.colors &&
                      product?.colors?.map((color, index) => (
                        <Tooltip title={color?.name}>
                          <div key={index}>
                            <span
                              style={{
                                display: "inline-block",
                                width: "30px",
                                height: "30px",
                                backgroundColor: color?.value,
                                borderRadius: "50px",
                                margin: "5px",
                              }}
                            ></span>
                          </div>
                        </Tooltip>
                      ))}
                  </Slider>
                </div>              <hr />
              </>}

              {product?.sizes?.length > 0 && <>    <h4>{t("PACK/SIZE")}</h4>

                <Radio.Group onChange={onChange} value={value} defaultValue={product?.sizes?.[0]?.sizePrice}>

                  {product?.sizes?.map((size) => <Radio key={size?.sizePrice} value={size?.sizePrice}><p style={{ fontFamily: "monospace" }}>{size?.sizeName}</p></Radio>
                  )}
                </Radio.Group>              <hr />
              </>}

              <div className="teintes-container">
                <h4>{t("All Teintes")}</h4>
                <div style={{ display: "flex", flexDirection: "column" }}>  <div onClick={showModal} style={{ marginTop: 10, cursor: "pointer" }}>
                  See All
                </div>
                  <div className="teintes-scroll-list" style={{ display: 'flex', overflowX: 'scroll', maxWidth: "400px" }}>
                    {teinteImages.slice(0, 10).map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: "60px", height: "60px", marginRight: 10 }}
                      />
                    ))}
                  </div></div>




                <Modal
                  title="All Teintes"
                  visible={visible}
                  onCancel={handleCancel}
                  footer={null}
                  width={1500}
                >
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{naturel?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {naturel.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{froid?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {froid.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{chaud?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {chaud.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{cendre?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {cendre.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{dore?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {dore.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{irise?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {irise.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{doré?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {doré.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{doréCendre?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {doréCendre.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{cuivre?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {cuivre.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{acajou?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {acajou.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{mat?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {mat.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{beige?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {beige.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{rouge?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {rouge.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{rougeCuivre?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {rougeCuivre.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{rougeViolin?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {rougeViolin.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{brun?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {brun.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{superr?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {superr.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{metalic?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {metalic.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{metalicViolet?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {metalicViolet.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{mix?.name}</span>
                  <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {mix.colors.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: 100, height: 100, margin: 10 }}
                      />
                    ))}
                  </div>
                </Modal>
              </div>
              <hr />
              <div className="row">
                <div className="col">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <button
                        className="btn btn-sm btn-outline-danger px-3"
                        type="button"
                        disabled={product.stock === 0}
                        onClick={decreaseQty}
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </button>
                    </div>

                    <input
                      type="number"
                      className="form-control form-control-sm text-center count"
                      value={quantity}
                      readOnly
                    />

                    <div className="input-group-prepend">
                      <button
                        className="btn btn-sm btn-outline-success px-3"
                        type="button"
                        disabled={product.stock === 0}
                        onClick={increaseQty}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <button
                    type="button"
                    className="btn btn-sm text-white w-100 h-100 text-nowrap"
                    style={{ backgroundColor: "#FF9D1C" }}
                    disabled={product.stock === 0}
                    onClick={addToCart}
                  >
                    <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    &nbsp;&nbsp;{t("Add to Cart")}
                  </button>
                </div>
              </div>

              <hr />

              {/* <p>
								Sold by: <strong>{product.seller}</strong>
							</p> */}
            </div>
          </div>

          <hr />

          <div className="row d-flex justify-content-center">
            <div className="col-md-12">
              <div
                className="card shadow-0 border"
                style={{ backgroundColor: "#F6F9FC" }}
              >
                <div className="card-body p-4">
                  {user ? (
                    <form onSubmit={submitHandler}>
                      <h5 className="text-center">{t("WRITE A REVIEW")}</h5>

                      <div className="star-container text-center text-nowrap mb-3">
                        <div
                          className="star-widget text-nowrap"
                          style={{ display: "inline-block" }}
                        >
                          <ReactStars
                            count={5}
                            onChange={setRating}
                            size={32}
                            isHalf={false}
                            emptyIcon={<i className="far fa-star"></i>}
                            fullIcon={<i className="fa fa-star"></i>}
                            activeColor="#ffd700"
                            value={rating}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <textarea
                          className="form-control"
                          placeholder={t("Describe your experience.")}
                          style={{ minHeight: "100px" }}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn py-2 text-white text-nowrap"
                          style={{
                            backgroundColor: "#FF9D1C",
                            borderRadius: "25px",
                          }}
                        >
                          {t("Submit")}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <Message
                      color="warning"
                      message={t("Login to post your review.")}
                    />
                  )}

                  <hr />

                  {product && product.reviews && product.reviews.length > 0 ? (
                    <ListReviews reviews={product.reviews} />
                  ) : (
                    <h6 className="text-center">{t("No Reviews found!")}</h6>
                  )}
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </section>
  );
};

export default ProductDetails;
