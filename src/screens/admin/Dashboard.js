import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

import { useDispatch, useSelector } from "react-redux";

import { getStatistics } from "../../actions/productActions";
import { allOrders } from "../../actions/orderActions";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { ArcElement } from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const {  totalAmount } = useSelector((state) => state.allOrders);
  const { statistics } = useSelector((state) => state.statistics);
  let outOfStock = 0;
  products.forEach((product) => {
    if (product.stock === 0) {
      outOfStock += 1;
    }
  });

  const data = {
    labels: ["Orders", "Out of Stock", "Category", "Users"],
    datasets: [
      {
        label: "Statistics",
        data: [	
          `${statistics && statistics?.data?.orderCount}`,
          `${statistics && statistics?.data?.outOfStockCount}`,
          `${statistics && statistics?.data?.categoryCount}`,
          `${statistics && statistics?.data?.userCount}`,
        ],
        backgroundColor: [
          "rgba(45, 206, 137, 0.5)",
          "rgba(245, 54, 92, 0.5)",
          "rgba(251, 99, 64, 0.5)",
          "rgba(255, 169, 0, 0.5)",
          "rgba(17, 205, 239, 0.5)",
        ],
      },
    ],
  };

  useEffect(() => {
    dispatch(allOrders());
    dispatch(getStatistics());
  
  }, [dispatch]);
  const [chartData, setChartData] = useState();

  useEffect(() => {
    if (statistics?.data?.categoryProductCounts) {
      const categoryNames = Object?.keys(statistics.data.categoryProductCounts);
      const productCounts = Object?.values(
        statistics.data.categoryProductCounts
      );
      setChartData({
        labels: categoryNames,
        datasets: [
          {
            label: "Product Counts",
            data: productCounts,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
          },
        ],
      });
    }
  }, [statistics]);
  return (
    <section className="container my-4">
      <div className="row" style={{ minHeight: "80vh" }}>
        <div
          className="col-12 col-md-3 px-3 py-4 my-4"
          style={{ backgroundColor: "#1A2D3C", borderRadius: "10px" }}
        >
          <Sidebar item="dashboard" />
        </div>
        <div className="col-12 col-md-9 px-3  my-4">
          <div className="card text-center bg-primary text-white">
            <div className="card-body p-2">
              <h5 className="text-white my-0">Total Amount</h5>
            </div>
            <div className="card-footer bg-primary text-white py-2">
              DT{totalAmount && totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 mt-3">
              <div className="card text-center bg-success text-white h-100">
                <div className="card-body p-3 h-100">
                  <h5 className="text-white my-0">Products</h5>
                </div>
                <div className="card-footer bg-success text-white py-2">
                  {statistics?.data?.productCount &&  statistics?.data?.productCount}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-4 mt-3">
              <div className="card text-center bg-danger text-white h-100">
                <div className="card-body p-3 h-100">
                  <h5 className="text-white my-0">Orders</h5>
                </div>
                <div className="card-footer bg-danger text-white py-2">
				{statistics?.data?.orderCount &&  statistics?.data?.orderCount}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-4 mt-3">
              <div className="card text-center bg-warning text-white h-100">
                <div className="card-body p-3 h-100">
                  <h5 className="text-white my-0">Out of Stock</h5>
                </div>
                <div className="card-footer bg-warning text-white py-2">
				{statistics?.data?.outOfStockCount &&  statistics?.data?.outOfStockCount}

                </div>
              </div>
            </div>
          </div>

          <hr />

          <Bar data={data} />
          {chartData && <Pie data={chartData} />}

          <hr />

          <div className="row">
            <div className="col-12 col-sm-12 col-md-6">
              <div
                className="card text-center text-white h-100"
                style={{ backgroundColor: "#FFA900" }}
              >
                <div className="card-body p-3 h-100">
                  <h5 className="text-white my-0">Categories</h5>
                </div>
                <div
                  className="card-footer  text-white py-2"
                  style={{ backgroundColor: "#FFA900" }}
                >
				{statistics?.data?.categoryCount &&  statistics?.data?.categoryCount}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-6">
              <div className="card text-center bg-info text-white h-100">
                <div className="card-body p-3 h-100">
                  <h5 className="text-white my-0">Users</h5>
                </div>
                <div className="card-footer bg-info text-white py-2">
				{statistics?.data?.userCount &&  statistics?.data?.userCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
