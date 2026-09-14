import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const CustomerRegister = () => {
    const { customer, register, isLoading } = useCustomerAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = location.state?.returnTo || '/shop';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) return null;
    
    if (customer) {
        return <Navigate to={returnTo} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
            setError('All fields are required.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number.');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await register(formData.name, formData.email, formData.phone, formData.password);
            navigate(returnTo);
        } catch (err) {
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join Rangrasiya today.</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary auth-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegister;
