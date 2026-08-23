import apiClient from "./client";

export const getDashboard = async () => {
    return await apiClient("/dashboard");
};