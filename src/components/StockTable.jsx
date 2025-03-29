import { useState, useEffect } from "react";
import StockRows from "./StockRows";
import { TABLE_HEADERS } from "../constants/headers";
import { portfolioData } from "../constants/portfolio";
import { getStockData } from "../services/api"; // API function

const StockTable = () => {
  const [stockDetails, setStockDetails] = useState([]); // Holds merged stock data
  const [loading, setLoading] = useState(false); // Loading state
  const [totals, setTotals] = useState({ marketCost: 0, marketValue: 0, unRealizedGains: 0, profitOrLoss: 0 });

  // ✅ Function to fetch stock data
  const fetchStockData = async () => {
    try {
      setLoading(true); // Show loading state
      let stocks = [];

      for (const portfolio of portfolioData) {
        const data = await getStockData(portfolio.ticker); // Fetch stock data one by one
        const marketCost = portfolio.avePrice * portfolio.shares;
        const marketValue = (data.price * portfolio.shares) * 0.99105;
        const unRealizedGains = marketValue - marketCost;
        const profitOrLoss = (unRealizedGains / marketCost) * 100;

        stocks.push({
          ...portfolio, // Keep portfolio details (shares, avePrice)
          stockCode: data.stockCode,
          companyName: data.companyName,
          dividendYield: data.dividendYield,
          marketPrice: data.price,
          marketCost,
          marketValue,
          unRealizedGains,
          profitOrLoss,
          dayVolume: data.dayVolume,
          averageVolume20: data.averageVolume20,
        });
      }

      setStockDetails(stocks); // Store all stocks in state

      // ✅ Calculate totals
      const totalMarketCost = stocks.reduce((acc, stock) => acc + stock.marketCost, 0);
      const totalMarketValue = stocks.reduce((acc, stock) => acc + stock.marketValue, 0);
      const totalUnrealizedGains = totalMarketValue - totalMarketCost;
      const totalProfitOrLoss = (totalUnrealizedGains / totalMarketCost) * 100;

      setTotals({
        marketCost: totalMarketCost,
        marketValue: totalMarketValue,
        unRealizedGains: totalUnrealizedGains,
        profitOrLoss: totalProfitOrLoss,
      });

    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // ✅ Fetch data on mount
  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className="relative p-6 bg-gray-900 min-h-screen text-white">

      {/* ✅ Portfolio Summary Panel */}
      <div className="absolute top-4 left-4 bg-gray-800 p-5 rounded-lg shadow-lg w-72 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Portfolio Summary</h3>
        <p><strong>Market Cost:</strong> <span className="font-medium">{totals.marketCost.toLocaleString()}</span></p>
        <p><strong>Market Value:</strong> <span className="font-medium">{totals.marketValue.toLocaleString()}</span></p>
        <p><strong>Unrealized Gains:</strong> <span className="font-medium">{totals.unRealizedGains.toLocaleString()}</span></p>
        <p>
          <strong>P/L:</strong> 
          <span className={`font-medium ${totals.profitOrLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
            {totals.profitOrLoss.toFixed(2)}%
          </span>
        </p>
      </div>

      {/* ✅ Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-300">Stock Portfolio</h2>
        <button
          onClick={fetchStockData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition disabled:bg-gray-500"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
      

      {/* ✅ Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 border border-gray-700 rounded-lg shadow-md">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              {TABLE_HEADERS.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider border border-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {
              stockDetails.length > 0 ? (
              stockDetails.map((stock, index) => {
                return <StockRows key={index} portfolio={stock} />
              })
            ) : (
              <tr>
                <td colSpan="12" className="px-6 py-4 text-center text-gray-400">
                  {loading ? "Loading..." : "No Data Available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;