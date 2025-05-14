
export type Profile = {
  id: string;
  first_name: string;
  age: number;
  bio: string;
  distance: number;
  image_url: string;
  location: {
    latitude: number;
    longitude: number;
  };
  interests: string[];
};

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

