import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import OrderModal from "../components/OrderModal";

const Cart = ({ setCart }) => {
  const [cart, setLocalCart] = useState([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setLocalCart(storedCart);
  }, []);

  const handleRemoveFromCart = (product) => {
    const updatedCart = cart.filter((item) => item.id !== product.id);
    setLocalCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleOrderClick = () => {
    setOrderDetails(cart);
    setIsOrderOpen(true);
  };

  const placeOrder = async () => {
    try {
      // Buyurtma Firebase'ga qo'shish
      const orderRef = await addDoc(collection(db, "orders"), {
        products: cart,
        createdAt: new Date(),
      });

      // Buyurtma nomini localStorage'ga saqlash
      localStorage.setItem("orderName", orderRef.id);

      // Cartni tozalash
      setLocalCart([]);
      localStorage.removeItem("cart");
      setIsOrderOpen(false);
    } catch (error) {
      console.error("Buyurtma joylashda xatolik:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Savat</h2>
      {cart.length === 0 ? (
        <p className="text-center">Hech qanday mahsulot yo'q.</p>
      ) : (
        <div>
          {cart.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p>{product.price} сум</p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(product)}
                className="text-red-500 hover:text-red-700"
              >
                O'chirish
              </button>
            </div>
          ))}
          <button
            onClick={handleOrderClick}
            className="mt-4 bg-[#FFA451] text-white py-2 px-4 rounded"
          >
            Buyurtma berish
          </button>
        </div>
      )}
      {isOrderOpen && (
        <OrderModal
          setIsOrderOpen={setIsOrderOpen}
          orderDetails={orderDetails} // orderDetails to'g'ri uzatilmoqda
        />
      )}
    </div>
  );
};

export default Cart;
