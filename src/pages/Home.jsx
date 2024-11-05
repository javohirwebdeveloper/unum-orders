import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import OrderModal from "../components/OrderModal";
import { Helmet } from "react-helmet";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

const Home = ({ cart, setCart }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);

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

    const storedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(storedLikes);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

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

  const toggleLike = async (product) => {
    const updatedLikes = likedProducts.includes(product.id)
      ? likedProducts.filter((id) => id !== product.id)
      : [...likedProducts, product.id];

    setLikedProducts(updatedLikes);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));

    // Update likes count in Firebase
    const productRef = doc(db, "products", product.id);
    await updateDoc(productRef, {
      likesCount: updatedLikes.includes(product.id)
        ? product.likesCount + 1
        : product.likesCount - 1,
    });
  };

  const placeOrder = async () => {
    const orderData = {
      items: cart,
      date: new Date(),
      total: cart.reduce((acc, item) => acc + item.price, 0),
    };

    // Save order to Firebase
    await addDoc(collection(db, "orders"), orderData);

    // Clear cart after order
    setCart([]);
    localStorage.removeItem("cart");
    alert("Sizning buyurtmangiz muvaffaqiyatli joylandi!");
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
            selectedCategory === "all"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          } px-[10px] py-[8px] rounded-[30px]`}
        >
          Barchasi
        </button>
        <button
          onClick={() => handleCategoryChange("un")}
          className={`duration-200 ${
            selectedCategory === "un"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          } px-[10px] py-[8px] rounded-[30px]`}
        >
          Unlar
        </button>
        <button
          onClick={() => handleCategoryChange("yem")}
          className={`duration-200 ${
            selectedCategory === "yem"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          } px-[10px] py-[8px] rounded-[30px]`}
        >
          Omuxta-yemlar
        </button>
        <button
          onClick={() => handleCategoryChange("ovqat")}
          className={`duration-200 ${
            selectedCategory === "ovqat"
              ? "bg-[#ac7518] text-[white]"
              : "bg-[#f4f4f4]"
          } px-[10px] py-[8px] rounded-[30px]`}
        >
          Oziq-ovqat mahsulotlari
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-lg flex flex-col p-4 h-full"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded-lg"
                />
                {/*<button
                  onClick={() => toggleLike(product)}
                  className="absolute top-2 right-2 flex items-center bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-200"
                >
                  <h1 className="text-sm">{product.likesCount}</h1>
                  {likedProducts.includes(product.id) ? (
                    <IoMdHeart className="text-red-600 ml-1" />
                  ) : (
                    <IoMdHeartEmpty className="text-gray-500 ml-1" />
                  )}
                </button>*/}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                {product.name}
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-1">
                {product.description}
              </p>
              <p className="text-sm font-semibold text-[#ff8716] mb-1">
                {formatPrice(product.price)} сум
              </p>
              <button
                onClick={() => addToCart(product)}
                className={`w-full font-semibold text-xs sm:text-sm ${
                  isInCart(product)
                    ? "bg-gray-300"
                    : "bg-[#FFF2E7] text-[#ff9838]"
                } px-3 py-2 rounded-lg mt-2`}
              >
                {isInCart(product) ? "Savatda bor" : "Savatga qo'shish"}
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
