const handleResponse = response => {
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(response.data.error);
    }
};

export { handleResponse };