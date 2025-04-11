'use client';

import { useState, useEffect, useCallback, useContext } from 'react';
import dynamic from 'next/dynamic';
import { FaLocationArrow, FaMapMarkerAlt } from 'react-icons/fa';
import { SignupContext } from '@/contexts/SignupContext';

type Location = {
  latitude: number;
  longitude: number;
};

type LocationPickerProps = {
  onLocationChange: (location: Location) => void;
  initialLocation?: Location;
};

const SimpleMap = dynamic(
  () => import('./SimpleMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    )
  }
);

export default function LocationPicker({ onLocationChange, initialLocation }: LocationPickerProps) {
  const signupContext = useContext(SignupContext)!

  const { nextStep } = signupContext
  const [position, setPosition] = useState<[number, number]>(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : [51.505, -0.09] // Default to London
  );
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or update position
  useEffect(() => {
    if (initialLocation) {
      setPosition([initialLocation.latitude, initialLocation.longitude]);
    }
  }, [initialLocation]);

  // Auto-detect user's location
  const detectUserLocation = useCallback(() => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude
        ];
        setPosition(newPos);
        onLocationChange({ latitude: newPos[0], longitude: newPos[1] });
        setIsLocating(false);
      },
      (err) => {
        setError(`Location access denied: ${err.message}`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [onLocationChange]);

  // Manual position update
  const handlePositionChange = useCallback((lat: number, lng: number) => {
    const validatedLat = Math.max(-90, Math.min(90, lat));
    const validatedLng = Math.max(-180, Math.min(180, lng));
    const newPosition: [number, number] = [validatedLat, validatedLng];
    setPosition(newPosition);
    onLocationChange({ latitude: validatedLat, longitude: validatedLng });
    setError(null);
  }, [onLocationChange]);

  return (
    <div className="space-y-4">
     
      <button
        onClick={detectUserLocation}
        disabled={isLocating}
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${isLocating
            ? 'bg-gray-300 text-gray-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition-colors`}
      >
        {isLocating ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Detecting...
          </>
        ) : (
          <>
            <FaLocationArrow />
            Use My Current Location
          </>
        )}
      </button>

      {/* Map Container */}
      <div className="border rounded-lg overflow-hidden h-96 bg-gray-50 relative">
        <SimpleMap
          position={position}
          onPositionChange={handlePositionChange}
        />
      </div>

      {/* Coordinate Display */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            value={position[0].toFixed(6)}
            onChange={(e) => handlePositionChange(Number(e.target.value), position[1])}
            step="0.000001"
            min="-90"
            max="90"
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            value={position[1].toFixed(6)}
            onChange={(e) => handlePositionChange(position[0], Number(e.target.value))}
            step="0.000001"
            min="-180"
            max="180"
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
        <div className='flex justify-end'>
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-200 text-white rounded-md hover:bg-pink-500"
          >
            Continue
          </button>
        </div>

      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <FaMapMarkerAlt className="inline mr-2" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {!error && position && (
        <div className="text-sm text-green-600">
          <FaMapMarkerAlt className="inline mr-2" />
          Location set: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </div>
      )}
    </div>
  );
}