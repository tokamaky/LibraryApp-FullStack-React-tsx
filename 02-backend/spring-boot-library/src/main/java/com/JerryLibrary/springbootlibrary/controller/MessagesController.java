package com.JerryLibrary.springbootlibrary.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.JerryLibrary.springbootlibrary.entity.Message;
import com.JerryLibrary.springbootlibrary.requestmodels.AdminQuestionRequest;
import com.JerryLibrary.springbootlibrary.service.MessagesService;
import com.JerryLibrary.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessagesController {

    private MessagesService messagesService;

    @Autowired
    public MessagesController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value="Authorization") String token,
                            @RequestBody Message messageRequest) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        messagesService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestHeader(value="Authorization") String token,
                           @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        //Extract the user's email from the token
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        //Extract the user's type from the token
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        //Check if the user is an admin
        if (admin == null ||!admin.equals("admin")) {
            //Throw an exception if the user is not an admin
            throw new Exception("Administration page only.");
        }
        //Call the putMessage method of the messagesService to store the message
        messagesService.putMessage(adminQuestionRequest, userEmail);
    }
}