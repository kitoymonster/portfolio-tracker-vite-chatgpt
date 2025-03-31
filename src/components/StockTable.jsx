import { useState, useEffect } from "react";
import StockRows from "./StockRows";
import { TABLE_HEADERS } from "../constants/headers";
import { portfolioData } from "../constants/portfolio";
import { getStockData } from "../services/api";
import '../css/styles/dark-mode.css'; // Import Dark Mode CSS

const StockTable = () => {
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({ marketCost: 0, marketValue: 0, unRealizedGains: 0, profitOrLoss: 0 });

  // ✅ Fetch stock data and update totals
  const fetchStockData = async () => {
    try {
      setLoading(true); // Show loading state
      let stocks = []; // Reset array to avoid duplicates

      for (const portfolio of portfolioData) {
        const data = await getStockData(portfolio.ticker); // Fetch stock data one by one
        const marketCost = portfolio.avePrice * portfolio.shares;
        const marketValue = (data.price * portfolio.shares) * 0.99105;
        const unRealizedGains = marketValue - marketCost;
        const profitOrLoss = (unRealizedGains / marketCost) * 100;

        const stock = {
          stockCode: data.stockCode,
          companyName: data.companyName,
          dividendYield: data.dividendYield,
          shares: portfolio.shares,
          avePrice: portfolio.avePrice,
          price: data.dayOpenPrice,
          marketCost: marketCost,
          marketValue: marketValue,
          unRealizedGains: unRealizedGains,
          profitOrLoss: profitOrLoss,
          dayVolume: data.dayVolume,
          averageVolume20: data.averageVolume20,
        };

        stocks.push(stock); // Add stock to local array
      }

      setStockDetails(stocks); // Replace state with new array (NO duplicates)
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false); // Hide loading state
    } 
  };
    
  useEffect(() => {
    fetchStockData();
  }, []); // Empty dependency array ensures this runs only once

  // 📌 Calculate Totals for Summary Panel
  const totalMarketCost = stockDetails.reduce((acc, stock) => acc + stock.marketCost, 0);
  const totalMarketValue = stockDetails.reduce((acc, stock) => acc + stock.marketValue, 0);
  const totalUnrealizedGains = stockDetails.reduce((acc, stock) => acc + stock.unRealizedGains, 0);
  const totalProfitOrLoss = ((totalUnrealizedGains / totalMarketCost) * 100).toFixed(2);

  return (
    <div className="container">
      {/* 📌 Summary Panel (Upper Left) */}
      <div className="summary-panel">
        <h3>Portfolio Summary</h3>
        <p>Market Cost: <span className="green">{totalMarketCost.toLocaleString()}</span></p>
        <p>Market Value: <span className="green">{totalMarketValue.toLocaleString()}</span></p>
        <p>Unrealized Gains: <span className={totalUnrealizedGains >= 0 ? "green" : "red"}>
          {totalUnrealizedGains.toLocaleString()}
        </span></p>
        <p>Profit/Loss: <span className={totalProfitOrLoss >= 0 ? "green" : "red"}>
          {totalProfitOrLoss}%
        </span></p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h2>Stock Profile</h2>
        <button
          onClick={fetchStockData}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* 📌 Table Wrapper (Ensures Scroll on Small Screens) */}
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              {TABLE_HEADERS.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stockDetails.map((stock, index) => (
              <StockRows key={index} portfolio={stock} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;