'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from 'react-leaflet';

interface GolfCourse {
  id: string;
  name: string;
  location: [number, number]; // [lat, lng]
  par: number;
  holes: number;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

interface GPSData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export default function GPSCourseMapper() {
  const [userLocation, setUserLocation] = useState<GPSData | null>(null);
  const [courses, setCourses] = useState<GolfCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Sample golf courses data (in real app, this would come from API)
  const sampleCourses: GolfCourse[] = useMemo(() => ([
    {
      id: '1',
      name: 'Pebble Beach Golf Links',
      location: [36.5689, -121.9508],
      par: 72,
      holes: 18,
      rating: 4.8,
      difficulty: 'Expert'
    },
    {
      id: '2',
      name: 'Augusta National',
      location: [33.5022, -82.0221],
      par: 72,
      holes: 18,
      rating: 4.9,
      difficulty: 'Expert'
    },
    {
      id: '3',
      name: 'St. Andrews Links',
      location: [56.3436, -2.8032],
      par: 72,
      holes: 18,
      rating: 4.7,
      difficulty: 'Hard'
    },
    {
      id: '4',
      name: 'Local Municipal Course',
      location: [40.7128, -74.0060], // NYC coordinates as example
      par: 70,
      holes: 18,
      rating: 3.8,
      difficulty: 'Medium'
    }
  ]), []);

  useEffect(() => {
    setCourses(sampleCourses);
  }, [sampleCourses]);

  // Helper component to imperatively change map center when selection changes
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom(), { animate: true });
    }, [center, map]);
    return null;
  }

  // Get current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpsData: GPSData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        setUserLocation(gpsData);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please check permissions.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Start GPS tracking
  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const gpsData: GPSData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        setUserLocation(gpsData);
      },
      (error) => {
        console.error('GPS tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    setWatchId(id);
    setIsTracking(true);
  };

  // Stop GPS tracking
  const stopGPSTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Find nearest courses
  const findNearestCourses = (maxDistance: number = 50): GolfCourse[] => {
    if (!userLocation) return [];

    return courses
      .map(course => ({
        ...course,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          course.location[0],
          course.location[1]
        )
      }))
      .filter(course => course.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  };

  const nearestCourses = findNearestCourses();

  const mapCenter: [number, number] = useMemo(() => {
    if (selectedCourse) return selectedCourse.location;
    if (userLocation) return [userLocation.latitude, userLocation.longitude];
    return sampleCourses[0].location; // sensible default
  }, [selectedCourse, userLocation, sampleCourses]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-800 via-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-300 mb-2">
            GPS Course Mapper
          </h1>
          <p className="text-white/90">
            Find and navigate to real golf courses near you
          </p>
        </div>

        {/* GPS Controls */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-2xl mx-auto mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={getCurrentLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              📍 Get My Location
            </button>
            <button
              onClick={isTracking ? stopGPSTracking : startGPSTracking}
              className={`font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                isTracking
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isTracking ? '⏹️ Stop Tracking' : '🎯 Start GPS Tracking'}
            </button>
          </div>

          {/* Location Status */}
          {userLocation && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <h3 className="font-bold mb-2">Current Location:</h3>
              <p>Latitude: {userLocation.latitude.toFixed(6)}</p>
              <p>Longitude: {userLocation.longitude.toFixed(6)}</p>
              <p>Accuracy: ±{userLocation.accuracy.toFixed(1)} meters</p>
              <p className="text-sm text-white/60 mt-2">
                Last updated: {new Date(userLocation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Map and Course List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Map */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Course Map</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                {...({ center: mapCenter } as any)}
                {...({ zoom: 12 } as any)}
                {...({ scrollWheelZoom: true } as any)}
                style={{ height: '100%', width: '100%' }}
              >
                <ChangeView center={mapCenter} />
                <TileLayer
                  {...({ attribution: '© OpenStreetMap contributors' } as any)}
                  {...({ url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' } as any)}
                />

                {/* User Location + accuracy circle */}
                {userLocation && (
                  <>
                    <Circle
                      {...({ center: [userLocation.latitude, userLocation.longitude] } as any)}
                      {...({ radius: Math.max(10, userLocation.accuracy) } as any)}
                      {...({ pathOptions: { color: '#60a5fa', fillColor: '#3b82f6', fillOpacity: 0.2 } } as any)}
                    />
                    <CircleMarker
                      {...({ center: [userLocation.latitude, userLocation.longitude] } as any)}
                      {...({ radius: 6 } as any)}
                      {...({ pathOptions: { color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 1 } } as any)}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-semibold">You are here</div>
                          <div>Accuracy: ±{userLocation.accuracy.toFixed(0)}m</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  </>
                )}

                {/* Course markers */}
                {courses.map((course) => (
                  <CircleMarker
                    key={course.id}
                    {...({ center: course.location } as any)}
                    {...({ radius: 8 } as any)}
                    {...({ eventHandlers: { click: () => setSelectedCourse(course) } } as any)}
                    {...({ pathOptions: {
                      color: selectedCourse?.id === course.id ? '#d97706' : '#d4af37',
                      fillColor: selectedCourse?.id === course.id ? '#f59e0b' : '#eab308',
                      fillOpacity: 0.8,
                    } } as any)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-semibold">{course.name}</div>
                        <div>Par {course.par} • {course.holes} holes</div>
                        <div className="text-xs text-gray-600">{course.difficulty} • ⭐ {course.rating}</div>
                        {userLocation && (
                          <div className="mt-1 text-xs">
                            {calculateDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              course.location[0],
                              course.location[1]
                            ).toFixed(1)} km away
                          </div>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Course List */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">
              Nearby Courses {userLocation && `(${nearestCourses.length} found)`}
            </h2>

            {userLocation ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {nearestCourses.length > 0 ? (
                  nearestCourses.map(course => (
                    <div
                      key={course.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedCourse?.id === course.id
                          ? 'bg-blue-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <h3 className="font-bold text-lg">{course.name}</h3>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Par: {course.par}</span>
                        <span>⭐ {course.rating}/5</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{course.difficulty}</span>
                        <span className="text-blue-400">
                          {calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            course.location[0],
                            course.location[1]
                          ).toFixed(1)} km away
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No courses found within 50km. Try adjusting your location.</p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60 mb-4">
                  Enable location services to find nearby golf courses
                </p>
                <button
                  onClick={getCurrentLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  Find Courses Near Me
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Course Details */}
        {selectedCourse && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedCourse.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{selectedCourse.par}</div>
                <div className="text-sm text-white/60">Par</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{selectedCourse.holes}</div>
                <div className="text-sm text-white/60">Holes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedCourse.rating}</div>
                <div className="text-sm text-white/60">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{selectedCourse.difficulty}</div>
                <div className="text-sm text-white/60">Difficulty</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                🗺️ Navigate Here
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                🎮 Start Round
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}