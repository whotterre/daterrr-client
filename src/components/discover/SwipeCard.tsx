'use client';
import { motion, PanInfo } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Profile, SwipeDirection } from '@/types';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { FaTimes } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi';
import { playSound } from '@/utils/soundEffects';

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 1000;
const ROTATION_RANGE = 15;

export default function SwipeCard({
  profile,
  onSwipe,
  active = true,
  offset = 1,
}: {
  profile: Profile;
  onSwipe: (direction: SwipeDirection) => void;
  active?: boolean;
  offset?: number;
}) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);

  const handleDrag = useCallback((_: any, info: PanInfo) => {
    const xOffset = info.offset.x;
    if (xOffset > SWIPE_THRESHOLD) {
      setSwipeDirection('right');
    } else if (xOffset < -SWIPE_THRESHOLD) {
      setSwipeDirection('left');
    } else if (info.offset.y < -SWIPE_THRESHOLD * 2) {
      setSwipeDirection('up');
    } else {
      setSwipeDirection(null);
    }
  }, []);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY) {
      onSwipe('right');
      setIsLiked(true);
    } else if (offset < -SWIPE_THRESHOLD || velocity < -SWIPE_VELOCITY) {
      onSwipe('left');
      setIsDisliked(true);
    } else if (info.offset.y < -SWIPE_THRESHOLD * 2) {
      onSwipe('up');
    }
    
    setSwipeDirection(null);
    playSound('swipe');
  }, [onSwipe]);

  const onLike = () => {
    setIsLiked(true);
    setTimeout(() => onSwipe('right'), 300);
    playSound('swipe');
  };

  const onDislike = () => {
    setIsDisliked(true);
    setTimeout(() => onSwipe('left'), 300);
    playSound('swipe');
  };

  const onSuperLike = () => {
    setTimeout(() => onSwipe('up'), 300);
    playSound('swipe');
  };

  return (
    <motion.div
      className={`absolute inset-0 rounded-2xl shadow-lg overflow-hidden bg-gray-100 ${
        active ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragStart={(_, info) => setDragStart({ x: info.point.x, y: info.point.y })}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ 
        scale: 1 - offset * 0.03, 
        y: offset * 10, 
        opacity: 0 
      }}
      animate={{ 
        scale: 1 - offset * 0.03, 
        y: offset * 10, 
        opacity: 1,
        rotate: swipeDirection === 'right' ? ROTATION_RANGE : 
                swipeDirection === 'left' ? -ROTATION_RANGE : 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }}
      exit={{
        x: isLiked ? 500 : isDisliked ? -500 : 0,
        opacity: 0,
        transition: { duration: 0.25 }
      }}
      whileDrag={{ scale: 1.05 }}
      style={{
        zIndex: offset,
      }}
    >
      {/* Profile image with loading state */}
      <div className="relative h-full w-full">
        <img 
          src={profile.image_url} 
          alt={profile.first_name} 
          className="h-full w-full object-cover"
          loading="lazy"
          />
        
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-1/3 p-6">
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{profile.first_name}, {profile.age}</h2>
            </div>
            
            {profile.bio && (
              <p className="text-sm text-gray-100 line-clamp-2 mt-1">{profile.bio}</p>
            )}
            
            {profile.interests?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.interests.slice(0, 5).map((interest, index) => (
                  <span 
                    key={index} 
                    className="bg-white/20 px-2 py-1 rounded-full text-xs backdrop-blur-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-28 right-6 flex flex-col-reverse gap-3">
          <button 
            onClick={onDislike}
            className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Dislike"
          >
            <FaTimes className="text-gray-600 text-lg" />
          </button>
          
          <button 
            onClick={onLike}
            className="bg-200 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-pink transition-colors"
            aria-label="Like"
          >
            {isLiked ? (
              <IoHeart className="text-white text-lg" />
            ) : (
              <IoHeartOutline className="text-white text-lg" />
            )}
          </button>
        </div>
        
        {/* Swipe indicators */}
        {swipeDirection === 'right' && (
          <motion.div 
            className="absolute top-8 right-8 border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg text-xl font-bold"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 12 }}
            exit={{ opacity: 0 }}
          >
            LIKE
          </motion.div>
        )}
        
        {swipeDirection === 'left' && (
          <motion.div 
            className="absolute top-8 left-8 border-4 border-gray-500 text-gray-500 px-4 py-2 rounded-lg text-xl font-bold"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: -12 }}
            exit={{ opacity: 0 }}
          >
            NOPE
          </motion.div>
        )}
        

      </div>
    </motion.div>
  );
}