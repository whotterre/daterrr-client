import React, { useState, useRef, useContext, useEffect } from 'react'
import { Image as ImageIcon } from 'lucide-react'

import { SignupContext } from '@/contexts/SignupContext'

export default function Step5ProfilePic() {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { formData, updateFormData, nextStep } = useContext(SignupContext)!;

    if (!formData || !updateFormData || !nextStep) {
        console.error("SignupContext not provided to Step5ProfilePic");
        return <div>Error: SignupContext not available.</div>;
    }

    useEffect(() => {
        if (formData.imageFile) {
            setImagePreviewUrl(URL.createObjectURL(formData.imageFile));
        } else {
            setImagePreviewUrl("");
        }

        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [formData.imageFile]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            updateFormData("imageFile", null);
            setImagePreviewUrl("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        updateFormData("imageFile", file);
    };

    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearPicture = () => {
        updateFormData("imageFile", null);
        setImagePreviewUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-center m-4">Upload a profile picture</h1>
            <div
                className="
                    border-2 border-dashed border-gray-400 rounded-lg p-4
                    w-full max-w-sm h-48 flex flex-col items-center justify-center
                    cursor-pointer hover:border-gray-600 hover:bg-gray-50
                    transition-colors duration-200
                "
                onClick={handleContainerClick}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                {imagePreviewUrl ? (
                    <img
                        src={imagePreviewUrl}
                        alt="Profile preview"
                        className="w-32 h-32 object-cover rounded-full shadow-lg"
                    />
                ) : (
                    <>
                        <ImageIcon size={48} className="text-gray-500 mb-2" />
                        <p className="text-gray-600 text-sm text-center">Click to upload a profile picture</p>
                    </>
                )}
            </div>

            {(imagePreviewUrl || formData.imageFile) && (
                <div className='flex gap-4'>
                    <button
                        onClick={handleClearPicture}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Clear Picture
                    </button>

                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => { nextStep() }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}