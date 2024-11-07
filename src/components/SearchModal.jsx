import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase konfiguratsiyangizdan olingan db
import { collection, getDocs } from "firebase/firestore"; // Firestore dan foydalanish
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"; // Like iconlari

const SearchModal = ({
  setIsSearchOpen,
  addToCart,
  isInCart,
  likedProducts,
  setLikedProducts,
  cart, // Cartni props orqali oling
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]); // Mahsulotlar ro'yxati

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products")); // 'products' - sizning collection nomingiz
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col justify-between items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full h-full overflow-y-auto">
        <button
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-md transition duration-300 hover:bg-red-600"
        >
          Yopish
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">
          Mahsulotlarni Qidirish
        </h2>
        <input
          type="text"
          placeholder="Qidiruv..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFA451] transition duration-200"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-lg flex flex-col p-4 bg-gray-50 transition duration-200 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-2 rounded-lg"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  {product.name}
                </h3>
                <p className="text-sm md:text-base text-gray-700 mb-1">
                  {product.description}
                </p>
                <p className="text-sm font-semibold text-[#F08626] mb-1">
                  {new Intl.NumberFormat("uz-UZ").format(product.price)} сум
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className={`w-full font-semibold text-xs sm:text-sm ${
                    isInCart(product)
                      ? "bg-gray-300 border-gray-500 "
                      : "bg-[#FFF2E7] border-[#ff9838] text-[#ff9838]"
                  } px-3 py-2 border !text-[16px]   mt-2`}
                >
                  {isInCart(product) ? "Savatda bor" : "Savatga qo'shish"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              Hech qanday mahsulot topilmadi
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
