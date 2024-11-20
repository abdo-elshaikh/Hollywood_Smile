import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, getUserProfile, changePassword } from '../services/authService';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user data from local storage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    // Register function
    const register = async (userData) => {
        try {
            const data = await registerUser(userData);
            console.log('Registered user:', data);
            setUser(data);
            return data;
        } catch (err) {
            setError(err.response.data.message || 'Registration failed');
            throw err;
        }
    };

    // Login function
    const login = async (userData) => {
        try {
            const data = await loginUser(userData);
            console.log('Logged in user:', data);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.response.data.message || 'Login failed');
            console.log(err);
        }
    };

    // Logout function
    const logout = () => {
        logoutUser();
        setUser(null);
    };

    // Change password function
    const changeUserPassword = async (password) => {
        try {
            const data = await changePassword(password);
            return data;
        } catch (err) {
            setError(err.response.data.message || 'Password change failed');
            throw err;
        }
    }

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const data = await getUserProfile();
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.response.data.message || 'Could not fetch user profile');
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout, fetchUserProfile, changeUserPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
