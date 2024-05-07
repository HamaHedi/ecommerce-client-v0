import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { UPDATE_BRAND_RESET } from "../../constants/brandConstants";
import {
  clearErrors,
  getBrandDetails,
  updateBrand,
} from "../../actions/brandActions";
import { getCategory } from "../../actions/categoryAction";

const AdminBrandUpdate = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [category, setCategory] = useState("");

  const { category: categories } = useSelector((state) => state.categorys);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.brands);
  const { error, brand } = useSelector((state) => state.brandDetails);

  const { id } = useParams();
  useEffect(() => {
    dispatch(getCategory());
  }, []);
  useEffect(() => {
    if (brand && brand._id !== id) {
      dispatch(getBrandDetails(id));
    } else {
      setName(brand.title);
      setDescription(brand.description);
      setOldImages(brand.images);
      setCategory(brand.category);
    }

    if (error && error.message) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError, {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      navigate("/admin/brand");
      toast.success("Brand updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch({ type: UPDATE_BRAND_RESET });
    }
  }, [dispatch, error, navigate, brand, id, updateError, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", description);
    formData.append("category", category);

    images.forEach((image) => {
      formData.append("files", image);
    });

    dispatch(updateBrand(brand._id, formData));
    dispatch(getBrandDetails(id));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);
    setOldImages([]);

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
          <Sidebar item="brand" />
        </div>

        <div className="col-12 col-md-9 px-3 my-4">
          <div className="card border h-100">
            <div className="card-header d-flex justify-content-between">
              <h3 className="mb-0">Update Brand</h3>
            </div>
            <div className="card-body">
              <form onSubmit={submitHandler} encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
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
                  <label>Images</label>

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

                  {oldImages &&
                    oldImages.map((img) => (
                      <img
                        key={img}
                        src={"https://api.lagha.shop/" + img.path}
                        alt={img.path}
                        className="mt-3 mr-2"
                        width="55"
                        height="52"
                      />
                    ))}

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

export default AdminBrandUpdate;
