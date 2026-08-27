import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getTeintes, getTeintePdf, groupTeintes } from "./teintesData";
import TeinteList from "../../components/TeinteList";
import { ReactComponent as FasebookIcon } from "../../components/square-facebook.svg";
import { ReactComponent as InstagramIcon } from "../../components/instagram.svg";
import axios from "axios";
import ProductRail from "../../components/ProductRail";
import NotifyBackInStock from "../../components/NotifyBackInStock";
import { useGlobalState } from "../../context/context";
import { WHATSAPP_NUMBER } from "../../components/WhatsAppButton";
const ProductDetails = () => {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  // Teintes choisies : { [référence]: quantité }
  const [teinteQty, setTeinteQty] = useState({});
  const setTeinteQuantity = (teinte, qty) =>
    setTeinteQty((prev) => {
      const next = { ...prev };
      if (qty > 0) next[teinte.reference] = qty;
      else delete next[teinte.reference];
      return next;
    });
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
  const { addRecentlyViewed, recentlyViewed } = useGlobalState();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (product && product._id) {
      addRecentlyViewed(product);
      const params = product.category
        ? `category=${encodeURIComponent(product.category)}`
        : product.brand
        ? `brand=${encodeURIComponent(product.brand)}`
        : "";
      axios
        .get(`https://api.lagha.shop/api/products?page=1&${params}`)
        .then(({ data }) => {
          const list = (data.products || [])
            .filter((p) => p._id !== product._id)
            .slice(0, 10);
          setRelated(list);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);
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
    dispatch(addItemToCart(id, quantity, value, selectedColor, undefined, selectedVolume));

    toast.success(t("Item Added to Cart"), {
      position: toast.POSITION.TOP_RIGHT,
      className: "m-2",
    });
  };

  // Nuancier du produit (Anea / Togethair) et son PDF
  const teintes = getTeintes(product?.teints);
  const teintePdf = getTeintePdf(product?.teints);
  const selectedTeintes = teintes
    .filter((teinte) => teinteQty[teinte.reference] > 0)
    .map((teinte) => ({ ...teinte, quantity: teinteQty[teinte.reference] }));
  const totalTeinteUnits = selectedTeintes.reduce(
    (acc, teinte) => acc + teinte.quantity,
    0
  );

  // Chaque teinte devient sa propre ligne de panier.
  const addTeintesToCart = () => {
    selectedTeintes.forEach((teinte) =>
      dispatch(
        addItemToCart(
          id,
          teinte.quantity,
          value,
          selectedColor,
          teinte.img,
          selectedVolume,
          teinte
        )
      )
    );

    toast.success(
      `${selectedTeintes.length} teinte(s) ajoutée(s) au panier`,
      { position: toast.POSITION.TOP_RIGHT, className: "m-2" }
    );
    setTeinteQty({});
    setVisible(false);
  };

  // Build a WhatsApp order message with the product details + a link to this page
  const orderViaWhatsApp = () => {
    const price = value?.sizePrice
      ? Number(value.sizePrice).toFixed(2)
      : product?.price
      ? Number(product.price).toFixed(2)
      : "";
    const lines = [
      "Bonjour Bianas 👋, je souhaite commander ce produit :",
      `*${product?.name || ""}*`,
      product?.code ? `Code: ${product.code}` : "",
      value?.sizeName ? `Pack/Taille: ${value.sizeName}` : "",
      selectedVolume?.volume ? `Volume: ${selectedVolume.volume} (Réf: ${selectedVolume.reference})` : "",
      selectedColor ? `Couleur: ${selectedColor}` : "",
      ...(selectedTeintes.length
        ? [
            "Teintes:",
            ...selectedTeintes.map(
              (teinte) =>
                `• ${teinte.name} - ${teinte.reference} : ${teinte.quantity}`
            ),
          ]
        : [`Quantité: ${quantity}`]),
      price ? `Prix: DT ${price}` : "",
      `Lien: ${window.location.href}`,
    ].filter(Boolean);
    const message = encodeURIComponent(lines.join("\n"));
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
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
  const [selectedVolume, setSelectedVolume] = useState();

  useEffect(() => { setValue(product?.sizes?.[0]); setColor(product?.colors?.[0]?.name); setSelectedVolume(product?.volumes?.[0]); }, [product])

  return (
    <section className="product-detail my-4" style={{ padding: "4% 5%", paddingTop: "16px" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message color="danger" message={error} />
      ) : (
        <>
          <div style={{ width: "100%" }}>
            <span className="pd-back" onClick={() => navigate(-1)}>
              ← Retour
            </span>
          </div>
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
              {product.views > 0 && (
                <p className="pd-views">
                  <i className="fa fa-eye" aria-hidden="true"></i>
                  &nbsp;{product.views}&nbsp;
                  {t("views") !== "views" ? t("views") : "vues"}
                </p>
              )}
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
              {product.stock > 0 && product.stock <= 5 && (
                <div className="pd-lowstock">
                  <i className="fa fa-fire" aria-hidden="true"></i>
                  &nbsp;Dépêchez-vous, plus que {product.stock} en stock !
                </div>
              )}
              {product.stock === 0 && (
                <NotifyBackInStock productId={product._id} />
              )}

              <hr />
              {teintes.length > 0 && (
                <div className="teintes-container">
                  <div className="teinte-header">
                    <h4 className="mb-0">{t("Toutes les teintes")}</h4>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button type="button" className="teinte-btn" onClick={showModal}>
                        <i className="fa fa-th" aria-hidden="true"></i>
                        Voir toutes les teintes ({teintes.length})
                      </button>
                      {teintePdf && (
                        <a
                          className="teinte-btn"
                          href={teintePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                          Nuancier {product?.teints} (PDF)
                        </a>
                      )}
                    </div>
                  </div>

                  <TeinteList
                    teintes={teintes}
                    quantities={teinteQty}
                    onChange={setTeinteQuantity}
                    maxHeight={380}
                  />

                  <div className="teinte-actions">
                    <span className="teinte-summary">
                      {selectedTeintes.length === 0 ? (
                        "Choisissez vos teintes et leurs quantités."
                      ) : (
                        <>
                          <strong>{selectedTeintes.length}</strong> teinte(s) ·{" "}
                          <strong>{totalTeinteUnits}</strong> unité(s)
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      className="teinte-btn teinte-btn-primary"
                      onClick={addTeintesToCart}
                      disabled={selectedTeintes.length === 0}
                    >
                      <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                      Ajouter au panier
                    </button>
                    <button
                      type="button"
                      className="teinte-btn teinte-btn-whatsapp"
                      onClick={orderViaWhatsApp}
                      disabled={selectedTeintes.length === 0}
                    >
                      <i className="fa fa-whatsapp" aria-hidden="true"></i>
                      Commander sur WhatsApp
                    </button>
                  </div>

                  <Modal
                    title={`Toutes les teintes ${product?.teints || ""}`}
                    visible={visible}
                    onCancel={handleCancel}
                    footer={null}
                    width={1100}
                  >
                    {teintePdf && (
                      <a
                        className="teinte-btn"
                        href={teintePdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginBottom: 14 }}
                      >
                        <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                        Ouvrir le nuancier {product?.teints} (PDF)
                      </a>
                    )}

                    {groupTeintes(teintes).map((group) => (
                      <div key={group.name}>
                        <h5 className="teinte-group-title">{group.name}</h5>
                        <TeinteList
                          teintes={group.teintes}
                          quantities={teinteQty}
                          onChange={setTeinteQuantity}
                          searchable={false}
                          columns={2}
                          maxHeight={null}
                        />
                      </div>
                    ))}

                    <div className="teinte-actions">
                      <span className="teinte-summary">
                        <strong>{selectedTeintes.length}</strong> teinte(s) ·{" "}
                        <strong>{totalTeinteUnits}</strong> unité(s) sélectionnée(s)
                      </span>
                      <button
                        type="button"
                        className="teinte-btn teinte-btn-primary"
                        onClick={addTeintesToCart}
                        disabled={selectedTeintes.length === 0}
                      >
                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                        Ajouter au panier
                      </button>
                    </div>
                  </Modal>
                </div>
              )}



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
                              borderRadius: "8px",
                              margin: "3px",
                              cursor: "pointer",
                              border: "1px solid rgba(0,0,0,0.12)",
                              boxShadow: selectedColor === color?.name
                                ? "rgba(103, 57, 149, 0.35) 0px 6px 16px"
                                : "unset",
                              outline: selectedColor === color?.name ? "2px solid #673995" : "none",
                              outlineOffset: "2px"
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
                          border: value?.sizePrice === size?.sizePrice ? "2px solid #673995" : "1px solid var(--hairline-strong)",
                          borderRadius: "12px",
                          padding: "12px",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: value?.sizePrice === size?.sizePrice ? "var(--brand-lavender-soft)" : "white",
                          width: "150px",
                          transition: "all 0.2s ease",
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
              {product?.volumes?.length > 0 && (
                <>
                  <h4>{t("VOLUME")}</h4>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {product?.volumes?.map((vol, index) => (
                      <div
                        key={vol?.reference || index}
                        onClick={() => setSelectedVolume(vol)}
                        style={{
                          border: selectedVolume?.reference === vol?.reference ? "2px solid #673995" : "1px solid var(--hairline-strong)",
                          borderRadius: "12px",
                          padding: "12px",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: selectedVolume?.reference === vol?.reference ? "var(--brand-lavender-soft)" : "white",
                          minWidth: "120px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <p style={{ fontWeight: selectedVolume?.reference === vol?.reference ? "bold" : "normal" }}>
                          {vol?.volume}
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--muted, #888)" }}>{t("Réf")}: {vol?.reference}</p>
                      </div>
                    ))}
                  </div>
                  <hr />
                </>
              )}

              <div className="pd-actions">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-sm px-3"
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
                      className="btn btn-sm px-3"
                      type="button"
                      disabled={product.stock === 0}
                      onClick={increaseQty}
                    >
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

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

              <button
                type="button"
                className="pd-whatsapp-btn"
                onClick={orderViaWhatsApp}
              >
                <i className="fa fa-whatsapp" aria-hidden="true"></i>
                &nbsp;&nbsp;
                {t("Order on WhatsApp") !== "Order on WhatsApp"
                  ? t("Order on WhatsApp")
                  : "Commander sur WhatsApp"}
              </button>

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
              <div className="card shadow-0 border review-card">
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
                          className="btn py-2 text-white text-nowrap review-submit-btn"
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

          <ProductRail
            eyebrow="Sélection"
            title={t("You may also like") !== "You may also like" ? t("You may also like") : "Vous aimerez aussi"}
            products={related}
          />

          <ProductRail
            eyebrow="Historique"
            title={t("Recently viewed") !== "Recently viewed" ? t("Recently viewed") : "Récemment consultés"}
            products={(recentlyViewed || []).filter((p) => p._id !== product._id).slice(0, 10)}
          />

        </>
      )}
    </section>
  );
};

export default ProductDetails;
