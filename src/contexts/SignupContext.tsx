import { createContext, ReactNode, useState } from "react";

// Location type
export type Location = {
  longitude: number;
  latitude: number;
};

// Form data structure
type SignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio: string;
  gender: string;
  age: number;
  imageFile: File | null;
  location: Location;
  interests: string[];
};

// Context type using SignupData
export type SignupContextType = {
  step: number;
  formData: SignupData;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepNum: number) => void;
  updateFormData: <K extends keyof SignupData>(field: K, value: SignupData[K]) => void;
};

// React Context
export const SignupContext = createContext<SignupContextType | undefined>(undefined);

// Props for the Provider
type SignupProviderProps = {
  children: ReactNode;
};

// Provider implementation
export const SignupProvider: React.FC<SignupProviderProps> = ({ children }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    bio: "",
    gender: "",
    age: 0,
    imageFile: null,
    location: { longitude: 0, latitude: 0 },
    interests: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const goToStep = (stepNum: number) => setStep(stepNum)

  const updateFormData = <K extends keyof SignupData>(field: K, value: SignupData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SignupContext.Provider value={{ step, formData, nextStep, prevStep, updateFormData, goToStep }}>
      {children}
    </SignupContext.Provider>
  );
};