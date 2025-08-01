import { useState, useEffect } from "react";
import { Lock, MailCheck } from "lucide-react";

const PINModal = ({
  handleClose,
  handleSubmitPIN,
  inputsRef,
  handleChange,
  handleKeyDown,
  showCodeInput,
  handleCodeChange,
  code,
  timer,
  progress,
  handleValidateCode
}) => {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 bg-primary text-white">
            <h5 className="modal-title fw-semibold d-flex align-items-center">
              <Lock size={20} className="me-2" />
              Ingresar PIN de Asistencia
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
          </div>

          <div className="modal-body p-4 text-center">
            {!showCodeInput ? (
              <>
                <p className="text-muted mb-3">Introduce los 4 dígitos asignados para registrar tu asistencia.</p>
                <div className="d-flex justify-content-center gap-3 mb-4">
                  {inputsRef.map((ref, index) => (
                    <input
                      key={index}
                      type="password"
                      maxLength={1}
                      className="form-control text-center fs-4 fw-bold"
                      style={{ width: "60px", height: "60px" }}
                      ref={ref}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>
                <button className="btn btn-primary px-4 py-2" onClick={handleSubmitPIN}>
                  Confirmar PIN
                </button>
              </>
            ) : (
              <>
                <p className="text-muted mb-3 d-flex align-items-center justify-content-center">
                  <MailCheck size={18} className="me-2" />
                  Ingresa el código enviado a tu correo.
                </p>
                <input
                  type="text"
                  className="form-control text-center mb-3"
                  maxLength={6}
                  value={code}
                  onChange={handleCodeChange}
                />
                <div className="progress mb-3" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-muted mb-2">Tiempo restante: {timer} segundos</p>
                <button className="btn btn-primary px-4 py-2" onClick={handleValidateCode}>
                  Validar Código
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PINModal;