import React from 'react';
import Firebase from './newCart/firebase';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './newCart/navbar';
import Home from './newCart/Home';
import Login from './newCart/Login';
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signin" element={<Firebase/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
