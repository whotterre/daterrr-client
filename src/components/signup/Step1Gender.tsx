import { useContext } from 'react';
import { SignupContext } from '../../contexts/SignupContext';

export const metadata = {
  title: 'Sign Up Step | Gender',
}

const GenderStep = () => {
  const { formData, updateFormData, nextStep } = useContext(SignupContext)!;

  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleGenderSelect = (gender: string) => {
    updateFormData('gender', gender);
    nextStep();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">What's your gender?</h2>
      <div className="space-y-4">
        {genders.map((gender) => (
          <button
            key={gender}
            onClick={() => handleGenderSelect(gender)}
            className={`w-full p-4 border rounded-lg text-center transition-colors hover:${
              formData.gender === gender
                ? 'bg-200 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenderStep;