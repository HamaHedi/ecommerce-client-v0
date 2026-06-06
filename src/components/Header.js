import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../actions/userActions";
import { API_BASE } from "../config";
import "../styles/header.css";
import { useGlobalState } from "../context/context";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, Menu } from "antd";
import { ReactComponent as UserIcon } from "../assets/icons/mdi--user.svg";
import { ReactComponent as CartIcon } from "../assets/icons/cart.svg";
import { ReactComponent as PositionIcon } from "../assets/icons/position.svg";
import { ReactComponent as ArrowDown } from "../assets/icons/arrowDown.svg";
import { ReactComponent as FrenshIcon } from "../assets/icons/frensh.svg";
import { ReactComponent as EnglishIcon } from "../assets/icons/english.svg";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { category: allCategory } = useSelector((state) => state.categorys);
  const { setKeyword, setCategory, setSubategory, setBrand, wishlist } = useGlobalState();

  const { t, i18n } = useTranslation("header");
  const [lang, setLang] = useState(i18n?.language?.toString());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCat, setOpenCat] = useState(null);

  // Live search (smart suggestions dropdown)
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchBoxRef = useRef(null);

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenCat(null);
  };

  // Debounced fetch of product suggestions as the user types
  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      axios
        .get(`${API_BASE}/api/products?keyword=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        })
        .then(({ data }) => {
          setSuggestions((data.products || []).slice(0, 6));
          setSearchLoading(false);
        })
        .catch((err) => {
          if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
            setSearchLoading(false);
          }
        });
    }, 280);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  // Close the suggestions dropdown when clicking outside the search box
  useEffect(() => {
    const onDocClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToProduct = (pid) => {
    setShowSuggest(false);
    setSearchTerm("");
    setSuggestions([]);
    closeMobile();
    navigate(`/product/${pid}`);
  };

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully.", {
      position: toast.POSITION.TOP_RIGHT,
      className: "m-2",
    });
  };

  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    setLang(language);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const value = (searchTerm || "").trim();
    setKeyword(value);
    setCategory("");
    setSubategory("");
    setBrand("");
    setShowSuggest(false);
    closeMobile();
    navigate("/products");
  };

  const resetToHome = () => {
    setKeyword("");
    setCategory("");
    setSubategory("");
    setBrand("");
    closeMobile();
  };

  // Select a category/subcategory (used by desktop dropdown + mobile drawer).
  // Always closes the mobile navbar after redirecting.
  const selectCategory = (catTitle, subTitle = "") => {
    setKeyword("");
    setCategory(catTitle);
    setSubategory(subTitle);
    setBrand("");
    closeMobile();
    navigate("/products");
  };

  const CategoriesItem = () => (
    <div className="categories-list-container">
      <div className="categories-items-container">
        {allCategory?.map((cat) => (
          <span key={cat.title}>
            <Dropdown
              overlay={
                <Menu>
                  {cat?.subcategories?.map((subCategory) => (
                    <Menu.Item
                      key={subCategory}
                      onClick={() => selectCategory(cat.title, subCategory)}
                    >
                      {subCategory}
                    </Menu.Item>
                  ))}
                </Menu>
              }
              placement="bottom"
            >
              <span
                onClick={() => selectCategory(cat?.title)}
                className="gategory-title"
              >
                {cat?.title}
              </span>
            </Dropdown>
          </span>
        ))}
      </div>
    </div>
  );

  const AccountMenu = () => (
    <div className="account-menu">
      <div className="account-menu-header">
        <img src={user && `https://api.lagha.shop${user.avatar}`} alt="user" />
        <b>{user && user.name}</b>
      </div>
      {user && user.role === "admin" && (
        <Link to="/dashboard" className="account-menu-item">
          <i className="fa fa-bar-chart" aria-hidden="true"></i>
          {t("dashboard")}
        </Link>
      )}
      <Link to="/orders" className="account-menu-item">
        <i className="fa fa-credit-card-alt" aria-hidden="true"></i>
        {t("orders")}
      </Link>
      <Link to="/profile" className="account-menu-item">
        <i className="fa fa-user-circle" aria-hidden="true"></i>
        {t("profile")}
      </Link>
      <Link to="/settings" className="account-menu-item">
        <i className="fa fa-cog" aria-hidden="true"></i>
        {t("settings")}
      </Link>
      <button className="account-menu-item danger" onClick={logoutHandler}>
        <i className="fa fa-sign-out" aria-hidden="true"></i>
        {t("logout")}
      </button>
    </div>
  );

  const languagesItems = [
    {
      key: "1",
      label: (
        <div
          className="navbar-flag-container"
          onClick={() => onChangeLanguage("fr")}
        >
          <FrenshIcon />
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
          <EnglishIcon />
          <p>{t("language.en")}</p>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="navbar-flag-container"
          onClick={() => onChangeLanguage("ar")}
        >
          <span className="lang-ar-badge">ع</span>
          <p>{t("language.ar")}</p>
        </div>
      ),
    },
  ];

  const mobileLink = (to, label, onClick) => (
    <Link
      to={to}
      className="mobile-nav-link"
      onClick={() => {
        onClick && onClick();
        closeMobile();
      }}
    >
      {label}
    </Link>
  );

  return (
    <>
    <header className="site-header">
      <div className="header-inner">
        {/* Mobile burger */}
        <button
          className="header-icon-btn header-burger"
          aria-label="Menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <i
            className={`fa ${mobileOpen ? "fa-times" : "fa-bars"}`}
            aria-hidden="true"
          ></i>
        </button>

        {/* Brand */}
        <Link to="/" className="brand-logo" onClick={resetToHome}>
          <img src="/logo.svg" alt="lagha shop" />
        </Link>

        {/* Primary nav (desktop) */}
        <nav className="primary-nav">
          <Link to="/" className="nav-link-item" onClick={resetToHome}>
            {t("home")}
          </Link>
          <Dropdown overlay={<CategoriesItem />} placement="bottom">
            <span className="nav-link-item">
              {t("categories")}
              <ArrowDown style={{ width: "12px" }} />
            </span>
          </Dropdown>
          <Link to="/brands" className="nav-link-item">
            {t("brands") !== "brands" ? t("brands") : "Brands"}
          </Link>
          <Link to="/contact" className="nav-link-item">
            {t("contact")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <div className="header-search-box desktop-only" ref={searchBoxRef}>
            <form onSubmit={searchHandler}>
              <div className="search-header-input-container">
                <input
                  type="text"
                  className="search-header-input"
                  placeholder={t("search..")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggest(true);
                  }}
                  onFocus={() => setShowSuggest(true)}
                />
                <i className="fa fa-search" aria-hidden="true"></i>
              </div>
            </form>

            {showSuggest && searchTerm.trim().length >= 2 && (
              <div className="search-suggestions">
                {searchLoading && suggestions.length === 0 ? (
                  <div className="search-suggestion-empty">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    &nbsp; {t("Searching") !== "Searching" ? t("Searching") : "Recherche…"}
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="search-suggestion-empty">
                    {t("No results") !== "No results" ? t("No results") : "Aucun résultat"}
                  </div>
                ) : (
                  <>
                    {suggestions.map((p) => (
                      <button
                        type="button"
                        className="search-suggestion"
                        key={p._id}
                        onClick={() => goToProduct(p._id)}
                      >
                        <img
                          src={`${API_BASE}${p.images?.[0]?.path || ""}`}
                          alt={p.name}
                          className="search-suggestion-img"
                        />
                        <span className="search-suggestion-info">
                          <span className="search-suggestion-name">{p.name}</span>
                          <span className="search-suggestion-price">
                            DT {Number(p.price || 0).toFixed(2)}
                          </span>
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      className="search-suggestion-all"
                      onClick={searchHandler}
                    >
                      <i className="fa fa-search" aria-hidden="true"></i>
                      &nbsp;
                      {t("See all results") !== "See all results"
                        ? t("See all results")
                        : "Voir tous les résultats"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className="header-icon-btn desktop-only"
            aria-label="Store location"
          >
            <PositionIcon />
          </Link>

          {user && user.name ? (
            <Dropdown
              overlay={<AccountMenu />}
              placement="bottomRight"
              trigger={["click", "hover"]}
            >
              <button
                className="header-icon-btn desktop-only"
                aria-label="Account"
              >
                <img
                  src={user && `https://api.lagha.shop${user.avatar}`}
                  alt="user"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "999px",
                    objectFit: "cover",
                  }}
                />
              </button>
            </Dropdown>
          ) : (
            !loading && (
              <Link
                to="/login"
                className="header-icon-btn desktop-only"
                aria-label="Sign in"
              >
                <UserIcon />
              </Link>
            )
          )}

          <Link
            to="/wishlist"
            className="header-icon-btn desktop-only"
            aria-label="Favoris"
          >
            <i className="fa fa-heart-o" style={{ fontSize: "20px" }}></i>
            {wishlist && wishlist.length > 0 && (
              <span className="cart-badge">{wishlist.length}</span>
            )}
          </Link>

          {/* Cart — always visible */}
          <Link to="/cart" className="header-icon-btn" aria-label="Cart">
            <CartIcon />
            {cartItems && cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>

          <Dropdown
            menu={{ items: languagesItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="text" className="header-icon-btn lang-flag desktop-only">
              {lang === "ar" ? (
                <span className="lang-ar-badge">ع</span>
              ) : lang === "en" ? (
                <EnglishIcon />
              ) : (
                <FrenshIcon />
              )}
            </Button>
          </Dropdown>
        </div>
      </div>
    </header>

      {/* Mobile drawer (outside <header> so position:fixed escapes the
          backdrop-filter containing block) */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <form onSubmit={searchHandler}>
          <div className="mobile-search">
            <input
              type="text"
              placeholder={t("search..")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </form>

        {searchTerm.trim().length >= 2 && suggestions.length > 0 && (
          <div className="mobile-search-suggestions">
            {suggestions.map((p) => (
              <button
                type="button"
                className="search-suggestion"
                key={p._id}
                onClick={() => goToProduct(p._id)}
              >
                <img
                  src={`${API_BASE}${p.images?.[0]?.path || ""}`}
                  alt={p.name}
                  className="search-suggestion-img"
                />
                <span className="search-suggestion-info">
                  <span className="search-suggestion-name">{p.name}</span>
                  <span className="search-suggestion-price">
                    DT {Number(p.price || 0).toFixed(2)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mobile-drawer-scroll">
          {mobileLink("/", t("home"), resetToHome)}

          {/* Categories accordion */}
          {allCategory && allCategory.length > 0 && (
            <div className="mobile-accordion">
              {allCategory.map((cat) => (
                <div className="mobile-acc-item" key={cat.title}>
                  <button
                    className="mobile-nav-link mobile-acc-toggle"
                    onClick={() =>
                      setOpenCat(openCat === cat.title ? null : cat.title)
                    }
                  >
                    <span>{cat.title}</span>
                    <i
                      className={`fa fa-chevron-${
                        openCat === cat.title ? "up" : "down"
                      }`}
                      aria-hidden="true"
                    ></i>
                  </button>
                  {openCat === cat.title && (
                    <div className="mobile-subcats">
                      <span
                        className="mobile-subcat"
                        onClick={() => selectCategory(cat.title)}
                      >
                        {t("All") !== "All" ? t("All") : "Tout"} — {cat.title}
                      </span>
                      {cat?.subcategories?.map((sub) => (
                        <span
                          key={sub}
                          className="mobile-subcat"
                          onClick={() => selectCategory(cat.title, sub)}
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {mobileLink(
            "/brands",
            t("brands") !== "brands" ? t("brands") : "Brands"
          )}
          {mobileLink("/contact", t("contact"))}

          {!user && !loading && mobileLink("/login", t("sign_in"))}

          {user && user.name && (
            <>
              {user.role === "admin" && mobileLink("/dashboard", t("dashboard"))}
              {mobileLink("/orders", t("orders"))}
              {mobileLink("/profile", t("profile"))}
              {mobileLink("/settings", t("settings"))}
              <button
                className="mobile-nav-link mobile-logout"
                onClick={() => {
                  logoutHandler();
                  closeMobile();
                }}
              >
                {t("logout")}
              </button>
            </>
          )}

          {/* Language switch */}
          <div className="mobile-lang">
            <button
              className={`mobile-lang-btn ${lang === "fr" ? "active" : ""}`}
              onClick={() => onChangeLanguage("fr")}
            >
              <FrenshIcon /> {t("language.fr")}
            </button>
            <button
              className={`mobile-lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => onChangeLanguage("en")}
            >
              <EnglishIcon /> {t("language.en")}
            </button>
            <button
              className={`mobile-lang-btn ${lang === "ar" ? "active" : ""}`}
              onClick={() => onChangeLanguage("ar")}
            >
              <span className="lang-ar-badge">ع</span> {t("language.ar")}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMobile} />
      )}
    </>
  );
};

export default Header;
