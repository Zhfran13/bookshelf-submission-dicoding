const { handler } = require('@hapi/hapi/lib/cors');
const { response } = require('@hapi/hapi/lib/validation');
const { addBook, getAllBook, getSpecifiedBook, editSpecifiedBook, deleteBook } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBook
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getSpecifiedBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editSpecifiedBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook
    }
];

module.exports = routes;