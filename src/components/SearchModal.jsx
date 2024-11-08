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
 const formatPrice = (price) => {
   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
 };
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
                 <h3 className="text-lg md:text-xl font-bold mb-2">
                   {product.name}
                 </h3>
                 <p className="text-sm md:text-base text-gray-700 mb-1">
                   {product.description}
                 </p>
                 <div className=" flex justify-between w-full items-end">
                   <p className="text-sm font-semibold text-[#ff8716] mb-1">
                     {formatPrice(product.price)} сум
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
