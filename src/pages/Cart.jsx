import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Firebase konfiguratsiyasi
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const orderIds = JSON.parse(localStorage.getItem("orders")) || [];

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders");
      const ordersQuery = query(ordersCollection, where("id", "in", orderIds));
      const querySnapshot = await getDocs(ordersQuery);
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id, // buyurtma ID sini qo'shamiz
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
    };

    if (orderIds.length > 0) {
      fetchOrders();
    }
  }, [orderIds]);

  const handleCancelOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(orders.filter((order) => order.id !== orderId));
      // Local storage'dan buyurtma ID ni o'chirish
      const updatedOrderIds = orderIds.filter((id) => id !== orderId);
      localStorage.setItem("orders", JSON.stringify(updatedOrderIds));
      alert("Buyurtma bekor qilindi!");
    } catch (error) {
      console.error("Buyurtmani bekor qilishda xato: ", error);
      alert("Buyurtmani bekor qilishda xato!");
    }
  };

  return (
    <div>
      <h2>Savat</h2>
      {orders.length === 0 ? (
        <p>Savatda hech qanday buyurtma yo'q.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.productName} - {order.quantity} ta - {order.totalPrice}{" "}
              so'm
              <button
                onClick={() => handleCancelOrder(order.id)}
                className="bg-red-500 text-white px-2 py-1 rounded ml-4"
              >
                Bekor qilish
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
