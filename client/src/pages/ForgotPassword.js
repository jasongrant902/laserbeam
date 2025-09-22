import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch("http://localhost:5000/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError ("Something went wrong. Please try again.")
        }
    };

    return  (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                type='email' required
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
                <button type='submit'>Send Reset Link</button>
                {message && <p className={styles.success}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    )
}