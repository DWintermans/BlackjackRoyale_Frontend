import React from 'react';
import logo from '../../logo.png';
import './Header.css';

export default function Header() {
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
}
