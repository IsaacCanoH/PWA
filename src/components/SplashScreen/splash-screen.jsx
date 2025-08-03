import { useState, useEffect } from "react"
import "./splash-screen.css"

export default function SplashScreen() {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    // Secuencia de animaciones
    const timer1 = setTimeout(() => setAnimationPhase(1), 500) 
    const timer2 = setTimeout(() => setAnimationPhase(2), 1200) 
    const timer3 = setTimeout(() => setAnimationPhase(3), 2000) 
    const timer4 = setTimeout(() => setAnimationPhase(4), 2800) 

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <div className="inaeba-splash-wrapper">
      {/* Elementos decorativos de fondo */}
      <div className="inaeba-bg-elements">
        <div className="inaeba-floating-shape inaeba-shape-1"></div>
        <div className="inaeba-floating-shape inaeba-shape-2"></div>
        <div className="inaeba-floating-shape inaeba-shape-3"></div>
        <div className="inaeba-floating-shape inaeba-shape-4"></div>
        <div className="inaeba-floating-shape inaeba-shape-5"></div>
        <div className="inaeba-floating-shape inaeba-shape-6"></div>
      </div>

      {/* Contenido principal */}
      <div className="inaeba-content-wrapper">
        {/* Logo/Icono */}
        <div className={`inaeba-logo-container ${animationPhase >= 1 ? "inaeba-logo-visible" : ""}`}>
          <div className="inaeba-logo-circle">
            <div className="inaeba-book-icon">
              <div className="inaeba-book-pages"></div>
              <div className="inaeba-book-spine"></div>
            </div>
          </div>
        </div>

        {/* Texto INAEBA */}
        <div className="inaeba-title-wrapper">
          <h1 className="inaeba-main-title">
            {"INAEBA".split("").map((letter, index) => (
              <span
                key={index}
                className={`inaeba-title-letter ${animationPhase >= 2 ? "inaeba-letter-animate" : ""}`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtítulo */}
        <div className={`inaeba-subtitle-wrapper ${animationPhase >= 3 ? "inaeba-subtitle-visible" : ""}`}>
          <p className="inaeba-subtitle-text">Instituto de Alfabetización y Educación Básica para Adultos</p>
        </div>

        {/* Indicador de carga */}
        <div className={`inaeba-loader-wrapper ${animationPhase >= 4 ? "inaeba-loader-visible" : ""}`}>
          <div className="inaeba-progress-bar">
            <div className="inaeba-progress-fill"></div>
          </div>
          <p className="inaeba-loading-text">Preparando tu experiencia educativa</p>
        </div>
      </div>
    </div>
  )
}
