import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardHeader from "../components/General/DashboardHeader"
import DashboardTabs from "../components/General/DashboardTabs"
import QRModal from "../components/General/QRModal"
import IncidentModal from "../components/General/IncidentModal"
import FaceRecognitionModal from "../components/General/FaceRecognitionModal"
import styles from "../styles/dashboard.module.css"
import "bootstrap/dist/css/bootstrap.min.css"

import { useNotifications } from "../context/NotificationContext"
import { useQrAndFace } from "../hooks/useQrAndFace"
import { useIncident } from "../hooks/useIncident"
import { useAttendances } from "../hooks/useAttendances"
import useAutoLogout from "../hooks/useAutoLogout"
import { useSyncData } from "../hooks/synchronizationData/useSyncDatos"
import { useOfflineExpiration } from "../hooks/synchronizationData/useOfflineExpiration"
import { useIncidents } from "../hooks/useIncidents"
import { useFaltasAuto } from "../hooks/useFaltasAuto"

const DashboardPage = () => {
  const navigate = useNavigate()

  useAutoLogout(10 * 60 * 1000)

  //-------------------- Autenticación --------------------
  const storedUser = localStorage.getItem("usuario")
  const usuario = storedUser ? JSON.parse(storedUser) : null
  const isOffline = usuario?.offline === true

  useEffect(() => {
    if (!usuario) {
      navigate("/login", { replace: true })
    }
  }, [usuario, navigate])

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  //-------------------- Sistema de Roles y Temas --------------------
  const userRole = usuario?.user?.rol || "empleado"

  const getRoleThemeClass = (role) => {
    switch (role) {
      case "supervisor":
        return styles.supervisorTheme
      case "enlace-administrativo":
        return styles.enlaceTheme
      case "empleado":
      default:
        return styles.empleadoTheme
    }
  }

  const themeClass = getRoleThemeClass(userRole)

  //-------------------------------------------------------
  useSyncData(usuario)
  const isOfflineExpired = useOfflineExpiration(usuario)

  //-------------------- Notificaciones --------------------
  const {
    notificationRef,
    showNotifications,
    setShowNotifications,
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    getNotificationBadgeColor,
  } = useNotifications()

  useEffect(() => {
    if (usuario?.user?.empleado_id) {
      fetchNotifications(usuario.user.empleado_id, isOffline)
    }
  }, [usuario?.user?.empleado_id, fetchNotifications, isOffline])

  //-------------------- Asistencias --------------------
  const [activeTab, setActiveTab] = useState("attendances")
  const { attendanceHistory, statistics,fetchAttendances } = useAttendances(usuario, isOffline)
  useFaltasAuto(usuario, isOffline, fetchAttendances)

  //-------------------- QR + Reconocimiento Facial --------------------
  const {
    showQRModal,
    setShowQRModal,
    cameraActive,
    showFaceModal,
    handleOpenCamera,
    handleCloseCamera,
    handleScanSuccess,
    handleFaceSuccess,
    handleFaceFailure,
  } = useQrAndFace(usuario, attendanceHistory, fetchAttendances)

  const registrarAsistencia = () => handleOpenCamera()

  //-------------------- Incidencias --------------------
  const {
    incidencias,
    selectedIncidencia,
    showModal,
    loading: loadingIncidencias,
    setShowModal,
    handleViewIncidencia,
    handleDownloadFile,
    fetchIncidencias
  } = useIncidents(usuario, isOffline)

  const {
    showIncidentModal,
    setShowIncidentModal,
    incidentForm,
    handleIncidentChange,
    handleFileUpload,
    handleSubmitIncident,
    incidentTypes,
  } = useIncident(usuario, fetchIncidencias, isOffline)

  

  //-------------------- Render --------------------
  return (
    <div className={`bg-light min-vh-100 ${themeClass}`}>
      <DashboardHeader
        usuario={usuario}
        userRole={userRole}
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationRef={notificationRef}
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        markAsRead={markAsRead}
        deleteNotification={deleteNotification}
        getNotificationIcon={getNotificationIcon}
        getNotificationBadgeColor={getNotificationBadgeColor}
        styles={styles}
        handleLogout={handleLogout}
        isOffline={isOffline}
        themeClass={themeClass}
      />

      <div className="container-fluid px-4 py-4">
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          attendanceHistory={attendanceHistory}
          statistics={statistics}
          setShowIncidenciaModal={setShowIncidentModal}
          usuario={usuario}
          registrarAsistencia={registrarAsistencia}
          setShowQRModal={setShowQRModal}
          isOffline={isOffline}
          isOfflineExpired={isOfflineExpired}
          styles={styles}
          themeClass={themeClass}
          // nuevas props para incidencias
          incidencias={incidencias}
          selectedIncidencia={selectedIncidencia}
          showModal={showModal}
          loadingIncidencias={loadingIncidencias}
          setShowModal={setShowModal}
          handleViewIncidencia={handleViewIncidencia}
          handleDownloadFile={handleDownloadFile}
        />
      </div>

      {showQRModal && (
        <QRModal
          handleOpenCamera={handleOpenCamera}
          handleCloseCamera={handleCloseCamera}
          cameraActive={cameraActive}
          onScanSuccess={handleScanSuccess}
          styles={styles}
          themeClass={themeClass}
        />
      )}

      {showIncidentModal && (
        <IncidentModal
          incidentForm={incidentForm}
          handleIncidentChange={handleIncidentChange}
          handleFileUpload={handleFileUpload}
          handleSubmitIncident={handleSubmitIncident}
          setShowIncidentModal={setShowIncidentModal}
          incidentTypes={incidentTypes}
          styles={styles}
          themeClass={themeClass}
        />
      )}

      <FaceRecognitionModal
        show={showFaceModal}
        onSuccess={handleFaceSuccess}
        onFailure={handleFaceFailure}
        usuario={usuario}
        onClose={handleFaceFailure}
        themeClass={themeClass}
      />
    </div>
  )
}

export default DashboardPage
