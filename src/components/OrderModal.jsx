import React, { useState } from "react";
import { db } from "../firebase"; // Firebase configuration
import { collection, addDoc } from "firebase/firestore";
import Tick from "../assets/tick.svg";
import { Link } from "react-router-dom";
import CancelImg from "../assets/Cancel.svg";

const OrderModal = ({ setIsOrderOpen, orderDetails, clearCart }) => {
  const [quantities, setQuantities] = useState(orderDetails.map(() => 1));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "", address: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    setErrors({ name: "", phone: "", address: "" });

    // Validate form inputs
    if (!name) {
      setErrors((prev) => ({
        ...prev,
        name: "Ism va familiya kiritilishi shart!",
      }));
      setLoading(false);
      return;
    }
    if (!/^\+?\d{12}$/.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone:
          "Mobil raqam + bilan 12 gacha raqamlardan iborat bo'lishi kerak!",
      }));
      setLoading(false);
      return;
    }
    if (!address) {
      setErrors((prev) => ({ ...prev, address: "Manzil kiritilishi shart!" }));
      setLoading(false);
      return;
    }

    try {
      const orderId = `order_${Date.now()}`;
      const orderData = {
        id: orderId,
        products: orderDetails.map((product, index) => ({
          name: product.name,
          quantity: quantities[index],
          totalPrice: product.price * quantities[index],
        })),
        user: { name, phone, address },
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "orders"), orderData);

      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      existingOrders.push(orderId);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.setItem("orderCustomerName", name);

      // Clear the cart after successful order
      clearCart();

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setIsOrderOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Order placement error: ", error);
      alert("Xato yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1;
    setQuantities(newQuantities);
  };

  const decrementQuantity = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 1) {
      newQuantities[index] -= 1;
    }
    setQuantities(newQuantities);
  };

  const totalAmount = orderDetails.reduce(
    (total, product, index) => total + product.price * quantities[index],
    0
  );

  return (
    <div className="fixed inset-0 z-10 bg-gray-900 bg-opacity-60 flex justify-center items-center px-4">
      <div className="bg-white relative p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => setIsOrderOpen(false)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
        >
          <img src={CancelImg} alt="Cancel" className="w-5" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-4">
          Buyurtma berish
        </h2>

        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-2">Nomi</th>
                <th className="p-2">Soni</th>
                <th className="p-2">Narxi</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((product, index) => (
                <tr key={product.id} className="border-t">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2 flex items-center">
                    <button
                      onClick={() => decrementQuantity(index)}
                      className="px-2 py-1 border rounded-l hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-3">{quantities[index]}</span>
                    <button
                      onClick={() => incrementQuantity(index)}
                      className="px-2 py-1 border rounded-r hover:bg-gray-200"
                    >
                      +
                    </button>
                  </td>
                  <td className="p-2">
                    {product.price * quantities[index]} сум
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td className="p-2">Jami</td>
                <td className="p-2"></td>
                <td className="p-2">{totalAmount} сум</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Ism va familiya"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="tel"
            placeholder="Mobil raqam"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}

          <input
            type="text"
            placeholder="Iltimos aniq uy manzilingizni kiriting!"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        <button
          onClick={handleOrder}
          className={`w-full py-2 rounded-lg text-white ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Buyurtma berish"}
        </button>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-white z-20 flex flex-col justify-center items-center p-4">
          <img src={Tick} alt="" className="w-16 mb-4" />
          <p className="text-green-500 text-xl font-bold mb-2">
            Buyurtma muvaffaqiyatli joylandi!
          </p>
          <p className="text-gray-600 mb-4">Bir kun ichida yetkazib beramiz</p>
          <Link
            to="/"
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
          >
            ORTGA QAYTISH
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderModal;