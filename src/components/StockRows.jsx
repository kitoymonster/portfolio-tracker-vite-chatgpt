const StockRows = ({ portfolio }) => {
  // Define fields that need special formatting
  const formattedFields = ["marketCost", "marketValue", "dayVolume", "averageVolume20"];
  const percentageFields = ["dividendYield", "profitOrLoss"];

  return (
    <tr>
      {Object.entries(portfolio).map(([key, value], index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          {formattedFields.includes(key)
            ? value.toLocaleString() // Format numbers with commas
            : percentageFields.includes(key)
            ? `${value.toFixed(2)}%` // Format percentage fields
            : typeof value === "number"
            ? value.toFixed(2) // Ensure numbers have two decimals
            : value}
        </td>
      ))}
    </tr>
  );
};

export default StockRows;