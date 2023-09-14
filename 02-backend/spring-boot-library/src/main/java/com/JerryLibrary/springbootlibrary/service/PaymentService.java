package com.JerryLibrary.springbootlibrary.service;

import com.JerryLibrary.springbootlibrary.dao.PaymentRepository;
import com.JerryLibrary.springbootlibrary.entity.Payment;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class PaymentService {

    // Dependency injection of the PaymentRepository
    private PaymentRepository paymentRepository;

    // Autowired constructor
    @Autowired
    public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.key.secret}") String secretKey) {
        this.paymentRepository = paymentRepository;
        Stripe.apiKey = secretKey;
    }

    // Method to create a PaymentIntent
    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException {
        // Create a list of payment method types
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        // Create a map of parameters
        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfoRequest.getAmount());
        params.put("currency", paymentInfoRequest.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);

        // Create a PaymentIntent using the Stripe API
        return PaymentIntent.create(params);
    }

    // Method to create a response with a status of OK
    public ResponseEntity<String> stripePayment(String userEmail) throws Exception {
        // Find the payment information for the user
        Payment payment = paymentRepository.findByUserEmail(userEmail);

        // Throw an exception if the payment information is missing
        if (payment == null) {
            throw new Exception("Payment information is missing");
        }
        // Set the amount to 0.00
        payment.setAmount(00.00);
        // Save the payment information
        paymentRepository.save(payment);
        // Return a response with a status of OK
        return new ResponseEntity<>(HttpStatus.OK);
    }


}