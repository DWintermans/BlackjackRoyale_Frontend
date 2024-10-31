import React, { useState } from 'react';
import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';
import { TryLogin } from '../../lib/api/requests/login.js';
import { TrySignup } from '../../lib/api/requests/register.js';
import './index.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() { 
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loadingToast = toast.loading(isSignUp ? "Signing Up..." : "Authenticating...");
        setLoading(true);

        try {
            let response;
            if (isSignUp) {
                response = await TrySignup(formData.username, formData.password);
                toast.update(loadingToast, {
                    render: response.message,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                console.log(response)

                localStorage.setItem("jwt", response.jwt);
                window.location.href = '/game';
            } else {
                response = await TryLogin(formData.username, formData.password);

                toast.update(loadingToast, {
                    render: response.message,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                console.log(response)

                localStorage.setItem("jwt", response.jwt);
                window.location.href = '/game';
            }
        } catch (error) {
            toast.update(loadingToast, {
                render: error.message,
                type: "error",
                isLoading: false,
                autoClose: 3000
            });

            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />

            <div className="login-container">
                <div className="sign">
                    <span className="signup">Sign Up</span>
                    <span>Sign In</span>
                </div>
                <form onSubmit={handleSubmit} className='login-form'>
                    <div className="formGroup">
                        <label htmlFor="username">Username:</label>
                        <input
                            className='login-input'
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div className="formGroup">
                            <label htmlFor="email">Email:</label>
                            <input
                            className='login-input'
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required={isSignUp}
                            />
                        </div>
                    )}

                    <div className="formGroup">
                        <label htmlFor="password">Password:</label>
                        <input
                        className='login-input'
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className='login-button'>
                        {loading ? (isSignUp ? "Signing Up..." : "Signing in...") : (isSignUp ? "Sign Up" : "Sign in")}
                    </button>
                </form>

                <p>
                    {isSignUp ? (<>Already have an account? <a className='login-a' onClick={() => setIsSignUp(false)}>Sign in</a></>)
                        :
                        (<>Don’t have an account? <a className='login-a' onClick={() => setIsSignUp(true)}>Sign Up</a></>)
                    }
                </p>
            </div>

            {/* <ToastContainer /> */}

            <Footer />
        </div>
    );
}
