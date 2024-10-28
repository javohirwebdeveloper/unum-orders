import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import OrderModal from "../components/OrderModal";

const Home = () => {
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
    <div className="px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                {product.name}
              </h3>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-md sm:text-lg font-semibold mb-2 text-[#F08626]">
                {formatPrice(product.price)} сум
              </p>
              <button
                onClick={() => handleOrderClick(product)}
                className="w-full !bg-[#FFF2E7] font-[600] text-[#FFA451] px-4 py-2 rounded-lg"
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
