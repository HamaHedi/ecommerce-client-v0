import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../actions/userActions";
import "../styles/header.css";
import { useGlobalState } from "../context/context";
import { useTranslation } from 'react-i18next'
import { Button, Dropdown } from 'antd'



const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { user, loading } = useSelector((state) => state.auth);
  const { keyword, setKeyword } = useGlobalState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
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

        <div className="categories-items-container">{allCategory?.map((category) => (
          <span className="gategory-title" onClick={() => setKeyword(category?.title)
          }>{category?.title}</span>
        ))}</div>
        <img src="./assets/cover1.png" />
      </div>
    );
  };
  const { t, i18n } = useTranslation('header')

  const [lang, setLang] = useState(i18n?.language?.toString())

  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language)
    setLang(language)
  }

  const languagesItems = [
    {
      key: '1',
      label: (
        <div className="navbar-flag-container" onClick={() => onChangeLanguage('fr')}>
          <img src={'./assets/fr-flag.png'} alt="flag" className="navbar-flag" />
          <p>{t('language.fr')}</p>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className="navbar-flag-container" onClick={() => onChangeLanguage('en')}>
          <img src={'./assets/en-flag.png'} alt="flag" className="navbar-flag" />
          <p>{t('language.en')}</p>
        </div>
      ),
    },


  ]

  return (
    <nav
      className="navbar navbar-expand-lg navbar-defailt py-2 border-bottom"
      style={{ height: "90px" }}
    >


      <div className="container">
        <Link to="/" className="navbar-brand">
          {/* <img src='/assets/logo.png' alt='logo' /> */}
          <b onClick={() => setKeyword()
          }>
            <img src="/assets/logo.png" alt="logo" />
          </b>
        </Link>
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
                    <img src="/assets/logo.png" alt="logo" />
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
          {<div
            className="navbar-nav-items"
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              gap: "25px",
            }}
          >
            <span className="navigation-item" onClick={() => setKeyword()
            }>{t('home')}</span>

            <span className="navigation-item" onClick={() => navigate("/contact")}>{t('contact')}</span>
            <Dropdown
              overlay={<CategoriesItem />}
              placement="bottom"
              arrow
              overlayStyle={{
                borderRadius: "5px",
                background: "white",
                padding: "25px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
              }}
            >
              <span className="navigation-item">{t('categories')}</span>
            </Dropdown>
          </div>}
          <ul className="navbar-nav ml-lg-auto">
            <li className="nav-item">
              <Link to="/cart" className="nav-link nav-link-icon mt-3 mt-lg-0">
                <i className="ni ni-cart"></i>
                <span className="nav-link-inner--text font-weight-bold">
                  {t('cart')}
                </span>
              </Link>
            </li>

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
                  <span className="nav-link-inner--text font-weight-bold text-nowrap">
                    &nbsp;{user && user.name}&nbsp;
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
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
                      {t('dashboard')}

                    </Link>
                  )}

                  <Link
                    to="/orders"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="fa fa-credit-card-alt" aria-hidden="true"></i>
                    {t('orders')}

                  </Link>

                  <Link
                    to="/profile"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="fa fa-user-circle" aria-hidden="true"></i>
                    {t('profile')}

                  </Link>

                  <Link
                    to="/settings"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="fa fa-cog" aria-hidden="true"></i>
                    {t('settings')}
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={logoutHandler}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                    {t('logout')}

                  </button>
                </div>
              </li>
            ) : (
              !loading && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link nav-link-icon">
                    <i className="ni ni-single-02"></i>
                    <span className="nav-link-inner--text font-weight-bold">
                      {t('sign_in')}
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>


        </div>
        <Dropdown
          menu={{ items: languagesItems }}
          trigger={['click']}
          placement="bottomRight"
          arrow
        >
          <Button type="link" shape="circle">
            <div className="navbar-flag-container">
              <img
                src={lang === 'en' ? './assets/en-flag.png' : './assets/fr-flag.png'}
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
