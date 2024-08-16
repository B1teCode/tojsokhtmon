// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddApartment from './pages/AddApartment';
import AddComplex from './pages/AddComplex';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ComplexTable from './pages/ComplexTable';
import ApartmentTable from './pages/ApartmentTable';
import './App.css';

const App = () => (
  <AuthProvider>
    <Router>
      <ConditionalNavbar />
      <Content />
    </Router>
  </AuthProvider>
);

const ConditionalNavbar = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navbar /> : null;
};

const Content = () => {
  const { currentUser } = useAuth();
  const containerClass = currentUser ? 'container top' : 'container';

  return (
    <div className={containerClass}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-apartment" element={<PrivateRoute><AddApartment /></PrivateRoute>} />
        <Route path="/add-complex" element={<PrivateRoute><AddComplex /></PrivateRoute>} />
        <Route path="/complexes" element={<PrivateRoute><ComplexTable /></PrivateRoute>} />
        <Route path="/apartments" element={<PrivateRoute><ApartmentTable /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Login />;
};

export default App;
