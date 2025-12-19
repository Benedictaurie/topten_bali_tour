// src/components/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${className}`}>
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownContent = ({ children, className = '' }) => {
  return (
    <div className={`py-2 ${className}`}>
      {children}
    </div>
  );
};

const DropdownLink = ({ href, children, className = '', ...props }) => {
  return (
    <a
      href={href}
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

Dropdown.Content = DropdownContent;
Dropdown.Link = DropdownLink;

export default Dropdown;