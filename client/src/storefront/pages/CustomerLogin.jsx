import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const CustomerLogin = () => {
    const { customer, login, isLoading } = useCustomerAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = location.state?.returnTo || '/shop';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) return null;
    
    // Redirect if already logged in
    if (customer) {
        return <Navigate to={returnTo} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate(returnTo);
        } catch (err) {
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                <p className="auth-subtitle">Welcome back to Rangrasiya.</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="current-password"
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary auth-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Create Account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
