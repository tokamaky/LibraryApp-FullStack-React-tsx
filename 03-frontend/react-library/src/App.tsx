import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Homepage } from './layouts/Homepage/Homepage';

export const  App = () =>{
  return (
    <div>     
        <Navbar />
        <Homepage />
        <Footer />
    </div>

  );
}

