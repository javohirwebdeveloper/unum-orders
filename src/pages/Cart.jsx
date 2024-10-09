import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Savat</h1>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <div key={index} className="border p-4 my-2">
            <p>{item.name}</p>
            <p>{item.price} so'm</p>
          </div>
        ))
      ) : (
        <p>Savat bo'sh</p>
      )}
    </div>
  );
};

export default Cart;
