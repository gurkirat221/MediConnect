// services/googleMapsService.js
const axios = require("axios");

const GOOGLE_MAPS_API = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

exports.findNearbyHospitals = async (lat, lng, radius = 5000) => {
  try {
    const response = await axios.get(GOOGLE_MAPS_API, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type: "hospital",
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    return response.data.results.map(hospital => ({
      name: hospital.name,
      address: hospital.vicinity,
      rating: hospital.rating || "N/A",
      location: hospital.geometry.location
    }));
  } catch (err) {
    console.error("❌ Google Maps Error:", err.response?.data || err.message);
    throw new Error("Failed to fetch hospitals");
  }
};
