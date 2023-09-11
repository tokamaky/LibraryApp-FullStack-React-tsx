import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import AdminMessageRequest from '../../../models/AdminMessageRequest';
import MessageModel from '../../../models/MessageModel';
import { Pagination } from '../../Utils/Pagination';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { AdminMessage } from './AdminMessage';

export const AdminMessages = () => {
    
    const { authState } = useOktaAuth();

    // Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        // Fetch user messages
        const fetchUserMessages = async () => {
            // Check if user is logged in
            if (authState && authState.isAuthenticated) {
                // Create URL for messages
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                // Create request options
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                // Fetch messages
                const messagesResponse = await fetch(url, requestOptions);
                // Check if request was successful
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                // Parse response as JSON
                const messagesResponseJson = await messagesResponse.json();

                // Set messages
                setMessages(messagesResponseJson._embedded.messages);
                // Set total pages
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            // Set isLoadingMessages to false
            setIsLoadingMessages(false);
        }
        // Fetch user messages
        fetchUserMessages().catch((error: any) => {
            // Set isLoadingMessages to false
            setIsLoadingMessages(false);
            // Set httpError
            setHttpError(error.message);
        })
        // Scroll to top
        window.scrollTo(0, 0);
    }, [authState, currentPage, btnSubmit]);

    // If isLoadingMessages is true, return a spinner
    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        );
    }

    // If httpError is true, return a div with a message
    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }


    // Async function to submit response to question
    async function submitResponseToQuestion(id: number, response: string) {
        // Create URL for message
        const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        // Check if user is logged in and if id and response are not null
        if (authState && authState?.isAuthenticated && id!== null && response!== '') {
            // Create message request model
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            // Create request options
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            // Fetch message
            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            // Check if request was successful
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Something went wrong!');
            }
            // Set btnSubmit to false
            setBtnSubmit(!btnSubmit);
        }
    }

    // Function to paginate
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ? 
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}