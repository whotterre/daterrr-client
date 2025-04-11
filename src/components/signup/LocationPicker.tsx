'use client';

import { useEffect, useCallback, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { FaLocationArrow, FaMapMarkerAlt } from 'react-icons/fa';
import { SignupContext } from '@/contexts/SignupContext';

type Location = {
  latitude: number;
  longitude: number;
};

type LocationPickerProps = {
  onLocationChange?: (location: Location) => void;
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
  const { nextStep, formData, updateFormData } = useContext(SignupContext)!;

  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize location from context or props
  useEffect(() => {
    if (initialLocation && !formData.location) {
      updateFormData('location', initialLocation);
    }
  }, [initialLocation, formData.location, updateFormData]);

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
        const newPos: Location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        updateFormData('location', newPos);
        onLocationChange?.(newPos);
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
  }, [onLocationChange, updateFormData]);

  // Manual location update
  const handleLocationChange = useCallback((lat: number, lng: number) => {
    const validatedLat = Math.max(-90, Math.min(90, lat));
    const validatedLng = Math.max(-180, Math.min(180, lng));
    const newLocation: Location = {
      latitude: validatedLat,
      longitude: validatedLng
    };
    updateFormData('location', newLocation);
    onLocationChange?.(newLocation);
    setError(null);
  }, [onLocationChange, updateFormData]);

  return (
    <div className="space-y-4">
      <button
        onClick={detectUserLocation}
        disabled={isLocating}
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          isLocating
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

      <div className="border rounded-lg overflow-hidden h-96 bg-gray-50 relative">
        <SimpleMap
          position={formData.location ? [formData.location.latitude, formData.location.longitude] : [0, 0]}
          onPositionChange={handleLocationChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            value={formData.location?.latitude?.toFixed(6) || ''}
            onChange={(e) => handleLocationChange(Number(e.target.value), formData.location?.longitude || 0)}
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
            value={formData.location?.longitude?.toFixed(6) || ''}
            onChange={(e) => handleLocationChange(formData.location?.latitude || 0, Number(e.target.value))}
            step="0.000001"
            min="-180"
            max="180"
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          Continue
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <FaMapMarkerAlt className="inline mr-2" />
          {error}
        </div>
      )}

      {!error && formData.location && (
        <div className="text-sm text-green-600">
          <FaMapMarkerAlt className="inline mr-2" />
          Location set: {formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)}
        </div>
      )}
    </div>
  );
}