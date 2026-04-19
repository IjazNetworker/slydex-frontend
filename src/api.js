const BASE_URL = "https://slydex-backend.onrender.com/api";

export const getProducts = async (brand = "") => {
  const url = brand ? `${BASE_URL}/products/?brand=${brand}` : `${BASE_URL}/products/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const getBrands = async () => {
  const res = await fetch(`${BASE_URL}/products/brands/`);
  if (!res.ok) throw new Error("Failed to fetch brands");
  return res.json();
};

// export const createOrder = async (orderData) => {
//   const res = await fetch(`${BASE_URL}/orders/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(orderData),
//   });
//   const data = await res.json();
//   if (!res.ok) throw data;
//   return data;
// };

// ✅ updated endpoint: /orders/create/
export const createOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/orders/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

// ✅ new — get all orders, optional ?status=pending|completed|cancelled
export const getOrders = async (status = "") => {
  const url = status
    ? `${BASE_URL}/orders/?status=${status}`
    : `${BASE_URL}/orders/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

// ✅ new — update order status
export const updateOrder = async (id, status) => {
  const res = await fetch(`${BASE_URL}/orders/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};