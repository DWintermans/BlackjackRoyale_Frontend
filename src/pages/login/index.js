import React, { useState } from 'react';
import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';
import { TryLogin } from '../../lib/api/requests/login.js';
import './index.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loadingToast = toast.loading("Authenticating...");
        setLoading(true);

        try {
            const loginResponse = await TryLogin(formData.username, formData.password);

            toast.update(loadingToast, {
                render: loginResponse.message,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            console.log(loginResponse)

            localStorage.setItem("jwt", loginResponse.jwt);

            //redirect to /game?

        } catch (error) {
            toast.update(loadingToast, {
                render: error.message,
                type: "error",
                isLoading: false,
                autoClose: 3000
            });

            console.log(error)

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />

            <div className="container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
            <ToastContainer />

            <Footer />
        </div>
    );
}
