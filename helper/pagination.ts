const paginationHelper = (query: Record<string, any>, tasks: number, limitItem: number = 2) => {
    interface Pagination {
        currentPage: number,
        limitItem: number,
        skip?: number,
        totalPage?: number
    }

    let objectPagination: Pagination = {
        currentPage: 1,
        limitItem: limitItem,
    }

    objectPagination["currentPage"] = parseInt(query.page)

    objectPagination["skip"] = (objectPagination.currentPage - 1) * objectPagination.limitItem

    const totalPage = Math.ceil(tasks / objectPagination.limitItem)
    objectPagination["totalPage"] = totalPage

    return objectPagination
}

export default paginationHelper