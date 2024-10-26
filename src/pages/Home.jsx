import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase config
import { collection, getDocs } from "firebase/firestore"; // Firestore funksiyalari
import OrderModal from "../components/OrderModal";
import SearchImg from "../assets/Search.svg";
import { Helmet } from "react-helmet";
import Modal from "react-modal"; // Modal kutubxonasini o'rnating

// Modal uchun uslubiy parametrlar
Modal.setAppElement("#root"); // React ilovangizning ildiz elementini o'rnating

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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

  // Modalni ochish va yopish funksiyalari
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      <div className="px-4">
        <button
          onClick={openSearchModal}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Qidirish
        </button>

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

        {/* Qidirish Modal */}
        <Modal
          isOpen={isSearchModalOpen}
          onRequestClose={closeSearchModal}
          contentLabel="Qidirish Modal"
          className="modal" // Stilni o'zingizga moslashtiring
          overlayClassName="overlay" // Stilni o'zingizga moslashtiring
        >
          <h2>Qidirish</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mahsulotni qidiring..."
            className="border p-2 rounded w-full"
          />
          <button
            onClick={closeSearchModal}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Yopish
          </button>

          {filteredProducts.length > 0 ? (
            <ul className="mt-4">
              {filteredProducts.map((product) => (
                <li key={product.id} className="py-2">
                  {product.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>Natijalar topilmadi.</p>
          )}
        </Modal>

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
