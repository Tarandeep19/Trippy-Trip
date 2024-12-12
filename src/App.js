import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api/travelAdvisorAPI';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);

  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places, setPlaces] = useState([]);

  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user's location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setCoords({ lat: 0, lng: 0 }); // Default to the equator if geolocation fails
      },
    );
  }, []);

  // Filter places based on rating
  useEffect(() => {
    if (Array.isArray(places)) {
      const filtered = places.filter((place) => Number(place.rating) > rating);
      setFilteredPlaces(filtered);
    } else {
      console.error('Places is not an array:', places);
    }
  }, [rating, places]);

  // Fetch weather and places data
  useEffect(() => {
    if (bounds?.sw && bounds?.ne) {
      setIsLoading(true);

      Promise.all([
        getWeatherData(coords.lat, coords.lng),
        getPlacesData(type, bounds.sw, bounds.ne),
      ])
        .then(([weather, placesData]) => {
          setWeatherData(weather);
          setPlaces(placesData.filter((place) => place.name && place.num_reviews > 0));
          setFilteredPlaces([]);
          setRating('');
        })
        .catch((error) => console.error('Error fetching data:', error))
        .finally(() => setIsLoading(false));
    }
  }, [bounds, type, coords]);

  // Handle autocomplete
  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (!autocomplete) {
      console.error('Autocomplete not initialized');
      return;
    }

    const place = autocomplete.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCoords({ lat, lng });
    } else {
      console.error('Place has no geometry:', place);
    }
  };

  return (
    <>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      {isLoading && <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>}
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            places={filteredPlaces.length ? filteredPlaces : places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;