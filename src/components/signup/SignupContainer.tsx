import { useContext } from 'react';
import { SignupContext } from '@/contexts/SignupContext';
import Step1Gender from './Step1Gender';
import ProgressIndicator from './ProgressIndicator';
import Step2PersonalInfo from './Step2PersonalInfo';
import Step3Interests from './Step3Interests';
import Step4Bio from './Step6Bio';
import LocationPicker  from './LocationPicker4';
import Step5ProfilePic from './Step5ProfilePic';
import VerifyOTP from './VerifyOTP';

type Location = {
  latitude: number
  longitude: number
}

const SignupContainer = () => {
  const signupContext = useContext(SignupContext)!;

  const {updateFormData} = signupContext

  const handleLocation = (location: Location) => {
    updateFormData('location', location);
    // nextStep();
  };

  if (!signupContext) {
    throw new Error("SignupContainer should be used within a SignupProvider");
  }

  const { step } = signupContext;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-md py-4">
        {step < 7 ? <ProgressIndicator /> : ""}
      </div>
      
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm"> {/* Container for form */}
      <ProgressIndicator/> 
        {step === 1 && <Step1Gender />}
        {step === 2 && <Step2PersonalInfo />}
        {step === 3 && <Step3Interests />}
        {step === 4 && <LocationPicker onLocationChange={handleLocation}/>}
        {step === 5 && <Step5ProfilePic/>}
        {step === 6 && <Step4Bio/>}
        {step === 7 && <VerifyOTP/>}
       
      </div>
    </div>
  );
};

export default SignupContainer;