"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false); // 🔹 Track map initialization

  interface Location {
    id: string;
    name: string;
    description: string;
    photos: { url: string }[];
    longitude: number;
    latitude: number;
    createdAt: string;
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();

    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the map only once
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/antonio-ko/cm5zsuvez006v01qt7diu46zt",
      center: [-74.006, 40.7128],
      zoom: 12,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });

    mapRef.current.on("load", () => {
      setIsMapLoaded(true); // ✅ Set flag when map is fully loaded
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // 🔹 Add markers after map has loaded
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || locations.length === 0) return;

    locations.forEach((location) => {
      const popupContainer = document.createElement("div");
      popupContainer.innerHTML = `
        <div class="p-4 rounded-lg shadow-lg bg-white border border-gray-300 hover:border-pink-400 transition duration-300">
          <h3 class="text-lg font-bold text-pink-600">${location.name}</h3>
          <p class="text-gray-700">${location.description}</p>
          <p class="text-sm text-gray-500">Added on: ${new Date(location.createdAt).toLocaleDateString()}</p>
          ${
            location.photos.length > 0
              ? `<img src="${location.photos[0].url}" class="w-40 h-28 object-cover rounded-md mt-2 shadow-sm" />`
              : ""
          }
          <button 
            id="delete-${location.id}" 
            class="mt-3 px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-700 transition" 
          >
            Delete
          </button>
        </div>`;

      const popup = new mapboxgl.Popup({
        offset: 15,
        closeButton: false,
        closeOnClick: true,
      }).setDOMContent(popupContainer);

      if (mapRef.current) {
        new mapboxgl.Marker({ color: "#FF69B4" }) // 🎯 Pink marker
          .setLngLat([location.longitude, location.latitude])
          .setPopup(popup)
          .addTo(mapRef.current!);
      }

      // ✅ Attach event listener to delete button
      popup.on("open", () => {
        const deleteButton = document.getElementById(`delete-${location.id}`);
        if (deleteButton) {
          deleteButton.addEventListener("click", () => deleteLocation(location.id));
        }
      });
    });
  }, [isMapLoaded, locations]); // 🔹 Run only when the map is loaded and locations change

  // 🔹 Function to Delete Location
  const deleteLocation = async (id: string) => {
    try {
      const response = await fetch("/api/locations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setLocations((prev) => prev.filter((location) => location.id !== id));
      } else {
        alert("Failed to delete location.");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <div className="relative w-full h-screen mx-auto rounded-lg overflow-hidden shadow-xl border border-gray-300">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default Map;