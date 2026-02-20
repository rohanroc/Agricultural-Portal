import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check session storage on mount
        const token = sessionStorage.getItem('token');
        if (token) {
            // In a real app, you might validate the token with an API call here
            setUser({ token, email: sessionStorage.getItem('userEmail') });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        // In real backend integration: const response = await fetch('/api/login', ...);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const fakeToken = "abc-123-token-" + Date.now();
                    sessionStorage.setItem('token', fakeToken);
                    sessionStorage.setItem('userEmail', email);
                    setUser({ token: fakeToken, email });
                    resolve({ success: true, user: { email, token: fakeToken } });
                } else {
                    reject({ message: "Invalid credentials" });
                }
            }, 1000);
        });
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userEmail');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
