/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import type { LiquidSchema } from '@/types/liquid';

const LiquidSchemaContext = createContext<LiquidSchema | undefined>(undefined);

interface LiquidSchemaProviderProps {
  children: ReactNode;
  schema?: LiquidSchema;
}

export function LiquidSchemaProvider({
  children,
  schema,
}: LiquidSchemaProviderProps) {
  return (
    <LiquidSchemaContext.Provider value={schema}>
      {children}
    </LiquidSchemaContext.Provider>
  );
}

export function useLiquidSchema() {
  return useContext(LiquidSchemaContext);
}
