import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`burger-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="line line1"></div>
        <div className="line line2"></div>
        <div className="line line3"></div>
      </div>

      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink exact activeClassName="active" className="nav-link" to="/" onClick={toggleMenu}>Главная</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/add-apartment" activeClassName="active" onClick={toggleMenu}>Добавить недвижимость</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/add-complex" activeClassName="active" onClick={toggleMenu}>Добавить Жилой Комплекс</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/complexes" activeClassName="active" onClick={toggleMenu}>Жилой комплекс</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/apartments" activeClassName="active" onClick={toggleMenu}>Недвижимость</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#" onClick={() => { handleLogout(); toggleMenu(); }}>Выйти</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
