import React, { useState, useEffect, useRef } from "react";
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

import { Button, Image, Modal, Tooltip } from "antd";
import { Radio } from 'antd';
import "../../styles/productdetails.css";
import { cendre, chaud, dore, froid, irise, naturel, teinteImages, doré, doréCendre, cuivre, acajou, mat, beige, rouge, rougeCuivre, rougeViolin, brun, superr, metalic, metalicViolet, mix } from "./constants";
import { beigeIrise, booster, chocolat, coffee, coldBrown, goldenAndCold, mahogany, marron, moka, naturell, ramati, rougee, sand, light, toner, violet, ash } from "./constants2"
import { ReactComponent as FasebookIcon } from "../../components/square-facebook.svg";
import { ReactComponent as InstagramIcon } from "../../components/instagram.svg";
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
    dispatch(addItemToCart(id, quantity, value, selectedColor));

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

  const [value, setValue] = useState();
  const [selectedColor, setColor] = useState();

  useEffect(() => { setValue(product?.sizes?.[0]); setColor(product?.colors?.[0]?.name); }, [product])

  const listRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
    setStartX(e.pageX - (listRef.current?.offsetLeft || 0));
    setScrollLeft(listRef.current?.scrollLeft || 0);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (listRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1;
    if (listRef.current) {
      listRef.current.scrollLeft = scrollLeft - walk;
    }
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
              <div className="d-flex align-items-end">
                <h4 className="mb-0">
                  DT {value?.sizePrice ? Number(value?.sizePrice).toFixed(2) : product.price && product.price.toFixed(2)}
                </h4>
                &nbsp;
                {product.oldPrice !== 0 && (
                  <h6 className="mb-0 text-muted">
                    <del>DT {product.oldPrice}</del>
                  </h6>
                )}
              </div>
              <hr />
              <h4>{t("Description")}</h4>
              <p dangerouslySetInnerHTML={{ __html: product.description }} />

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
              {product?.teints !== undefined && product?.teints !== "undefined" && <div className="teintes-container">
                <h4>{t("Toutes les teintes")}</h4>
                <div style={{ display: "flex", flexDirection: "column" }}>  <div onClick={showModal} style={{ marginTop: 10, cursor: "pointer" }}>
                  Voir Tout                </div>
                  <div
                    className={`teintes-scroll-list ${isDragging ? 'dragging' : ''}`}

                    style={{ display: 'flex', overflowX: 'scroll', maxWidth: '400px' }}
                    ref={listRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseUpOrLeave}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseMove={handleMouseMove}
                  >
                    {product?.teints === 'Anea' && teinteImages.slice(0, 10).map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: '60px', height: '60px', marginRight: 10 }}
                      />
                    ))}
                    {product?.teints === 'Togethair' && beigeIrise.colors.slice(0, 10).map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Teinte ${index + 1}`}
                        style={{ width: '60px', height: '60px', marginRight: 10 }}
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
                  {product?.teints === 'Anea' && <> <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{naturel?.name}</span>
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
                    </div></>}




                  {product?.teints === "Togethair" && <>   <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{beigeIrise?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {beigeIrise.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{booster?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {booster.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{chocolat?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {chocolat.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{coffee.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {coffee.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{coldBrown?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {coldBrown.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{goldenAndCold?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {goldenAndCold.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{mahogany?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {mahogany.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{marron?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {marron.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{moka?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {moka.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>

                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{naturell?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {naturell.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>

                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{ramati?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {ramati.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{rougee?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {rougee.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>

                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{sand?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {sand.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>

                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{light?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {light.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>

                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{toner?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {toner.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>

                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{violet?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {violet.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "600", fontFamily: "inherit" }}>{ash?.name}</span>
                    <div className="teintes-modal-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>

                      {ash.colors.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Teinte ${index + 1}`}
                          style={{ width: 100, height: 140, margin: 10 }}
                        />
                      ))}
                    </div></>}




                </Modal>
              </div>}



              {/* {product?.colors && (
                <div className="form-group" style={{display:"flex", gap:"5px"}}>
                  {product?.colors?.[0].split(",")?.map((color) => (
           
                  ))}
                </div>
              )} */}
              {product?.colors?.length > 0 && <> {product?.colors && <h4>{t("Colors")}</h4>}

                <div
                  className="products-colors-container"
                  style={{ padding: "15px" }}
                >

                  {product?.colors &&
                    product?.colors?.map((color, index) => (
                      <Tooltip title={color?.name}>
                        <div key={index}>
                          <span
                            onClick={() => setColor(color?.name)}
                            style={{

                              display: "inline-block",
                              width: "50px",
                              height: "30px",
                              backgroundColor: color?.value,
                              borderRadius: "5px",
                              margin: "5px",
                              cursor: "pointer",
                              border: "1px solid black",
                              boxShadow: selectedColor === color?.name
                                ? "rgba(0, 0, 0, 0.5) 0px 8px 20px, rgba(0, 0, 0, 0.3) 0px 2px 4px"
                                : "unset",
                              outline: selectedColor === color?.name ? "2px solid rgba(0, 0, 0, 0.2)" : "none"
                            }}
                          ></span>
                        </div>
                      </Tooltip>
                    ))}

                </div>              <hr />
              </>}

              {product?.sizes?.length > 0 && (
                <>
                  <h4>{t("PACK/SIZE")}</h4>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {product?.sizes?.map((size, index) => (
                      <div
                        key={size?.sizePrice}
                        onClick={() => setValue(size)}
                        style={{
                          border: value === size?.sizePrice ? "2px solid black" : "1px solid gray",
                          borderRadius: "5px",
                          padding: "10px",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: value?.sizePrice === size?.sizePrice ? "#f0f0f0" : "white",
                          width: "150px",
                        }}
                      >
                        <p style={{ fontWeight: value?.sizePrice === size?.sizePrice ? "bold" : "normal" }}>
                          {size?.sizeName}
                        </p>
                        <p>{size?.sizePrice} dt</p>
                      </div>
                    ))}
                  </div>
                  <hr />
                </>
              )}

              <div className="row" style={{ alignItems: "center" }}>
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
                    className="add-cart-btn"
                    disabled={product.stock === 0}
                    onClick={addToCart}
                  >
                    <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    &nbsp;&nbsp;{t("Add to Cart")}
                  </button>
                </div>
              </div>

              <div className="ratings mt-auto text-nowrap" style={{ display: "flex", justifyContent: "center", padding: "20px" }} >
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
              <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "center" }}>     <a href="https://www.facebook.com/lagha.shop1/"><FasebookIcon /></a>
                <a href="https://www.instagram.com/laghashop/"><InstagramIcon style={{ width: "35px" }} /></a></div>

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
                      color="info"
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
