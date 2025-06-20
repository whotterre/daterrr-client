import { useContext, useState } from 'react';
import { SignupContext } from '../../contexts/SignupContext';

const PersonalInfoStep = () => {
  const { formData, updateFormData, nextStep, prevStep } = useContext(SignupContext)!;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dob, setDob] = useState('');

  const getAgeFromDate = (dob: string): number => {
    if (!dob) return 0;
    
    const currentDate = new Date();
    const birthDate = new Date(dob);
    
    if (isNaN(birthDate.getTime())) return 0;
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (
      monthDiff < 0 || 
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    
    return age;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    setDob(dateString);
    const age = getAgeFromDate(dateString);
    updateFormData('age', age);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    const age = getAgeFromDate(dob);
    if (age < 18) newErrors.dob = 'You must be at least 18 years old';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Add email to sessionStorage 
      localStorage.setItem("pendingEmail", formData.email)
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Personal Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border rounded-md"
          />
          <div className="mt-1 text-sm text-gray-600">
            {dob ? `Age: ${formData.age}` : 'Please select your date of birth'}
          </div>
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-200 text-white rounded-md hover:bg-blue-600"
            onClick={nextStep}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStep;