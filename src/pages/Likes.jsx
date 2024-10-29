import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Firebase instance import qiling
import { collection, getDocs, query, where } from "firebase/firestore";

const Likes = () => {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      // LocalStorage’dan saqlangan mahsulot nomlarini oling
      const storedLikes =
        JSON.parse(localStorage.getItem("likedProducts")) || [];

      if (storedLikes.length > 0) {
        try {
          // Firebase’dan mahsulotlarni oling
          const q = query(
            collection(db, "products"),
            where("name", "in", storedLikes)
          );
          const querySnapshot = await getDocs(q);

          // Mahsulotlarni ro'yxatga qo'shing
          const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setLikedProducts(products);
        } catch (error) {
          console.error("Firebase'dan ma'lumot olishda xato:", error);
        }
      }
    };

    fetchLikedProducts();
  }, []);

  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "0";
  };

  const handleAddToCart = (product) => {
    console.log(`${product.name} savatga qo'shildi!`);
  };

  const handleRemoveFromLikes = (productId) => {
    const updatedLikes = likedProducts.filter(
      (product) => product.id !== productId
    );
    setLikedProducts(updatedLikes);
    localStorage.setItem(
      "likedProducts",
      JSON.stringify(updatedLikes.map((product) => product.name))
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Yoqtirgan Mahsulotlaringiz</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {likedProducts.length > 0 ? (
          likedProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h3 className="font-bold mb-1">{product.name}</h3>
              <p className="text-sm">{product.description}</p>
              <p className="text-sm font-semibold text-[#F08626]">
                {formatPrice(product.price)} сум
              </p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                >
                  Savatga qo'shish
                </button>
                <button
                  onClick={() => handleRemoveFromLikes(product.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg"
                >
                  Yoqtirmaslik
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Hech qanday mahsulot yoqtilmadi</p>
        )}
      </div>
    </div>
  );
};

export default Likes;
