class AddBookRequest {
    // The title of the book
    title: string;
    // The author of the book
    author: string;
    // The description of the book
    description: string;
    // The number of copies of the book
    copies: number;
    // The category of the book
    category: string;
    // An optional image URL
    img?: string;

    constructor(title: string, author: string, description: string, copies: number, 
        category: string) {
            this.title = title;
            this.author = author;
            this.description = description;
            this.copies = copies;
            this.category = category;
        }
}

export default AddBookRequest;