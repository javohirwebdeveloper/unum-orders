import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase config
import { collection, getDocs } from "firebase/firestore"; // Firestore funksiyalari
import OrderModal from "../components/OrderModal";
import SearchImg from "../assets/Search.svg";
import { Helmet } from "react-helmet";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Mahsulotlar uchun state

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <div className="px-4">
        <div className="mb-4">
          <label>
            <div className="flex gap-4 rounded-2xl shadow-md bg-[#F3F4F9] text-[#86869E] items-center h-12 pl-6">
              <img src={SearchImg} className="h-4 w-4" alt="" />
              <input
                type="text"
                placeholder="Mahsulot qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-none bg-transparent outline-none placeholder-[#86869E] border rounded-lg"
              />
            </div>
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
    </>
  );
};

export default Home;
