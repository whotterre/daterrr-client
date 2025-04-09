'use client'; // Required for interactivity

import { useState, useEffect } from 'react';
import { girl_1, girl_2, girl_3 } from "../data/index";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slideData = [
    {
        header: "Smart Algorithm",
        description: "Our vetting process ensures you only match with real humans.",
        image: girl_1,
        color: "bg-pink-100"
    },
    {
        header: "Perfect Matches",
        description: "Connect with people who share your passions and interests.",
        image: girl_2,
        color: "bg-purple-100"
    },
    {
        header: "Premium Benefits",
        description: "Enjoy 1 month of premium features on us when you sign up today.",
        image: girl_3,
        color: "bg-blue-100"
    }
];

export default function OnboardingCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0); // 0: none, 1: right, -1: left

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const handleNext = () => {
        setDirection(1);
        setCurrentSlide((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    return (
        <div className={`relative h-screen w-full overflow-hidden ${slideData[currentSlide].color} transition-colors duration-500`}>
            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg"
            >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg"
            >
                <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>

            {/* Carousel Slides */}
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-8"
                >
                    <div className="max-w-md text-center">
                        <motion.img
                            src={slideData[currentSlide].image.src} // Access .src property
                            alt="Onboarding illustration"
                            className="mx-auto h-64 object-contain mb-8"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        />
                        <motion.h2
                            className="text-3xl font-bold mb-4 text-200"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {slideData[currentSlide].header}
                        </motion.h2>
                        <motion.p
                            className="text-lg text-gray-700 mb-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {slideData[currentSlide].description}
                        </motion.p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {slideData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-pink-500 w-6' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Skip/Get Started Button */}
            <motion.div
                className="absolute bottom-12 left-0 right-0 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >   
                <Link href={"/signup"}>
                <button className="px-8 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors shadow-lg">
                    {currentSlide === slideData.length - 1 ? "Get Started" : "Skip"}
                </button>
                </Link>
            </motion.div>
        </div>
    );
}