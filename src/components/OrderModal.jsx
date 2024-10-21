import React, { useState } from "react";
import { db } from "../firebase"; // Firebase konfiguratsiyasi
import { collection, addDoc } from "firebase/firestore";

const OrderModal = ({ setIsOrderOpen, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    try {
      const orderId = `order_${Date.now()}`; // Yangi order ID yaratish
      const orderData = {
        id: orderId,
        productName: product.name,
        quantity: quantity,
        totalPrice: product.price * quantity,
        user: {
          name: name,
          phone: phone,
          address: address,
        },
        status: "pending",
        createdAt: new Date(),
      };

      // Firestore'ga buyurtmani qo'shish
      await addDoc(collection(db, "orders"), orderData);

      // LocalStorage'ga buyurtma ID sini saqlash
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      existingOrders.push(orderId); // Yangi order ID ni qo'shish
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      alert("Buyurtma muvaffaqiyatli joylandi!");
      setIsOrderOpen(false);
    } catch (error) {
      console.error("Buyurtma joylashda xato: ", error);
      alert("Buyurtma joylashda xato!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-3/4">
        <button
          onClick={() => setIsOrderOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Yopish
        </button>
        <h2 className="text-xl mt-4">Buyurtma berish</h2>
        <p className="mt-2">Mahsulot: {product.name}</p>

        <input
          type="text"
          placeholder="Ism va familiya"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border my-2 rounded-lg"
        />
        <input
          type="tel"
          placeholder="Mobil raqam"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border my-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Manzil"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border my-2 rounded-lg"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-2 border my-4 rounded-lg"
          min="1"
        />
        <button
          onClick={handleOrder}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Buyurtma berish"}
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
