import { useContext, useState } from 'react';
import { SignupContext } from '../../contexts/SignupContext';
import {
  FaFootballBall, FaBasketballBall, FaTableTennis, FaSwimmer, FaRunning, FaYinYang,
  FaMusic, FaGuitar, FaHeadphones, FaDrum, FaItunesNote,
  FaRobot, FaCode, FaMobile, FaShieldAlt, FaBitcoin, FaVrCardboard,
  FaPizzaSlice, FaFish, FaLeaf, FaCookieBite, FaFire, FaGlobeAmericas
} from 'react-icons/fa';
import { GiViolin } from "react-icons/gi"
const InterestsStep = () => {
  const { formData, updateFormData, nextStep, prevStep } = useContext(SignupContext)!;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sample interest categories with icons
  const interestCategories = [
    {
      name: 'Sports',
      items: [
        { name: 'Football', icon: <FaFootballBall /> },
        { name: 'Basketball', icon: <FaBasketballBall /> },
        { name: 'Tennis', icon: <FaTableTennis /> },
        { name: 'Swimming', icon: <FaSwimmer /> },
        { name: 'Running', icon: <FaRunning /> },
        { name: 'Yoga', icon: <FaYinYang /> }
      ]
    },
    {
      name: 'Music',
      items: [
        { name: 'Pop', icon: <FaMusic /> },
        { name: 'Rock', icon: <FaGuitar /> },
        { name: 'Hip Hop', icon: <FaHeadphones /> },
        { name: 'Jazz', icon: <FaDrum /> },
        { name: 'Classical', icon: <GiViolin /> },
        { name: 'Electronic', icon: <FaItunesNote /> }
      ]
    },
    {
      name: 'Technology',
      items: [
        { name: 'AI', icon: <FaRobot /> },
        { name: 'Programming', icon: <FaCode /> },
        { name: 'Gadgets', icon: <FaMobile /> },
        { name: 'Cybersecurity', icon: <FaShieldAlt /> },
        { name: 'Blockchain', icon: <FaBitcoin /> },
        { name: 'VR/AR', icon: <FaVrCardboard /> }
      ]
    },
    {
      name: 'Food',
      items: [
        { name: 'Italian', icon: <FaPizzaSlice /> },
        { name: 'Japanese', icon: <FaFish /> },
        { name: 'Vegan', icon: <FaLeaf /> },
        { name: 'Baking', icon: <FaCookieBite /> },
        { name: 'BBQ', icon: <FaFire /> },
        { name: 'Fusion', icon: <FaGlobeAmericas /> }
      ]
    }
  ];

  const toggleInterest = (interest: string) => {
    const currentInterests = [...formData.interests];
    const index = currentInterests.indexOf(interest);

    if (index === -1) {
      currentInterests.push(interest);
    } else {
      currentInterests.splice(index, 1);
    }

    updateFormData('interests', currentInterests);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.interests.length < 3) {
      newErrors.interests = 'Please select at least 3 interests';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">What are you interested in?</h2>
      <p className="text-gray-600 text-center mb-8">
        Select at least 3 interests to help us personalize your experience
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {interestCategories.map((category) => (
          <div key={category.name} className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
            <div className="flex flex-wrap gap-3">
              {category.items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => toggleInterest(item.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.interests.includes(item.name)
                    ? 'bg-blue-200 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ))}

        {errors.interests && (
          <p className="text-red-500 text-sm text-center mt-4">{errors.interests}</p>
        )}

        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-200 text-white rounded-md hover:bg-blue-600"
          >
            Continue
          </button>
        </div>
      </form>

      {/* Selected interests counter */}
      <div className="mt-6 text-center text-sm text-gray-500">
        {formData.interests.length} interests selected (minimum 3)
      </div>
    </div>
  );
};

export default InterestsStep;