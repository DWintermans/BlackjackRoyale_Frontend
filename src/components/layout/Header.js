import React from 'react';
import './Header.css';

export default function Header() {

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  };

  const isLoggedIn = !!localStorage.getItem('jwt');
  return (
    <div className="header">
      <div className="logo">
      <img src="/images/logo.png" alt="logo" />
      </div>

      {isLoggedIn && (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}
