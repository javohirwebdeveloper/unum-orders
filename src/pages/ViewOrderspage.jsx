import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const ViewOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    status: "",
    quantity: 1,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersRef = collection(db, "orders");
      const orderDocs = await getDocs(ordersRef);
      const fetchedOrders = orderDocs.docs.map((doc) => ({
        orderId: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (selectedOrder) {
      try {
        const orderDocRef = doc(db, "orders", selectedOrder.orderId);
        await deleteDoc(orderDocRef);

        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== selectedOrder.orderId)
        );
        setIsModalOpen(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Error canceling order:", error);
        alert("Error canceling order.");
      }
    }
  };

  const handleEditOrderDetails = (order) => {
    setOrderDetails({
      status: order.status,
      quantity: order.quantity,
    });
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const saveOrderDetails = async () => {
    if (selectedOrder) {
      try {
        const orderDocRef = doc(db, "orders", selectedOrder.orderId);
        await updateDoc(orderDocRef, {
          status: orderDetails.status,
          quantity: orderDetails.quantity,
        });

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === selectedOrder.orderId
              ? {
                  ...order,
                  status: orderDetails.status,
                  quantity: orderDetails.quantity,
                }
              : order
          )
        );
        setIsEditModalOpen(false);
        setOrderDetails({ status: "", quantity: 1 });
      } catch (error) {
        console.error("Error updating order details:", error);
        alert("Error updating order details.");
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const formatPrice = (price) => {
    console.log(price); // Debugging the price value
    if (isNaN(price) || price == null) {
      return "N/A";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const calculateTotalPrice = () => {
    return orders.reduce((total, order) => {
      const orderTotal = order.products.reduce(
        (orderTotal, product) => orderTotal + product.totalPrice,
        0
      );
      return total + orderTotal;
    }, 0);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <div
              key={`${order.orderId}-${index}`}
              className="bg-gray-50 shadow-md rounded-lg overflow-hidden p-4 flex flex-col justify-between transition-transform hover:scale-105 border-4 border-blue-500"
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

              <div className="text-center mb-4">
                <p className="font-medium text-lg text-gray-800">
                  {order.user.name}
                </p>
                <p className="font-medium text-lg text-gray-800">
                  {order.user.phone}
                </p>
                <p className="font-medium text-lg text-gray-800">
                  {order.user.region}
                </p>
                <p className="font-medium text-lg text-gray-800">
                  {order.user.address}
                </p>
                <div className="space-y-4">
                  {order.products.map((product, productIndex) => (
                    <div
                      key={`${product.name}-${productIndex}`}
                      className="border-b pb-4"
                    >
                      <p className="text-gray-600">Mahsulot: {product.name}</p>
                      <p className="text-gray-600">Soni: {product.quantity}</p>
                      <p className="text-gray-600">
                        Jami: {formatPrice(product.totalPrice)} сум
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 font-bold">
                    Jami Narx:{" "}
                    {formatPrice(
                      order.products.reduce(
                        (total, product) => total + product.totalPrice,
                        0
                      )
                    )}{" "}
                    сум
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleCancelOrder(order)}
                  className="text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-100 transition"
                >
                  Bajarildi
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Buyurtmalar topilmadi!</p>
      )}

      <div className="fixed top-12 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
        Jami: {formatPrice(calculateTotalPrice())} сум
      </div>

      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">Buyurtma Detallari</h3>
            <p>
              <strong>Buyurtma ID:</strong> {selectedOrder.orderId}
            </p>
            <p>
              <strong>Foydalanuvchi Ismi:</strong> {selectedOrder.userName}
            </p>
            <p>
              <strong>Telefon:</strong> {selectedOrder.userPhone}
            </p>
            <p>
              <strong>Hudud:</strong> {selectedOrder.userRegion}
            </p>
            <p>
              <strong>Manzil:</strong> {selectedOrder.userAddress}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Mahsulotlar:</strong>
            </p>
            <ul>
              {selectedOrder.products.map((product, index) => (
                <li key={index}>
                  <strong>{product.name}</strong> - {product.quantity} ta -{" "}
                  {formatPrice(product.totalPrice)} сум
                </li>
              ))}
            </ul>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Cancel Order */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <p className="text-center text-lg font-semibold mb-4">
              Buyurtmani bekor qilishga ishonchingiz komilmi?
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

      {/* Modal for Edit Order */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <div className="mb-4">
              <label className="block text-gray-700">Status:</label>
              <select
                value={orderDetails.status}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, status: e.target.value })
                }
                className="border rounded px-2 w-full py-1"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mahsulot Soni:</label>
              <input
                type="number"
                value={orderDetails.quantity}
                onChange={(e) =>
                  setOrderDetails({
                    ...orderDetails,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="border rounded px-2 w-full py-1"
                min="1"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Bekor
              </button>
              <button
                onClick={saveOrderDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrdersPage;

