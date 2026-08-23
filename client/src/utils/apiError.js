export const getApiErrorMessage = (
    error,
    fallback = "Something went wrong. Please try again."
) => {
    if (!error) {
        return fallback;
    }

    if (typeof error === "string") {
        return error;
    }

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.data?.message) {
        return error.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return fallback;
};

export const isNetworkError = (error) => {
    if (!error) {
        return false;
    }

    return (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNREFUSED" ||
        error.message
            ?.toLowerCase()
            .includes("network")
    );
};

export const getHttpStatus = (error) => {
    return (
        error?.response?.status ||
        error?.status ||
        null
    );
};