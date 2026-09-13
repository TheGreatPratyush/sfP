import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9f9f9' }}>
            <form onSubmit={handleLogin} style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h2>Owner Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ margin: '20px 0' }}>
                    <input 
                        type="password" 
                        placeholder="Admin Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
