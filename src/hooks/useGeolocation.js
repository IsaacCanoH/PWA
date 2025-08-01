import { useState } from "react";

export const useGeolocation = () => {
  const [error, setError] = useState(null);

  const getCoordinates = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error("Geolocalización no soportada");
        setError(err.message);
        return reject(err);
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          resolve({ latitude, longitude });
        },
        (err) => {
          const message = "Error obteniendo ubicación: " + err.message;
          setError(err.message);
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });

  return {
    getCoordinates,
    error,
  };
};
