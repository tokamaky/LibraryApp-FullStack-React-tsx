package com.JerryLibrary.springbootlibrary.dao;

import com.JerryLibrary.springbootlibrary.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long>{
    
}
