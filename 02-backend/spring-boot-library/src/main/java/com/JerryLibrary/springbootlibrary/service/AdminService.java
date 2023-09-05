package com.JerryLibrary.springbootlibrary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.JerryLibrary.springbootlibrary.dao.BookRepository;
import com.JerryLibrary.springbootlibrary.dao.CheckoutRepository;
import com.JerryLibrary.springbootlibrary.dao.ReviewRepository;
import com.JerryLibrary.springbootlibrary.entity.Book;
import com.JerryLibrary.springbootlibrary.requestmodels.AddBookRequest;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    //Declare a BookRepository, ReviewRepository, and CheckoutRepository
    private BookRepository bookRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;

    //Autowire the BookRepository, ReviewRepository, and CheckoutRepository
    @Autowired
    public AdminService (BookRepository bookRepository,
                         ReviewRepository reviewRepository,
                         CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    //Increase the quantity of a book
    public void increaseBookQuantity(Long bookId) throws Exception {

        //Find the book
        Optional<Book> book = bookRepository.findById(bookId);

        //If the book is not found, throw an exception
        if (!book.isPresent()) {
            throw new Exception("Book not found");
        }

        //Increase the number of copies available
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);

        //Save the book
        bookRepository.save(book.get());
    }

    //Decrease the quantity of a book
    public void decreaseBookQuantity(Long bookId) throws Exception {

        //Find the book
        Optional<Book> book = bookRepository.findById(bookId);

        //If the book is not found or the quantity is locked, throw an exception
        if (!book.isPresent() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0) {
            throw new Exception("Book not found or quantity locked");
        }

        //Decrease the number of copies available
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);

        //Save the book
        bookRepository.save(book.get());
    }

    //Post a book
    public void postBook(AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());
        bookRepository.save(book);
    }

    //Delete a book
    public void deleteBook(Long bookId) throws Exception {

        //Find the book
        Optional<Book> book = bookRepository.findById(bookId);

        //If the book is not found, throw an exception
        if (!book.isPresent()) {
            throw new Exception("Book not found");
        }

        //Delete the book
        bookRepository.delete(book.get());
        //Delete all reviews and checkout records for the book
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }
}