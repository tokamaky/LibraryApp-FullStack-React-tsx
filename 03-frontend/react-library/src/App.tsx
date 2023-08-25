import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Homepage } from './layouts/Homepage/Homepage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch } from 'react-router';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';

export const App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <div className='clex-grow-1'>
      <Navbar />
      <Switch>
        <Route path='/' exact>
        <Redirect to='/home' />
        </Route>
        <Route path='/home'>
          <Homepage />
        </Route>
        <Route path='/search'>
          <SearchBooksPage />
        </Route>
        <Route path='/checkout/:bookId'>
          <BookCheckoutPage />
        </Route>
      </Switch>
      </div>
      <Footer />
    </div>

  );
}

