'use client'; // Required for interactivity

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaBell, FaHeart } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
export default function Navbar() {



  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <FaHeart className="h-6 w-6 text-pink-500" />
          <span className="ml-2 font-bold">Daterrr</span>
        </Link>

        {/* Main Navigation */}
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

        {/* User Controls */}
        <div className="flex items-center space-x-4 justify-end">
          {/* <FaBell className="text-2xl"/>
          <RxAvatar className="text-2xl"/> */}

          <Link
            href="/signup"
            className={`${true ? 'text-pink-600 font-medium' : 'text-gray-600 hover:text-pink-500'
              } transition-colors`}
          >
            <button className='bg-200 py-3 px-9 rounded-md text-white'>Sign Up</button>
          </Link>
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