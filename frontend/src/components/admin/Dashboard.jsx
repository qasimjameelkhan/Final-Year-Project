import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTransactions,
  getAnalyticsSummary,
} from "../../actions/analyticsActions";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SideBar from "./SideBar";
import Loader from "../Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions, analytics, loading } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(getAllTransactions());
    dispatch(getAnalyticsSummary());
  }, [dispatch]);

  // Prepare data for the sales chart
  const prepareChartData = () => {
    if (!transactions || transactions.length === 0) return null;

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const dailySales = last30Days.map((date) => {
      const dayTransactions = transactions.filter(
        (t) => t.date.split("T")[0] === date
      );
      return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
    });

    return {
      labels: last30Days.map((date) => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: "Daily Transactions",
          data: dailySales,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  return (
    <div className="admin-dashboard">
      <SideBar />
      <div className="main-content">
        <div className="dashboard-content">
          <h1>Dashboard Overview</h1>

          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Summary Cards */}
              <div className="summary-cards">
                <div className="card">
                  <div className="card-icon total-sales">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="card-info">
                    <h3>Total Sales</h3>
                    <p>${analytics?.totalSales?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-icon commission">
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div className="card-info">
                    <h3>Total Commission</h3>
                    <p>${analytics?.totalCommission?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-icon arts">
                    <i className="fas fa-palette"></i>
                  </div>
                  <div className="card-info">
                    <h3>Total Arts</h3>
                    <p>{analytics?.totalArts || 0}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-icon transactions">
                    <i className="fas fa-exchange-alt"></i>
                  </div>
                  <div className="card-info">
                    <h3>Total Transactions</h3>
                    <p>{transactions?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Sales Chart */}
              <div className="chart-container">
                <h2>Transactions Overview (Last 30 Days)</h2>
                {chartData ? (
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: true,
                          text: "Daily Transactions Trend",
                        },
                      },
                    }}
                  />
                ) : (
                  <p className="no-data">No transactions data available</p>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="recent-transactions">
                <h2>Recent Transactions</h2>
                <div className="transactions-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Buyer</th>
                        <th>Seller</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.slice(0, 5).map((transaction) => (
                        <tr key={transaction.id}>
                          <td>
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td>{transaction.buyer}</td>
                          <td>{transaction.seller}</td>
                          <td>${transaction.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <style jsx>{`
            .admin-dashboard {
              display: flex;
              min-height: 100vh;
              width: 100%;
            }

            .main-content {
              flex: 1;
              margin-left: 250px;
              background: #f8f9fa;
              min-height: 100vh;
              width: 70%;
            }

            .dashboard-content {
              padding: 2rem;
            }

            h1 {
              color: #333;
              margin-bottom: 2rem;
              font-size: 1.8rem;
            }

            h2 {
              color: #495057;
              margin: 2rem 0 1rem;
              font-size: 1.4rem;
            }

            .summary-cards {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1.5rem;
              margin-bottom: 2rem;
            }

            .card {
              background: white;
              border-radius: 8px;
              padding: 1.5rem;
              display: flex;
              align-items: center;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease;
            }

            .card:hover {
              transform: translateY(-5px);
            }

            .card-icon {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 1rem;
              font-size: 1.5rem;
              color: white;
            }

            .total-sales {
              background: linear-gradient(45deg, #4caf50, #45a049);
            }

            .commission {
              background: linear-gradient(45deg, #2196f3, #1976d2);
            }

            .arts {
              background: linear-gradient(45deg, #ff9800, #f57c00);
            }

            .transactions {
              background: linear-gradient(45deg, #9c27b0, #7b1fa2);
            }

            .card-info h3 {
              margin: 0;
              font-size: 1rem;
              color: #6c757d;
            }

            .card-info p {
              margin: 0.5rem 0 0;
              font-size: 1.5rem;
              font-weight: 600;
              color: #333;
            }

            .chart-container {
              background: white;
              border-radius: 8px;
              padding: 1.5rem;
              margin-bottom: 2rem;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .recent-transactions {
              background: white;
              border-radius: 8px;
              padding: 1.5rem;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .transactions-table {
              overflow-x: auto;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th,
            td {
              padding: 1rem;
              text-align: left;
              border-bottom: 1px solid #eee;
            }

            th {
              background-color: #f8f9fa;
              font-weight: 600;
              color: #495057;
            }

            tr:hover {
              background-color: #f8f9fa;
            }

            .status-badge {
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.875rem;
              font-weight: 500;
            }

            .status-badge.completed {
              background-color: #d4edda;
              color: #155724;
            }

            .status-badge.pending {
              background-color: #fff3cd;
              color: #856404;
            }

            .status-badge.failed {
              background-color: #f8d7da;
              color: #721c24;
            }

            .no-data {
              text-align: center;
              color: #6c757d;
              padding: 2rem;
            }

            @media (max-width: 768px) {
              .main-content {
                margin-left: 60px;
              }

              .dashboard-content {
                padding: 1rem;
              }

              .summary-cards {
                grid-template-columns: 1fr;
              }

              th,
              td {
                padding: 0.75rem;
                font-size: 0.875rem;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
