'use client'
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForgotPassword } from '@/contexts/ForgotPasswordContext';
import EmailStepComponent from '@/components/forgot-password/EmailStep';
import ForgotPasswordComponent from '@/components/forgot-password/PasswordStep'
import OTPStep from './OTPStep';

const ForgotPasswordFlow = () => {
    const { data } = useForgotPassword();
    // const searchParams = useSearchParams();

    // useEffect(() => {
    //     // Check if we have a reset token in URL
    //     const token = searchParams.get('token');
    //     if (token) {
    //         setToken(token);
    //         setStep('reset');
    //     }
    // }, [searchParams, setToken, setStep]);

    switch (data.step) {
        case 'email':
            return <EmailStepComponent />;
        case 'otp':
            return <OTPStep />;
        case 'reset':
            return <ForgotPasswordComponent />;
        default:
            return <EmailStepComponent />;
    }
};

export default ForgotPasswordFlow;
