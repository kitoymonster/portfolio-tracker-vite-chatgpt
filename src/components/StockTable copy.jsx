import React from "react";
import StockRows from "./StockRows";
import { TABLE_HEADERS } from '../constants/headers'
import { portfolioData } from '../constants/portfolio';

const StockTable = () => {
  return (
    <div>
      <h2>Stock Profile</h2>
      <table border="1" className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
              {TABLE_HEADERS.map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
            ))}
            </tr>
          </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {portfolioData.map((stock) => {
            return <StockRows portfolio={stock} />
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
