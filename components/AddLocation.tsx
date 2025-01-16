"use client";
import Image from "next/image";
import { useState } from "react";

const AddLocationForm = ({ onLocationAdded }: { onLocationAdded: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // 🔹 Upload Image to the Server
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setPhotos([...photos, data.url]);
    } else {
      alert("File upload failed.");
    }
  };

  // 🔹 Fetch Coordinates from Mapbox Geocoding API
  const fetchCoordinates = async () => {
    if (!placeName) return alert("Please enter a place name.");

    setGeoLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      setGeoLoading(false);

      if (data.features.length > 0) {
        const [lon, lat] = data.features[0].center;
        setLatitude(lat.toString());
        setLongitude(lon.toString());
      } else {
        alert("Location not found. Try entering a more specific place.");
      }
    } catch (error) {
      setGeoLoading(false);
      console.log(error)
      alert("Failed to fetch coordinates.");
    }
  };

  // 🔹 Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) return alert("Please fetch coordinates first!");

    const response = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: placeName || name,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        photos,
      }),
    });

    if (response.ok) {
      onLocationAdded();
      setName("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setPlaceName("");
      setPhotos([]);
      alert("Location added successfully!");
    } else {
      alert("Failed to add location.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Add a New Location</h2>

      {/* 🔹 Place Name Input */}
      <input
        type="text"
        placeholder="Enter Place Name (e.g., Eiffel Tower)"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        className="w-full p-2 mb-4 border rounded text-black"
        required
      />

      <button
        type="button"
        onClick={fetchCoordinates}
        className="bg-blue-500 text-white p-2 rounded w-full mb-4"
        disabled={geoLoading}
      >
        {geoLoading ? "Fetching..." : "Get Coordinates"}
      </button>

      {/* 🔹 Coordinates Fields (Auto-filled) */}
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          readOnly
          className="p-2 border rounded w-1/2 bg-gray-100 text-black"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          readOnly
          className="p-2 border rounded w-1/2 bg-gray-100 text-black"
        />
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mt-4 mb-4 border rounded text-black"
        required
      />

      {/* 🔹 Photo Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="w-full p-2 mt-4 mb-4 border rounded text-black"
      />

      {loading && <p className="text-gray-600">Uploading...</p>}

      <ul className="mb-4">
        {photos.map((url, index) => (
          <li key={index}>
            <Image src={url} alt={`Uploaded ${index}`} className="w-20 h-20 rounded-lg" width={100} height={100} />
          </li>
        ))}
      </ul>

      <button type="submit" className="w-full bg-pink-500 text-white p-2 rounded">
        Add Location
      </button>
    </form>
  );
};

export default AddLocationForm;