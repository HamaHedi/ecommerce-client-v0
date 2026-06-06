import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { API_BASE } from "../../config";

const tokenHeader = () => ({
  headers: { Authorization: localStorage.getItem("token") },
});

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", sortOrder: "" });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/admin/banners`, tokenHeader());
      setBanners(data.banners || []);
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

  const onFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const create = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez choisir une image");
      return;
    }
    const fd = new FormData();
    fd.append("files", file);
    fd.append("title", form.title);
    fd.append("subtitle", form.subtitle);
    fd.append("link", form.link);
    fd.append("sortOrder", form.sortOrder || 0);
    try {
      await axios.post(`${API_BASE}/api/admin/banners`, fd, tokenHeader());
      toast.success("Bannière ajoutée");
      setFile(null);
      setPreview("");
      setForm({ title: "", subtitle: "", link: "", sortOrder: "" });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Échec de l'ajout");
    }
  };

  const toggle = async (b) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/admin/banners/${b._id}`,
        { active: !b.active },
        tokenHeader()
      );
      setBanners((list) => list.map((x) => (x._id === b._id ? data.banner : x)));
    } catch (err) {
      toast.error("Échec de la mise à jour");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/banners/${id}`, tokenHeader());
      setBanners((list) => list.filter((x) => x._id !== id));
      toast.success("Bannière supprimée");
    } catch (err) {
      toast.error("Échec de la suppression");
    }
  };

  return (
    <section className="container-fluid admin-page">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div className="col-12 col-md-2 admin-nav-col">
          <Sidebar item="banners" />
        </div>

        <div className="col-12 col-md-10 admin-content-col">
          <h1 className="admin-page-title">Bannières de la page d'accueil</h1>

          <div className="card border" style={{ marginBottom: "24px" }}>
            <div className="card-header">
              <h3 className="mb-0">Nouvelle bannière</h3>
            </div>
            <div className="card-body">
              <form onSubmit={create}>
                <div className="coupon-form-grid">
                  <div className="form-group">
                    <label>Image</label>
                    <input type="file" accept="image/*" className="form-control" onChange={onFile} />
                  </div>
                  <div className="form-group">
                    <label>Titre (optionnel)</label>
                    <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Sous-titre (optionnel)</label>
                    <input className="form-control" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Lien (optionnel)</label>
                    <input className="form-control" placeholder="/products" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Ordre</label>
                    <input type="number" className="form-control" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                  </div>
                </div>
                {preview && (
                  <img src={preview} alt="aperçu" className="banner-preview" />
                )}
                <button type="submit" className="btn btn-success">
                  <i className="fa fa-plus"></i>&nbsp; Ajouter la bannière
                </button>
              </form>
            </div>
          </div>

          <div className="card border">
            <div className="card-header">
              <h3 className="mb-0">Bannières ({banners.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Chargement…</p>
              ) : banners.length === 0 ? (
                <p className="dash-empty">Aucune bannière. La page utilise les images par défaut.</p>
              ) : (
                <div className="banner-grid">
                  {banners.map((b) => (
                    <div className={`banner-item ${b.active ? "" : "is-off"}`} key={b._id}>
                      <img src={`${API_BASE}${b.image.path}`} alt={b.title || "banner"} />
                      <div className="banner-item-info">
                        <strong>{b.title || "—"}</strong>
                        <span>{b.subtitle}</span>
                      </div>
                      <div className="banner-item-actions">
                        <button className="banner-toggle" onClick={() => toggle(b)}>
                          {b.active ? "Actif" : "Inactif"}
                        </button>
                        <button className="btn btn-danger py-1 px-2" onClick={() => remove(b._id)}>
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

export default AdminBanners;
