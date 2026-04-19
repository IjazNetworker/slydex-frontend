import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import "./index.css";
import AdminOrdersPage from "./pages/AdminOrdersPage";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}