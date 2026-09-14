const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const apiClient = async (endpoint, options = {}) => {
    const {
        method = "GET",
        body,
        headers = {},
    } = options;

    const requestHeaders = {
        ...headers,
    };

    const token = localStorage.getItem("sfp_admin_token");
    if (token && !requestHeaders["Authorization"]) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const isFormData = body instanceof FormData;

    if (body !== undefined && !isFormData) {
        requestHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: isFormData
            ? body
            : body !== undefined
              ? JSON.stringify(body)
              : undefined,
    });

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error("Invalid response received from server");
    }

    if (!response.ok || result.success === false) {
        const error = new Error(
            result.message || "Something went wrong"
        );

        error.status = response.status;
        error.data = result;

        throw error;
    }

    return result;
};

export default apiClient;