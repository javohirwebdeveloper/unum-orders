import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../Api';

const ProductDetail = ({ setIsOrderOpen, setOrderDetails }) => {
  const { id } = useParams(); // URL dan mahsulot ID sini olish
  const product = products.find((item) => item.id === Number(id)); // ID ga mos mahsulotni olish
  const [count, setCount] = useState(1);

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const totalPrice = count * product.price;

  const handleOrderClick = () => {
    setOrderDetails({ product, count, totalPrice }); // Buyurtma ma'lumotlarini saqlash
    setIsOrderOpen(true); // Modalni ochish
  };

  return (
    <div className="p-6">
      {product ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <img src={product.image} alt={product.name} className="w-full h-96 object-cover mb-4 rounded-lg" />
          <p className="mb-4">{product.description}</p>
          <p className="text-lg font-semibold mb-2">Narxi: {product.price} so'm</p>
          <div className="flex items-center mb-4">
            <button onClick={handleDecrement} className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">-</button>
            <span className="text-lg">{count}</span>
            <button onClick={handleIncrement} className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2">+</button>
          </div>
          <p className="text-lg font-bold mb-4">Jami narx: {totalPrice} so'm</p>
          <button
            onClick={handleOrderClick} // Modalni ochish
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Buyurtma berish
          </button>
        </>
      ) : (
        <p className="text-red-500">Mahsulot topilmadi!</p>
      )}
    </div>
  );
};

export default ProductDetail;
