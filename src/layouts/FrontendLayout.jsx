// src/layouts/FrontendLayout.jsx
import React, {useState} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
import Dropdown from '../components/global/Dropdown';

export default function FrontendLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk user authentication (sementara)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Fungsi untuk scroll ke section About
  const scrollToAbout = () => {
    if (location.pathname === '/') {
      // Jika sudah di home page, scroll ke section about
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Jika di page lain, redirect ke home page dengan hash
      window.location.href = '/#about';
    }
  };

  // Fungsi untuk scroll ke footer Contact
  const scrollToContact = () => {
    if (location.pathname === '/') {
      // Jika sudah di home page, scroll ke footer
      const footer = document.getElementById('footer-contact');
      if (footer) {
        footer.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Jika di page lain, redirect ke home page
      window.location.href = '/';
      // Tunggu sebentar lalu scroll ke footer
      setTimeout(() => {
        const footer = document.getElementById('footer-contact');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Fungsi untuk login (simulasi)
  // const handleLogin = () => {
  //   navigate('/login');
  // };


  // Fungsi untuk logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  // Fungsi untuk register
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="font-sans text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-9 py-7 shadow-md bg-white fixed w-full top-0 z-50">
        <div className="font-bold text-lg">
          <Link to="/">
            <img
              src="/assets/appimages/logo/Logo[1]-black-transparan.png"
              alt="Logo"
              className="w-30 h-10 mr-2" 
            />
          </Link>
        </div>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="hover:text-blue-500 transition duration-300">Home</Link>
          </li>
          <li>
            {/* About button yang scroll ke section About */}
            <button 
              onClick={scrollToAbout}
              className="hover:text-blue-500 transition duration-300 cursor-pointer"
            >
              About
            </button>
          </li>
          <li>
            <Dropdown trigger={
              <button className="flex items-center hover:text-blue-500 focus:outline-none transition duration-300">
                Services <span className="ml-1">▼</span>
              </button>
            }>
              <Dropdown.Content>
                <Dropdown.Link href="/tour-packages">Paket Tour</Dropdown.Link>
                <Dropdown.Link href="/activity-packages">Activity</Dropdown.Link>
                <Dropdown.Link href="/rental-packages">Rental Mobil/Motor</Dropdown.Link>
              </Dropdown.Content>
            </Dropdown>
          </li>
          <li>
            {/* Contact Us button yang scroll ke footer */}
            <button 
              onClick={scrollToContact}
              className="hover:text-blue-500 transition duration-300 cursor-pointer"
            >
              Contact Us
            </button>
          </li>
        </ul>

        {/* Login Button */}
        {/* <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
              >
              Login
            </button>
          </div>
        </div> */}
      </nav>

      {/* Content dari setiap Page */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer id="footer-contact" className="bg-gray-800 text-white py-12 px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="font-bold text-lg mb-4">TOPTEN BALI TOUR</h3>
            <p className="text-gray-300">
              Your trusted travel partner in Bali. We provide the best tour packages, 
              activities, and rental services to make your Bali experience unforgettable.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FiFacebook className="w-5 h-5 text-gray-400 hover:text-[#2d8bff] transition-colors" />
              </a>
              <a href="https://www.instagram.com/toptenbalitour/" target="_blank" rel="noopener noreferrer">
                <FiInstagram className="w-5 h-5 text-gray-400 hover:text-[#2d8bff] transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FiLinkedin className="w-5 h-5 text-gray-400 hover:text-[#2d8bff] transition-colors" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <FiPhone className="mr-2 w-5 h-5 text-gray-400 hover:text-[#2d8bff] transition-colors" />
                +62 819-9978-0700
              </p>
              <p className="flex items-center">
                <FiMail className="mr-2 w-5 h-5 text-gray-400 hover:text-[#2d8bff] transition-colors" />
                topten@gmail.com
              </p>
              <p className="flex items-center">
                <FiMapPin className="mr-2 w-5 h-5 text-gray-400 hover:text-[#2d8bff] transition-colors" />
                Denpasar, Bali, Indonesia
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Gallery</h3>
            <div className="flex space-x-4">
              <div className="bg-gray-600 w-20 h-16 flex items-center justify-center rounded-lg text-gray-300">
                PIC 1
              </div>
              <div className="bg-gray-600 w-20 h-16 flex items-center justify-center rounded-lg text-gray-300">
                PIC 2
              </div>
              <div className="bg-gray-600 w-20 h-16 flex items-center justify-center rounded-lg text-gray-300">
                PIC 3
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © 2025 TOPTEN BALI TOUR. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}