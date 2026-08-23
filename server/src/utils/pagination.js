// Calculates pagination values for database queries

const getPagination = (page = 1, limit = 10) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const itemsPerPage = Math.max(Number(limit) || 10, 1);
    const offset = (currentPage - 1) * itemsPerPage;

    return {
        page: currentPage,
        limit: itemsPerPage,
        offset,
    };
};

module.exports = {
    getPagination,
};