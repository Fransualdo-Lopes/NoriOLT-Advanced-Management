
import { useEffect, useRef, useCallback } from 'react';

/**
 * usePolling Hook
 * Executa uma função de callback em intervalos regulares, respeitando a visibilidade da aba.
 * 
 * @param callback Função assíncrona para buscar os dados
 * @param interval Tempo em milissegundos entre as execuções
 * @param enabled Booleano para ativar/desativar o polling (ex: pausar durante modais)
 */
export function usePolling(callback: () => Promise<void>, interval: number, enabled: boolean = true) {
  const savedCallback = useRef(callback);

  // Mantém a referência da callback atualizada sem reiniciar o efeito
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const execute = useCallback(async () => {
    // Só executa se a aba estiver visível para poupar recursos e banda
    if (document.visibilityState === 'visible') {
      await savedCallback.current();
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Execução inicial imediata não é feita aqui para evitar conflito com useEffects de montagem
    const id = setInterval(execute, interval);
    
    // Listener para retomar a atualização assim que o usuário volta para a aba
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        execute();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [interval, enabled, execute]);

  return execute;
}
