import { useEffect, useState } from "react";
import { db } from "../../db/indexedDB";
import { decryptData } from "../../utils/cryptoUtils";
import { useSyncStatus } from "../../context/SyncContext";

export const useOfflineExpiration = (usuario) => {
  const [isExpired, setIsExpired] = useState(false);
  const { synced } = useSyncStatus();

  useEffect(() => {
    const checkExpiration = async () => {
      const currentUserId = usuario?.user?.empleado_id;
      if (!currentUserId) return;

      try {
        const allRecords = await db.encryptedData.orderBy("savedAt").toArray();

        const userRecords = allRecords.filter((record) => {
          try {
            const data = decryptData(record.data);
            return data.usuario_id === currentUserId;
          } catch {
            console.warn("Registro corrupto o ilegible:", record);
            return false;
          }
        });

        if (userRecords.length === 0) {
          setIsExpired(false);
          return;
        }

        const firstDate = new Date(userRecords[0].savedAt);
        const now = new Date();
        const diffInMs = now - firstDate;
        const oneDayMs = 24 * 60 * 60 * 1000;

        setIsExpired(diffInMs >= oneDayMs);
      } catch (err) {
        console.error("Error verificando expiración offline:", err.message);
      }
    };

    checkExpiration();
  }, [usuario, synced]); 

  return isExpired;
};
