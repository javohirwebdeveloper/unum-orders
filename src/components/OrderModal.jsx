import React, { useState } from 'react';

const OrderModal = ({ setIsOrderOpen, product, addToCart }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1); // Initialize quantity to 1

  // Ensure product.price is a number
  const price = Number(product.price);
  const totalPrice = quantity * price; // Calculate total price

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

const handleSubmit = () => {
  console.log('Buyurtma tafsilotlari:', { name, phone, address, quantity });
  
  if (name && phone && address) {
    const orderDetails = {
      product: product.name,
      quantity,
      name,
      phone,
      address,
      totalPrice,
    };

    addToCart(orderDetails);

    console.log('Telegramga yuborilayotgan xabar:', `Yangi buyurtma:\nMahsulot: ${orderDetails.product}\nSoni: ${orderDetails.quantity}\nJami narx: ${orderDetails.totalPrice} so'm\nIsm: ${orderDetails.name}\nTelefon: ${orderDetails.phone}\nManzil: ${orderDetails.address}`);

    fetch('https://api.telegram.org/bot7906494098:AAFTFJoh2dZtlYMJcQBpOyJQzHj-r0Q-ENc/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: '-1002428276481',
        text: `Yangi buyurtma:\nMahsulot: ${orderDetails.product}\nSoni: ${orderDetails.quantity}\nJami narx: ${orderDetails.totalPrice} so'm\nIsm: ${orderDetails.name}\nTelefon: ${orderDetails.phone}\nManzil: ${orderDetails.address}`,
      }),
    })
      .then((response) => {
        console.log('Response:', response);
        if (response.ok) {
          alert('Buyurtma yuborildi!');
          setIsOrderOpen(false);
        } else {
          alert('Buyurtma yuborishda xatolik yuz berdi.');
        }
      })
      .catch((error) => {
        console.error('Xatolik:', error);
        alert('Buyurtma yuborishda xatolik yuz berdi.');
      });
  } else {
    alert('Iltimos, barcha maydonlarni to\'ldiring.');
  }
};



  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Buyurtma berish</h2>
        <p className="mb-4">Mahsulot: <strong>{product.name}</strong></p>
        <p className="mb-4">Jami narx: <strong>{totalPrice} so'm</strong></p>

        {/* Quantity controls */}
        <div className="flex items-center mb-4">
          <button onClick={handleDecrement} className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">-</button>
          <span className="text-lg">{quantity}</span>
          <button onClick={handleIncrement} className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2">+</button>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Ism</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ismingizni kiriting"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Telefon</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Telefon raqamingizni kiriting"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Manzil</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Manzilingizni kiriting"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsOrderOpen(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Buyurtma berish
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
