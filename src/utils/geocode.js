const axios = require("axios");

const geocode = async (locationName) => {
  const apiKey = process.env.GOOGLE_GEOCODE_API_KEY; // Actually a Mapbox key now
  const encoded = encodeURIComponent(locationName);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${apiKey}`;

  const response = await axios.get(url);
  const feature = response.data.features[0];

  if (!feature) throw new Error("Location not found");

  const [longitude, latitude] = feature.center;

  return {
    latitude,
    longitude,
    address: feature.place_name,
    city: feature.context?.find(c => c.id.startsWith("place"))?.text || "",
    state: feature.context?.find(c => c.id.startsWith("region"))?.text || "",
    country: feature.context?.find(c => c.id.startsWith("country"))?.text || "",
  };
};

module.exports = geocode;
