import { useState, useEffect } from "react"
import { getIncidentsByUser, saveIncidentsOffline, getIncidentsOffline } from "../services/dashboard/incidentsService"

export const useIncidents = (usuario, isOffline) => {
  const [incidencias, setIncidencias] = useState([])
  const [selectedIncidencia, setSelectedIncidencia] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const empleadoId = usuario?.user?.empleado_id
    if (empleadoId) {
      fetchIncidencias(empleadoId)
    }
  }, [usuario?.user?.empleado_id])

  const fetchIncidencias = async (empleadoId) => {
    try {
      setLoading(true)
      const data = isOffline
        ? await getIncidentsOffline(empleadoId)
        : await getIncidentsByUser(empleadoId);

      if (!isOffline) {
        await saveIncidentsOffline(data); // solo si estás en línea
      }

      const mapped = data.map((item) => ({
        id: item.incidencia_id,
        tipo: item.tipo_incidencia,
        descripcion: item.descripcion,
        fecha_incidencia: item.fecha_incidencia.split("T")[0],
        archivo_evidencia: item.ruta_archivo || null,
        archivo_url: item.ruta_archivo
          ? `http://localhost:3000/uploads/${item.ruta_archivo}`
          : null,
        estado:
          item.estado === "pendiente"
            ? "En Proceso"
            : item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
      }))

      setIncidencias(mapped)
    } catch (error) {
      console.error("Error al cargar incidencias:", error)
      setIncidencias([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewIncidencia = (incidencia) => {
    setSelectedIncidencia(incidencia)
    setShowModal(true)
  }

  const handleDownloadFile = (archivo_url, archivo_nombre) => {
    const link = document.createElement("a")
    link.href = archivo_url
    link.download = archivo_nombre
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    incidencias,
    selectedIncidencia,
    showModal,
    loading,
    setShowModal,
    handleViewIncidencia,
    handleDownloadFile,
    fetchIncidencias
  }
}
