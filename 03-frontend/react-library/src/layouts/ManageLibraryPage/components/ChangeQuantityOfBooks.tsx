import React from "react";
import { useEffect, useState } from "react";
import BookModel from '../../../models/BookModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Pagination } from '../../Utils/Pagination';
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {
        // Create a fetch request to the API
        const fetchBooks = async () => {
            // Create a base URL for the API
            const baseUrl: string = `${process.env.REACT_APP_API}/books?page=${currentPage - 1}&size=${booksPerPage}`;

            // Make the request to the API
            const response = await fetch(baseUrl);

            // Check if the response is not ok
            if (!response.ok) {
                // Throw an error if the response is not ok
                throw new Error('Something went wrong!');
            }

            // Parse the response as JSON
            const responseJson = await response.json();

            // Get the response data
            const responseData = responseJson._embedded.books;

            // Set the total amount of books
            setTotalAmountOfBooks(responseJson.page.totalElements);
            // Set the total pages
            setTotalPages(responseJson.page.totalPages);

            // Create an array of books
            const loadedBooks: BookModel[] = [];

            // Loop through the response data
            for (const key in responseData) {
                // Push the book data into the array
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            // Set the books
            setBooks(loadedBooks);
            // Set the loading state to false
            setIsLoading(false);
        };
        // Call the fetchBooks function when the component is mounted
        fetchBooks().catch((error: any) => {
            // Set the loading state to false
            setIsLoading(false);
            // Set the http error
            setHttpError(error.message);
        })
    }, [currentPage, bookDelete]);

    // Get the index of the last book
    const indexOfLastBook: number = currentPage * booksPerPage;
    // Get the index of the first book
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    // Get the last item
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks?
        booksPerPage * currentPage : totalAmountOfBooks;

    // Paginate the books
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Delete the book
    const deleteBook = () => setBookDelete(!bookDelete);

    // Check if the loading state is true
    if (isLoading) {
        // Return a spinner
        return (
            <SpinnerLoading/>
        );
    }

    // Check if there is an http error
    if (httpError) {
        // Return an error
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
    return (
        <div className='container mt-5'>
            {totalAmountOfBooks > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountOfBooks})</h3>
                    </div>
                    <p>
                        {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items: 
                    </p>
                    {books.map(book => (
                       <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}/>
                    ))}
                </>
                :
                <h5>Add a book before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}