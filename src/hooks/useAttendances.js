import { useState, useEffect, useRef } from "react";
import {
  getAttendancesByUser,
  saveAttendancesOffline,
  getAttendancesOffline,
} from "../services/dashboard/attendancesService";

export const useAttendances = (usuario, isOffline) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [statistics, setStatistics] = useState({});
  const hasFetched = useRef(false);

  const fetchAttendances = async () => {
    try {
      const employeeId = usuario.user.empleado_id;
      const data = await fetchAttendanceData(employeeId, isOffline);
      const history = processAttendanceHistory(data);
      const stats = calculateAttendanceStats(history);

      setAttendanceHistory(history);
      setStatistics(stats);
    } catch (err) {
      console.error("Error al cargar asistencias:", err.message);
    }
  };

  useEffect(() => {
    if (!usuario || hasFetched.current) return;
    hasFetched.current = true;
    fetchAttendances();
  }, [usuario, isOffline]);

  return {
    attendanceHistory,
    statistics,
    fetchAttendances,
  };
};

const fetchAttendanceData = async (employeeId, isOffline) => {
  const data = isOffline
    ? await getAttendancesOffline(employeeId)
    : await getAttendancesByUser(employeeId);

  if (!isOffline) {
    await saveAttendancesOffline(data);
  }

  return data;
};

const processAttendanceHistory = (attendances) => {
  const grouped = {};

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  attendances.forEach((record) => {
    const date = new Date(record.fecha_hora_registro);

    if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
      return;
    }

    const day = date.toLocaleDateString("es-MX", {
      timeZone: "America/Mexico_City",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const time = date.toLocaleTimeString("es-MX", {
      timeZone: "America/Mexico_City",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!grouped[day]) {
      grouped[day] = {
        entrada: "",
        salida: "",
        horas: "00:00",
        estado: "",
        condicion_salida: "",
        estado_final: "",
        fecha: day,
      };
    }

    const current = grouped[day];

    if (record.tipo === "entrada" && (!current.entrada || date < new Date(`${day} ${current.entrada}`))) {
      current.entrada = time;
      current.estado = record.condicion;
    }

    if (record.tipo === "salida" && (!current.salida || date > new Date(`${day} ${current.salida}`))) {
      current.salida = time;
      current.condicion_salida = record.condicion;
    }
  });

  const registros = calculateWorkedHours(Object.values(grouped));

  registros.forEach((item) => {
    if (
      (item.estado === "puntual" || item.estado === "retardo") &&
      item.condicion_salida === "falta"
    ) {
      item.estado_final = "falta";
    } else if (
      item.estado === "puntual" &&
      item.condicion_salida === "incompleto"
    ) {
      item.estado_final = "incompleta";
    } else {
      item.estado_final = item.estado;
    }
  });

  return registros;
};

const calculateWorkedHours = (data) =>
  data.map((item) => {
    if (item.entrada && item.salida) {
      const [h1, m1] = item.entrada.split(":").map(Number);
      const [h2, m2] = item.salida.split(":").map(Number);

      const entrada = new Date(0, 0, 0, h1, m1);
      const salida = new Date(0, 0, 0, h2, m2);
      const diff = salida - entrada;

      const hours = diff > 0 ? Math.floor(diff / 3600000) : 0;
      const minutes = diff > 0 ? Math.floor((diff % 3600000) / 60000) : 0;

      item.horas = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    return item;
  });

const calculateAttendanceStats = (history) => {
  const total = history.length;

  const incompletas = history.filter(
    (h) => h.estado === "puntual" && h.condicion_salida === "incompleto"
  ).length;

  const asistencias = history.filter(
    (h) => h.estado === "puntual" && h.condicion_salida !== "incompleto"
  ).length;

  const retardos = history.filter((h) => h.estado === "retardo").length;
  const faltas = history.filter((h) => h.estado === "falta").length;
  const porcentaje = total > 0 ? Math.round((asistencias / total) * 100) : 0;

  return {
    asistencias,
    retardos,
    faltas,
    incompletas,
    porcentaje,
  };
};
