import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { newProduct, clearErrors } from "../../actions/productActions";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";

import { getCategory } from "../../actions/categoryAction";
import { getBrands } from "../../actions/brandActions";

const AdminProductAdd = () => {
  const [name, setName] = useState("");
  const [oldPrice, setOldPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState("");

  const { loading, error, success } = useSelector((state) => state.newProduct);
  const { category: categories } = useSelector((state) => state.categorys);
  const { brands: brands } = useSelector((state) => state.brands);
  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBrands());

    if (error && error.message) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch(clearErrors());
    }

    if (success) {
      navigate("/admin/products");
      toast.success("Product created successfully", {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("seller", seller);
    formData.append("subcategory", subcategory);
    formData.append("brand", brand);
    images.forEach((image) => {
      formData.append("files", image);
    });

    dispatch(newProduct(formData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages([...e.target.files]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <section className="container my-4">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div
          className="col-12 col-md-3 px-3 py-4 my-4"
          style={{ backgroundColor: "#1A2D3C", borderRadius: "10px" }}
        >
          <Sidebar item="products" />
        </div>

        <div className="col-12 col-md-9 px-3 my-4">
          <div className="card border h-100">
            <div className="card-header d-flex justify-content-between">
              <h3 className="mb-0">New Product</h3>
            </div>
            <div className="card-body">
              <form onSubmit={submitHandler} encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="name_field">
                    Name <small>*</small>
                  </label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {error && error.errors && error.errors.name && (
                    <small className="form-text text-danger text-left mt-2 mx-1">
                      {error.errors.name}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="old_price_field">Old Price</label>
                  <input
                    type="text"
                    id="old_price_field"
                    className="form-control"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">
                    Price <small>*</small>
                  </label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  {error && error.errors && error.errors.price && (
                    <small className="form-text text-danger text-left mt-2 mx-1">
                      {error.errors.price}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {error && error.errors && error.errors.description && (
                    <small className="form-text text-danger text-left mt-2 mx-1">
                      {error.errors.description}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">
                    Category <small>*</small>
                  </label>
                  <select
                    className="form-control"
                    id="category_field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" selected disabled hidden>
                      Choose one
                    </option>

                    {categories &&
                      categories.map((x) => (
                        <option key={x._id} value={x.title}>
                          {x.title}
                        </option>
                      ))}
                  </select>
                  {error &&
                    error.errors &&
                    error.errors.category &&
                    !category && (
                      <small className="form-text text-danger text-left mt-2 mx-1">
                        {error.errors.category}
                      </small>
                    )}
                </div>
                <div className="form-group">
                  <label htmlFor="subcategory_field">Subcategory</label>
                  <select
                    className="form-control"
                    id="subcategory_field"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  >
                    <option value="" selected disabled hidden>
                      Choose one
                    </option>

                    {/* Map through subcategories based on the selected category */}
                    {categories?.map((cat) => {
                      if (cat?.title === category) {
                        return cat?.subcategories?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ));
                      }
                      return null;
                    })}
                  </select>
               
                </div>
				<div className="form-group">
                    <label htmlFor="category_field">
                      Marque <small>*</small>
                    </label>
                    <select
                      className="form-control"
                      id="brand_field"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    >
                      <option value="" selected disabled hidden>
                        Choose one
                      </option>

                      {brands &&
                        brands?.map((x) => (
                          <option key={x._id} value={x.title}>
                            {x.title}
                          </option>
                        ))}
                    </select>
                    {error &&
                      error.errors &&
                      error.errors.brand &&
                      !brand && (
                        <small className="form-text text-danger text-left mt-2 mx-1">
                          {error.errors.brand}
                        </small>
                      )}
                  </div>
                <div className="form-group">
                  <label htmlFor="stock_field">
                    Stock <small>*</small>
                  </label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                  {error && error.errors && error.errors.stock && (
                    <small className="form-text text-danger text-left mt-2 mx-1">
                      {error.errors.stock}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                  />
                  {error && error.errors && error.errors.seller && (
                    <small className="form-text text-danger text-left mt-2 mx-1">
                      {error.errors.seller}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Images <small>*</small>
                  </label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={onChange}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>

                  {imagesPreview.map((img) => (
                    <img
                      src={img}
                      key={img}
                      alt="Images Preview"
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
                </div>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <div
                      className="spinner-border"
                      role="status"
                      style={{ width: "22px", height: "22px" }}
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "CREATE"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProductAdd;
