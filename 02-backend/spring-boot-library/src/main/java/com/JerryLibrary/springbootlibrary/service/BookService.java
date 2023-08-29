package com.JerryLibrary.springbootlibrary.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.JerryLibrary.springbootlibrary.dao.BookRepository;
import com.JerryLibrary.springbootlibrary.dao.CheckoutRepository;
import com.JerryLibrary.springbootlibrary.entity.Book;
import com.JerryLibrary.springbootlibrary.entity.Checkout;

@Service
@Transactional
public class BookService {
    
    private BookRepository bookRepository;

    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository){

        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;

    }

    public Book checkoutBook ( String userEmail, Long bookId) throws Exception {
        
        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <=0){
            throw new Exception("Book doesn't exist or already checked out by user");
        }
    }

}

























