import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ADMIN_PASSWORD = "Javohir";

  const fetchProducts = async () => {
    const productsCollection = collection(db, "products");
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (editMode && currentId) {
      const productRef = doc(db, "products", currentId);
      await updateDoc(productRef, {
        name,
        description,
        price: Number(price),
        image,
        category,
        likesCount: Number(likesCount),
      });
    } else {
      await addDoc(collection(db, "products"), {
        name,
        description,
        price: Number(price),
        image,
        category,
        likesCount: Number(likesCount),
      });
    }
    fetchProducts();
    resetForm();
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setCurrentId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setImage(product.image);
    setCategory(product.category || "");
    setLikesCount(product.likesCount || 0);
  };

  const handleDeleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    fetchProducts();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    setLikesCount(0);
    setEditMode(false);
    setCurrentId(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Noto'g'ri parol");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-800">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-lg w-80"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            Admin Panelga Kirish
          </h2>
          <input
            type="password"
            placeholder="Admin parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition"
          >
            Kirish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Admin Panel
      </h1>
      <NavLink
        to="/viewOrders"
        className="text-blue-600 underline mb-4 block text-center"
      >
        Buyurtmalar
      </NavLink>
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-6 rounded shadow-md mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Mahsulot Qo'shish / Tahrirlash
        </h2>
        <input
          type="text"
          placeholder="Mahsulot nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Mahsulot tavsifi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Narxi"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Rasm URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Toifa"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Likes Count"
          value={likesCount}
          onChange={(e) => setLikesCount(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition"
        >
          {editMode ? "O'zgartirish" : "Qo'shish"}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-red-600 text-white p-2 rounded w-full hover:bg-red-700 transition mt-2"
          >
            Bekor qilish
          </button>
        )}
      </form>

      <h2 className="text-2xl font-semibold mb-4">Mahsulotlar ro'yxati</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center transition-transform hover:shadow-lg"
          >
            <div className="flex items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div>
                <strong className="block text-lg">{product.name}</strong>
                <span className="text-gray-600">{product.description}</span>
                <span className="text-sm text-gray-500">
                  - <em>{product.category}</em>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xl">{product.price} so'm</span>
              <span className="text-gray-600">{product.likesCount} likes</span>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition mx-1"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition mx-1"
                >
                  O'chirish
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
