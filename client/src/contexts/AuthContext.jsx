import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getUserProfile, changePassword, updateUserProfile } from '../services/authService';

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
        const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
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
    const login = async (userData, rememberMe) => {
        try {
            const data = await loginUser(userData, rememberMe);
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
        setUser(null);
    };

    // Change password function
    const changeUserPassword = async (currentPassword, newPassword) => {
        try {
            const data = await changePassword(currentPassword, newPassword);
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
            console.log('Fetched user profile:', data);
            return data.user;
        } catch (err) {
            setError(err.response.data.message || 'Could not fetch user profile');
            throw err;
        }
    };

    const EditUserProfile = async (userData) => {
        try {
            const data = await updateUserProfile(userData);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.response.data.message || 'Could not update user profile');
            throw err;
        }
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null);
            }, 5000);
        }
    }, [error]);

    useEffect(() => {
        const storageUser = JSON.parse(localStorage.getItem('user'));
        const sessionUser = JSON.parse(sessionStorage.getItem('user'));
        if (user && storageUser) {
            localStorage.setItem('user', JSON.stringify(user));
        } else if (user && sessionUser) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        }
    }, [user]);

    const value = { user, loading, error, register, login, logout, fetchUserProfile, changeUserPassword, EditUserProfile };


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
