import { useContext, useState } from 'react';
import { SignupContext } from '../../contexts/SignupContext';
import axios from 'axios';

const BioStep = () => {
  const { formData, updateFormData, prevStep } = useContext(SignupContext)!;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const reqBody = new FormData();
      reqBody.append('email', formData.email);
      reqBody.append('password', formData.password);
      reqBody.append('first_name', formData.firstName);
      reqBody.append('last_name', formData.lastName);
      reqBody.append('bio', formData.bio);
      reqBody.append('gender', formData.gender);
      reqBody.append('age', formData.age.toString());

      reqBody.append('interests', formData.interests.join(','));

      if (formData.imageFile) {
        reqBody.append('image_file', formData.imageFile);
      }


      const response = await axios.post(
        `http://localhost:4000/v1/user/register`,
        reqBody,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000,
        });

      // TODO: Add toast notif for UI feedback
      console.log("User signed up successfully", response.data)

    } catch (error) {
      let errorMessage = 'Registration failed';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
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

      <form className="space-y-4" onSubmit={handleSubmit}>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50" // Adjusted color for "Next" button
            disabled={!formData.bio || formData.bio.length < 10 || isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BioStep;
