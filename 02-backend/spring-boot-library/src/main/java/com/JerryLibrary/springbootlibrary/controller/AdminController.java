package com.JerryLibrary.springbootlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.JerryLibrary.springbootlibrary.requestmodels.AddBookRequest;
import com.JerryLibrary.springbootlibrary.service.AdminService;
import com.JerryLibrary.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // Autowired AdminService to access the methods
    private AdminService adminService;

    // Autowired AdminController constructor
    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Mapping for the increase book quantity endpoint
    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value="Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        // Extract the admin from the token
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        // Check if the admin is an admin
        if (admin == null ||!admin.equals("admin")) {
            // Throw an exception if the admin is not an admin
            throw new Exception("Administration page only");
        }
        // Call the increaseBookQuantity method in the AdminService
        adminService.increaseBookQuantity(bookId);
    }

    // Mapping for the decrease book quantity endpoint
    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value="Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        // Extract the admin from the token
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        // Check if the admin is an admin
        if (admin == null ||!admin.equals("admin")) {
            // Throw an exception if the admin is not an admin
            throw new Exception("Administration page only");
        }
        // Call the decreaseBookQuantity method in the AdminService
        adminService.decreaseBookQuantity(bookId);
    }

    // Mapping for the add book endpoint
    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value="Authorization") String token,
                         @RequestBody AddBookRequest addBookRequest) throws Exception {
        // Extract the admin from the token
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        // Check if the admin is an admin
        if (admin == null ||!admin.equals("admin")) {
            // Throw an exception if the admin is not an admin
            throw new Exception("Administration page only");
        }
        // Call the postBook method in the AdminService
        adminService.postBook(addBookRequest);
    }

    // Mapping for the delete book endpoint
    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value="Authorization") String token,
                           @RequestParam Long bookId) throws Exception {
        // Extract the admin from the token
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        // Check if the admin is an admin
        if (admin == null ||!admin.equals("admin")) {
            // Throw an exception if the admin is not an admin
            throw new Exception("Administration page only");
        }
        // Call the deleteBook method in the AdminService
        adminService.deleteBook(bookId);
    }

}