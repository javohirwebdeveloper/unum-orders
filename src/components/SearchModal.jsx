import React, { useState } from 'react';
import { products } from '../Api'; // mahsulotlar Api.js'dan kelmoqda

const SearchModal = ({ setIsSearchOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-3/4">
        <button onClick={() => setIsSearchOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">Yopish</button>
        <input
          type="text"
          placeholder="Qidiruv..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border my-4 rounded-lg"
        />
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      </div>
    </div></>
  );
};

export default SearchModal;
