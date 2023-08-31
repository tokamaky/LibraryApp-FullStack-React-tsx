package com.JerryLibrary.springbootlibrary.dao;

import com.JerryLibrary.springbootlibrary.entity.Book;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

public interface BookRepository extends JpaRepository<Book, Long>{

    Page<Book> findByTitleContaining(@Param("title") String title, Pageable pageable);
    
    Page<Book> findByCategory(@Param("category") String category, Pageable pageable);

    @Query("select o from Book o where id in :book_ids")
    
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookId);

}
