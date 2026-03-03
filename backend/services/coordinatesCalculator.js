/**
 * ==========================================================
 * File        : coordinatesCalculator.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Service to calculate distances between geographical coordinates
 * ==========================================================
 */

// Function to calculate distance between two coordinates using Haversine formula
function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  const R = 6371000; // radius of Earth in meters
  const toRad = (deg) => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}


module.exports={
    getDistanceFromLatLon
}