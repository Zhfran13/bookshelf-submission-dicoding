const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');
// const routes = require('./routes');

const addBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(21);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // Jika request body tidak mengirimkan name
    if (name === undefined) {
        bookshelf.unshift();
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    // Jika request body memiliki nilai readPage > pageCount
    if (readPage > pageCount) {
        bookshelf.unshift();
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    // Jika request body tidak memiliki id buku (generic error)
    if (id === null) {
        bookshelf.unshift();
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan'
        });
        response.code(500);
        return response;
    }

    const addNewBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    bookshelf.push(addNewBook);

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        }
    });
    response.code(201);
    return response;
}

const getAllBook = (request, h) => {
    const { name, reading, finished } = request.query;

    if (reading >= 0 && reading < 1) {
        const bookReadingFalse = bookshelf.filter((bookshelfIndex) => { return bookshelfIndex.reading === false });

        const generalInfoBook = bookReadingFalse.map((bookshelfIndexObject) => {
            const { id, name, publisher } = bookshelfIndexObject;
            return { id, name, publisher };
        });

        const response = h.response({
            status: 'success',
            data: {
                books: generalInfoBook
            }
        });
        response.code(200);
        return response;
    } else if (reading >= 1 && reading < 2) {
        const bookReadingTrue = bookshelf.filter((bookshelfIndex) => { return bookshelfIndex.reading === true });

        const generalInfoBook = bookReadingTrue.map((bookshelfIndexObject) => {
            const { id, name, publisher } = bookshelfIndexObject;
            return { id, name, publisher };
        });

        const response = h.response({
            status: 'success',
            data: {
                books: generalInfoBook
            }
        });
        response.code(200);
        return response;
    };

    if (finished >= 0 && finished < 1) {
        const bookFinishedFalse = bookshelf.filter((bookshelfIndex) => { return bookshelfIndex.finished === false });

        const generalInfoBook = bookFinishedFalse.map((bookshelfIndexObject) => {
            const { id, name, publisher } = bookshelfIndexObject;
            return { id, name, publisher };
        });

        const response = h.response({
            status: 'success',
            data: {
                books: generalInfoBook
            }
        });
        response.code(200);
        return response;
    } else if (finished >= 1 && finished < 2) {
        const bookFinishedTrue = bookshelf.filter((bookshelfIndex) => { return bookshelfIndex.finished === true });

        const generalInfoBook = bookFinishedTrue.map((bookshelfIndexObject) => {
            const { id, name, publisher } = bookshelfIndexObject;
            return { id, name, publisher };
        });

        const response = h.response({
            status: 'success',
            data: {
                books: generalInfoBook
            }
        });
        response.code(200);
        return response;
    };

    if (name !== undefined) {
        const specifiedBook = bookshelf.filter((bookshelfIndex) => { return bookshelfIndex.name.toLowerCase().includes(name.toLowerCase()) });

        const generalInfoBook = specifiedBook.map((bookshelfIndexObject) => {
            const { id, name, publisher } = bookshelfIndexObject;
            return { id, name, publisher };
        });

        const response = h.response({
            status: 'success',
            data: {
                books: generalInfoBook
            }
        });
        response.code(200);
        return response;
    }

        const generalInfoBook = bookshelf.map((bookshelfIndexObject) => {
            const { id, name, publisher } = bookshelfIndexObject;
            return { id, name, publisher };
        });

        const response = h.response({
            status: 'success',
            data: {
                books: generalInfoBook
            }
        });
        response.code(200);
        return response;
};

const getSpecifiedBook = (request, h) => {
    const { bookId } = request.params;

    const specifiedBook = bookshelf.filter((bookshelfIndex) => { return bookshelfIndex.id === bookId })[0];

    if (specifiedBook !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book: specifiedBook
            }
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editSpecifiedBook = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    };

    const specifiedBookIndex = bookshelf.findIndex((bookshelfIndex) => { return bookshelfIndex.id === bookId });
    if (specifiedBookIndex !== -1) {
        bookshelf[specifiedBookIndex] = {
            ...bookshelf[specifiedBookIndex],
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
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteBook = (request, h) => {
    const { bookId } = request.params;

    const specifiedBook = bookshelf.filter((bookshelfIndex) => { return bookshelfIndex.id === bookId })[0];

    if (specifiedBook !== undefined) {
        const specifiedBookIndex = bookshelf.findIndex((bookshelfIndex) => { return bookshelfIndex.id === bookId });
        bookshelf.splice(specifiedBookIndex, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

module.exports = { addBook, getAllBook, getSpecifiedBook, editSpecifiedBook, deleteBook };