import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useOktaAuth } from '@okta/okta-react';

export const ChangeQuantityOfBook: React.FC<{ book: BookModel, deleteBook: any }> = (props, key) => {
    
    const { authState } = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        // Set the quantity and remaining values to the book's copies and copies available
        const fetchBookInState = () => {
            props.book.copies? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        };
        // Call the fetchBookInState function when the component is re-rendered
        fetchBookInState();
    }, []);

    // Increase the quantity of the book
    async function increaseQuantity() {
        // Create the URL for the API call
        const url = `http://localhost:8080/api/admin/secure/increase/book/quantity/?bookId=${props.book?.id}`;
        // Create the request options
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        // Make the API call
        const quantityUpdateResponse = await fetch(url, requestOptions);
        // If the API call is not successful, throw an error
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        // Increment the quantity and remaining values
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    // Decrease the quantity of the book
    async function decreaseQuantity() {
        // Create the URL for the API call
        const url = `http://localhost:8080/api/admin/secure/decrease/book/quantity/?bookId=${props.book?.id}`;
        // Create the request options
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        // Make the API call
        const quantityUpdateResponse = await fetch(url, requestOptions);
        // If the API call is not successful, throw an error
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        // Decrement the quantity and remaining values
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    }

    // Delete the book
    async function deleteBook() {
        // Create the URL for the API call
        const url = `http://localhost:8080/api/admin/secure/delete/book/?bookId=${props.book?.id}`;
        // Create the request options
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        // Make the API call
        const updateResponse = await fetch(url, requestOptions);
        // If the API call is not successful, throw an error
        if (!updateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        // Call the deleteBook function
        props.deleteBook();
    }
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.book.img?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                width='123' height='196' alt='Book' />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.book.img?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                width='123' height='196' alt='Book' />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className='card-text'> {props.book.description} </p>
                    </div>
                </div>
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center algin-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteBook}>Delete</button>
                    </div>
                </div>
                <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>Add Quantity</button>
                <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
            </div>
        </div>
    );
}