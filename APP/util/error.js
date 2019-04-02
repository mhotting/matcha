module.exports = (message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    throw error;
}