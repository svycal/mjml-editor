import { useMemo } from 'react';
import { useEditor } from '@/context/EditorContext';
import type { MjmlNode } from '@/types/mjml';

/**
 * Hook for visual blocks to get resolved attributes.
 * Combines mj-attributes defaults with per-element attributes.
 */
export function useResolvedAttributes(node: MjmlNode): Record<string, string> {
  const { getResolvedAttributes } = useEditor();
  return useMemo(
    () => getResolvedAttributes(node),
    [getResolvedAttributes, node]
  );
}
