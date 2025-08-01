"use client"

import { useState, useEffect } from "react"
import "../app/splash-screen.css" // Asegúrate de que la ruta sea correcta

export default function SplashScreen() {
  const [animationPhase, setAnimationPhase] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isMounted, setIsMounted] = useState(true) // Nuevo estado para controlar el desmontaje final

  useEffect(() => {
    // Fases de animación para la aparición del contenido
    const timer1 = setTimeout(() => setAnimationPhase(1), 300) // INAEBA letters
    const timer2 = setTimeout(() => setAnimationPhase(2), 800) // Subtitle
    const timer3 = setTimeout(() => setAnimationPhase(3), 1500) // Loading indicator

    // Iniciar el desvanecimiento después de que todas las animaciones de contenido hayan terminado
    // y se haya mostrado el splash screen por un tiempo.
    const fadeOutStartTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 2500) // Empieza a desvanecerse después de 2.5 segundos

    // Desmontar completamente el componente después de que la transición de desvanecimiento haya terminado
    // (asumiendo una transición de 1 segundo en el CSS).
    const unmountTimer = setTimeout(() => {
      setIsMounted(false)
    }, 2500 + 1000) // Tiempo total: 2.5s (contenido) + 1s (desvanecimiento) = 3.5 segundos

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(fadeOutStartTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  // Si no está montado, no renderizar nada
  if (!isMounted) return null

  return (
    <div className={`splash-main-container ${isFadingOut ? "splash-fading-out" : ""}`}>
      {/* Elementos decorativos de fondo */}
      <div className="splash-background-elements">
        {/* Libros flotantes */}
        <div className="splash-book splash-book-1"></div>
        <div className="splash-book splash-book-2"></div>
        <div className="splash-book splash-book-3"></div>
        {/* Lápices */}
        <div className="splash-pencil splash-pencil-1"></div>
        <div className="splash-pencil splash-pencil-2"></div>
        {/* Círculos que representan puntos/notas */}
        <div className="splash-circle splash-circle-1"></div>
        <div className="splash-circle splash-circle-2"></div>
        <div className="splash-circle splash-circle-3"></div>
        {/* Formas geométricas educativas */}
        <div className="splash-square"></div>
        <div className="splash-triangle"></div>
        {/* Líneas que simulan texto/escritura */}
        <div className="splash-text-lines">
          <div className="splash-line splash-line-1"></div>
          <div className="splash-line splash-line-2"></div>
        </div>
        <div className="splash-text-lines splash-text-lines-bottom">
          <div className="splash-line splash-line-3"></div>
          <div className="splash-line splash-line-4"></div>
        </div>
        {/* Graduación/Birrete simulado */}
        <div className="splash-graduation">
          <div className="splash-cap"></div>
          <div className="splash-tassel"></div>
        </div>
      </div>
      {/* Contenido principal */}
      <div className="splash-main-content">
        {/* Texto INAEBA animado */}
        <div className="splash-title-container">
          <h1 className="splash-main-title">
            {"INAEBA".split("").map((letter, index) => (
              <span
                key={index}
                className={`splash-letter ${animationPhase >= 1 ? "splash-letter-visible" : ""}`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>
        {/* Subtítulo */}
        <div className={`splash-subtitle-container ${animationPhase >= 2 ? "splash-subtitle-visible" : ""}`}>
          <p className="splash-subtitle">Instituto de Alfabetización y Educación Básica para Adultos</p>
        </div>
        {/* Indicador de carga */}
        <div className={`splash-loading-container ${animationPhase >= 3 ? "splash-loading-visible" : ""}`}>
          {/* Spinner personalizado */}
          <div className="splash-spinner-container">
            <div className="splash-spinner-bg"></div>
            <div className="splash-spinner"></div>
          </div>
          {/* Puntos de carga */}
          <div className="splash-dots-container">
            <div className="splash-dot splash-dot-1"></div>
            <div className="splash-dot splash-dot-2"></div>
            <div className="splash-dot splash-dot-3"></div>
          </div>
          <p className="splash-loading-text">Cargando tu experiencia educativa...</p>
        </div>
      </div>
    </div>
  )
}
