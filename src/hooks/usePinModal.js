import { useState, useRef, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { MD5 } from "crypto-js";

export const usePinModal = (usuario) => {
  const [showPINModal, setShowPINModal] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(30);
  const [progress, setProgress] = useState(100);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const { showError, showSuccess } = useToast();

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (value.length === 1 && index < inputsRef.length - 1) {
      inputsRef[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef[index - 1].current?.focus();
    }
  };

  const handleSubmitPIN = () => {
    const pin = inputsRef.map((ref) => ref.current?.value).join("");
    const hashedPIN = MD5(pin).toString();

    if (hashedPIN === usuario?.work_info?.pin) {
      setShowCodeInput(true);
      startTimer();
    } else {
      showError("PIN incorrecto");
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleValidateCode = () => {
    if (code === "999999") {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      showSuccess("Código validado correctamente");
      reset();
    } else {
      showError("Código incorrecto");
    }
  };

  const startTimer = () => {
    let time = 30;
    let prog = 100;

    setTimer(time);
    setProgress(prog);

    intervalRef.current = setInterval(() => {
      time--;
      prog -= 100 / 30;
      setTimer(time);
      setProgress(prog);
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      showError("Se agotó el tiempo para ingresar el código");
      reset();
    }, 30000);
  };

  const reset = () => {
    setShowPINModal(false);
    setShowCodeInput(false);
    setCode("");
    setTimer(30);
    setProgress(100);
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  };

  return {
    showPINModal,
    setShowPINModal,
    inputsRef,
    handleChange,
    handleKeyDown,
    handleSubmitPIN,
    showCodeInput,
    handleCodeChange,
    code,
    timer,
    progress,
    handleValidateCode,
  };
};
