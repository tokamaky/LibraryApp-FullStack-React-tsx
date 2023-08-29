package com.JerryLibrary.springbootlibrary.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.JerryLibrary.springbootlibrary.entity.Checkout;

public  interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);
    
}
