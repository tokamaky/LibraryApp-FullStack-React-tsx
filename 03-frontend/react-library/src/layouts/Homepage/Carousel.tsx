export const Carousel = () => {
    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="homepafe-carousel-title">
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div id='carouselExampleControls' className="carousel carousel-dark slide mt-5 d-done
            d-lg-block" data-bs-interval='false'>

                {/* Desktop*/}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
                                <div className="text-center">
                                    <img src={require('./../../Images/BooksImages/book-luv2code-1000.png') } 
                                    width='151'
                                    height='233'
                                    alt='book'/>
                                    <h6 className="mt-2">Book</h6>
                                    <p></p>
                                </div>
                            </div>
                            {/* {books.slice(0, 3).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))} */}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {/* {books.slice(3, 6).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))} */}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {/* {books.slice(6, 9).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))} */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}