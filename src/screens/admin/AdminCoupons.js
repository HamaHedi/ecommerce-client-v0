import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { API_BASE, authHeaders } from "../../config";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrder: "",
    expiresAt: "",
    usageLimit: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/coupons`, authHeaders());
      setCoupons(data.coupons || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Erreur de chargement des coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const create = async (e) => {
    e.preventDefault();
    if (!form.code || form.discountValue === "") {
      toast.error("Code et valeur requis");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/api/coupons`,
        {
          ...form,
          discountValue: Number(form.discountValue),
          minOrder: Number(form.minOrder) || 0,
          usageLimit: Number(form.usageLimit) || 0,
        },
        authHeaders()
      );
      toast.success("Coupon créé");
      setForm({
        code: "",
        discountType: "percent",
        discountValue: "",
        minOrder: "",
        expiresAt: "",
        usageLimit: "",
      });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Création échouée");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/coupons/${id}`, authHeaders());
      toast.success("Coupon supprimé");
      setCoupons((c) => c.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Suppression échouée");
    }
  };

  return (
    <section className="container-fluid admin-page">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div className="col-12 col-md-2 admin-nav-col">
          <Sidebar item="coupons" />
        </div>

        <div className="col-12 col-md-10 admin-content-col">
          <h1 className="admin-page-title">Codes promo</h1>

          <div className="card border" style={{ marginBottom: "24px" }}>
            <div className="card-header">
              <h3 className="mb-0">Nouveau coupon</h3>
            </div>
            <div className="card-body">
              <form className="coupon-form" onSubmit={create}>
                <div className="coupon-form-grid">
                  <div className="form-group">
                    <label>Code</label>
                    <input
                      className="form-control"
                      name="code"
                      placeholder="BIANAS10"
                      value={form.code}
                      onChange={(e) =>
                        setForm({ ...form, code: e.target.value.toUpperCase() })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      className="form-control"
                      name="discountType"
                      value={form.discountType}
                      onChange={onChange}
                    >
                      <option value="percent">Pourcentage (%)</option>
                      <option value="fixed">Montant fixe (DT)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Valeur</label>
                    <input
                      className="form-control"
                      name="discountValue"
                      type="number"
                      value={form.discountValue}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Min. achat (DT)</label>
                    <input
                      className="form-control"
                      name="minOrder"
                      type="number"
                      value={form.minOrder}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Limite d'usage (0 = illimité)</label>
                    <input
                      className="form-control"
                      name="usageLimit"
                      type="number"
                      value={form.usageLimit}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expire le</label>
                    <input
                      className="form-control"
                      name="expiresAt"
                      type="date"
                      value={form.expiresAt}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="fa fa-plus"></i>&nbsp; Créer le coupon
                </button>
              </form>
            </div>
          </div>

          <div className="card border">
            <div className="card-header">
              <h3 className="mb-0">Coupons ({coupons.length})</h3>
            </div>
            <div className="card-body mdb-datatable">
              <table className="table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Remise</th>
                    <th>Min.</th>
                    <th>Usage</th>
                    <th>Expire</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Chargement…
                      </td>
                    </tr>
                  ) : coupons.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Aucun coupon
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <strong>{c.code}</strong>
                        </td>
                        <td>
                          {c.discountType === "percent"
                            ? `${c.discountValue}%`
                            : `${c.discountValue} DT`}
                        </td>
                        <td>{c.minOrder || 0} DT</td>
                        <td>
                          {c.usedCount || 0}
                          {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                        </td>
                        <td>
                          {c.expiresAt
                            ? new Date(c.expiresAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`coupon-status ${
                              c.active ? "on" : "off"
                            }`}
                          >
                            {c.active ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger py-1 px-2"
                            onClick={() => remove(c._id)}
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

export default AdminCoupons;
