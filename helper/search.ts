const searchHelper = (query) => {
    interface searchObject {
        keyword: string,
        regex?: RegExp
    }

    let object: searchObject = {
        keyword: "",
    }

    if (query.keyword) {
        object.keyword = query.keyword

        const regex = new RegExp(object.keyword, "i");
        object["regex"] = regex
    }

    return object;
}

export default searchHelper