const BASE_URL = 'https://api.dragonfi.ph/api'

export const getStockData = async (ticker) => {
    const response = await fetch(`${BASE_URL}/Securities/GetStockProfile?stockCode=${ticker}`);
    const data = await response.json();
    return data
}