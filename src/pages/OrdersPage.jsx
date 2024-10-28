import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const OrdersPage = () => {
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const orderIds = JSON.parse(localStorage.getItem("orders")) || [];
      if (orderIds.length === 0) return;

      // Fetch orders from Firebase that match the saved order IDs
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("id", "in", orderIds));

      const orderDocs = await getDocs(q);
      const orders = orderDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserOrders(orders);
    };

    fetchUserOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {userOrders.length > 0 ? (
        <ul>
          {userOrders.map((order) => (
            <li key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Products:</p>
              <ul>
                {order.products.map((product, idx) => (
                  <li key={idx}>
                    {product.name} - {product.quantity} x {product.totalPrice}{" "}
                    сум
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
