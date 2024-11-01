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
import SearchImg from "./assets/Search.svg"; // Qidiruv tugma uchun rasm
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
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed h-screen w-screen bg-gradient-to-br from-black to-[#ac7518] inset-0 flex items-center justify-center z-50">
        <img
          src="https://i.imgur.com/SdCe2Ui.png"
          alt="Loading..."
          className=" w-36 h-36"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="p-3 pb-40 text-[#27214D] ">
        <header className="flex z-10 bg-[white] top-0 pt-2 px-2 fixed w-full justify-between items-center mb-4">
          <button onClick={() => setIsMenuOpen(true)} className=" rounded">
            <img src={MenuImg} alt="Menu" />
          </button>
          <Link to="/">
            <img src={LogoImg} className="w-10 rounded-[15%]" alt="Logo" />
          </Link>
          <div className="flex items-center">
            <button onClick={() => setIsSearchOpen(true)} className=" rounded">
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

        <main className="mt-20">
          <Routes>
            <Route path="/" element={<Home />} />
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

        {isMenuOpen && (
          <div
            onClick={() => setIsMenuOpen(false)}
            className={`duration-500 z-50 w-full h-full inset-0 left-0 fixed ${
              isMenuOpen
                ? "bg-gray-900 bg-opacity-50"
                : "bg-transparent bg-opacity-0"
            }`}
          ></div>
        )}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`fixed right-0 z-50 duration-300 top-0 pt-4 pr-4 cursor-pointer ${
            isMenuOpen ? "translate-x-0" : "translate-x-[120%]"
          }`}
        >
          <img src={CancelImg} alt="Cancel" />
        </div>
        <div
          className={`fixed inset-1 z-50 left-0 top-0 w-[250px] h-full duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-[120%]"
          }`}
        >
          {isMenuOpen && <MenuModal setIsMenuOpen={setIsMenuOpen} />}
        </div>

        {/* Qidiruv Modalini ko‘rsatish */}
        {isSearchOpen && <SearchModal setIsSearchOpen={setIsSearchOpen} />}
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
            `flex flex-col items-center justify-center transition-all duration-300 ${
              isActive ? "text-red-500 font-bold" : "text-gray-600"
            } hover:text-red-500`
          }
        >
          <p className="text-[30px]">
            <FiShoppingCart />
          </p>
          <span className="text-sm">Savat</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-300 ${
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
