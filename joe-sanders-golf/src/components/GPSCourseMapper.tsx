'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<GPSData | null>(null);
  const [courses, setCourses] = useState<GolfCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [lastCenter, setLastCenter] = useState<[number, number] | null>(null);

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

  // Preselect course by query param (e.g., ?courseId=2) or custom lat/lng
  useEffect(() => {
    const id = searchParams.get('courseId');
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    if (id) {
      const found = sampleCourses.find(c => c.id === id);
      if (found) setSelectedCourse(found);
      return;
    }
    if (latStr && lngStr) {
      const lat = Number(latStr);
      const lng = Number(lngStr);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setSelectedCourse({
          id: 'custom',
          name: 'Custom Location',
          location: [lat, lng],
          par: 0,
          holes: 0,
          rating: 0,
          difficulty: 'Easy'
        });
      }
      return;
    }
    // Restore last session if present
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('gps:lastSelection') : null;
      if (saved) {
        const parsed = JSON.parse(saved) as { id?: string; name?: string; location?: [number, number] };
        if (parsed?.location) {
          setSelectedCourse({
            id: parsed.id || 'last',
            name: parsed.name || 'Last Location',
            location: parsed.location,
            par: 0,
            holes: 0,
            rating: 0,
            difficulty: 'Easy',
          });
        }
      }
      const savedCenter = typeof window !== 'undefined' ? window.localStorage.getItem('gps:lastCenter') : null;
      if (savedCenter) {
        const parsed = JSON.parse(savedCenter) as { center: [number, number] };
        if (parsed?.center) setLastCenter(parsed.center);
      }
    } catch {}
  }, [searchParams, sampleCourses]);

  // Helper component to imperatively change map center when selection changes
  function ChangeView({ center }: { center: LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom(), { animate: true });
    }, [center, map]);
    return null;
  }

  // Get current GPS location
  const getCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('Geolocation is not supported by this browser.');
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
        setGeoError(null);
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Enable it in your browser settings to find nearby courses.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGeoError('Location information is unavailable right now.');
        } else if (error.code === error.TIMEOUT) {
          setGeoError('Timed out getting your location. Try again.');
        } else {
          setGeoError('Unable to get your location.');
        }
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
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
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
        setGeoError(null);
      },
      (error) => {
        console.error('GPS tracking error:', error);
        setGeoError('GPS tracking error. You can retry or stop tracking.');
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

  const mapCenter: LatLngExpression = useMemo(() => {
    if (selectedCourse) return selectedCourse.location;
    if (userLocation) return [userLocation.latitude, userLocation.longitude];
    if (lastCenter) return lastCenter;
    return sampleCourses[0].location; // sensible default
  }, [selectedCourse, userLocation, sampleCourses, lastCenter]);

  // Filter courses by search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(c => c.name.toLowerCase().includes(q));
  }, [courses, searchQuery]);

  // Persist selection and center
  useEffect(() => {
    try {
      if (selectedCourse) {
        const payload = { id: selectedCourse.id, name: selectedCourse.name, location: selectedCourse.location };
        window.localStorage.setItem('gps:lastSelection', JSON.stringify(payload));
      }
      if (Array.isArray(mapCenter)) {
        window.localStorage.setItem('gps:lastCenter', JSON.stringify({ center: mapCenter }));
      }
    } catch {}
  }, [selectedCourse, mapCenter]);

  // Share current selection/location via link
  const handleShareLink = async () => {
    let url = '/gps-courses';
    if (selectedCourse) {
      const known = courses.find(c => c.id === selectedCourse.id);
      if (known) {
        url += `?courseId=${encodeURIComponent(selectedCourse.id)}`;
      } else if (selectedCourse.location) {
        const [lat, lng] = selectedCourse.location;
        url += `?lat=${lat}&lng=${lng}`;
      }
    } else if (userLocation) {
      url += `?lat=${userLocation.latitude}&lng=${userLocation.longitude}`;
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const full = typeof window !== 'undefined' ? window.location.origin + url : url;
        await navigator.clipboard.writeText(full);
        alert('Link copied to clipboard!');
      } else {
        // Fallback
        const full = typeof window !== 'undefined' ? window.location.origin + url : url;
        prompt('Copy this link:', full);
      }
    } catch {
      // Fallback
      const full = typeof window !== 'undefined' ? window.location.origin + url : url;
      prompt('Copy this link:', full);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredCourses.length > 0) {
      const first = filteredCourses[0];
      setSelectedCourse(first);
    }
  };

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
          {geoError && (
            <div className="mb-4 p-3 rounded-md bg-red-600/20 border border-red-600/40 text-red-200 text-sm">
              {geoError}
            </div>
          )}
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 justify-center mb-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="min-w-[200px] flex-1 max-w-xs bg-white/20 text-white placeholder-white/70 px-3 py-2 rounded-md border border-white/20 focus:outline-none focus:border-white/40"
            />
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-md">
              Search
            </button>
            <button type="button" onClick={handleShareLink} className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-md">
              Share Link
            </button>
          </form>
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
                center={mapCenter}
                zoom={12}
                scrollWheelZoom
                style={{ height: '100%', width: '100%' }}
              >
                <ChangeView center={mapCenter} />
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location + accuracy circle */}
                {userLocation && (
                  <>
                    <Circle
                      center={[userLocation.latitude, userLocation.longitude]}
                      radius={Math.max(10, userLocation.accuracy)}
                      pathOptions={{ color: '#60a5fa', fillColor: '#3b82f6', fillOpacity: 0.2 }}
                    />
                    <CircleMarker
                      center={[userLocation.latitude, userLocation.longitude]}
                      radius={6}
                      pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 1 }}
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
                {filteredCourses.map((course) => (
                  <CircleMarker
                    key={course.id}
                    center={course.location as LatLngExpression}
                    radius={8}
                    eventHandlers={{ click: () => setSelectedCourse(course) }}
                    pathOptions={{
                      color: selectedCourse?.id === course.id ? '#d97706' : '#d4af37',
                      fillColor: selectedCourse?.id === course.id ? '#f59e0b' : '#eab308',
                      fillOpacity: 0.8,
                    }}
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
                  nearestCourses
                    .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(course => (
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

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => router.push(`https://www.google.com/maps?q=${selectedCourse.location[0]},${selectedCourse.location[1]}`)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                title="Open in Google Maps"
              >
                🗺️ Navigate Here
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set('courseId', selectedCourse.id);
                  params.set('lat', String(selectedCourse.location[0]));
                  params.set('lng', String(selectedCourse.location[1]));
                  router.push(`/simulator?${params.toString()}`);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                title="Open simulator with this course context"
              >
                🎮 Start Round
              </button>
              <button
                onClick={handleShareLink}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                title="Copy a shareable link to this course"
              >
                🔗 Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}