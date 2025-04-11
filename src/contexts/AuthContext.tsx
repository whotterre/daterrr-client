'use client';
import { createContext, ReactNode, useState, useContext } from "react";

type LoginData = {
    email: string;
    password: string;
};

type AuthContextType = {
    authData: LoginData;
    updateFormData: <K extends keyof LoginData>(field: K, value: LoginData[K]) => void;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authData, setAuthData] = useState<LoginData>({
        email: "",
        password: ""
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const updateFormData = <K extends keyof LoginData>(field: K, value: LoginData[K]) => {
        setAuthData(prev => ({ ...prev, [field]: value }));
    };

    const login = () => {
        // Your authentication logic here
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAuthData({ email: "", password: "" });
    };

    return (
        <AuthContext.Provider value={{
            authData,
            updateFormData,
            isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};