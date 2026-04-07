/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';

const RenderEndpointContext = createContext<string | undefined>(undefined);

interface RenderEndpointProviderProps {
  children: ReactNode;
  renderEndpoint: string;
}

export function RenderEndpointProvider({
  children,
  renderEndpoint,
}: RenderEndpointProviderProps) {
  return (
    <RenderEndpointContext.Provider value={renderEndpoint}>
      {children}
    </RenderEndpointContext.Provider>
  );
}

export function useRenderEndpoint(): string {
  const endpoint = useContext(RenderEndpointContext);
  if (!endpoint) {
    throw new Error(
      'useRenderEndpoint must be used within MjmlEditor (no renderEndpoint provided)'
    );
  }
  return endpoint;
}
