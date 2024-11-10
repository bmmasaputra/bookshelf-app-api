import { nanoid } from 'nanoid';
import books from './books.js';

const addBooksHandler = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading 
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const setFinished = (readPage, pageCount) => {
        if (readPage == pageCount) return true;
        return false;
    };
    const finished = setFinished(readPage, pageCount)

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        
        response.code(400);
        return response;
    }

    const readPageSmaller = (readPage, pageCount) => {
        if (readPage > pageCount) {
            return false;
        }

        return true;
    };
    
    if (!readPageSmaller(readPage, pageCount)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        response.code(201);
        return response;
    }
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter(b => b.id === id)[0];

    if (book == undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });

        response.code(404);
        return response;
    }

    const response = h.response({
        status: "success",
        data: {
            book,
        },
    });

    response.code(200);
    return response;
}

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        
        response.code(400);
        return response;
    }

    const readPageSmaller = (readPage, pageCount) => {
        if (readPage > pageCount) {
            return false;
        }

        return true;
    };
    
    if (!readPageSmaller(readPage, pageCount)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();

    const book = books.findIndex((index) => index.id === id);

    if (book !== -1) {
        books[book] = {
            ...books[book],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    
    response.code(404);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.findIndex(i => i.id === id);

    if (book !== -1) {
        books.splice(book, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });

    response.code(404);
    return response;
}

const getBooksHandler = (request, h) => {
    const { reading, finished, name } = request.query;
    let filteredBooks = books;

    // Filter by reading status if 'reading' query is provided
    if (typeof reading === 'string') {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }

    // Filter by finished status if 'finished' query is provided
    if (typeof finished === 'string') {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }

    // Filter by name if 'name' query is provided
    if (typeof name === 'string') {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes('dicoding'));
    }

    // Map to the final structure for each book
    const booksData = filteredBooks.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    return h.response({
        status: 'success',
        data: { books: booksData },
    }).code(200);
};

export { 
    addBooksHandler,
    getBooksHandler, 
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};