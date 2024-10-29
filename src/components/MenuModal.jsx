import React from 'react';
import { Link } from 'react-router-dom';

const MenuModal = ({ setIsMenuOpen }) => {
  return (
    <>
      <div className="bg-white fixed left-0 z-30 inset-0 p-6 h-full top-0 ">
        <ul className="mt-4">
          <li>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2"
            >
              Bosh sahifa
            </Link>
          </li>

          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MenuModal;
