"use client";

import { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const Map = ({ geocodedLocations }) => {
  const [pins, setPins] = useState([]);
  const [lastHeading, setLastHeading] = useState(NaN); 
  const [mapOptions, setMapOptions] = useState({
    zoom: 10,
    center: {lat: 40.6, lng: -74}
  })

  // Custom marker icon for the geocoded locations (e.g., red color)
  const geocodedMarkerIcon = {
    url: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(20, 40),
  };

  const [geocodedMarkers, setGeocodedMarkers] = useState([]);


  useEffect(() => {
    // Update the map center and zoom whenever a new pin is added
    if (pins.length > 0) {
      const lastPin = pins[pins.length - 1];
      setMapOptions({
        zoom: lastPin.zoom,
        center: { lat: lastPin.latitude, lng: lastPin.longitude },
      });
    }
  }, [pins]);


   // Convert geocodedLocations string to an array
   useEffect(() => {
    if (geocodedLocations && typeof geocodedLocations === "string") {
      try {
        const parsedLocations = JSON.parse(geocodedLocations);
        if (Array.isArray(parsedLocations)) {
          setGeocodedMarkers(
            parsedLocations.map((location, index) => ({
              position: { lat: location.latitude, lng: location.longitude },
              icon: geocodedMarkerIcon,
              key: `geocoded-marker-${index}`,
            }))
          );
        }
      } catch (error) {
        console.error("Error parsing geocodedLocations:", error);
      }
    }
  }, [geocodedLocations]);

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  
  const calculateHeading = (source, destination) => {
    const lat1 = toRadians(source.latitude);
    const lon1 = toRadians(source.longitude);
    const lat2 = toRadians(destination.latitude);
    const lon2 = toRadians(destination.longitude);
    const deltaLon = lon2 - lon1;
  
    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
  
    let heading = (Math.atan2(y, x) * 180) / Math.PI;
    heading = (heading + 360) % 360; // Convert to positive degrees
  
    return heading;
  };
  


  const handleMapClick = (event) => {
    const latLng = event.latLng;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    
    let heading = 0;
    if (pins.length > 0) {
      const lastPin = pins[pins.length - 1];
      heading = calculateHeading(lastPin, { latitude, longitude });
  
      // Update the last heading before adding the new pin
      setLastHeading(heading);
    }
  
    setPins((prevPins) => {
      if (prevPins.length > 0) {
        // Get the last pin and update its heading
        const updatedLastPin = { ...prevPins[prevPins.length - 1], heading };
        // Replace the last pin with the updated one and add the new pin
        return [...prevPins.slice(0, prevPins.length - 1), updatedLastPin, { latitude, longitude, heading }];
      } else {
        return [...prevPins, { latitude, longitude, heading }];
      }
    });
  };

  const handleExportToClipboard = () => {
    const text = pins.map((pin) => `${pin.latitude}\t${pin.longitude}`).join("\n");
    navigator.clipboard.writeText(text);
    alert("Pins copied to clipboard!");
  };

  const handleDeleteLast = () => {
    setPins((prevPins) => {
      if (prevPins.length > 0) {
        // Remove the last pin from the array
        const updatedPins = prevPins.slice(0, prevPins.length - 1);

        // Update the heading of the new last pin (if applicable)
        if (updatedPins.length > 1) {
          const secondLastPin = updatedPins[updatedPins.length - 2];
          const heading = secondLastPin.heading;
          const lastPin = { ...updatedPins[updatedPins.length - 1], heading };
          updatedPins[updatedPins.length - 1] = lastPin;
        }

        return updatedPins;
      } else {
        return prevPins; // No pins to remove
      }
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <GoogleMap
        zoom={mapOptions.zoom}
        center={mapOptions.center}
        mapContainerClassName="map-container"
        onClick={handleMapClick} // Call handleMapClick on map click
      >
        {/* Render the markers for geocodedLocations */}
        {geocodedMarkers.map((marker) => (
            <Marker {...marker} />
        ))}
        
        {pins.map((pin, index) => (
          <Marker
            key={index}
            position={{ lat: pin.latitude, lng: pin.longitude }}
          />
        ))}
      </GoogleMap>

      <div className="recorded-pins-container">
        <h2>Recorded Pins:</h2>
        <ul>
          {pins.map((pin, index) => (
            <li key={index}>Latitude: {pin.latitude.toFixed(6)}, Longitude: {pin.longitude.toFixed(6)}, Heading: {pin.heading.toFixed(0)}</li>
          ))}
        </ul>
        <div className="export-buttons">
            <button onClick={handleExportToClipboard}>Copy To Clipboard</button>
            <button onClick={handleDeleteLast}>Delete Last Pin</button>
        </div>
      </div>
    </div>
  );
};

export default Map;