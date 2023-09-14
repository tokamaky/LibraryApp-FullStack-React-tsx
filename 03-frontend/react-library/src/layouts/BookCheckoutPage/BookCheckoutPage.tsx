import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    // Payment
    const [displayError, setDisplayError] = useState(false);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        // Get the bookId from the URL
        const fetchBook = async () => {
            // Get the base URL from the environment variables
            const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

            // Make a request to the API
            const response = await fetch(baseUrl);

            // Check if the response is not ok
            if (!response.ok) {
                // Throw an error if the response is not ok
                throw new Error('Something went wrong!');
            }

            // Parse the response as JSON
            const responseJson = await response.json();

            // Create a new book object
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

            // Set the book to the component
            setBook(loadedBook);
            // Set the loading state to false
            setIsLoading(false);
        };
        // Call the fetchBook function when the component is mounted
        fetchBook().catch((error: any) => {
            // Set the loading state to false
            setIsLoading(false);
            // Set the http error message to the component
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        // Get the reviewUrl from the environment variables
        const fetchBookReviews = async () => {
            // Get the review URL from the environment variables
            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

            // Make a request to the API
            const responseReviews = await fetch(reviewUrl);

            // Check if the response is not ok
            if (!responseReviews.ok) {
                // Throw an error if the response is not ok
                throw new Error('Something went wrong!');
            }

            // Parse the response as JSON
            const responseJsonReviews = await responseReviews.json();

            // Get the response data
            const responseData = responseJsonReviews._embedded.reviews;

            // Create an empty array to store the reviews
            const loadedReviews: ReviewModel[] = [];

            // Calculate the weighted star reviews
            let weightedStarReviews: number = 0;

            // Iterate through the response data
            for (const key in responseData) {
                // Push a new review object to the array
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                // Add the weighted star reviews to the total
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            // Check if the reviews exist
            if (loadedReviews) {
                // Calculate the round of the weighted star reviews
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                // Set the total stars to the component
                setTotalStars(Number(round));
            }

            // Set the reviews to the component
            setReviews(loadedReviews);
            // Set the loading review state to false
            setIsLoadingReview(false);
        };

        // Call the fetchBookReviews function when the component is mounted
        fetchBookReviews().catch((error: any) => {
            // Set the loading review state to false
            setIsLoadingReview(false);
            // Set the http error message to the component
            setHttpError(error.message);
        })
    }, [isReviewLeft]);

    useEffect(() => {
        // fetch user reviews for the given bookId
        const fetchUserReviewBook = async () => {
            // check if user is authenticated
            if (authState && authState.isAuthenticated) {
                // construct the url for the reviews
                const url = `${process.env.REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
                // set the request options
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                // make the request
                const userReview = await fetch(url, requestOptions);
                // check if the request was successful
                if (!userReview.ok) {
                    // throw an error if not
                    throw new Error('Something went wrong');
                }
                // parse the response as json
                const userReviewResponseJson = await userReview.json();
                // set the isReviewLeft value
                setIsReviewLeft(userReviewResponseJson);
            }
            // set the isLoadingUserReview flag to false
            setIsLoadingUserReview(false);
        }
        // call the fetchUserReviewBook function
        fetchUserReviewBook().catch((error: any) => {
            // set the isLoadingUserReview flag to false
            setIsLoadingUserReview(false);
            // set the httpError value
            setHttpError(error.message);
        })
    }, [authState]);

    // fetch the current loans count for the given bookId
    useEffect(() => {
        // fetch the current loans count for the given bookId
        const fetchUserCurrentLoansCount = async () => {
            // check if user is authenticated
            if (authState && authState.isAuthenticated) {
                // construct the url for the current loans count
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
                // set the request options
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                     }
                };
                // make the request
                const currentLoansCountResponse = await fetch(url, requestOptions);
                // check if the request was successful
                if (!currentLoansCountResponse.ok)  {
                    // throw an error if not
                    throw new Error('Something went wrong!');
                }
                // parse the response as json
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                // set the currentLoansCount value
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            // set the isLoadingCurrentLoansCount flag to false
            setIsLoadingCurrentLoansCount(false);
        }
        // call the fetchUserCurrentLoansCount function
        fetchUserCurrentLoansCount().catch((error: any) => {
            // set the isLoadingCurrentLoansCount flag to false
            setIsLoadingCurrentLoansCount(false);
            // set the httpError value
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    // fetch the book checked out by the given userId
    useEffect(() => {
        // fetch the book checked out by the given userId
        const fetchUserCheckedOutBook = async () => {
            // check if user is authenticated
            if (authState && authState.isAuthenticated) {
                // construct the url for the book checked out by the given userId
                const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);

                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    // If the loading state is true, return a spinner
    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    // If there is an http error, display it
    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    // If the checkout button is clicked, call the checkoutBook function
    async function checkoutBook() {
        // Set the url to the checkoutBook function
        const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
        // Set the request options
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        // Make the request
        const checkoutResponse = await fetch(url, requestOptions);
        // If the response is not ok, throw an error
        if (!checkoutResponse.ok) {
            setDisplayError(true);
            throw new Error('Something went wrong!');
        }
        // Set the displayError to false
        setDisplayError(false);
        // Set the isCheckedOut to true
        setIsCheckedOut(true);
    }

    // If the review button is clicked, call the submitReview function
    async function submitReview(starInput: number, reviewDescription: string) {
        // Set the bookId to 0
        let bookId: number = 0;
        // If the book has an id, set the bookId to the book id
        if (book?.id) {
            bookId = book.id;
        }

        // Create a new ReviewRequestModel with the starInput and bookId and reviewDescription
        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        // Set the url to the submitReview function
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        // Set the request options
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        // Make the request
        const returnResponse = await fetch(url, requestOptions);
        // If the response is not ok, throw an error
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        // Set the isReviewLeft to true
        setIsReviewLeft(true);
    }


    return (
        <div>
            <div className='container d-none d-lg-block'>
                {displayError && <div className='alert alert-danger mt-3' role='alert'>
                    Please pay outstanding fees and/or return late book(s).
                </div>
                }
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                        checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
            {displayError && <div className='alert alert-danger mt-3' role='alert'>
                    Please pay outstanding fees and/or return late book(s).
                </div>
                }
                <div className='d-flex justify-content-center alighn-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                    checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}