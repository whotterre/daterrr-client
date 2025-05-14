'use client';
import { useEffect, useState } from 'react';
import SwipeCard from './SwipeCard';
import { SwipeDirection } from '@/types';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

export default function Discover() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<SwipeDirection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      const authToken = localStorage.getItem("DaterrAccessToken");
      if (!authToken) return;

      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:4000/v1/genswipefeed", {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });

        if (response.data) {
          setProfiles(response.data.profilePool);
          console.log(response.data.profilePool)
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to load profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSwipe = async (dir: SwipeDirection) => {
    const authToken = localStorage.getItem("DaterrAccessToken")
    console.log(authToken)
    try {
      setIsLoading(true)
      const response = await axios.post("http://localhost:4000/v1/swipes", {
        swipeeID: activeProfile.id,
      }, {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });

      if (response.data){
        console.log(response.data)
      }
    } catch(error: any){
        console.error("Error swiping on a user", error)
        setError("Failed to perform swipe due to a technical glitch")
    } finally {
      setIsLoading(false)
    }
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 300); 
  };

  const activeProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const thirdProfile = profiles[currentIndex + 2];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <LoaderCircle className="animate-spin w-full h-full"/>
        <h2>Loading profiles...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
        <p className="text-gray-600">Try adjusting your discovery settings</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md p-10 mx-auto">
      {/* Card Stack Container */}
      <div className="relative w-full h-[500px] mb-8">

        {/* Third card (backmost) */}
        {thirdProfile && (
          <div className="absolute top-0 w-full h-full">
            <SwipeCard profile={thirdProfile} onSwipe={() => {}} active={false} />
          </div>
        )}

        {/* Second card (middle) */}
        {nextProfile && (
          <div className="absolute top-0 w-full h-full">
            <SwipeCard profile={nextProfile} onSwipe={() => {}} active={false} />
          </div>
        )}

        {/* Active card with AnimatePresence */}
        <AnimatePresence mode="popLayout">
          {activeProfile && (
            <div className="absolute top-0 w-full h-full" key={activeProfile.id}>
              <SwipeCard
                key={activeProfile.id}
                profile={activeProfile}
                onSwipe={handleSwipe}
                active={true}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      
    </div>
  );
}
