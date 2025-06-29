// src/components/Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Peri – Period Tracker</p>
    </footer>
  );
}

export default Footer;
