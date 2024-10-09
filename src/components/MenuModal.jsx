import React from 'react';
import { Link } from 'react-router-dom';

const MenuModal = ({ setIsMenuOpen }) => {
  return (
    <>
      <div className="bg-white p-6 h-full top-0 ">
        <ul className="mt-4">
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2">Bosh sahifa</Link>
          </li>
          <li>
            <Link to="/likes" onClick={() => setIsMenuOpen(false)} className="block py-2">Yoqqanlar</Link>
          </li>
          <li>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block py-2">Savat</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MenuModal;
