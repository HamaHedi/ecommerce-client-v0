import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { API_BASE, authHeaders } from "../../config";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | pending | approved

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/admin/testimonials`,
        authHeaders()
      );
      setTestimonials(data.testimonials || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setApproved = async (item, approved) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/testimonials/${item._id}`,
        { approved },
        authHeaders()
      );
      setTestimonials((list) =>
        list.map((x) => (x._id === item._id ? { ...x, approved } : x))
      );
      toast.success(approved ? "Avis approuvé" : "Avis masqué");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Mise à jour échouée");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(
        `${API_BASE}/api/admin/testimonials/${id}`,
        authHeaders()
      );
      setTestimonials((list) => list.filter((x) => x._id !== id));
      toast.success("Avis supprimé");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Suppression échouée");
    }
  };

  const filtered = testimonials.filter((t) => {
    if (filter === "pending") return !t.approved;
    if (filter === "approved") return t.approved;
    return true;
  });

  const pendingCount = testimonials.filter((t) => !t.approved).length;

  return (
    <section className="container-fluid admin-page">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div className="col-12 col-md-2 admin-nav-col">
          <Sidebar item="testimonials" />
        </div>

        <div className="col-12 col-md-10 admin-content-col">
          <h1 className="admin-page-title">
            Avis clients
            {pendingCount > 0 && (
              <span className="testi-pending-badge">{pendingCount} en attente</span>
            )}
          </h1>

          <div className="admin-filters">
            <div className="admin-filter">
              <label>Filtrer</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
              </select>
            </div>
          </div>

          <div className="card border">
            <div className="card-body">
              {loading ? (
                <p className="text-center">Chargement…</p>
              ) : filtered.length === 0 ? (
                <p className="text-center text-muted mb-0">Aucun avis</p>
              ) : (
                <div className="admin-testi-grid">
                  {filtered.map((item) => (
                    <div
                      className={`admin-testi-card ${item.approved ? "is-approved" : "is-pending"}`}
                      key={item._id}
                    >
                      <div className="admin-testi-head">
                        <span className="admin-testi-avatar">
                          {(item.name || "?").charAt(0)}
                        </span>
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.role || "Client"}</small>
                        </div>
                        <span
                          className={`admin-testi-status ${item.approved ? "on" : "off"}`}
                        >
                          {item.approved ? "Approuvé" : "En attente"}
                        </span>
                      </div>

                      <div className="admin-testi-stars">
                        {"★★★★★".slice(0, item.rating || 5)}
                      </div>

                      <p className="admin-testi-text">“{item.text}”</p>

                      {item.image?.path && (
                        <img
                          className="admin-testi-photo"
                          src={`${API_BASE}${item.image.path}`}
                          alt={item.name}
                        />
                      )}

                      <div className="admin-testi-actions">
                        {item.approved ? (
                          <button
                            className="btn btn-secondary py-1 px-3"
                            onClick={() => setApproved(item, false)}
                          >
                            <i className="fa fa-eye-slash"></i>&nbsp; Masquer
                          </button>
                        ) : (
                          <button
                            className="btn btn-success py-1 px-3"
                            onClick={() => setApproved(item, true)}
                          >
                            <i className="fa fa-check"></i>&nbsp; Approuver
                          </button>
                        )}
                        <button
                          className="btn btn-danger py-1 px-3"
                          onClick={() => remove(item._id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
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

export default AdminTestimonials;
