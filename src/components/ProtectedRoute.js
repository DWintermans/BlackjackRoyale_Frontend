import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({element, ...rest }){
    const isAuthenticated = !!localStorage.getItem("jwt"); 

    if (!isAuthenticated)
        return window.location.href = '/login';

    return isAuthenticated && element;
};