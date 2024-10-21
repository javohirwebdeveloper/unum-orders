import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase konfiguratsiyangizdan olingan db
import { collection, getDocs } from "firebase/firestore"; // Firestore dan foydalanish

const SearchModal = ({ setIsSearchOpen }) => {
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-3/4">
        <button
          onClick={() => setIsSearchOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Yopish
        </button>
        <input
          type="text"
          placeholder="Qidiruv..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border my-4 rounded-lg"
        />
        <ul>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product.id} className="py-2 border-b">
                {product.name}
              </li>
            ))
          ) : (
            <li className="py-2 text-gray-500">
              Hech qanday mahsulot topilmadi
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchModal;
