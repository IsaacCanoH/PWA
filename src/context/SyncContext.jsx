import { createContext, useContext, useState } from "react";

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [synced, setSynced] = useState(false);
  return (
    <SyncContext.Provider value={{ synced, setSynced }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncStatus = () => useContext(SyncContext);
