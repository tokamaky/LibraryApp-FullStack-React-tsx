import { useOktaAuth } from '@okta/okta-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PaymentInfoRequest from '../../models/PaymentInfoRequest';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

export const PaymentPage = () => {
    
    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        // Fetch fees from API
        const fetchFees = async () => {
            // Check if user is authenticated
            if (authState && authState.isAuthenticated) {
                // Construct URL to fetch fees
                const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
                // Create request options
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };
                // Fetch fees from API
                const paymentResponse = await fetch(url, requestOptions);
                // Check if API call was successful
                if (!paymentResponse.ok) {
                    // Throw error
                    throw new Error('Something went wrong!')
                }
                // Parse response as JSON
                const paymentResponseJson = await paymentResponse.json();
                // Set fees to response
                setFees(paymentResponseJson.amount);
                // Set loading fees to false
                setLoadingFees(false);
            }
        }
        // Call fetchFees when component is mounted
        fetchFees().catch((error: any) => {
            // Set loading fees to false
            setLoadingFees(false);
            // Set http error to error message
            setHttpError(error.message);
        })
    }, [authState]);

    // Get elements from useElements hook
    const elements = useElements();
    // Get stripe from useStripe hook
    const stripe = useStripe();

    // Check if stripe or elements are available
    async function checkout() {
        // Check if stripe or elements are available
        if (!stripe ||!elements ||!elements.getElement(CardElement)) {
            // Return if stripe or elements are not available
            return;
        }

        // Set submit disabled to true
        setSubmitDisabled(true);

        // Create payment info request
        let paymentInfo = new PaymentInfoRequest(Math.round(fees * 100), 'USD', authState?.accessToken?.claims.sub);

        // Construct URL to fetch fees
        const url = `https://localhost:8443/api/payment/secure/payment-intent`;
        // Create request options
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentInfo)
        };
        // Fetch fees from API
        const stripeResponse = await fetch(url, requestOptions);
        // Check if API call was successful
        if (!stripeResponse.ok) {
            // Throw error
            setHttpError(true);
            // Set submit disabled to false
            setSubmitDisabled(false);
            // Throw error
            throw new Error('Something went wrong!');
        }
        // Parse response as JSON
        const stripeResponseJson = await stripeResponse.json();

        // Confirm card payment
        stripe.confirmCardPayment(
            stripeResponseJson.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: authState?.accessToken?.claims.sub
                    }
                }
            }, {handleActions: false}
        ).then(async function (result: any) {
            // Check if payment was successful
            if (result.error) {
                // Set submit disabled to false
                setSubmitDisabled(false)
                // Alert
                alert('There was an error')
            } else {
                // Construct URL to fetch fees
                const url = `https://localhost:8443/api/payment/secure/payment-complete`;
                // Create request options
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                // Fetch fees from API
                const stripeResponse = await fetch(url, requestOptions);
                if (!stripeResponse.ok) {
                    setHttpError(true)
                    setSubmitDisabled(false)
                    throw new Error('Something went wrong!')
                }
                setFees(0);
                setSubmitDisabled(false);
            }
        });
        setHttpError(false);
    }

    if (loadingFees) {
        return (
            <SpinnerLoading/>
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
        <div className='container'>
            {fees > 0 && <div className='card mt-3'>
                <h5 className='card-header'>Fees pending: <span className='text-danger'>${fees}</span></h5>
                <div className='card-body'>
                    <h5 className='card-title mb-3'>Credit Card</h5>
                    <CardElement id='card-element' />
                    <button disabled={submitDisabled} type='button' className='btn btn-md main-color text-white mt-3' 
                        onClick={checkout}>
                        Pay fees
                    </button>
                </div>
            </div>}

            {fees === 0 && 
                <div className='mt-3'>
                    <h5>You have no fees!</h5>
                    <Link type='button' className='btn main-color text-white' to='search'>
                        Explore top books
                    </Link>
                </div>
            }
            {submitDisabled && <SpinnerLoading/>}
        </div>
    );
}