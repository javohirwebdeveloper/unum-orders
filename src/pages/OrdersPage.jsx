import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";

const OrdersPage = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const orderIds = JSON.parse(localStorage.getItem("orders")) || [];
      if (orderIds.length === 0) return;

      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("id", "in", orderIds));

      const orderDocs = await getDocs(q);
      const orders = orderDocs.docs.flatMap((doc) =>
        doc.data().products.map((product) => ({
          orderId: doc.id,
          status: doc.data().status,
          ...product,
        }))
      );
      setUserOrders(orders);
    };

    fetchUserOrders();
  }, []);

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (selectedOrder) {
      try {
        const orderDocRef = doc(db, "orders", selectedOrder.orderId);
        const updatedOrderProducts = userOrders.filter(
          (order) =>
            !(
              order.orderId === selectedOrder.orderId &&
              order.name === selectedOrder.name
            )
        );

        await deleteDoc(orderDocRef);

        setUserOrders(updatedOrderProducts);

        setIsModalOpen(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Buyurtmani o'chirishda xato yuz berdi:", error);
        alert("Buyurtmani bekor qilishda xato yuz berdi.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">My Orders</h2>
      {userOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userOrders.map((order, index) => (
            <div
              key={`${order.orderId}-${index}`}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-4 flex flex-col justify-between transition-transform hover:scale-105"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-semibold text-gray-600">
                  Order ID: {order.orderId}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-center">
                <p className="font-medium text-lg text-gray-800">
                  {order.name}
                </p>
                <p className="text-gray-600">
                  {order.quantity} x {order.totalPrice} сум
                </p>
              </div>
              <button
                onClick={() => handleCancelOrder(order)}
                className="mt-4 text-red-600 border border-red-600 rounded-md px-4 py-2 hover:bg-red-100 transition"
              >
                Buyurtmani bekor qilish
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Hech qanday buyurtma topilmadi.
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <p className="text-center text-lg font-semibold mb-4">
              Bu buyurtmani bekor qilishni istaysizmi?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Yo'q
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
