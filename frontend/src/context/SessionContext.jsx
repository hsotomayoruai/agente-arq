import React, { createContext, useContext, useState, useCallback } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const startSession = useCallback((sessionData, customerData = null) => {
    setSession(sessionData);
    setCustomer(customerData);
    setLastResult(null);
  }, []);

  const setResult = useCallback((result) => {
    setLastResult(result);
    if (result && result.customer) {
      setCustomer(result.customer);
    }
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
    setCustomer(null);
    setLastResult(null);
  }, []);

  return (
    <SessionContext.Provider value={{
      session,
      customer,
      lastResult,
      startSession,
      setResult,
      clearSession,
      isGuest: session ? Boolean(session.is_guest) : true
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
