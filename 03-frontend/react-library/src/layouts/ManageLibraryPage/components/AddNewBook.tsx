import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import AddBookRequest from '../../../models/AddBookRequest';

export const AddNewBook = () => {

    const { authState } = useOktaAuth();

    // New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        // Set the category to the value passed in
        setCategory(value);
    }

    // Function to convert images to base64
    async function base64ConversionForImages(e: any) {
        // Check if the file is an image
        if (e.target.files[0]) {
            // Get the base64 of the image
            getBase64(e.target.files[0]);
        }
    }

    // Function to get the base64 of an image
    function getBase64(file: any) {
        // Create a new file reader
        let reader = new FileReader();
        // Read the image as a data URL
        reader.readAsDataURL(file);
        // Set the onload event of the reader to a function that sets the selected image
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        // Set the onerror event of the reader to a function that logs an error
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }
    async function submitNewBook() {
        // Get the URL of the API endpoint
        const url = `http://localhost:8080/api/admin/secure/add/book`;
        // Check if the user is authenticated and if the title, author, category, description, and copies are not empty
        if (authState?.isAuthenticated && title!== '' && author!== '' && category!== 'Category' 
            && description!== '' && copies >= 0) {
                // Create a new book object with the given parameters
                const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
                // Set the image of the book to the selected image
                book.img = selectedImage;
                // Create an object to store the request options
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(book)
                };

                // Make a POST request to the API endpoint
                const submitNewBookResponse = await fetch(url, requestOptions);
                // Check if the response is not ok
                if (!submitNewBookResponse.ok) {
                    // Throw an error if the response is not ok
                    throw new Error('Something went wrong!');
                }
                // Reset the title, author, description, copies, category, and selected image
                setTitle('');
                setAuthor('');
                setDescription('');
                setCopies(0);
                setCategory('Category');
                setSelectedImage(null);
                // Set the display warning to false and display success to true
                setDisplayWarning(false);
                setDisplaySuccess(true);
            } else {
                // Set the display warning to true and display success to false
                setDisplayWarning(true);
                setDisplaySuccess(false);
            }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess && 
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {displayWarning && 
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new book
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' name='title' required 
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Author </label>
                                <input type="text" className='form-control' name='author' required 
                                    onChange={e => setAuthor(e.target.value)} value={author}/>
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button' 
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                        {category}
                                </button>
                                <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('FE')} className='dropdown-item'>Front End</a></li>
                                    <li><a onClick={() => categoryField('BE')} className='dropdown-item'>Back End</a></li>
                                    <li><a onClick={() => categoryField('Data')} className='dropdown-item'>Data</a></li>
                                    <li><a onClick={() => categoryField('DevOps')} className='dropdown-item'>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3} 
                                onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' name='Copies' required 
                                onChange={e => setCopies(Number(e.target.value))} value={copies}/>
                        </div>
                        <input type='file' onChange={e => base64ConversionForImages(e)}/>
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}