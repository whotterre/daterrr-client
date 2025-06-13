import { useState } from "react";

interface Gender {
    gender: string;
    code: string;
}

export default function Preferences() {
    const genders: Array<Gender> = [
        { "gender": "Male", "code": "male" },
        { "gender": "Female", "code": "female" },
        { "gender": "Non-Binary", "code": "non-binary" },
        { "gender": "All Genders", "code": "all" }
    ];

    const [minAge, setMinAge] = useState<number>(18);
    const [maxAge, setMaxAge] = useState<number>(30);
    const [selectedGender, setSelectedGender] = useState<string>("all");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Preferences saved:", { 
                gender: selectedGender,
                minAge,
                maxAge
            });
            setIsLoading(false);
        }, 1000);
    };

    const handleAgeChange = (type: 'min' | 'max', value: number) => {
        if (value < 18) value = 18;
        if (value > 100) value = 100;
        
        if (type === 'min') {
            setMinAge(value);
            if (value > maxAge) setMaxAge(value);
        } else {
            setMaxAge(value);
            if (value < minAge) setMinAge(value);
        }
    };

    return (
        <div className="bg-white w-full p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Discover Preferences</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        I'm interested in
                    </label>
                    <select 
                        className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        name="gender" 
                        id="gender"
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                    >
                        {genders.map((gender, index) => (
                            <option key={index} value={gender.code} className="p-2">
                                {gender.gender}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Age Range</label>
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">From</label>
                            <input 
                                type="number" 
                                min="18" 
                                max="100"
                                value={minAge}
                                onChange={(e) => handleAgeChange('min', parseInt(e.target.value) || 18)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">To</label>
                            <input 
                                type="number" 
                                min="18" 
                                max="100"
                                value={maxAge}
                                onChange={(e) => handleAgeChange('max', parseInt(e.target.value) || 30)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <input 
                            type="range" 
                            min="18" 
                            max="100" 
                            value={minAge}
                            onChange={(e) => handleAgeChange('min', parseInt(e.target.value))}
                            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input 
                            type="range" 
                            min="18" 
                            max="100" 
                            value={maxAge}
                            onChange={(e) => handleAgeChange('max', parseInt(e.target.value))}
                            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer mt-4"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Distance</label>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">0 km</span>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            defaultValue="50"
                            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-500">100+ km</span>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center ${
                        isLoading ? 'bg-pink-400' : 'bg-pink-500 hover:bg-pink-600'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Save Preferences'
                    )}
                </button>
            </form>
        </div>
    );
}