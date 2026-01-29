/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { EditorExtensions } from '@/types/mjml';

/**
 * Default extensions configuration - all extensions disabled by default
 */
const DEFAULT_EXTENSIONS: EditorExtensions = {
  conditionalBlocks: false,
};

const ExtensionsContext = createContext<EditorExtensions>(DEFAULT_EXTENSIONS);

interface ExtensionsProviderProps {
  children: ReactNode;
  extensions?: EditorExtensions;
}

export function ExtensionsProvider({
  children,
  extensions,
}: ExtensionsProviderProps) {
  const value = useMemo(
    () => ({
      ...DEFAULT_EXTENSIONS,
      ...extensions,
    }),
    [extensions]
  );

  return (
    <ExtensionsContext.Provider value={value}>
      {children}
    </ExtensionsContext.Provider>
  );
}

/**
 * Hook to access the current extensions configuration
 */
export function useExtensions(): EditorExtensions {
  return useContext(ExtensionsContext);
}
