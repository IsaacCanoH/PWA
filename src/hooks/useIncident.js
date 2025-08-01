import { useState, useEffect } from "react";
import { createIncident, saveIncidentOffline, getTypeIncident } from "../services/dashboard/incidentsService";
import { useToast } from "../context/ToastContext";
import { useNotifications } from "../context/NotificationContext";
import { useLoader } from "../context/LoaderContext";
import { fileToBase64 } from "../utils/fileUtils";

export const useIncident = (usuario, fetchIncidencias, isOffline) => {
  const { showSuccess, showError, showInfo } = useToast();
  const { createNotification } = useNotifications();
  const { showLoader, hideLoader } = useLoader();

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentTypes, setIncidentTypes] = useState([]);

  const [incidentForm, setIncidentForm] = useState({
    tipo: "",
    descripcion: "",
    fecha_incidencia: "",
    evidencias: [],
  });

  useEffect(() => {
    const loadTypes = async () => {
      const tipos = await getTypeIncident(isOffline);
      setIncidentTypes(tipos);
    };
    loadTypes();
  }, []);

  const handleIncidentChange = ({ target: { name, value } }) => {
    setIncidentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = ({ target: { files } }) => {
    setIncidentForm((prev) => ({
      ...prev,
      evidencias: [...prev.evidencias, ...files],
    }));
  };

  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    showLoader("Registrando incidencia...");

    try {
      const empleadoId = usuario?.user?.empleado_id;
      if (!empleadoId) {
        showError("Error: El usuario no tiene un empleado_id definido.");
        return;
      }

      const incidentData = await prepareIncidentData(usuario, incidentForm);
      const formData = prepareFormData(usuario, incidentForm);

      if (navigator.onLine) {
        await sendIncidentOnline(formData, usuario, incidentForm, createNotification, showSuccess, showInfo);

        if (typeof fetchIncidencias === "function") {
          await fetchIncidencias(usuario.user.empleado_id);
        }
        
      } else {
        await saveIncidentOffline(incidentData);
        await createNotification({
          usuario_id: empleadoId,
          titulo: "Incidencia creada",
          mensaje: "Incidencia creada correctamente, se enviará cuando exista conexión.",
          tipo: "alerta",
          leida: false,
          vista: false,
          fecha_creacion: new Date().toISOString(),
          metadata: {
            descripcion: incidentForm.descripcion,
            fecha: incidentForm.fecha_incidencia,
          },
        });
        showInfo("Incidencia almacenada. Se sincronizará cuando haya conexión.");
      }

      clearForm();
    } catch (err) {
      console.error(err);
      showError("Error al registrar la incidencia.");
    } finally {
      hideLoader();
    }
  };

  const clearForm = () => {
    setShowIncidentModal(false);
    setIncidentForm({
      tipo: "",
      descripcion: "",
      fecha_incidencia: "",
      evidencias: [],
    });
  };

  return {
    showIncidentModal,
    setShowIncidentModal,
    incidentForm,
    handleIncidentChange,
    handleFileUpload,
    handleSubmitIncident,
    incidentTypes,
  };
};

const prepareIncidentData = async (usuario, form) => {
  const evidencias = await Promise.all(
    form.evidencias.map(async (file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      content: await fileToBase64(file),
    }))
  );

  return {
    usuario_id: usuario?.user?.empleado_id,
    tipo_incidencia: form.tipo,
    descripcion: form.descripcion,
    fecha_incidencia: form.fecha_incidencia,
    evidencias,
  };
};

const prepareFormData = (usuario, form) => {
  const formData = new FormData();
  formData.append("usuario_id", usuario?.user?.empleado_id);
  formData.append("tipo_incidencia", form.tipo);
  formData.append("descripcion", form.descripcion);
  formData.append("fecha_incidencia", form.fecha_incidencia);

  form.evidencias.forEach((file) => {
    formData.append("archivos", file);
  });

  return formData;
};

const sendIncidentOnline = async (formData, usuario, form, createNotification, showSuccess, showInfo) => {
  try {
    await createIncident(formData);

    await createNotification({
      usuario_id: usuario?.user?.empleado_id,
      titulo: "Incidencia registrada",
      mensaje: "Incidencia enviada correctamente.",
      tipo: "exito",
      leida: false,
      vista: false,
      metadata: {
        descripcion: form.descripcion,
        fecha: form.fecha_incidencia,
      },
    });

    showSuccess("Incidencia registrada correctamente.");
  } catch (err) {
    console.warn("Error al enviar incidencia, almacenando localmente:", err.message);

    const offlineData = await prepareIncidentData(usuario, form);
    await saveIncidentOffline(offlineData);

    await createNotification({
      usuario_id: usuario?.user?.empleado_id,
      titulo: "Incidencia creada",
      mensaje: "Incidencia creada correctamente, se enviará cuando exista conexión.",
      tipo: "alerta",
      leida: false,
      vista: false,
      fecha_creacion: new Date().toISOString(),
      metadata: {
        descripcion: form.descripcion,
        fecha: form.fecha_incidencia,
      },
    });

    showInfo("Incidencia almacenada. Se sincronizará cuando haya conexión.");
  }
};
