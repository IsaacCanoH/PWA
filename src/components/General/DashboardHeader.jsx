"use client"

import { Bell, LogOut } from "lucide-react"
import { useState } from "react"
import ProfilePhotoModal from "./ProfilePhotoModal"

const DashboardHeader = ({
  usuario,
  userRole,
  unreadCount,
  showNotifications,
  setShowNotifications,
  notificationRef,
  notifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  getNotificationIcon,
  getNotificationBadgeColor,
  styles,
  handleLogout,
  isOffline,
  themeClass,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [userPhoto, setUserPhoto] = useState("/images/avt_default.png")

  const formatFechaUTC = (fecha) => {
    const date = new Date(fecha)
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    })
  }

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUserPhoto(newPhotoUrl)
  }

  return (
    <>
      <nav className={`navbar navbar-expand-lg shadow-sm border-bottom py-4 ${styles.navbarPrimary}`}>
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <div className="me-3 d-flex align-items-center justify-content-center">
              <span className="text-white fw-bold fs-4">INAEBA</span>
            </div>
            <div className="d-none d-md-block">
              <h6 className="mb-0 text-white fw-semibold">Sistema de Administración</h6>
              <small className="text-white opacity-75">
                {userRole === "supervisor"
                  ? "Panel Supervisor"
                  : userRole === "enlace-administrativo"
                    ? "Panel Enlace Administrativo"
                    : "Panel Empleado"}
              </small>

            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div
              className="d-none d-lg-flex align-items-center me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setShowProfileModal(true)}
            >
              <img
                src={userPhoto || "/placeholder.svg"}
                className="rounded-circle me-3"
                width="36"
                height="36"
                style={{
                  border: "2px solid #ffffff",
                  objectFit: "cover",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
              <div>
                <div
                  className="fw-semibold text-white"
                  style={{
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = "0.8")}
                  onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                  {usuario.user.nombre} {usuario.user.apellido_p} {usuario.user.apellido_m}
                </div>
                <div className="text-white opacity-75 small">{usuario.user.email}</div>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="position-relative" ref={notificationRef}>
              <button
                className="btn btn-light btn-sm rounded-circle p-2 position-relative d-flex align-items-center justify-content-center"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ width: "40px", height: "40px" }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-flex align-items-center justify-content-center"
                    style={{ fontSize: "0.65rem", minWidth: "18px", height: "18px" }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className={`position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border ${styles.notificationDropdown}`}
                  style={{ width: "400px", maxWidth: "95vw", zIndex: 1050 }}
                >
                  <div className="p-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className={`mb-0 fw-semibold d-flex align-items-center ${styles.textPrimary}`}>
                        <Bell size={18} className={`me-2 ${styles.textPrimary}`} />
                        Notificaciones
                      </h6>
                      <div className="d-flex gap-2 align-items-center">
                        {unreadCount > 0 && !isOffline && (
                          <button
                            className={`btn btn-sm d-flex align-items-center ${styles.btnOutlinePrimary}`}
                            onClick={markAllAsRead}
                            style={{ fontSize: "0.75rem" }}
                          >
                            ✔ Marcar todas
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center"
                          onClick={() => setShowNotifications(false)}
                          style={{ width: "28px", height: "28px" }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`notification-list ${styles.notificationList}`}>
                    {notifications.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                          <Bell size={32} className="text-muted" />
                        </div>
                        <p className="text-muted mb-0">No tienes notificaciones</p>
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div
                          key={notification.notificacion_id || `notif-${index}`}
                          className={`p-4 border-bottom ${styles.notificationItem} ${!notification.leida ? styles.notificationUnread : ""
                            }`}
                        >
                          <div className="d-flex align-items-start">
                            <div className="me-3 mt-1 d-flex align-items-center justify-content-center">
                              {getNotificationIcon(notification.tipo)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center">
                                  <h6 className="mb-0 fw-semibold me-2" style={{ fontSize: "0.9rem" }}>
                                    {notification.titulo}
                                  </h6>
                                  {!notification.leida && (
                                    <span
                                      className={`badge rounded-pill ${getNotificationBadgeColor(notification.tipo)} d-flex align-items-center`}
                                      style={{ fontSize: "0.65rem" }}
                                    >
                                      Nuevo
                                    </span>
                                  )}
                                </div>
                                <div className="d-flex gap-1">
                                  {!notification.leida && !isOffline && (
                                    <button
                                      className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center"
                                      onClick={() => markAsRead(notification.notificacion_id)}
                                      style={{ width: "24px", height: "24px" }}
                                    >
                                      ✔
                                    </button>
                                  )}
                                  {!isOffline && (
                                    <button
                                      className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center"
                                      onClick={() => deleteNotification(notification.notificacion_id)}
                                      style={{ width: "24px", height: "24px" }}
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="mb-2 text-muted" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                                {notification.mensaje}
                              </p>
                              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                                {formatFechaUTC(notification.fecha_creacion)}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 text-center border-top">
                      <button className={`btn btn-sm mx-auto d-flex align-items-center ${styles.btnOutlinePrimary}`}>
                        <Bell size={14} className="me-2" />
                        Ver todas las notificaciones
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de fotografía de perfil */}
      <ProfilePhotoModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        usuario={usuario}
        onPhotoUpdate={handlePhotoUpdate}
        themeClass={themeClass}
      />
    </>
  )
}

export default DashboardHeader
