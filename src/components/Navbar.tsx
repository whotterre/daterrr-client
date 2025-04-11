'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBell, FaHeart } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useContext(AuthContext)!
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <FaHeart className="h-6 w-6 text-pink-500" />
          <span className="ml-2 font-bold">Daterrr</span>
        </Link>

        {/* Main Navigation - Only show when logged in */}
        {isAuthenticated && (
          <div className="hidden md:flex space-x-8">
            <NavLink href="/discover" currentPath={pathname}>
              Discover
            </NavLink>
            <NavLink href="/matches" currentPath={pathname}>
              Matches
            </NavLink>
            <NavLink href="/chats" currentPath={pathname}>
              Chats
            </NavLink>
          </div>
        )}

        {/* User Controls */}
        <div className="flex items-center space-x-4 justify-end">
          {isAuthenticated ? (
            <>
              <button className="p-2 text-gray-600 hover:text-pink-500">
                <FaBell className="text-xl" />
              </button>
              <Link href="/profile">
                <button className="p-2 text-gray-600 hover:text-pink-500">
                  <RxAvatar className="text-xl" />
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-pink-500 py-2 px-6 rounded-md text-white hover:bg-pink-600 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Helper component for active links
function NavLink({
  href,
  currentPath,
  children,
}: {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}) {
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      className={`${isActive ? 'text-pink-600 font-medium' : 'text-gray-600 hover:text-pink-500'
        } transition-colors`}
    >
      {children}
    </Link>
  );
}