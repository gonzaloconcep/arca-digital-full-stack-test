import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'arca_session_id';

/**
 * Obtiene o crea un session ID para tracking de eventos
 * El session ID persiste durante la sesión del navegador
 */
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

/**
 * Resetea el session ID (útil para testing)
 */
export const resetSessionId = (): string => {
  const sessionId = uuidv4();
  sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};
