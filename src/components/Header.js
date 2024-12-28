import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../actions/userActions";
import "../styles/header.css";
import { useGlobalState } from "../context/context";
import { useTranslation } from "react-i18next";
import { Button, Divider, Dropdown, Menu } from "antd";
import { ReactComponent as UserIcon } from "../assets/icons/mdi--user.svg";
import { ReactComponent as CartIcon } from "../assets/icons/cart.svg";
import { ReactComponent as PositionIcon } from "../assets/icons/position.svg";
import { ReactComponent as ArrowDown } from "../assets/icons/arrowDown.svg";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const {
    keyword,
    setKeyword,
    category,
    setCategory,
    subcategory,
    setSubategory,
    setBrand,
  } = useGlobalState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully.", {
      position: toast.POSITION.TOP_RIGHT,
      className: "m-2",
    });
  };
  const { category: allCategory } = useSelector((state) => state.categorys);

  const CategoriesItem = () => {
    return (
      <div className="categories-list-container">
        <div className="categories-items-container">
          {allCategory?.map((category) => (
            <span className="category-title" key={category.title}>
              <Dropdown
                overlay={
                  <Menu>
                    {category?.subcategories?.map((subCategory) => (
                      <Menu.Item
                        key={subCategory}
                        className="gategory-title"
                        onClick={() => {
                          setKeyword("");
                          setCategory(category.title);
                          setSubategory(subCategory);
                        }}
                      >
                        {subCategory}
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
                  }}
                  className="gategory-title"
                >
                  {category?.title}
                </span>
              </Dropdown>
            </span>
          ))}
        </div>
      </div>
    );
  };
  const { t, i18n } = useTranslation("header");

  const [lang, setLang] = useState(i18n?.language?.toString());

  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    setLang(language);
  };
  const keywordRef = useRef("");

  const searchHandler = (e) => {
    e.preventDefault();


    setKeyword(keywordRef.current.value);
  };

  const languagesItems = [
    {
      key: "1",
      label: (
        <div
          className="navbar-flag-container"
          onClick={() => onChangeLanguage("fr")}
        >
          <img
            src={"./assets/fr-flag.png"}
            alt="flag"
            className="navbar-flag"
          />
          <p>{t("language.fr")}</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="navbar-flag-container"
          onClick={() => onChangeLanguage("en")}
        >
          <img
            src={"./assets/en-flag.png"}
            alt="flag"
            className="navbar-flag"
          />
          <p>{t("language.en")}</p>
        </div>
      ),
    },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg navbar-defailt py-2 border-bottom"
      style={{ height: "150px", background: "#fff" }}
    >
      <div className="container" onSubmit={searchHandler} >

        {windowWidth > 550 ? <Link to="/" className="navbar-brand">
          <b
            onClick={() => {
              setKeyword();
              setCategory("")
              setSubategory("")
              setBrand("");
            }}
          >
            <img
              src="/assets/new-logo-2.png"
              alt="logo"
              style={{ height: "150px", width: "100px" }}
            />
          </b>
        </Link> : null}


        <button
          className="navbar-toggler border"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-default"
          aria-controls="navbar-default"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i
            className="fa fa-bars"
            aria-hidden="true"
            style={{ color: "#A0A0A0" }}
          ></i>
        </button>

        <div className="collapse navbar-collapse" id="navbar-default">
          <div className="navbar-collapse-header">
            <div className="row">
              <div className="col-6 collapse-brand">
                <Link to="/">
                  <b>
                    <img src="/assets/new-logo-2.png" alt="logo" />
                  </b>
                </Link>
              </div>
              <div className="col-6 collapse-close">
                <button
                  type="button"
                  className="navbar-toggler"
                  data-toggle="collapse"
                  data-target="#navbar-default"
                  aria-controls="navbar-default"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
          {
            <div
              className="navbar-nav-items"
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "center",
                gap: "25px",
              }}
            >
              {windowWidth <= 1000 && <><Link to="/">

                <span
                  data-toggle="collapse"
                  data-target="#navbar-default"
                  aria-expanded="false"

                  className="navigation-item"
                  onClick={() => {
                    setKeyword();
                    setBrand("");
                  }}
                >
                  {t("home")}
                </span>
              </Link>

                <Link to="/contact" >
                  <span className="navigation-item"
                    data-toggle="collapse"
                    data-target="#navbar-default"
                    aria-expanded="false"

                  >
                    {t("contact")}
                  </span>
                </Link>
                <Dropdown
                  overlay={<CategoriesItem />}
                  placement="bottom"
                  arrow
                  overlayStyle={{
                    borderRadius: "5px",
                    background: "white",
                    padding: "25px",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                >
                  <span className="navigation-item">{t("categories")}</span>
                </Dropdown>
                {user && user.name ? (
                  <li className="nav-item dropdown">
                    <span
                      className="nav-link nav-link-icon"
                      style={{ cursor: "pointer", display: "flex" }}
                      id="navbar-default_dropdown_1"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <img
                        src={user && `https://api.lagha.shop${user.avatar}`}
                        alt="user"
                        className="rounded-circle"
                        style={{ width: "25px", height: "25px" }}
                      />
                      <span className="nav-link-inner--text font-weight-bold text-nowrap" style={{ display: "flex" }}>
                        &nbsp;{user && user.name}&nbsp;
                        <ArrowDown style={{ width: "15px" }} />
                      </span>
                    </span>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="navbar-default_dropdown_1"
                    >
                      {user && user.role === "admin" && (
                        <Link
                          to="/dashboard"
                          className="dropdown-item d-flex align-items-center"
                        >
                          <i className="fa fa-bar-chart" aria-hidden="true"></i>
                          {t("dashboard")}
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        className="dropdown-item d-flex align-items-center"
                      >
                        <i className="fa fa-credit-card-alt" aria-hidden="true"></i>
                        {t("orders")}
                      </Link>

                      <Link
                        to="/profile"
                        className="dropdown-item d-flex align-items-center"
                      >
                        <i className="fa fa-user-circle" aria-hidden="true"></i>
                        {t("profile")}
                      </Link>

                      <Link
                        to="/settings"
                        className="dropdown-item d-flex align-items-center"
                      >
                        <i className="fa fa-cog" aria-hidden="true"></i>
                        {t("settings")}
                      </Link>

                      <div className="dropdown-divider"></div>

                      <button
                        className="dropdown-item d-flex align-items-center"
                        onClick={logoutHandler}
                      >
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                        {t("logout")}
                      </button>
                    </div>
                  </li>
                ) : (
                  !loading && (
                    <Link to="/login"  >

                      <span className="navigation-item" data-toggle="collapse"
                        data-target="#navbar-default"
                        aria-expanded="false"
                      >
                        {t("sign_in")}
                      </span>
                    </Link>
                  )
                )}</>}
            </div>
          }
          <ul className="navbar-nav ml-lg-auto" style={{ display: "flex", alignItems: "center" }}>
            <form >
              <div style={{ display: "flex", alignItems: "center", background: "white", borderRadius: "15px", border: "1px solid #5a3584", marginRight: "140px" }}>
                <input
                  type="text"
                  style={{ display: "flex", border: "0px", borderRadius: "15px", outline: "none", boxShadow: "none", width: "300px" }}
                  placeholder={t("search..")}
                  ref={keywordRef}

                />
                <i className="fa fa-search" aria-hidden="true" style={{ paddingRight: "10px" }}></i>
              </div>
            </form>
            <li className="nav-item">
              <Link to="/contact" className="nav-link nav-link-icon mt-3 mt-lg-0" style={{ display: "flex", alignItems: "center" }}>
                <PositionIcon style={{ width: "35px" }} />

              </Link>
            </li>
            {windowWidth > 1000 && user && user.name ? (
              <li className="nav-item dropdown">
                <span
                  className="nav-link nav-link-icon"
                  style={{ cursor: "pointer", display: "flex" }}
                  id="navbar-default_dropdown_1"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src={user && `https://api.lagha.shop${user.avatar}`}
                    alt="user"
                    className="rounded-circle"
                    style={{ width: "25px", height: "25px" }}
                  />
                  <span className="nav-link-inner--text font-weight-bold text-nowrap" style={{ color: "white", display: "flex" }}>
                    &nbsp;{user && user.name}&nbsp;
                    <ArrowDown style={{ width: "15px" }} />
                  </span>
                </span>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="navbar-default_dropdown_1"
                >
                  {user && user.role === "admin" && (
                    <Link
                      to="/dashboard"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <i className="fa fa-bar-chart" aria-hidden="true"></i>
                      {t("dashboard")}
                    </Link>
                  )}

                  <Link
                    to="/orders"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="fa fa-credit-card-alt" aria-hidden="true"></i>
                    {t("orders")}
                  </Link>

                  <Link
                    to="/profile"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="fa fa-user-circle" aria-hidden="true"></i>
                    {t("profile")}
                  </Link>

                  <Link
                    to="/settings"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="fa fa-cog" aria-hidden="true"></i>
                    {t("settings")}
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={logoutHandler}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                    {t("logout")}
                  </button>
                </div>
              </li>
            ) : (
              !loading && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link nav-link-icon" style={{ display: "flex", alignItems: "center" }}>
                    <UserIcon style={{ width: "30px" }} />

                  </Link>
                </li>
              )
            )}

            <li className="nav-item">
              <Link to="/cart" className="nav-link nav-link-icon mt-3 mt-lg-0" style={{ display: "flex" }}>
                <CartIcon style={{ width: "30px", fill: 'white' }} />


              </Link>
            </li>

          </ul>
        </div>
        <Dropdown
          menu={{ items: languagesItems }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <Button type="link" shape="circle">
            <div className="navbar-flag-container">
              <img
                src={
                  lang === "en"
                    ? "./assets/en-flag.png"
                    : "./assets/fr-flag.png"
                }
                alt="flag"
                className="navbar-flag"
              />
            </div>
          </Button>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Header;
