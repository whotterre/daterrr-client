'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

interface ForgotPasswordData {
    email: string;
    token: string;
    step: 'email' | 'reset' | 'otp' | 'success';
}

interface ForgotPasswordContextType {
    data: ForgotPasswordData;
    setEmail: (email: string) => void;
    setToken: (token: string) => void;
    setStep: (step: ForgotPasswordData['step']) => void;
    resetFlow: () => void;
}

const ForgotPasswordContext = createContext<ForgotPasswordContextType | undefined>(undefined);

interface ForgotPasswordProviderProps {
    children: ReactNode;
}

export const ForgotPasswordProvider = ({ children }: ForgotPasswordProviderProps) => {
    const [data, setData] = useState<ForgotPasswordData>({
        email: '',
        token: '',
        step: 'email'
    });

    const setEmail = (email: string) => {
        setData(prev => ({ ...prev, email }));
    };

    const setToken = (token: string) => {
        setData(prev => ({ ...prev, token }));
    };

    const setStep = (step: ForgotPasswordData['step']) => {
        setData(prev => ({ ...prev, step }));
    };

    const resetFlow = () => {
        setData({
            email: '',
            token: '',
            step: 'email'
        });
    };

    return (
        <ForgotPasswordContext.Provider value={{
            data,
            setEmail,
            setToken,
            setStep,
            resetFlow
        }}>
            {children}
        </ForgotPasswordContext.Provider>
    );
};

export const useForgotPassword = () => {
    const context = useContext(ForgotPasswordContext);
    if (!context) {
        throw new Error('useForgotPassword must be used within a ForgotPasswordProvider');
    }
    return context;
};