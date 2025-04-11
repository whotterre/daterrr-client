"use client"
import { useContext } from 'react';
import { SignupContext } from '../../contexts/SignupContext';

export default function ProgressIndicator() {
  const signupContext = useContext(SignupContext);

  if (!signupContext) {
    throw new Error("ProgressIndicator should be used within a SignupProvider");
  }

  const { step, goToStep } = signupContext;

  return (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          {/* Clickable step circle */}
          <button
            type="button"
            onClick={() => goToStep(stepNumber)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${step >= stepNumber 
                ? 'bg-200 text-white hover:bg-200' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            {stepNumber}
          </button>
          
          {/* Connector line */}
          {stepNumber < 5 && (
            <div className={`w-12 h-1 mx-1 transition-colors
              ${step > stepNumber ? 'bg-200' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}