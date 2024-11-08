import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import SearchImg from "../assets/Search.svg";
import { RxCross2 } from "react-icons/rx";
const SearchModal = ({
  setIsSearchOpen,
  addToCart,
  isInCart,
  likedProducts,
  setLikedProducts,
  cart,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-between items-center z-50">
      <div className="bg-white p-4 pt-5 w-full h-full overflow-y-auto">
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="font-semibold !text-[30px] rounded-full"
          >
            <i className="fi fi-ts-angle-circle-left"></i>
          </button>
          <label className="w-full flex items-center">
            <div className="border-b-2 border-[#555555] pb-[7px] w-full flex gap-2 items-center">
              <img src={SearchImg} alt="" />
              <input
                type="text"
                placeholder="Qidiruv..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="font-semibold !text-[30px] "
                  aria-label="Clear search"
                >
                  <RxCross2 />
                </button>
              )}
            </div>
          </label>
        </div>

        <div className="grid mt-7 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-lg flex flex-col p-1 h-full"
              >
                <div className="relative product-image-wrapper">
                  <img
                    loading="lazy"
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-1 rounded-b-none rounded-lg"
                  />
                </div>
                <div className="p-2 pt-1">
                  <h3 className=" text-[15px] md:text-xl font-bold mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 mb-1">
                    {product.description}
                  </p>
                  <div className=" flex -mt-2 justify-between w-full items-end">
                    <p className="text-sm font-semibold flex flex-col text-[#ff8716] mb-1">
                      <span className=" text-lg leading-[10px]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-base">сум</span>
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      className={`font-semibold rounded-full border w-14 h-14 shadow-xl text-xs sm:text-sm ${
                        isInCart(product) ? "text-[#ff9838]" : ""
                      } p-2 !text-[26px]`}
                    >
                      {isInCart(product) ? (
                        <i className="fi fi-rr-bag-shopping-minus"></i>
                      ) : (
                        <i class="fi fi-rr-shopping-bag-add"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : searchTerm ? (
            <p className="text-center !text-[18px] col-span-full text-gray-500">
              Hech qanday mahsulot topilmadi
            </p>
          ) : (
            <p className="text-center !text-[18px] col-span-full text-gray-500">
              Qidirish uchun kerakli mahsulot nomini kiriting!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
