'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type SimpleMapProps = {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
};

export default function SimpleMap({ position, onPositionChange }: SimpleMapProps) {
  useEffect(() => {
    // Initialize map
    const map = L.map('map-container').setView(position, 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    const marker = L.marker(position, {
      draggable: true
    }).addTo(map);

    // Event handlers
    function handleClick(e: L.LeafletMouseEvent) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
      marker.setLatLng(e.latlng);
    }

    function handleDragEnd(e: L.DragEndEvent) {
      const newPos = e.target.getLatLng();
      onPositionChange(newPos.lat, newPos.lng);
    }

    map.on('click', handleClick);
    marker.on('dragend', handleDragEnd);

    // Cleanup
    return () => {
      map.off('click', handleClick);
      marker.off('dragend', handleDragEnd);
      map.remove();
    };
  }, [position, onPositionChange]);

  return <div id="map-container" className="h-full w-full" />;
}