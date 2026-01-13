// Main editor component
export { MjmlEditor } from './components/editor/MjmlEditor';

// Theme utilities
export { ThemeProvider, useTheme } from './context/ThemeContext';
export { ThemeToggle } from './components/ui/theme-toggle';

// Types
export type {
  MjmlNode,
  MjmlTagName,
  ContentBlockType,
  EditorState,
  EditorAction,
} from './types/mjml';

export type { LiquidSchema, LiquidSchemaItem } from './types/liquid';
