package com.JerryLibrary.springbootlibrary.controller;

import com.JerryLibrary.springbootlibrary.requestmodels.PaymentInfoRequest;
import com.JerryLibrary.springbootlibrary.service.PaymentService;
import com.JerryLibrary.springbootlibrary.utils.ExtractJWT;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://jerrylibrarybackend.up.railway.app")
@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {

    // Declare a PaymentService instance
    private PaymentService paymentService;

    // Autowired the PaymentService instance
    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create a POST request to the payment-intent endpoint
    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest)
            throws StripeException {

        // Create a PaymentIntent object with the request body
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
        // Convert the PaymentIntent object to a JSON string
        String paymentStr = paymentIntent.toJson();

        // Return a response with the JSON string
        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }

    // Create a PUT request to the payment-complete endpoint
    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(@RequestHeader(value="Authorization") String token)
            throws Exception {
        // Extract the user's email from the token
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        // Throw an exception if the user email is missing
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        // Call the stripePayment method with the user's email
        return paymentService.stripePayment(userEmail);
    }
}