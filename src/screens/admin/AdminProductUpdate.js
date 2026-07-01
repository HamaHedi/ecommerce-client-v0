import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  updateProduct,
  clearErrors,
} from "../../actions/productActions";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";

import { getCategory } from "../../actions/categoryAction";
import { getBrands } from "../../actions/brandActions";
import { Switch } from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const AdminProductUpdate = () => {
  const [name, setName] = useState("");
  const [oldPrice, setOldPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([{ name: "", value: "#000000" }]);
  const [isNew, setIsNew] = useState(false);
  const [code, setCode] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [selectedTeintes, setSelectedTeintes] = useState();
  const teinteOptions = [{ title: "Anea", value: "anea" }, { title: "Togethair", value: "togethair" }]

  const [oldCertificates, setOldCertificates] = useState([]);
  const [certificatesPreview, setCertificatesPreview] = useState([]);

  const [sizes, setSizes] = useState([{ sizeName: "", sizePrice: "" }]);
  const handleSizeNameChange = (index, name) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].sizeName = name;
    setSizes(updatedSizes);
  };

  const handleSizePriceChange = (index, price) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].sizePrice = price;
    setSizes(updatedSizes);
  };

  const handleRemoveSizePicker = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  };

  const handleAddSizePicker = () => {
    setSizes([...sizes, { sizeName: "", sizePrice: "" }]);
  };

  const [volumes, setVolumes] = useState([{ volume: "", reference: "" }]);
  const handleVolumeChange = (index, volume) => {
    const updatedVolumes = [...volumes];
    updatedVolumes[index].volume = volume;
    setVolumes(updatedVolumes);
  };

  const handleVolumeReferenceChange = (index, reference) => {
    const updatedVolumes = [...volumes];
    updatedVolumes[index].reference = reference;
    setVolumes(updatedVolumes);
  };

  const handleRemoveVolumePicker = (index) => {
    const updatedVolumes = volumes.filter((_, i) => i !== index);
    setVolumes(updatedVolumes);
  };

  const handleAddVolumePicker = () => {
    setVolumes([...volumes, { volume: "", reference: "" }]);
  };

  const handleAddColorPicker = () => {
    setColors([...colors, { name: "", value: "#000000" }]);
  };
  const handleSwitchChange = (checked) => {
    setIsNew(checked)
  };
  const handleColorChange = (index, newValue) => {
    const newColors = colors.map((color, i) =>
      i === index ? { ...color, value: newValue } : color
    );
    setColors(newColors);
  };

  const handleNameChange = (index, newName) => {
    const newColors = colors.map((color, i) =>
      i === index ? { ...color, name: newName } : color
    );
    setColors(newColors);
  };

  const handleRemoveColorPicker = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);
  const { error, product } = useSelector((state) => state.productDetails);
  const { category: categories } = useSelector((state) => state.categorys);
  const { brands: brands } = useSelector((state) => state.brands);
  const [subcategory, setSubcategory] = useState("");

  const { id } = useParams();

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBrands());

    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      setName(product.name);
      setOldPrice(product.oldPrice);
      setPrice(product.price);
      setDescription(product.description);
      setStock(product.stock);
      setSeller(product.seller);
      setOldImages(product.images);
      setCategory(product.category);
      setSubcategory(product.subcategory);
      setBrand(product?.brand);
      setIsNew(product?.isNew);
      setCode(product?.code);
      setOldCertificates(product.certificates);
      setColors(product.colors.map((color) => ({ name: color.name, value: color.value })));
      setSizes(product?.sizes.map((size) => ({ sizeName: size.sizeName, sizePrice: size.sizePrice })));
      if (product?.volumes?.length) {
        setVolumes(product.volumes.map((vol) => ({ volume: vol.volume, reference: vol.reference })));
      }

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
      navigate("/admin/products");
      toast.success("Product updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
        className: "m-2",
      });
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, error, navigate, product, id, updateError, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("oldPrice", oldPrice);
    formData.append("seller", seller);
    formData.append("subcategory", subcategory);
    formData.append("isNew", isNew);
    formData.append("code", code);
    const cleanSizes = sizes.filter(
      (s) => s.sizeName && s.sizeName.trim() !== "" && s.sizePrice !== ""
    );
    const cleanColors = colors.filter((c) => c.name && c.name.trim() !== "");
    const cleanVolumes = volumes.filter(
      (v) => v.volume && v.volume.trim() !== "" && v.reference && v.reference.trim() !== ""
    );
    formData.append("sizes", JSON.stringify(cleanSizes));
    formData.append("volumes", JSON.stringify(cleanVolumes));
    formData.append("teints", selectedTeintes);

    formData.append("brand", brand);
    formData.append("colors", JSON.stringify(cleanColors));

    images.forEach((image) => {
      formData.append("files", image);
    });
    certificates.forEach((certificate) => {
      formData.append("certificates", certificate);
    });
    dispatch(updateProduct(product._id, formData));
    dispatch(getProductDetails(id));
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
  const handleCertificates = (e) => {
    const files = Array.from(e.target.files);

    setCertificatesPreview([]);
    setCertificates([]);
    setOldCertificates([])
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setCertificatesPreview((oldArray) => [...oldArray, reader.result]);
          setCertificates([...e.target.files]);
        }
      };

      reader.readAsDataURL(file);
    });
  };
  return (
    <section className="container-fluid admin-page">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div
          className="col-12 col-md-2 admin-nav-col"
         
        >
          <Sidebar item="products" />
        </div>

        <div className="col-12 col-md-10 admin-content-col">
          <div className="card border h-100">
            <div className="card-header d-flex justify-content-between">
              <h3 className="mb-0">Update Product</h3>
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
                  <label htmlFor="code_field">Code</label>
                  <input
                    type="text"
                    id="code_field"
                    className="form-control"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />

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
                <label style={{ paddingRight: "3px" }} >New Product {' '}</label>
                <Switch onChange={handleSwitchChange} value={isNew} />
                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
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

                <div className="form-group" style={{ height: "300px" }}>
                  <label htmlFor="description_field">Description</label>
                  {/* <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea> */}
                  <ReactQuill theme="snow" value={description} onChange={setDescription} style={{ height: "220px" }} />

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
                  <label htmlFor="category_field">Subcategory</label>
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
                      if (cat.title === category) {
                        return cat?.subcategories.map((sub) => (
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
                      brands.map((x) => (
                        <option key={x._id} value={x.title}>
                          {x.title}
                        </option>
                      ))}
                  </select>
                  {error && error.errors && error.errors.brand && !brand && (
                    <small className="form-text text-danger text-left mt-2 mx-1">
                      {error.errors.brand}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
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

                <div>
                  <div>
                    <span>Colors</span>
                    {colors?.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          marginBottom: "8px",
                        }}
                      >
                        <input
                          type="color"
                          value={color.value}
                          onChange={(e) =>
                            handleColorChange(index, e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Color Name"
                          value={color.name}
                          onChange={(e) =>
                            handleNameChange(index, e.target.value)
                          }
                        />
                        <div
                          onClick={() => handleRemoveColorPicker(index)}
                          style={{ cursor: "pointer" }}
                        >
                          Remove
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    onClick={handleAddColorPicker}
                    style={{ cursor: "pointer" }}
                  >
                    Add Color
                  </div>
                </div>
                <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                  <span>Sizes</span>
                  {sizes.map((size, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Size Name"
                        value={size.sizeName}
                        onChange={(e) => handleSizeNameChange(index, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Size Price"
                        value={size.sizePrice}
                        onChange={(e) => handleSizePriceChange(index, e.target.value)}
                      />
                      <div
                        onClick={() => handleRemoveSizePicker(index)}
                        style={{ cursor: "pointer" }}
                      >
                        Remove
                      </div>
                    </div>
                  ))}
                  <div onClick={handleAddSizePicker} style={{ cursor: "pointer" }}>
                    Add Size
                  </div>
                </div>
                <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                  <span>Volumes</span>
                  {volumes.map((vol, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Volume (e.g. 10VOL)"
                        value={vol.volume}
                        onChange={(e) => handleVolumeChange(index, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Volume Reference (e.g. OXT0001)"
                        value={vol.reference}
                        onChange={(e) => handleVolumeReferenceChange(index, e.target.value)}
                      />
                      <div
                        onClick={() => handleRemoveVolumePicker(index)}
                        style={{ cursor: "pointer" }}
                      >
                        Remove
                      </div>
                    </div>
                  ))}
                  <div onClick={handleAddVolumePicker} style={{ cursor: "pointer" }}>
                    Add Volume
                  </div>
                </div>
                {/* <div className="form-group">
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
                </div> */}
                <div className="form-group">
                  <label htmlFor="category_field">
                    Teintes
                  </label>
                  <select
                    className="form-control"
                    id="brand_field"
                    value={selectedTeintes}
                    onChange={(e) => setSelectedTeintes(e.target.value)}
                  >
                    <option value="" selected disabled hidden>
                      Choose one
                    </option>

                    {teinteOptions &&
                      teinteOptions?.map((x) => (
                        <option key={x._id} value={x.title}>
                          {x.title}
                        </option>
                      ))}
                  </select>

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
                <div className="form-group">
                  <label>
                    Certificates <small>*</small>
                  </label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={handleCertificates}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Certificates
                    </label>
                  </div>
                  {oldCertificates &&
                    oldCertificates.map((img) => (
                      <img
                        key={img}
                        src={"https://api.lagha.shop/" + img.path}
                        alt={img.path}
                        className="mt-3 mr-2"
                        width="55"
                        height="52"
                      />
                    ))}
                  {certificatesPreview?.map((img) => (
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

export default AdminProductUpdate;
