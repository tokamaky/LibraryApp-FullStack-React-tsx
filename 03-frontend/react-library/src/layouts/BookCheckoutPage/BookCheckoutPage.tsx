import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const BookCheckoutPage = () =>{

    const[book, setBook] = useState<BookModel>();
    const[isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {

            // Define the base URL for the API
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

            // Fetch data from the API
            const response = await fetch(baseUrl);

            // Check if the response is successful (HTTP status 200-299)
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            // Parse the response JSON
            const responseJson = await response.json();



            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };

        //catch the error because using async, if there's any error stop loading and show error message 
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);


    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }
    
    return(
            <div>

            </div>
    )
}