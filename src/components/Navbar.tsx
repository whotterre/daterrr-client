'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBell, FaCompass, FaHeart } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { GiLovers } from 'react-icons/gi';
import axios from 'axios';

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
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();


  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage!.getItem("DaterrAccessToken")
  const handleLogout = () => {
    localStorage.removeItem("DaterrAccessToken");
    router.push("/login");
    router.refresh();
  };

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/v1/user/getprofile", {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        if (response.status === 200) {
          setProfile(response.data.profile);
          if (!localStorage.getItem("CurrentUserID")) {
            localStorage.setItem("CurrentUserID", response.data.profile.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchProfile()
  }, [accessToken]);
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center" aria-label="Home">
          <FaHeart className="h-6 w-6 text-pink-500" />
          <span className="ml-2 font-bold">Daterrr</span>
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/discover">
            <FaCompass />
          </Link>
          <Link href="/matches">
            <GiLovers />
          </Link>
        </div>

        {/* User Controls */}
        <div className="relative flex items-center space-x-4">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-8 w-8"></div>
            </div>
          ) : true ? (
            <>
              <button
                className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                aria-label="Notifications"
                onClick={() => router.push('/notifications')}
              >
                <FaBell className="text-xl" />
              </button>
              <div
                className="relative"
                onMouseEnter={() => setShowProfileDropdown(true)}
                onMouseLeave={() => setShowProfileDropdown(false)}
              >
                <button
                  className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                  aria-label="Profile"
                >
                  <img
                    src={profile?.image_url || '/default-avatar.png'}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                    <h3 className="text-lg font-semibold">
                      {profile!.first_name} {profile?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {profile?.bio || 'No bio available.'}
                    </p>
                    <button
                      onClick={() => router.push('/profile')}
                      className="mt-4 w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
                    >
                      View Full Profile
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </nav>
  );
}

// NavLink component remains the same