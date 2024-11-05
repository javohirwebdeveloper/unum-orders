import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const OrdersPage = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    region: "",
    address: "",
  });
  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const storedOrders = localStorage.getItem("orders");
      const orderIds = storedOrders ? storedOrders.split(",") : [];

      if (orderIds.length === 0) return;

      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("id", "in", orderIds));

      const orderDocs = await getDocs(q);
      const orders = orderDocs.docs.flatMap((doc) =>
        doc.data().products.map((product) => ({
          orderId: doc.id,
          status: doc.data().status,
          ...product,
          userName: doc.data().user.name,
          userPhone: doc.data().user.phone,
          userRegion: doc.data().user.region,
          userAddress: doc.data().user.address,
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
        await deleteDoc(orderDocRef);

        // Update userOrders state and remove order from localStorage
        const storedOrders = localStorage.getItem("orders");
        const orderIds = storedOrders ? storedOrders.split(",") : [];
        const filteredOrderIds = orderIds.filter(
          (id) => id !== selectedOrder.orderId
        );
        localStorage.setItem("orders", filteredOrderIds.join(","));

        setUserOrders((prevOrders) =>
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

  const handleEditUserDetails = (order) => {
    setUserDetails({
      name: order.userName,
      phone: order.userPhone,
      region: order.userRegion,
      address: order.userAddress,
    });
    setProductQuantity(order.quantity);
    setIsEditModalOpen(true);
    setSelectedOrder(order);
  };

  const saveUserDetails = async () => {
    try {
      const orderDocRef = doc(db, "orders", selectedOrder.orderId);
      await updateDoc(orderDocRef, {
        userName: userDetails.name,
        userPhone: userDetails.phone,
        userRegion: userDetails.region,
        userAddress: userDetails.address,
        quantity: productQuantity,
      });

      setUserOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === selectedOrder.orderId
            ? {
                ...order,
                userName: userDetails.name,
                userPhone: userDetails.phone,
                userRegion: userDetails.region,
                userAddress: userDetails.address,
                quantity: productQuantity,
              }
            : order
        )
      );
      setIsEditModalOpen(false);
      setUserDetails({ name: "", phone: "", region: "", address: "" });
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Error updating user details.");
    }
  };
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-center mb-8">Buyurtmalarim</h2>
      {userOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userOrders.map((order, index) => (
            <div
              key={`${order.orderId}-${index}`}
              className="bg-gray-50 shadow-md rounded-lg overflow-hidden p-4 flex flex-col justify-between transition-transform hover:scale-105 border-l-4 border-blue-500"
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
                  {order.name}
                </p>
                <p className="text-gray-600">Soni: {order.quantity}</p>
                <p className="text-gray-600">
                  Narx: {formatPrice(order.totalPrice)} сум
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditUserDetails(order)}
                  className="text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-100 transition"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleCancelOrder(order)}
                  className="text-red-600 border border-red-600 rounded-md px-4 py-2 hover:bg-red-100 transition"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Buyurtmalar topilmadi!</p>
      )}

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

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-gray-700">Mahsulot Soni:</label>
              <div className="flex items-center">
                <button
                  onClick={() =>
                    setProductQuantity(Math.max(1, productQuantity - 1))
                  }
                  className="bg-gray-300 px-3 py-1 rounded-l-md hover:bg-gray-400 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  value={productQuantity}
                  readOnly
                  className="border-t border-b border-gray-300 text-center w-12 py-1"
                />
                <button
                  onClick={() => setProductQuantity(productQuantity + 1)}
                  className="bg-gray-300 px-3 py-1 rounded-r-md hover:bg-gray-400 transition"
                >
                  +
                </button>
              </div>
            </div>{" "}
            <div className="mb-4">
              <label className="block text-gray-700">Ism:</label>
              <input
                type="text"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                className="border rounded px-2 w-full py-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Telefon:</label>
              <input
                type="text"
                value={userDetails.phone}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, phone: e.target.value })
                }
                className="border rounded px-2 w-full py-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Hudud:</label>
              <select
                value={userDetails.region}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, region: e.target.value })
                }
                className="border rounded px-2 w-full py-1"
              >
                <option value="">Select your region</option>
                <option value="chaqmoq">Chaqmoq</option>
                <option value="qizilsharq">Qizilsharq</option>
                <option value="do'stobod">Do'stobod</option>
                <option value="devyatiy">Devyatiy</option>
                <option value="pitletka">Pitletka</option>
                <option value="paxtobod">Paxtobod</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Manzil:</label>
              <input
                type="text"
                value={userDetails.address}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, address: e.target.value })
                }
                className="border rounded px-2 w-full py-1"
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
                onClick={saveUserDetails}
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

export default OrdersPage;
