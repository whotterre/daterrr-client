import { useContext, useState } from 'react';
import { SignupContext } from '../../contexts/SignupContext';
import axios from 'axios';

const BioStep = () => {
  const { formData, updateFormData, prevStep } = useContext(SignupContext)!;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null);

  const maxLength = 200;

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const bio = e.target.value;
    if (bio.length <= maxLength) {
      updateFormData('bio', bio);
      setErrors(prev => ({ ...prev, bio: '' }));
    }
  };


  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bio || formData.bio.trim().length < 10) {
      newErrors.bio = 'Please write at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    console.log(formData)
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const registerBody = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        bio: formData.bio,
        gender: formData.gender,
        image_url: formData.imageURL,
        interests: formData.interests
      };
  
      const response = await axios.post(
        `http://localhost:4000/v1/user/register`, 
        registerBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Handle successful registration
      alert('Registration successful:' +  response.data);
      console.log('Registration successful:', response.data);
      // You might want to redirect or update state here
      
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-center">Tell us about yourself</h2>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Personal Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={handleBioChange}
            rows={6}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-100 focus:border-100"
            placeholder="Share something interesting about yourself..."
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${formData.bio?.length > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
              {formData.bio?.length || 0}/{maxLength} characters
            </span>
            {errors.bio && <span className="text-xs text-red-500">{errors.bio}</span>}
          </div>
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
            className="px-4 py-2 bg-200 text-white rounded-md hover:bg-500 disabled:opacity-50"
            disabled={!formData.bio || formData.bio.length < 10}
            onClick={handleSubmit}
          >
          Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default BioStep;