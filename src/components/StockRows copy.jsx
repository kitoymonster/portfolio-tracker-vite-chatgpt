import { useState, useEffect } from "react";
import { getStockData } from '../services/api'

const StockRows = ({ portfolio }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async (ticker) => {
      try {
        const data = await getStockData(ticker)
        const marketCost = portfolio.avePrice * portfolio.shares;
        const marketValue = (data.price * portfolio.shares) * 0.99105;
        const unRealizedGains = marketValue - marketCost;
        const profitOrLoss = (unRealizedGains/marketCost) * 100;

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
          averageVolume20: data.averageVolume20
        }
        setStocks(Array.isArray(stock) ? stock : [stock]); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (portfolio.ticker) {
      fetchData(portfolio.ticker);
    }
  }, [portfolio.ticker, portfolio.avePrice, portfolio.shares]); // Runs when `stockCode` changes

  return (
    <>
    { stocks && stocks.length ? (
        stocks.map((stock, index) => {

          return (
            <tr key={index}>
              {Object.entries(stock).map(([key, value], index) => (
                <td key={index} className="px-6 py-4 whitespace-nowrap">
                  {
                    ["marketCost", "marketValue", "dayVolume", "averageVolume20"].includes(key) 
                    ? value.toLocaleString()  // Format numbers with commas
                    : ["unRealizedGains"].includes(key) 
                    ? Number(value.toFixed(2)).toLocaleString()
                    : ["profitOrLoss"].includes(key) 
                    ? value.toFixed(2)
                    : ["dividendYield"].includes(key) 
                    ? `${value.toFixed(2)}%`
                    : value}
                </td>
              ))} 
            </tr>
          )
        }
      )) : (
        <tr>
            <td colSpan="3">Loading...</td>
        </tr>
        )}
    </>
  );
};

export default StockRows;