'use client';
import { createContext, useState} from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    age?: number;
    gender?: string;
    bio?: string;
    interests?: string[];
    photos?: string[];
    location?: string;
  }
  

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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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