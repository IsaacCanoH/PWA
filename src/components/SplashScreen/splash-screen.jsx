"use client"

import { useState, useEffect } from "react"
import "./splash-screen.css"

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 500)
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500)
    const timer3 = setTimeout(() => setAnimationPhase(3), 2500)
    const timer4 = setTimeout(() => setIsVisible(false), 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  if (!isVisible) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <h1 className="welcome-title">¡Bienvenido a INAEBA!</h1>
          <p className="welcome-subtitle">Tu aplicación está lista</p>
        </div>
      </div>
    )
  }

  return (
    <div className="splash-container">
      {/* Elementos decorativos de fondo */}
      <div className="background-elements">
        {/* Libros flotantes */}
        <div className="book book-1"></div>
        <div className="book book-2"></div>
        <div className="book book-3"></div>

        {/* Lápices */}
        <div className="pencil pencil-1"></div>
        <div className="pencil pencil-2"></div>

        {/* Círculos que representan puntos/notas */}
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>

        {/* Formas geométricas educativas */}
        <div className="square"></div>
        <div className="triangle"></div>

        {/* Líneas que simulan texto/escritura */}
        <div className="text-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
        </div>
        <div className="text-lines text-lines-bottom">
          <div className="line line-3"></div>
          <div className="line line-4"></div>
        </div>

        {/* Graduación/Birrete simulado */}
        <div className="graduation">
          <div className="cap"></div>
          <div className="tassel"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {/* Texto INAEBA animado */}
        <div className="title-container">
          <h1 className="main-title">
            {"INAEBA".split("").map((letter, index) => (
              <span
                key={index}
                className={`letter ${animationPhase >= 1 ? "letter-visible" : ""}`}
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
        <div className={`subtitle-container ${animationPhase >= 2 ? "subtitle-visible" : ""}`}>
          <p className="subtitle">Instituto Nacional para la Educación de los Adultos</p>
        </div>

        {/* Indicador de carga */}
        <div className={`loading-container ${animationPhase >= 3 ? "loading-visible" : ""}`}>
          {/* Spinner personalizado */}
          <div className="spinner-container">
            <div className="spinner-bg"></div>
            <div className="spinner"></div>
          </div>

          {/* Puntos de carga */}
          <div className="dots-container">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>

          <p className="loading-text">Cargando tu experiencia educativa...</p>
        </div>
      </div>
    </div>
  )
}
