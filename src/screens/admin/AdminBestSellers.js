import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { API_BASE, authHeaders } from "../../config";

const AdminBestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const loadBestSellers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/best-sellers`);
      setBestSellers(data.bestSellers || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Erreur de chargement");
    }
  };

  useEffect(() => {
    loadBestSellers();
  }, []);

  // Debounced product search
  useEffect(() => {
    const term = keyword.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      axios
        .get(`${API_BASE}/api/products?keyword=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        })
        .then(({ data }) => {
          setResults((data.products || []).slice(0, 12));
          setSearching(false);
        })
        .catch((err) => {
          if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED")
            setSearching(false);
        });
    }, 280);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [keyword]);

  const isBest = (id) => bestSellers.some((b) => b._id === id);

  const setFlag = async (product, value) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/products/${product._id}/best-seller`,
        { bestSeller: value },
        authHeaders()
      );
      toast.success(value ? "Ajouté aux meilleures ventes" : "Retiré des meilleures ventes");
      if (value) {
        setBestSellers((list) =>
          list.some((b) => b._id === product._id) ? list : [{ ...product, bestSeller: true }, ...list]
        );
      } else {
        setBestSellers((list) => list.filter((b) => b._id !== product._id));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Mise à jour échouée");
    }
  };

  const imgSrc = (p) => `${API_BASE}${p.images?.[0]?.path || ""}`;

  return (
    <section className="container-fluid admin-page">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div className="col-12 col-md-2 admin-nav-col">
          <Sidebar item="bestsellers" />
        </div>

        <div className="col-12 col-md-10 admin-content-col">
          <h1 className="admin-page-title">Meilleures ventes</h1>

          <div className="card border" style={{ marginBottom: "24px" }}>
            <div className="card-header">
              <h3 className="mb-0">Ajouter un produit</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Rechercher un produit (nom, marque, catégorie…)</label>
                <input
                  className="form-control"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Rechercher…"
                />
              </div>

              {searching && <p className="text-muted">Recherche…</p>}

              <div className="bestseller-results">
                {results.map((p) => (
                  <div className="bestseller-row" key={p._id}>
                    <img src={imgSrc(p)} alt={p.name} />
                    <div className="bestseller-row-info">
                      <strong>{p.name}</strong>
                      <span>DT {Number(p.price || 0).toFixed(2)}</span>
                    </div>
                    {isBest(p._id) ? (
                      <button
                        className="btn btn-danger py-1 px-3"
                        onClick={() => setFlag(p, false)}
                      >
                        <i className="fa fa-times"></i>&nbsp; Retirer
                      </button>
                    ) : (
                      <button
                        className="btn btn-success py-1 px-3"
                        onClick={() => setFlag(p, true)}
                      >
                        <i className="fa fa-plus"></i>&nbsp; Ajouter
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card border">
            <div className="card-header">
              <h3 className="mb-0">
                Produits sélectionnés ({bestSellers.length})
              </h3>
            </div>
            <div className="card-body">
              {bestSellers.length === 0 ? (
                <p className="text-muted mb-0">
                  Aucun produit sélectionné. Les produits ajoutés ici
                  s'afficheront sur la page d'accueil après la section Promo.
                </p>
              ) : (
                <div className="bestseller-results">
                  {bestSellers.map((p) => (
                    <div className="bestseller-row" key={p._id}>
                      <img src={imgSrc(p)} alt={p.name} />
                      <div className="bestseller-row-info">
                        <strong>{p.name}</strong>
                        <span>DT {Number(p.price || 0).toFixed(2)}</span>
                      </div>
                      <button
                        className="btn btn-danger py-1 px-3"
                        onClick={() => setFlag(p, false)}
                      >
                        <i className="fa fa-trash"></i>&nbsp; Retirer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminBestSellers;
