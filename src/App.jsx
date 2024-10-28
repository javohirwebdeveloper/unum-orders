import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminPanel from "./pages/AdminPanel";
import MenuModal from "./components/MenuModal";
import SearchModal from "./components/SearchModal";
import OrderModal from "./components/OrderModal";
import CartImg from "./assets/Cart.svg";
import CancelImg from "./assets/Cancel.svg";
import MenuImg from "./assets/gamburger.svg";
import SearchImg from "./assets/Search.svg"; // Qidiruv tugma uchun rasm
import LogoImg from "./assets/Logo.svg";
import LoadingImg from "./assets/Logo.svg";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bg-[#095946] inset-0 flex items-center justify-center z-50">
        <img src={LoadingImg} alt="Loading..." className=" w-36 h-36" />
      </div>
    );
  }

  return (
    <Router>
      <div className="p-4 text-[#27214D] bg-[#F9F9F9]">
        <header className="flex [bg-[#F9F9F9] top-0 pt-2 fixed w-full pr-8 justify-between items-center mb-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-4 py-2 rounded"
          >
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
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        {isMenuOpen && (
          <div
            onClick={() => setIsMenuOpen(false)}
            className={`duration-500 w-full h-full inset-0 left-0 fixed ${
              isMenuOpen
                ? "bg-gray-900 bg-opacity-50"
                : "bg-transparent bg-opacity-0"
            }`}
          ></div>
        )}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`fixed right-0 duration-300 top-0 pt-4 pr-4 cursor-pointer ${
            isMenuOpen ? "translate-x-0" : "translate-x-[120%]"
          }`}
        >
          <img src={CancelImg} alt="Cancel" />
        </div>
        <div
          className={`fixed inset-1 left-0 top-0 w-[250px] h-full duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-[120%]"
          }`}
        >
          {isMenuOpen && <MenuModal setIsMenuOpen={setIsMenuOpen} />}
        </div>

        {/* Qidiruv Modalini ko‘rsatish */}
        {isSearchOpen && <SearchModal setIsSearchOpen={setIsSearchOpen} />}
        {isOrderOpen && <OrderModal setIsOrderOpen={setIsOrderOpen} />}
      </div>
    </Router>
  );
}

export default App;
