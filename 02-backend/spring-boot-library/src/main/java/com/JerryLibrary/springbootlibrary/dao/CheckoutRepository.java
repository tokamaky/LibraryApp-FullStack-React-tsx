package com.JerryLibrary.springbootlibrary.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.JerryLibrary.springbootlibrary.entity.Checkout;
import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    //Finds a checkout by user email and book id
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    //Finds all checkouts by user email
    List<Checkout> findBooksByUserEmail(String userEmail);

    //Deletes all checkouts by book id
    @Modifying
    @Query("delete from Checkout where book_id in :book_id")
    void deleteAllByBookId(@Param("book_id") Long bookId);
}
