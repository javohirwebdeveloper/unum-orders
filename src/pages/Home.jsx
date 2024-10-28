import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import OrderModal from "../components/OrderModal";
import { Helmet } from "react-helmet";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setIsOrderOpen(true);
  };

  const addToCart = (orderDetails) => {
    const updatedCart = [...cart, orderDetails];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 text-[#333333]">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`duration-200 ${
            selectedCategory == "all"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          }  px-[10px] py-[8px] rounded-[30px]`}
        >
          Barchasi
        </button>
        <button
          onClick={() => handleCategoryChange("flour")}
          className={`duration-200 ${
            selectedCategory == "flour"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          }  px-[10px] py-[8px] rounded-[30px]`}
        >
          Unlar
        </button>
        <button
          onClick={() => handleCategoryChange("feed products")}
          className={`duration-200 ${
            selectedCategory == "feed products"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          }  px-[10px] py-[8px] rounded-[30px]`}
        >
          Omuxta-yemlar
        </button>
        <button
          onClick={() => handleCategoryChange("food products")}
          className={`duration-200 ${
            selectedCategory == "food products"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          }  px-[10px] py-[8px] rounded-[30px]`}
        >
          Oziq-ovqat mahsulotlari
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border p-2 sm:p-4 rounded-lg shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 sm:h-48 object-cover mb-2 sm:mb-4 rounded-lg"
              />
              <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">
                {product.description}
              </p>
              <p className="text-sm sm:text-md font-semibold mb-1 sm:mb-2 text-[#F08626]">
                {formatPrice(product.price)} сум
              </p>
              <button
                onClick={() => handleOrderClick(product)}
                className="w-full bg-[#FFF2E7] font-semibold text-xs sm:text-sm text-[#FFA451] px-3 py-2 rounded-lg"
              >
                Харид қилиш
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">
            Hech qanday mahsulot topilmadi
          </p>
        )}
      </div>

      {isOrderOpen && (
        <OrderModal
          setIsOrderOpen={setIsOrderOpen}
          product={selectedProduct}
          addToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Home;
