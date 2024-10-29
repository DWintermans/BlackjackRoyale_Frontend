import React from 'react';
import webSocketService from '../../lib/api/requests/websocketservice';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
    webSocketService.close();
  };

  const isLoggedIn = !!localStorage.getItem('jwt');

  return (
    <div className="header">
      <div className="logo" onClick={() => navigate('/')}>
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
