import React, { useState } from "react";
import $ from "jquery";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import CancelImg from "../assets/Cancel.svg";
import "./OrderModal.css";

const OrderModal = ({ setIsOrderOpen, orderDetails, clearCart }) => {
  const [quantities, setQuantities] = useState(orderDetails.map(() => 1));
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
  });
  const [selectedRegion, setSelectedRegion] = useState("");
  const [locationStatus, setLocationStatus] = useState(
    "Lokatsiyangizni kiriting!"
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const errorMessages = {
    name: "Ism va familiya kiritilishi shart!",
    phone: "Mobil raqam kiritilishi shart!",
    address: "Manzil kiritilishi shart!",
    location: "Hududingizni tanlang!",
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = errorMessages.name;
    if (!/^\+?\d{12}$/.test(formData.phone))
      newErrors.phone = errorMessages.phone;
    if (!formData.address.trim()) newErrors.address = errorMessages.address;
    if (!selectedRegion) newErrors.location = errorMessages.location;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationFetch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setFormData((prev) => ({
            ...prev,
            location: `${latitude}, ${longitude}`,
          }));
          setLocationStatus("Lokatsiya olindi");

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=c0a9c50b92a5406891c1a27ddcabfd3e`
            );
            if (!response.ok) throw new Error("API dan xato");

            const data = await response.json();
            if (data.results.length > 0) {
              setFormData((prev) => ({
                ...prev,
                address: data.results[0].formatted_address,
              }));
            } else {
              alert("Manzil topilmadi!");
            }
          } catch (error) {
            console.error("Geocoding error: ", error);
            alert("Manzil olishda xato: " + error.message);
          }
        },
        (error) => {
          console.error("Lokatsiya olishda xato: ", error);
          alert("Lokatsiya olishda xato: " + error.message);
        },
        { timeout: 10000 }
      );
    } else {
      alert("Brauzeringiz lokatsiya olishni qo'llab-quvvatlamaydi.");
    }
  };

  const handleOrder = async () => {
    setLoading(true);
    setErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const orderId = `order_${Date.now()}`;
      const [latitude, longitude] = formData.location.split(", ").map(Number);
      const orderData = {
        id: orderId,
        products: orderDetails.map((product, index) => ({
          name: product.name,
          quantity: quantities[index],
          totalPrice: product.price * quantities[index],
        })),
        user: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          region: selectedRegion,
          location: { latitude, longitude },
        },
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "orders"), orderData);
      localStorage.setItem(
        "orders",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("orders") || "[]"),
          orderId,
        ])
      );
      clearCart();
      setIsOrderOpen(false); // Modalni yopish
    } catch (error) {
      console.error("Order placement error: ", error);
      alert("Xato yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = (index) => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      newQuantities[index] += 1;
      return newQuantities;
    });
  };

  const decrementQuantity = (index) => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      if (newQuantities[index] > 1) newQuantities[index] -= 1;
      return newQuantities;
    });
  };

  const totalAmount = orderDetails.reduce(
    (total, product, index) => total + product.price * quantities[index],
    0
  );

  return (
    <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-60 flex justify-center items-center px-4">
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
          <label className="block text-gray-700">Hududingizni tanlang:</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.location ? "border-red-500" : ""
            }`}
          >
            <option value="">Hududingizni tanlang</option>
            <option value="chaqmoq">Chaqmoq</option>
            <option value="qizilsharq">Qizilsharq</option>
            <option value="do'stobod">Do'stobod</option>
            <option value="devyatiy">Devyatiy</option>
            <option value="pitletka">Pitletka</option>
            <option value="paxtobod">Paxtobod</option>
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Ism va familiya"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            type="tel"
            placeholder="Mobil raqam"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.phone ? "border-red-500" : ""
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
          <input
            type="text"
            placeholder="Iltimos aniq uy manzilingizni kiriting!"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.address ? "border-red-500" : ""
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
          <button
            onClick={handleLocationFetch}
            className={`w-full py-2 px-4 rounded-lg font-semibold ${
              locationStatus === "Lokatsiya olindi"
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            } mb-4`}
          >
            {locationStatus}
          </button>
        </div>

        <div className="w-full flex justify-center mt-4">
          <button
            className={`order ${loading ? "animate" : ""}`}
            onClick={(e) => {
              if (!loading) {
                handleOrder();
                $(e.currentTarget).addClass("animate");
                setTimeout(() => {
                  $(e.currentTarget).removeClass("animate");
                }, 10000);
              }
            }}
            disabled={loading}
          >
            <span className="default">Buyurtma berish</span>
            <span className="success">
              Buyurtma joylandi
              <svg viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </svg>
            </span>
            <div className="box"></div>
            <div className="truck">
              <div className="back"></div>
              <div className="fronts">
                <div className="window"></div>
              </div>
              <div className="light top"></div>
              <div className="light bottom"></div>
            </div>
            <div className="lines"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
