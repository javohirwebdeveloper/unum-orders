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

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(""); // Yangi holat uchun kategoriya
  const [likesCount, setLikesCount] = useState(0); // LikesCount uchun yangi holat
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

      try {
        await updateDoc(productRef, {
          name,
          description,
          price: Number(price),
          image,
          category,
          likesCount: Number(likesCount), // likesCount ni yangilash
        });
        fetchProducts(); // Yangilanishdan keyin mahsulotlarni yuklash
      } catch (error) {
        console.error("Mahsulotni yangilashda xatolik:", error);
      }
    } else {
      await addDoc(collection(db, "products"), {
        name,
        description,
        price: Number(price),
        image,
        category,
        likesCount: Number(likesCount), // Yangi mahsulot qo'shishda likesCount ni kiritish
      });
      fetchProducts();
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
    setCategory(product.category || "");
    setLikesCount(product.likesCount || 0); // likesCount ni tahrirlashda olish
  };

  const handleDeleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    fetchProducts(); // O'chirishdan keyin yangilash
  };

  const handleLikeProduct = async (id) => {
    const productRef = doc(db, "products", id);
    const product = products.find((prod) => prod.id === id);

    // likesCount ni 1 ga oshirish
    await updateDoc(productRef, {
      likesCount: product.likesCount + 1,
    });
    fetchProducts(); // Yangilanishdan keyin mahsulotlarni yuklash
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    setLikesCount(0); // Formani qaytadan tozalashda likesCount ni 0 ga qaytarish
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Admin Panelga Kirish
          </h2>
          <input
            type="password"
            placeholder="Admin parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Kirish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-6 rounded shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          Mahsulot Qo'shish / Tahrirlash
        </h2>
        <input
          type="text"
          placeholder="Mahsulot nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />
        <input
          type="text"
          placeholder="Mahsulot tavsifi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />
        <input
          type="number"
          placeholder="Narxi"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />
        <input
          type="text"
          placeholder="Rasm URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />
        <input
          type="text"
          placeholder="Toifa"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />
        <input
          type="number"
          placeholder="Likes Count"
          value={likesCount}
          onChange={(e) => setLikesCount(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          {editMode ? "O'zgartirish" : "Qo'shish"}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-red-500 text-white p-2 rounded w-full hover:bg-red-600 mt-2"
          >
            Bekor qilish
          </button>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-4">Mahsulotlar ro'yxati</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center"
          >
            <div className="flex items-center">
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "50px" }}
                className="mr-4 rounded"
              />
              <div>
                <strong className="block">{product.name}</strong>
                <span>{product.description}</span> - <em>{product.category}</em>
              </div>
            </div>
            <div>
              <span>{product.price} so'm</span> -{" "}
              <span>{product.likesCount} likes</span>
              <div className="ml-4">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 ml-2"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
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
