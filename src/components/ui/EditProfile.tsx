'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  email: string;
  age: number;
  gender: string;
  location: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem('DaterrAccessToken');
      if (!accessToken) {
        setError('Authentication required. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/v1/user/getprofile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProfile(response.data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const accessToken = localStorage.getItem('DaterrAccessToken');
    if (!accessToken) return;

    try {
      await axios.put(
        'http://localhost:4000/v1/user/updateprofile',
        { ...profile },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            value={profile?.first_name || ''}
            onChange={(e) => setProfile({ ...profile!, first_name: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={profile?.last_name || ''}
            onChange={(e) => setProfile({ ...profile!, last_name: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            value={profile?.bio || ''}
            onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}