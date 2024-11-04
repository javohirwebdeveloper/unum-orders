import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CancelImg from "../assets/Cancel.svg";
import "./ViewOrdersPage.css";

const ViewOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const apiKey = "c0a9c50b92a5406891c1a27ddcabfd3e";

  const regions = ["all", "chaqmoq", "qizilsharq", "do'stobod", "paxtobod"];

  const getAddressFromCoordinates = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Geocoding API so'rovida xato yuz berdi");
    }

    const data = await response.json();
    return data.results.length > 0
      ? data.results[0].formatted_address
      : "Mavjud manzil topilmadi";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = await Promise.all(
        ordersSnapshot.docs.map(async (doc) => {
          const orderData = { id: doc.id, ...doc.data() };
          if (orderData.user.location) {
            const { latitude, longitude } = orderData.user.location;
            try {
              const address = await getAddressFromCoordinates(
                latitude,
                longitude
              );
              return { ...orderData, user: { ...orderData.user, address } };
            } catch (error) {
              console.error("Geocoding error: ", error);
              return {
                ...orderData,
                user: { ...orderData.user, address: "Manzil topilmadi" },
              };
            }
          }
          return orderData;
        })
      );
      setOrders(ordersList);
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderComplete = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, { status: "completed" });
      // Refresh the orders list to reflect the completed status
      fetchOrders();
      alert("Buyurtma bajarildi!");
    } catch (error) {
      console.error("Xato yuz berdi: ", error);
      alert("Buyurtma bajarishda xato!");
    }
  };

  const filteredOrders = orders.filter((order) =>
    selectedRegion === "all" ? true : order.user.region === selectedRegion
  );

  return (
    <div className="orders-page">
      <h1 className="text-3xl font-bold mb-4">Buyurtmalar</h1>
      <div className="mb-4">
        <label className="mr-2">Hudud bo'yicha filtrlash:</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region.charAt(0).toUpperCase() + region.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="order-card transition-transform hover:scale-105 cursor-pointer"
            onClick={() => handleOrderClick(order)}
          >
            <h2 className="font-semibold">{order.user.name}</h2>
            <p className="text-gray-600">
              Jami:{" "}
              {order.products.reduce(
                (total, product) => total + product.totalPrice,
                0
              )}{" "}
              сум
            </p>
            <p className="text-gray-600">Hudud: {order.user.region}</p>
            <p className="text-gray-500">Status: {order.status}</p>
            {order.status !== "completed" && (
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrderComplete(order.id);
                }}
              >
                Bajarildi
              </button>
            )}
          </div>
        ))}
      </div>
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-60 flex justify-center items-center px-4">
          <div className="bg-white relative p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
            >
              <img src={CancelImg} alt="Cancel" className="w-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Buyurtma tafsilotlari
            </h2>
            <div className="order-details">
              <h3 className="font-semibold">Mahsulotlar:</h3>
              <ul>
                {selectedOrder.products.map((product, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{product.name}</span>
                    <span>
                      {product.quantity} x {product.totalPrice} сум
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {selectedOrder.user.location && (
              <div className="map-container mt-4">
                <MapContainer
                  center={[
                    selectedOrder.user.location.latitude,
                    selectedOrder.user.location.longitude,
                  ]}
                  zoom={13}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[
                      selectedOrder.user.location.latitude,
                      selectedOrder.user.location.longitude,
                    ]}
                  >
                    <Popup>{selectedOrder.user.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrdersPage;
