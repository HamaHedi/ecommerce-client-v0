import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { API_BASE, authHeaders } from "../../config";

const ICON_OPTIONS = [
  { value: "fa-bullhorn", label: "Annonce" },
  { value: "fa-truck", label: "Livraison" },
  { value: "fa-certificate", label: "Authentique" },
  { value: "fa-lock", label: "Sécurité" },
  { value: "fa-heart", label: "Clients" },
  { value: "fa-comments", label: "Support" },
  { value: "fa-tags", label: "Promo" },
  { value: "fa-gift", label: "Cadeau" },
  { value: "fa-star", label: "Étoile" },
];

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    text: "",
    icon: "fa-bullhorn",
    order: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/admin/announcements`,
        authHeaders()
      );
      setAnnouncements(data.announcements || []);
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

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const create = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) {
      toast.error("Le texte est requis");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/api/admin/announcements`,
        { ...form, order: Number(form.order) || 0 },
        authHeaders()
      );
      toast.success("Annonce ajoutée");
      setForm({ text: "", icon: "fa-bullhorn", order: "" });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Création échouée");
    }
  };

  const toggleActive = async (a) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/announcements/${a._id}`,
        { active: !a.active },
        authHeaders()
      );
      setAnnouncements((list) =>
        list.map((x) => (x._id === a._id ? { ...x, active: !x.active } : x))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Mise à jour échouée");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(
        `${API_BASE}/api/admin/announcements/${id}`,
        authHeaders()
      );
      toast.success("Annonce supprimée");
      setAnnouncements((list) => list.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Suppression échouée");
    }
  };

  return (
    <section className="container-fluid admin-page">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div className="col-12 col-md-2 admin-nav-col">
          <Sidebar item="announcements" />
        </div>

        <div className="col-12 col-md-10 admin-content-col">
          <h1 className="admin-page-title">Bandeau d'annonces</h1>

          <div className="card border" style={{ marginBottom: "24px" }}>
            <div className="card-header">
              <h3 className="mb-0">Nouvelle annonce</h3>
            </div>
            <div className="card-body">
              <form onSubmit={create}>
                <div className="coupon-form-grid">
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Texte affiché</label>
                    <input
                      className="form-control"
                      name="text"
                      maxLength={160}
                      placeholder="Ex: Livraison gratuite dès 150 DT 🎉"
                      value={form.text}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Icône</label>
                    <select
                      className="form-control"
                      name="icon"
                      value={form.icon}
                      onChange={onChange}
                    >
                      {ICON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ordre (0 = premier)</label>
                    <input
                      className="form-control"
                      name="order"
                      type="number"
                      value={form.order}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="fa fa-plus"></i>&nbsp; Ajouter l'annonce
                </button>
              </form>
            </div>
          </div>

          <div className="card border">
            <div className="card-header">
              <h3 className="mb-0">Annonces ({announcements.length})</h3>
            </div>
            <div className="card-body mdb-datatable">
              <table className="table">
                <thead>
                  <tr>
                    <th>Icône</th>
                    <th>Texte</th>
                    <th>Ordre</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Chargement…
                      </td>
                    </tr>
                  ) : announcements.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Aucune annonce — le bandeau affiche les messages par
                        défaut.
                      </td>
                    </tr>
                  ) : (
                    announcements.map((a) => (
                      <tr key={a._id}>
                        <td>
                          <i className={`fa ${a.icon || "fa-bullhorn"}`}></i>
                        </td>
                        <td>{a.text}</td>
                        <td>{a.order}</td>
                        <td>
                          <button
                            className={`coupon-status ${
                              a.active ? "on" : "off"
                            }`}
                            style={{ border: 0, cursor: "pointer" }}
                            onClick={() => toggleActive(a)}
                            title="Activer / désactiver"
                          >
                            {a.active ? "Actif" : "Inactif"}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger py-1 px-2"
                            onClick={() => remove(a._id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminAnnouncements;
