import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const MenuModal = ({ isMenuOpen, setIsMenuOpen }) => {
  const closeModal = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      <div
        className={`${isMenuOpen ? " translate-x-0" : " -translate-x-[120%]"}
            fixed inset-0  bg-black bg-opacity-50 z-30`}
        onClick={closeModal} // Modal tashqarisiga bosganda yopish
      >
        <div
          className={`${isMenuOpen ? " translate-x-0" : " -translate-x-[120%]"}
            bg-white fixed duration-500 left-0 top-0 w-[250px] h-full p-6 z-40`}
          onClick={(e) => e.stopPropagation()} // Modal ichidagi elementlarga bosganda yopilmasligi uchun
        >
          <button
            onClick={closeModal}
            className="fixed top-4 right-4 text-3xl text-gray-600 hover:text-gray-800 transition duration-200"
          >
            <IoMdClose />
          </button>

          <ul className="mt-16">
            <li>
              <Link
                to="/"
                onClick={closeModal}
                className="block py-3 text-lg text-gray-700 hover:text-[#ac7518] transition duration-200"
              >
                Bosh sahifa
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                onClick={closeModal}
                className="block py-3 text-lg text-gray-700 hover:text-[#ac7518] transition duration-200"
              >
                Admin Paneli
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MenuModal;
