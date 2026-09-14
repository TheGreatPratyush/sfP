import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../../api/client";

const CustomerAuthContext = createContext();

export const useCustomerAuth = () => {
    return useContext(CustomerAuthContext);
};

export const CustomerAuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [customerToken, setCustomerToken] = useState(() => localStorage.getItem("sfp_customer_token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (customerToken) {
            checkAuth(customerToken);
        } else {
            setIsLoading(false);
        }
    }, [customerToken]);

    const checkAuth = async (token) => {
        try {
            const response = await apiClient("/customer-auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.success) {
                setCustomer(response.customer);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Failed to verify customer auth", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await apiClient("/customer-auth/login", {
            method: "POST",
            body: { email, password }
        });
        
        if (response.success && response.token) {
            localStorage.setItem("sfp_customer_token", response.token);
            setCustomerToken(response.token);
            setCustomer(response.customer);
            return response;
        }
        throw new Error(response.message || "Login failed");
    };

    const register = async (name, email, phone, password) => {
        const response = await apiClient("/customer-auth/register", {
            method: "POST",
            body: { name, email, phone, password }
        });
        
        if (response.success && response.token) {
            localStorage.setItem("sfp_customer_token", response.token);
            setCustomerToken(response.token);
            setCustomer(response.customer);
            return response;
        }
        throw new Error(response.message || "Registration failed");
    };

    const logout = () => {
        localStorage.removeItem("sfp_customer_token");
        setCustomerToken(null);
        setCustomer(null);
    };

    return (
        <CustomerAuthContext.Provider value={{ customer, customerToken, isLoading, login, register, logout }}>
            {children}
        </CustomerAuthContext.Provider>
    );
};
