import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import OrderModal from "../components/OrderModal";
import { MdDelete } from "react-icons/md";
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
    <div className="p-3 bg-gray-50 ">
      <h2 className="text-3xl font-bold mb-5 text-gray-800">Savat</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Hech qanday mahsulot yo'q.
        </p>
      ) : (
        <div className="space-y-3">
          {cart.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-white p-5 pl-3 pr-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex gap-3">
                <img src={product.image} className="w-10" alt="" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-lg">{product.price} сум</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(product)}
                className="text-red-600 hover:text-red-800 !text-[30px] transition duration-300"
              >
                <i className="fi fi-rr-bag-shopping-minus"></i>
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleOrderClick}
              className="w-full py-3 font-bold text-lg text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Buyurtma berish
            </button>
            <button
              onClick={clearCart}
              className="ml-4 py-[10px] px-3 !text-[30px] text-lg text-white bg-gray-400 rounded-lg hover:bg-gray-500 transition duration-300"
            >
              <MdDelete />
            </button>
          </div>
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
