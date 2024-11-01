import React, { useState } from "react";
import $ from "jquery"; // jQuery import
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import CancelImg from "../assets/Cancel.svg";
import "./OrderModal.css";

const OrderModal = ({ setIsOrderOpen, orderDetails, clearCart }) => {
  const [quantities, setQuantities] = useState(orderDetails.map(() => 1));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
  });
  const [animate, setAnimate] = useState(false);

  const validateName = (name) => {
    if (!name.trim()) return "Ism va familiya kiritilishi shart!";
    if (name.length < 2)
      return "Ism kamida 2 ta harfdan iborat bo'lishi kerak!";
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?\d{12}$/;
    if (!phone) return "Mobil raqam kiritilishi shart!";
    if (!phoneRegex.test(phone))
      return "Mobil raqam + bilan 12 gacha raqamlardan iborat bo'lishi kerak!";
    return "";
  };

  const validateAddress = (address) => {
    if (!address.trim()) return "Manzil kiritilishi shart!";
    if (address.length < 5)
      return "Manzil kamida 5 ta belgidan iborat bo'lishi kerak!";
    return "";
  };

  const validateLocation = (location) => {
    if (!location) return "Hududingizni tanlang!";
    return "";
  };

  const isFormValid = () => {
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    const addressError = validateAddress(address);
    const locationError = validateLocation(location);

    setErrors({
      name: nameError,
      phone: phoneError,
      address: addressError,
      location: locationError,
    });

    return !nameError && !phoneError && !addressError && !locationError;
  };

  const handleOrder = async () => {
    setLoading(true);
    setErrors({ name: "", phone: "", address: "", location: "" });

    if (!isFormValid()) {
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
        user: { name, phone, address, location },
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "orders"), orderData);

      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      existingOrders.push(orderId);
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.setItem("orderCustomerName", name);

      clearCart();
      setAnimate(true);

      // Wait for 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 9000));

      // Close the modal
      setTimeout(() => {
        setAnimate(false);
        setIsOrderOpen(false);
      }, 0);
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
    if (newQuantities[index] > 1) newQuantities[index] -= 1;
    setQuantities(newQuantities);
  };

  const totalAmount = orderDetails.reduce(
    (total, product, index) => total + product.price * quantities[index],
    0
  );

  return (
    <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-60 flex justify-center items-center px-4">
      <div className="bg-white  relative p-6 rounded-lg shadow-lg w-full max-w-md">
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
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setErrors({
                ...errors,
                location: validateLocation(e.target.value),
              });
            }}
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
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: validateName(e.target.value) });
            }}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="tel"
            placeholder="Mobil raqam"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors({ ...errors, phone: validatePhone(e.target.value) });
            }}
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
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setErrors({
                ...errors,
                address: validateAddress(e.target.value),
              });
            }}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.address ? "border-red-500" : ""
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>
        <div className="w-full flex justify-center">
          {" "}
          <button
            className={`order ${loading ? "animate" : ""}`}
            onClick={(e) => {
              if (!loading && isFormValid()) {
                handleOrder();
                let button = $(e.currentTarget);
                button.addClass("animate");
                setTimeout(() => {
                  button.removeClass("animate");
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
