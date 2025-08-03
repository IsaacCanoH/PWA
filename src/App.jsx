import React, { Suspense } from "react"; // 👈 agrega Suspense
import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes"
import { loadModels } from "./services/faceApiService";
import SplashScreen from "./components/SplashScreen/splash-screen";

const App = () => {
  const [isLoading, setIsLoading] = useState(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const alreadyShown = sessionStorage.getItem("splashShown");
    return isStandalone && !alreadyShown;
  });

  useEffect(() => {
    const preload = async () => {
      try {
        await loadModels();
        console.log("Modelos precargados");
      } catch (err) {
        console.error("Error al cargar modelos:", err);
      } finally {
        setTimeout(() => {
          sessionStorage.setItem("splashShown", "true");
          setIsLoading(false);
        }, 4000); // igual que duración del splash
      }
    };

    if (isLoading) {
      preload();
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <Suspense fallback={<div className="app-loader">Cargando aplicación...</div>}>
          <AppRoutes />
        </Suspense>
      )}
    </>
  );
};

export default App;
