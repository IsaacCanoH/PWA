import { useEffect, useRef, useCallback } from "react";
import { syncPendingData } from "../../services/synchronizationData/syncDispatcher";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";
import { useSyncStatus } from "../../context/SyncContext";

export const useSyncData = (usuario) => {
  const { showSuccess, showError } = useToast();
  const { createNotification } = useNotifications();
  const { setSynced } = useSyncStatus();

  const handlerRef = useRef(null);
  const alreadySynced = useRef(false);
  const currentUserId = usuario?.user?.empleado_id;

  const sync = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const count = await syncPendingData(currentUserId, createNotification);
      if (count > 0) {
        showSuccess(`Se sincronizaron ${count} dato(s) pendiente(s).`);
      }
      setSynced(true);
    } catch (err) {
      console.error("Error al sincronizar datos:", err.message);
      showError("Error al sincronizar datos pendientes.");
    }
  }, [currentUserId, createNotification, showSuccess, showError]);

  useEffect(() => {
    handlerRef.current = sync;
  }, [sync]);

  useEffect(() => {
    const handleOnline = () => {
      if (!alreadySynced.current) {
        alreadySynced.current = true;
        handlerRef.current?.();
      }
    };

    if (navigator.onLine) {
      handleOnline();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);
};
