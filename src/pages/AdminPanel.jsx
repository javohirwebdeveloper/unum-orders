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
import ProductModal from "./Modal"; // Modal componentni import qilamiz

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    likesCount: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const productsCollection = collection(db, "products");
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (editMode && currentId) {
      const productRef = doc(db, "products", currentId);
      await updateDoc(productRef, {
        ...formData,
        price: Number(formData.price),
        likesCount: Number(formData.likesCount),
      });
    } else {
      await addDoc(collection(db, "products"), {
        ...formData,
        price: Number(formData.price),
        likesCount: Number(formData.likesCount),
      });
    }
    fetchProducts();
    resetForm();
    setIsModalOpen(false);
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category || "",
      likesCount: product.likesCount || 0,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    fetchProducts();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      likesCount: 0,
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-2 p-4">
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Mahsulotni qidirish..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditMode(false);
          resetForm();
        }}
        className="bg-blue-600 text-white p-3 rounded-lg mb-6 hover:bg-blue-700 transition"
      >
        Mahsulot Qo'shish
      </button>

      {/* Products list */}
      <h2 className="text-2xl font-semibold mb-4">Mahsulotlar ro'yxati</h2>
      <ul className="space-y-4">
        {filteredProducts.map((product) => (
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

      {/* Modal */}
      {isModalOpen && (
        <ProductModal
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleAddProduct}
          resetForm={resetForm}
          editMode={editMode}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default AdminPanel;
