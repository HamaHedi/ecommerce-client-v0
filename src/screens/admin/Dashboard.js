import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import { useDispatch, useSelector } from "react-redux";

import { getStatistics, getAdminProducts } from "../../actions/productActions";
import { allOrders } from "../../actions/orderActions";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "../../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const PURPLE = "#673995";
const CORAL = "#f26460";
const LOW_STOCK_THRESHOLD = 5;

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products = [] } = useSelector((state) => state.products);
  const { orders = [], totalAmount } = useSelector((state) => state.allOrders);
  const { statistics } = useSelector((state) => state.statistics);

  useEffect(() => {
    dispatch(allOrders());
    dispatch(getStatistics());
    dispatch(getAdminProducts(1, ""));
  }, [dispatch]);

  // ---- Revenue over the last 14 days ----
  const revenue = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d;
    });
    const labels = days.map((d) =>
      d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    );
    const data = days.map((d) => {
      const key = d.toISOString().slice(0, 10);
      return orders
        .filter((o) => (o.createdAt || "").slice(0, 10) === key)
        .reduce((a, o) => a + (o.totalPrice || 0), 0);
    });
    return { labels, data };
  }, [orders]);

  // ---- Top products by quantity sold ----
  const topProducts = useMemo(() => {
    const map = {};
    orders.forEach((o) =>
      (o.orderItems || []).forEach((it) => {
        map[it.name] = (map[it.name] || 0) + (it.quantity || 0);
      })
    );
    const sorted = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return {
      labels: sorted.map(([n]) => (n.length > 22 ? n.slice(0, 22) + "…" : n)),
      data: sorted.map(([, q]) => q),
    };
  }, [orders]);

  // ---- Order status breakdown ----
  const statusBreakdown = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const s = o.orderStatus || "Processing";
      map[s] = (map[s] || 0) + 1;
    });
    return { labels: Object.keys(map), data: Object.values(map) };
  }, [orders]);

  // ---- Low stock products ----
  const lowStock = useMemo(
    () =>
      (products || [])
        .filter((p) => p.stock !== undefined && p.stock <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 8),
    [products]
  );

  const cards = [
    {
      label: "Chiffre d'affaires",
      value: `${(totalAmount || 0).toFixed(2)} DT`,
      icon: "fa-money",
      tone: "a",
    },
    {
      label: "Commandes",
      value: statistics?.data?.orderCount ?? orders.length,
      icon: "fa-shopping-cart",
      tone: "b",
    },
    {
      label: "Produits",
      value: statistics?.data?.productCount ?? products.length,
      icon: "fa-cubes",
      tone: "c",
    },
    {
      label: "Clients",
      value: statistics?.data?.userCount ?? "—",
      icon: "fa-users",
      tone: "d",
    },
  ];

  const chartOpts = (currency) => ({
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => (currency ? v + " DT" : v) },
        grid: { color: "#ece8f1" },
      },
      x: { grid: { display: false } },
    },
  });

  return (
    <section className="container-fluid admin-page">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div className="col-12 col-md-2 admin-nav-col">
          <Sidebar item="dashboard" />
        </div>

        <div className="col-12 col-md-10 admin-content-col">
          <h1 className="admin-page-title">Tableau de bord</h1>

          {/* Stat cards */}
          <div className="dash-stats">
            {cards.map((c) => (
              <div className={`dash-stat tone-${c.tone}`} key={c.label}>
                <span className="dash-stat-icon">
                  <i className={`fa ${c.icon}`}></i>
                </span>
                <span className="dash-stat-body">
                  <span className="dash-stat-value">{c.value}</span>
                  <span className="dash-stat-label">{c.label}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Revenue */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h3>Chiffre d'affaires — 14 derniers jours</h3>
            </div>
            <Line
              data={{
                labels: revenue.labels,
                datasets: [
                  {
                    label: "CA (DT)",
                    data: revenue.data,
                    borderColor: PURPLE,
                    backgroundColor: "rgba(103,57,149,0.12)",
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: PURPLE,
                  },
                ],
              }}
              options={chartOpts(true)}
            />
          </div>

          <div className="dash-grid-2">
            {/* Top products */}
            <div className="dash-panel">
              <div className="dash-panel-head">
                <h3>Meilleures ventes</h3>
              </div>
              {topProducts.labels.length ? (
                <Bar
                  data={{
                    labels: topProducts.labels,
                    datasets: [
                      {
                        label: "Quantité vendue",
                        data: topProducts.data,
                        backgroundColor: "rgba(103,57,149,0.75)",
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={{ ...chartOpts(false), indexAxis: "y" }}
                />
              ) : (
                <p className="dash-empty">Aucune donnée de vente.</p>
              )}
            </div>

            {/* Status */}
            <div className="dash-panel">
              <div className="dash-panel-head">
                <h3>Statut des commandes</h3>
              </div>
              {statusBreakdown.labels.length ? (
                <div style={{ maxWidth: 280, margin: "0 auto" }}>
                  <Doughnut
                    data={{
                      labels: statusBreakdown.labels,
                      datasets: [
                        {
                          data: statusBreakdown.data,
                          backgroundColor: [
                            PURPLE,
                            CORAL,
                            "#9b4bbf",
                            "#cbb9d7",
                            "#43215f",
                          ],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { position: "bottom" } },
                    }}
                  />
                </div>
              ) : (
                <p className="dash-empty">Aucune commande.</p>
              )}
            </div>
          </div>

          {/* Low stock */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h3>
                <i
                  className="fa fa-exclamation-triangle"
                  style={{ color: CORAL }}
                ></i>{" "}
                Stock faible
              </h3>
              <Link to="/admin/products" className="dash-link">
                Voir tous les produits →
              </Link>
            </div>
            {lowStock.length ? (
              <div className="dash-lowstock">
                {lowStock.map((p) => (
                  <Link
                    to={`/admin/product/${p._id}`}
                    className="dash-lowstock-item"
                    key={p._id}
                  >
                    <span className="dash-lowstock-name">{p.name}</span>
                    <span
                      className={`dash-lowstock-badge ${
                        p.stock === 0 ? "out" : ""
                      }`}
                    >
                      {p.stock === 0 ? "Rupture" : `${p.stock} restant(s)`}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="dash-empty">
                Aucun produit en stock faible. 👍
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
