package com.JerryLibrary.springbootlibrary.service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import net.bytebuddy.asm.Advice;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.JerryLibrary.springbootlibrary.dao.BookRepository;
import com.JerryLibrary.springbootlibrary.dao.CheckoutRepository;
import com.JerryLibrary.springbootlibrary.dao.HistoryRepository;
import com.JerryLibrary.springbootlibrary.dao.PaymentRepository;
import com.JerryLibrary.springbootlibrary.entity.Book;
import com.JerryLibrary.springbootlibrary.entity.Checkout;
import com.JerryLibrary.springbootlibrary.entity.History;
import com.JerryLibrary.springbootlibrary.entity.Payment;
import com.JerryLibrary.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;

    private CheckoutRepository checkoutRepository;

    private HistoryRepository historyRepository;

    private PaymentRepository paymentRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,
            HistoryRepository historyRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook (String userEmail, Long bookId) throws Exception {

        // Find the book by its ID
        Optional<Book> book = bookRepository.findById(bookId);

        // Check if the book exists
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        // Check if the book is already checked out by the user
        if (!book.isPresent() || validateCheckout!= null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checked out by user");
        }

        // Find all the books checked out by the user
        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);

        // Create a SimpleDateFormat object to parse the return date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // Set a boolean to determine if the book needs to be returned
        boolean bookNeedsReturned = false;

        // Iterate through the list of books checked out by the user
        for (Checkout checkout: currentBooksCheckedOut) {
            // Parse the return date of the book
            Date d1 = sdf.parse(checkout.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            // Calculate the difference in time between the two dates
            TimeUnit time = TimeUnit.DAYS;

            double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

            // Check if the difference in time is less than 0
            if (differenceInTime < 0) {
                bookNeedsReturned = true;
                break;
            }
        }

        // Find the user's payment
        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        // Check if the user has any outstanding fees
        if ((userPayment!= null && userPayment.getAmount() > 0) || (userPayment!= null && bookNeedsReturned)) {
            throw new Exception("Outstanding fees");
        }

        // Check if the user has a payment
        if (userPayment == null) {
            // Create a new payment
            Payment payment = new Payment();
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }

        // Decrement the number of copies available of the book
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        // Create a new checkout
        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        // Save the checkout
        checkoutRepository.save(checkout);

        // Return the book
        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        // Find the checkout by the user's email and book ID
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        // Check if the checkout exists
        if (validateCheckout!= null) {
            return true;
        } else {
            return false;
        }
    }
    public int currentLoansCount(String userEmail) {
        // Get the number of books in the user's shelf
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        // Create an empty list to store the response objects
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        // Get the list of books from the user's shelf
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        // Create a list of book ids
        for (Checkout i: checkoutList) {
            bookIdList.add(i.getBookId());
        }

        // Get the list of books from the database
        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        // Create a SimpleDateFormat object to parse the return date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // Create a list of books
        for (Book book : books) {
            // Get the checkout object for the current book
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getBookId() == book.getId()).findFirst();

            // If the checkout object is present
            if (checkout.isPresent()) {

                // Parse the return date
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                // Calculate the difference in time
                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(),
                        TimeUnit.MILLISECONDS);

                // Add the response object to the list
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
            }
        }
        // Return the list of response objects
        return shelfCurrentLoansResponses;
    }
    public void returnBook (String userEmail, Long bookId) throws Exception {

        //Find the book by its ID
        Optional<Book> book = bookRepository.findById(bookId);

        //Find the checkout by the user email and book ID
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        //Check if the book is present or not
        if (!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        //Update the number of copies available
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        //Save the book
        bookRepository.save(book.get());

        //Create a SimpleDateFormat object
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        //Parse the return date and current date
        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        //Calculate the difference in time
        TimeUnit time = TimeUnit.DAYS;

        //Calculate the difference in time
        double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        //Check if the difference in time is less than 0
        if (differenceInTime < 0) {
            //Find the payment by the user email
            Payment payment = paymentRepository.findByUserEmail(userEmail);

            //Update the amount of the payment
            payment.setAmount(payment.getAmount() + (differenceInTime * -1));
            //Save the payment
            paymentRepository.save(payment);
        }

        //Delete the checkout
        checkoutRepository.deleteById(validateCheckout.getId());

        //Create a new history object
        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()
        );

        //Save the history
        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {

        //Find the checkout by the user email and book ID
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        //Check if the checkout is present or not
        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        //Create a SimpleDateFormat object
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        //Parse the return date and current date
        Date d1 = sdFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        //Check if the return date is greater than the current date
        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
            //Update the return date to the next week
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            //Save the checkout
            checkoutRepository.save(validateCheckout);
        }
    }
}