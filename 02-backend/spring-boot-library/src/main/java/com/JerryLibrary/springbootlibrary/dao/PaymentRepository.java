package com.JerryLibrary.springbootlibrary.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.JerryLibrary.springbootlibrary.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByUserEmail(String userEmail);
}