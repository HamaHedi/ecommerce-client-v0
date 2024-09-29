import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/productCard.css";
import { useTranslation } from "react-i18next";
import { Image } from "antd";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("product");
  const calculatePercentageReduction = (oldPrice, price) => {
    if (oldPrice && price) {
      return ((oldPrice - price) / oldPrice * 100).toFixed(0) + "%";
    }
    return ""; // Return an empty string if prices are not available
  };
  console.log(product)
  return (
    // <div className='col-12 col-sm-12 col-md-6 col-lg-4 mb-5'>
    // 	<div
    // 		className='card p-2 h-100'
    // 		style={{ border: '1px solid #A8DADC', borderRadius: '25px' }}
    // 	>
    // 		<div className='card-body'>
    // 			<Link to={`/product/${product._id}`}>
    // 				<img
    // 					src={`${product && product.images[0] && product.images[0].path}`}
    // 					alt='product'
    // 					className='w-100 mb-4'
    // 					style={{ borderRadius: '25px' }}
    // 				/>
    // 			</Link>

    // 			<h5 className='font-widget-bold'>
    // 				<Link to={`/product/${product._id}`} className='text-dark'>
    // 					{product.name}
    // 				</Link>
    // 			</h5>

    // 			<div className='ratings mt-auto text-nowrap mb-1'>
    // 				<div className='rating-outer'>
    // 					<div
    // 						className='rating-inner'
    // 						style={{ width: `${(product.ratings / 5) * 100}%` }}
    // 					></div>
    // 				</div>
    // 				<small id='no_of_reviews'>&nbsp;({product.numOfReviews} Reviews)</small>
    // 			</div>

    // 			<div className='d-flex align-items-end'>
    // 				<h5 className='mb-0'>${product.price && product.price.toFixed(2)}</h5>
    // 				&nbsp;
    // 				{product.oldPrice !== 0 && (
    // 					<h6 className='mb-0 text-muted'>
    // 						<del>${product.oldPrice && product.oldPrice.toFixed(2)}</del>
    // 					</h6>
    // 				)}
    // 			</div>
    // 		</div>
    // 	</div>
    // </div>
    <div className="product-card-container">
      {product?.oldPrice > 0 && <span className="promo-percentage">-{calculatePercentageReduction(product?.oldPrice, product?.price)} </span>}
      <div className="product-card-body">
        <div className="product-image-container">
          {/* <Link to={`/product/${product._id}`}>

            <img
              src=
              alt="product"
              className="product-image"
              style={{ borderRadius: "25px" }}
            />
          </Link> */}
          <Image
            style={{

              height: "220px"
            }}
            fallback={`${product &&
              product.images[0] &&
              "https://api.lagha.shop/" + product.images[0].path
              }`}
          />
        </div>
        <span className="product-title">
          <Link to={`/product/${product._id}`} className="text-dark">
            {product?.brand}
          </Link>
        </span>
        <span className="product-name">
          <Link to={`/product/${product._id}`} className="text-dark">
            {product?.name}
          </Link>
        </span>
        <div className="d-flex align-items-end">
          <h5 className="mb-0">
            {product.price && product.price.toFixed(3)}Dt
          </h5>
          &nbsp;
          {product.oldPrice !== 0 && (
            <h6 className="mb-0 text-muted">
              <del>{product.oldPrice && product.oldPrice.toFixed(3)}Dt</del>
            </h6>
          )}
        </div>
        {/* <div className="ratings mt-auto text-nowrap mb-1">
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(product.ratings / 5) * 100}%` }}
            ></div>
          </div>
          <small id="no_of_reviews">
            &nbsp;({product.numOfReviews} {t("reviews")})
          </small>
        </div> */}
        <button
          className="view-details-button"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {t("view_details")}
        </button>
      </div>
    </div>
  );
};

export default Product;
