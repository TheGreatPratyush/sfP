import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import Button from "../components/common/Button";
import "./Login.css";

const Login = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await apiClient("/auth/login", {
                method: "POST",
                body: { password }
            });
            localStorage.setItem("sfp_admin_token", data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid credentials");
        }
    };

    return (
        <div className="admin-login-page">
            <form onSubmit={handleLogin} className="admin-login-card">
                <h2 className="admin-login-title">Owner Login</h2>
                {error && <div className="admin-login-error">{error}</div>}
                <div className="admin-login-input-wrapper">
                    <input 
                        type="password" 
                        placeholder="Admin Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        className="admin-login-input"
                    />
                </div>
                <Button type="submit" variant="primary" size="large" className="admin-login-button">
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;
