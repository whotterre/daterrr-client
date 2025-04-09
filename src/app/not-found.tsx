"use client"
import { FaHeartBroken } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Broken Hearts */}
        <div className="flex justify-center gap-4 mb-6">
          <FaHeartBroken className="text-red-400 text-4xl" />
          <FaHeartBroken className="text-pink-400 text-4xl" />
          <FaHeartBroken className="text-purple-400 text-4xl" />
        </div>

        {/* Fun Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oopsie Daisy!</h1>
        <p className="text-xl text-gray-600 mb-6">
          Looks like this page went on a coffee break and never came back...
        </p>
        <p className="text-lg text-gray-500 mb-8">
          The page you're looking for is more lost than a penguin in the desert.
        </p>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <motion.span
            animate={{ x: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mr-2"
          >
            👈
          </motion.span>
          Take me back to safety!
        </Link>

        {/* Fun ASCII Art */}
        <div className="mt-10 text-gray-400 text-xs font-mono">
          {`(╯°□°)╯︵ ┻━┻`}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;