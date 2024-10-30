import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import OrderModal from "../components/OrderModal";

const Cart = () => {
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

  const clearCart = () => {
    setLocalCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Savat</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Hech qanday mahsulot yo'q.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.price} сум</p>
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
            className="w-full py-2 mt-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Buyurtma berish
          </button>
        </div>
      )}
      {isOrderOpen && (
        <OrderModal
          setIsOrderOpen={setIsOrderOpen}
          orderDetails={orderDetails}
          clearCart={clearCart}
        />
      )}
    </div>
  );
};

export default Cart;
