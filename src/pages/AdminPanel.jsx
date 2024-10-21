import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase konfiguratsiyasi
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ADMIN_PASSWORD = "Javohir"; // O'zingizning parolingizni kiriting

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (editMode) {
      const productRef = doc(db, "products", currentId);
      await updateDoc(productRef, {
        name,
        description,
        price: Number(price),
        image,
      });
      setEditMode(false);
    } else {
      await addDoc(collection(db, "products"), {
        name,
        description,
        price: Number(price),
        image,
      });
    }
    resetForm();
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setCurrentId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setImage(product.image);
  };

  const handleDeleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
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
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Admin parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kirish</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Mahsulot nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mahsulot tavsifi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Narxi"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Rasm URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <button type="submit">{editMode ? "O'zgartirish" : "Qo'shish"}</button>
        {editMode && <button onClick={resetForm}>Bekor qilish</button>}
      </form>

      <h2>Mahsulotlar ro'yxati</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "50px" }}
            />
            <strong>{product.name}</strong> - {product.description} -{" "}
            {product.price} so'm
            <button onClick={() => handleEditProduct(product)}>
              Tahrirlash
            </button>
            <button onClick={() => handleDeleteProduct(product.id)}>
              O'chirish
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;