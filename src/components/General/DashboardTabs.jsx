"use client"
import { Clock, Camera, FileText, ScrollText, AlertTriangle } from "lucide-react"
import AttendancesTab from "./AttendancesTab"
import IncidenciasTab from "./IncidentsTabs"

const DashboardTabs = ({
  activeTab,
  setActiveTab,
  attendanceHistory,
  statistics,
  setShowIncidenciaModal,
  usuario,
  registrarAsistencia,
  isOffline,
  isOfflineExpired,
  styles,
  themeClass,
  incidencias,
  selectedIncidencia,
  showModal,
  loadingIncidencias,
  setShowModal,
  handleViewIncidencia,
  handleDownloadFile,
}) => {
  const renderTabContent = () => {
    if (activeTab === "attendances") {
      return (
        <AttendancesTab
          attendanceHistory={attendanceHistory}
          statistics={statistics}
          styles={styles}
          themeClass={themeClass}
        />
      )
    }

    if (activeTab === "incidencias") {
      return (
        <IncidenciasTab
          usuario={usuario}
          isOffline={isOffline}
          styles={styles}
          themeClass={themeClass}
          incidencias={incidencias}
          selectedIncidencia={selectedIncidencia}
          showModal={showModal}
          loading={loadingIncidencias}
          setShowModal={setShowModal}
          handleViewIncidencia={handleViewIncidencia}
          handleDownloadFile={handleDownloadFile}
        />
      )
    }

    return null
  }

  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">
              ¡Bienvenido, {usuario.user.nombre} {usuario.user.apellido_p} {usuario.user.apellido_m}!
            </h4>
            <p className="text-muted mb-0">Gestiona tu asistencia y mantén tu registro actualizado</p>
            {isOffline && (
              <div className="alert alert-warning mt-3 d-flex flex-wrap align-items-center gap-2 py-2 px-3 small">
                <AlertTriangle size={16} className="text-warning flex-shrink-0" />
                <span className="text-break">
                  Estás usando la aplicación en <strong>modo offline</strong>. Algunas funcionalidades podrían estar
                  limitadas.
                </span>
              </div>
            )}
            {isOfflineExpired && (
              <div className="alert alert-danger mt-2 d-flex align-items-center gap-2 py-2 px-3 small">
                <AlertTriangle size={16} className="text-danger flex-shrink-0" />
                <span className="text-break">
                  Has superado el tiempo permitido sin sincronizar. Algunas funciones están bloqueadas hasta conectarte
                  a internet.
                </span>
              </div>
            )}
          </div>
          <div className="d-flex gap-2 flex-column flex-sm-row">
            <button
              className={`btn px-4 py-2 d-flex align-items-center justify-content-center ${styles.btnPrimary}`}
              onClick={registrarAsistencia}
              disabled={isOfflineExpired}
            >
              <Camera size={18} className="me-2" />
              Registrar Asistencia
            </button>
            <button
              className={`btn px-4 py-2 d-flex align-items-center justify-content-center ${styles.btnOutlinePrimary}`}
              onClick={() => setShowIncidenciaModal(true)}
              disabled={isOfflineExpired}
            >
              <FileText size={18} className="me-2" />
              Nueva Incidencia
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navegación */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 px-0 pt-0">
          <ul className={`nav nav-tabs border-0 px-4 pt-4 ${styles.tabsContainer}`}>
            {[
              { key: "attendances", label: "Mis Asistencias", icon: <Clock size={16} className="me-2" /> },
              { key: "incidencias", label: "Mis Incidencias", icon: <FileText size={16} className="me-2" /> },
            ].map(({ key, label, icon }) => (
              <li className="nav-item" key={key}>
                <button
                  className={`nav-link border-0 px-3 py-2 fw-medium d-flex align-items-center ${activeTab === key ? `active ${styles.textPrimary} ${styles.bgPrimaryOpacity}` : "text-muted"
                    }`}
                  onClick={() => setActiveTab(key)}
                >
                  {icon}
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body p-4">{renderTabContent()}</div>
      </div>
    </>
  )
}

export default DashboardTabs
