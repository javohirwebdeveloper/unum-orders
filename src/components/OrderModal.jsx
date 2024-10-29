import React, { useState } from "react";
import { db } from "../firebase"; // Firebase configuration
import { collection, addDoc } from "firebase/firestore";
import Tick from "../assets/tick.svg";
import { Link } from "react-router-dom";
import CancelImg from "../assets/Cancel.svg";

const OrderModal = ({ setIsOrderOpen, orderDetails }) => {
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
      // Create a unique order ID
      const orderId = `order_${Date.now()}`;
      const orderData = {
        id: orderId,
        products: orderDetails.map((product, index) => ({
          name: product.name,
          quantity: quantities[index],
          totalPrice: product.price * quantities[index],
        })),
        user: {
          name: name,
          phone: phone,
          address: address,
        },
        status: "pending",
        createdAt: new Date(),
      };

      // Add order to Firebase
      await addDoc(collection(db, "orders"), orderData);

      // Save the order ID and customer name to local storage
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      existingOrders.push(orderId);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.setItem("orderCustomerName", name); // Save the customer name

      // Show success message and close modal after a delay
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
    <div className="fixed inset-0 pb-5 z-10 bg-gray-900 bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white relative p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <button
          onClick={() => setIsOrderOpen(false)}
          className="absolute right-0 top-0"
        >
          <img src={CancelImg} alt="" />
        </button>
        <h2 className="text-xl mt-1 mb-4">Buyurtma berish</h2>

        <table className="w-full mb-4 border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-2 border">Nomi</th>
              <th className="p-2 border">Soni</th>
              <th className="p-2 border">Narxi</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((product, index) => (
              <tr key={product.id}>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border flex justify-between items-center">
                  <button
                    onClick={() => decrementQuantity(index)}
                    className="px-2 py-1 border"
                  >
                    -
                  </button>
                  <span className="px-2">{quantities[index]}</span>
                  <button
                    onClick={() => incrementQuantity(index)}
                    className="px-2 py-1 border"
                  >
                    +
                  </button>
                </td>
                <td className="p-2 border">
                  {product.price * quantities[index]} сум
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="p-2 border">Jami</td>
              <td className="p-2 border"></td>
              <td className="p-2 border">{totalAmount} сум</td>
            </tr>
          </tfoot>
        </table>

        <input
          type="text"
          placeholder="Ism va familiya"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border my-2 rounded-lg"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <input
          type="tel"
          placeholder="Mobil raqam"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border my-2 rounded-lg"
        />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}

        <input
          type="text"
          placeholder="Manzil"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border my-2 rounded-lg"
        />
        {errors.address && <p className="text-red-500">{errors.address}</p>}

        <button
          onClick={handleOrder}
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full mt-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Buyurtma berish"}
        </button>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-white z-20 flex flex-col justify-center items-center">
          <img src={Tick} alt="" className="w-20 mb-4" />
          <p className="text-green-500 text-xl font-bold">
            Buyurtma muvaffaqiyatli joylandi!
          </p>
          <p className="text-gray-600 mb-4">Bir kun ichida yetkazib beramiz</p>
          <Link
            to="/"
            className="bg-[#FFA451] cursor-pointer font-bold text-center w-full py-4 text-white"
          >
            ORTGA QAYTISH
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderModal;
