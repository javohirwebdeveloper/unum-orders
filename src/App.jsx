import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  NavLink,
} from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminPanel from "./pages/AdminPanel";
import MenuModal from "./components/MenuModal";
import SearchModal from "./components/SearchModal";
import OrderModal from "./components/OrderModal";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import CartImg from "./assets/Cart.svg";
import CancelImg from "./assets/Cancel.svg";
import { GoHome } from "react-icons/go";
import MenuImg from "./assets/gamburger.svg";
import SearchImg from "./assets/Search.svg";
import LogoImg from "./assets/Logo.svg";
import LoadingImg from "./assets/Logo.svg";
import { FiShoppingCart } from "react-icons/fi";
import OrdersPage from "./pages/OrdersPage";
import Likes from "./pages/Likes";
import ViewOrdersPage from "./pages/ViewOrderspage";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
const addToCart = (product) => {
  const isProductInCart = cart.some((item) => item.id === product.id);

  let updatedCart;
  if (isProductInCart) {
    updatedCart = cart.filter((item) => item.id !== product.id);
  } else {
    updatedCart = [...cart, product];
  }

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

const isInCart = (product) => {
  return cart.some((item) => item.id === product.id);
};
useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 2000);
  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  setCart(storedCart);
}, []);

useEffect(() => {
  window.scrollTo(0, 0);
}, []);

if (isLoading) {
  return (
    <div className="fixed flex-col  h-screen w-screen bg-gradient-to-br from-black to-[#ac7518] inset-0 flex items-center justify-center z-50">
      <img
        src="https://i.imgur.com/SdCe2Ui.png"
        alt="Loading..."
        className="w-36 h-36"
      />
      <span class="loader1"></span>
    </div>
  );
}

return (
  <Router>
    <div className="p-3 pb-40 text-[#27214D] ">
      <header className="flex z-10 bg-[white] top-0 pt-2 px-2 fixed w-full justify-between items-center mb-4">
        <button onClick={() => setIsMenuOpen(true)} className="rounded">
          <img src={MenuImg} alt="Menu" />
        </button>
        <Link to="/">
          <img src={LogoImg} className="w-10 rounded-[15%]" alt="Logo" />
        </Link>
        <div className="flex items-center">
          <button onClick={() => setIsSearchOpen(true)} className="rounded">
            <img src={SearchImg} alt="Search" />
          </button>
          <Link
            to="/cart"
            className="flex justify-center items-center flex-col px-4 py-2 rounded"
          >
            <img src={CartImg} alt="Cart" />
          </Link>
        </div>
      </header>

      <main className="mt-16">
        <Routes>
          <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} />}
          />
          <Route path="/viewOrders" element={<ViewOrdersPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/likes" element={<Likes />} />
        </Routes>
      </main>

      <MenuModal isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {isSearchOpen && (
        <SearchModal
          addToCart={addToCart}
          isInCart={isInCart}
          setIsSearchOpen={setIsSearchOpen}
        />
      )}
      {isOrderOpen && <OrderModal setIsOrderOpen={setIsOrderOpen} />}
    </div>

    <div className="navbar fixed bottom-0 bg-white w-full p-3 justify-between z-10 h-[76px] border-t-2 flex items-center shadow-md">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-all duration-300 ${
            isActive ? "text-red-500 font-bold" : "text-gray-600"
          } hover:text-red-500`
        }
      >
        <p className="text-[30px]">
          <GoHome />
        </p>
        <span className="text-sm">Home</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `flex flex-col relative items-center justify-center transition-all duration-300 ${
            isActive ? "text-red-500 font-bold" : "text-gray-600"
          } hover:text-red-500`
        }
      >
        {cart.length > 0 && (
          <div className="bg-red-500 absolute right-0 -mt-3 -mr-3 text-[20px] top-0 rounded-full w-6 h-6 flex justify-center items-center text-white">
            {cart.length}
          </div>
        )}
        <p className="text-[30px]">
          <FiShoppingCart />
        </p>
        <span className="text-sm">Savat</span>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `flex flex-col relative items-center justify-center transition-all duration-300 ${
            isActive ? "text-red-500 font-bold" : "text-gray-600"
          } hover:text-red-500`
        }
      >
        <img src={CartImg} className="w-8" alt="Orders" />
        <span className="text-sm">Buyurtmalar</span>
      </NavLink>
    </div>
  </Router>
);
}

export default App;
