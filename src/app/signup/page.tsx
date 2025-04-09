"use client"
import { SignupProvider } from "../../contexts/SignupContext";
import SignupContainer from "../../components/signup/SignupContainer";

export default function SignupPage() {
  return (
    <SignupProvider>
      <SignupContainer />
    </SignupProvider>
  );
}