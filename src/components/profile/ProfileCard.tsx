'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type UserProfile = {
    id: string;
    email: string;
    created_at: Date;
    last_active: Date;
    first_name: string;
    last_name: string;
    bio: string;
    gender: string;
    age: number;
    image_url: string;
    interests: string[];
    location: string;
}

export default function Profile() {
    const [error, setError] = useState<string | null>(null)
    const [profile, setProfile] = useState<UserProfile>()
    useEffect(() => {
        const accessToken = localStorage.getItem("DaterrAccessToken");
        if (!accessToken) {
            setError("Access token is missing. Please log in again.");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:4000/v1/user/getprofile", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.status === 200) {
                    setProfile(response.data)
                    console.log(response.data)
                }
            } catch (e: any) {
                console.error("Error fetching user profile", e)
                setError(e.response?.data?.message || "Failed to load matches")
            }
        }
        fetchProfile()
    }, []);


    return (
        <div className="my-11 p-4 rounded w-full h-full">
            {profile ? (
                <div>
                    <h2 className="text-3xl text-600">{profile.first_name + " " + profile.last_name }</h2>
                    <p className="text-3xl text-600">{profile.bio}</p>
                </div>
            ) : (
                <p className="text-red-500">Loading profile...</p>
            )}
            <button>View Full Details</button>
        </div>
    )
}
