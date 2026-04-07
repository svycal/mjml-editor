/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';

const NonceContext = createContext<string | undefined>(undefined);

interface NonceProviderProps {
  children: ReactNode;
  nonce?: string;
}

export function NonceProvider({ children, nonce }: NonceProviderProps) {
  return (
    <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
  );
}

export function useNonce() {
  return useContext(NonceContext);
}
