/* eslint-disable consistent-return */
import axios from 'axios';

// Fetch places data within specified boundaries
export const getPlacesData = async (type, sw, ne) => {
  try {
    const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
      params: {
        bl_latitude: sw.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
        tr_latitude: ne.lat,
      },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPID_API_TRAVEL_API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      },
    });

    return data;
  } catch (error) {
    return [];
  }
};

// Fetch weather data based on latitude and longitude
export const getWeatherData = async (lat, lng) => {
  try {
    if (!lat || !lng) {
      return null;
    }

    const { data } = await axios.get('https://community-open-weather-map.p.rapidapi.com/find', {
      params: { lat, lon: lng },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPID_API_WEATHER_API_KEY,
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
      },
    });
    return data;
  } catch (error) {
    return null;
  }
};
