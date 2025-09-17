'use client';
import { useState } from 'react';
import { MapPin, Wind, CloudRain, Sun, Cloud } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  par: number;
  length: number;
  weather: {
    temperature: number;
    windSpeed: number;
    windDirection: string;
    conditions: 'sunny' | 'cloudy' | 'rainy';
  };
  image: string;
  unlocked: boolean;
}

interface CourseSelectorProps {
  selectedCourse: string;
  onCourseSelect: (courseId: string) => void;
  userTier: 'free' | 'pro' | 'elite';
}

const courses: Course[] = [
  {
    id: 'practice-range',
    name: 'Practice Range',
    description: 'Perfect your swing with unlimited balls',
    difficulty: 'easy',
    par: 0,
    length: 0,
    weather: {
      temperature: 72,
      windSpeed: 5,
      windDirection: 'SW',
      conditions: 'sunny'
    },
    image: '/images/course-practice.jpg',
    unlocked: true
  },
  {
    id: 'augusta-national',
    name: 'Augusta National',
    description: 'The Masters course - legendary and challenging',
    difficulty: 'hard',
    par: 72,
    length: 7475,
    weather: {
      temperature: 68,
      windSpeed: 12,
      windDirection: 'N',
      conditions: 'cloudy'
    },
    image: '/images/course-augusta.jpg',
    unlocked: false
  },
  {
    id: 'pebble-beach',
    name: 'Pebble Beach',
    description: 'Ocean views and dramatic elevation changes',
    difficulty: 'hard',
    par: 72,
    length: 6827,
    weather: {
      temperature: 65,
      windSpeed: 18,
      windDirection: 'W',
      conditions: 'sunny'
    },
    image: '/images/course-pebble.jpg',
    unlocked: false
  },
  {
    id: 'st-andrews',
    name: 'St. Andrews',
    description: 'The Home of Golf - links style perfection',
    difficulty: 'medium',
    par: 72,
    length: 7265,
    weather: {
      temperature: 55,
      windSpeed: 22,
      windDirection: 'NE',
      conditions: 'cloudy'
    },
    image: '/images/course-andrews.jpg',
    unlocked: false
  },
  {
    id: 'torrey-pines',
    name: 'Torrey Pines',
    description: 'Cliffside beauty with ocean breezes',
    difficulty: 'medium',
    par: 72,
    length: 7599,
    weather: {
      temperature: 70,
      windSpeed: 15,
      windDirection: 'NW',
      conditions: 'sunny'
    },
    image: '/images/course-torrey.jpg',
    unlocked: false
  }
];

export function CourseSelector({ selectedCourse, onCourseSelect, userTier }: CourseSelectorProps) {
  const [showWeather, setShowWeather] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getWeatherIcon = (conditions: string) => {
    switch (conditions) {
      case 'sunny': return <Sun size={16} className="text-yellow-400" />;
      case 'cloudy': return <Cloud size={16} className="text-gray-400" />;
      case 'rainy': return <CloudRain size={16} className="text-blue-400" />;
      default: return <Sun size={16} className="text-yellow-400" />;
    }
  };

  const isCourseUnlocked = (course: Course) => {
    if (course.unlocked) return true;
    if (userTier === 'elite') return true;
    if (userTier === 'pro' && course.difficulty !== 'hard') return true;
    return false;
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af3740] rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          <MapPin size={20} />
          Course Select
        </h3>
        <button
          onClick={() => setShowWeather(!showWeather)}
          className="text-gray-400 hover:text-[#d4af37] transition-colors"
        >
          <Wind size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {courses.map((course) => {
          const unlocked = isCourseUnlocked(course);
          const isSelected = selectedCourse === course.name;

          return (
            <div
              key={course.id}
              className={`relative rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#d4af37] bg-[#d4af37]/10'
                  : unlocked
                  ? 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'
                  : 'border-gray-800 bg-gray-900/50'
              } ${!unlocked ? 'opacity-60' : ''}`}
              onClick={() => unlocked && onCourseSelect(course.name)}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${isSelected ? 'text-[#d4af37]' : 'text-white'}`}>
                      {course.name}
                    </h4>
                    {!unlocked && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {userTier === 'free' ? 'PRO+' : 'ELITE'}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-bold ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-2">{course.description}</p>

                {course.par > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Par: {course.par}</span>
                    <span>{course.length}yd</span>
                  </div>
                )}

                {showWeather && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        {getWeatherIcon(course.weather.conditions)}
                        <span className="text-gray-400">{course.weather.temperature}°F</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind size={12} className="text-gray-400" />
                        <span className="text-gray-400">
                          {course.weather.windSpeed}mph {course.weather.windDirection}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!unlocked && (
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">🔒 Locked</div>
                    <div className="text-xs text-gray-500">
                      Upgrade to unlock
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          {showWeather ? 'Weather conditions affect ball flight' : 'Tap wind icon for weather details'}
        </div>
      </div>
    </div>
  );
}