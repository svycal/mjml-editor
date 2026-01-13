import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export interface SuggestionProps {
  query: string;
  triggerType: 'variable' | 'tag';
  range: { from: number; to: number };
  clientRect: (() => DOMRect | null) | null;
}

export interface LiquidSuggestionOptions {
  onStart: (props: SuggestionProps) => void;
  onUpdate: (props: SuggestionProps) => void;
  onExit: () => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
}

interface PluginState {
  active: boolean;
  triggerType: 'variable' | 'tag' | null;
  from: number;
  query: string;
}

const pluginKey = new PluginKey<PluginState>('liquidSuggestion');

function getClientRect(view: EditorView, from: number): () => DOMRect | null {
  return () => {
    const coords = view.coordsAtPos(from);
    return {
      x: coords.left,
      y: coords.top,
      width: 0,
      height: coords.bottom - coords.top,
      top: coords.top,
      left: coords.left,
      right: coords.left,
      bottom: coords.bottom,
      toJSON: () => ({
        x: coords.left,
        y: coords.top,
        width: 0,
        height: coords.bottom - coords.top,
        top: coords.top,
        left: coords.left,
        right: coords.left,
        bottom: coords.bottom,
      }),
    };
  };
}

export const LiquidSuggestion = Extension.create<LiquidSuggestionOptions>({
  name: 'liquidSuggestion',

  addOptions() {
    return {
      onStart: () => {},
      onUpdate: () => {},
      onExit: () => {},
      onKeyDown: () => false,
    };
  },

  addProseMirrorPlugins() {
    const { options } = this;

    return [
      new Plugin<PluginState>({
        key: pluginKey,

        state: {
          init(): PluginState {
            return {
              active: false,
              triggerType: null,
              from: 0,
              query: '',
            };
          },

          apply(_tr, prev, _oldState, newState) {
            // Check if there's a selection change or text input
            const { selection } = newState;
            const { $from } = selection;

            // Only work with cursor selections (not ranges)
            if (!selection.empty) {
              if (prev.active) {
                return { active: false, triggerType: null, from: 0, query: '' };
              }
              return prev;
            }

            // Get text before cursor in current text block
            const textBefore = $from.parent.textBetween(
              0,
              $from.parentOffset,
              undefined,
              '\ufffc'
            );

            // Check for {{ trigger (variables)
            const variableMatch = textBefore.match(/\{\{([^{}]*)$/);
            if (variableMatch) {
              const triggerPos =
                $from.pos - $from.parentOffset + textBefore.lastIndexOf('{{');
              const query = variableMatch[1];
              return {
                active: true,
                triggerType: 'variable' as const,
                from: triggerPos,
                query,
              };
            }

            // Check for {% trigger (tags)
            const tagMatch = textBefore.match(/\{%([^{}]*)$/);
            if (tagMatch) {
              const triggerPos =
                $from.pos - $from.parentOffset + textBefore.lastIndexOf('{%');
              const query = tagMatch[1];
              return {
                active: true,
                triggerType: 'tag' as const,
                from: triggerPos,
                query,
              };
            }

            // No trigger found
            if (prev.active) {
              return { active: false, triggerType: null, from: 0, query: '' };
            }
            return prev;
          },
        },

        view() {
          return {
            update: (view, prevState) => {
              const prev = pluginKey.getState(prevState);
              const next = pluginKey.getState(view.state);

              if (!prev || !next) return;

              const started = !prev.active && next.active;
              const stopped = prev.active && !next.active;
              const changed =
                prev.active &&
                next.active &&
                (prev.query !== next.query || prev.from !== next.from);

              if (stopped) {
                options.onExit();
              }

              if (started && next.triggerType) {
                options.onStart({
                  query: next.query,
                  triggerType: next.triggerType,
                  range: { from: next.from, to: view.state.selection.from },
                  clientRect: getClientRect(view, next.from),
                });
              }

              if (changed && next.triggerType) {
                options.onUpdate({
                  query: next.query,
                  triggerType: next.triggerType,
                  range: { from: next.from, to: view.state.selection.from },
                  clientRect: getClientRect(view, next.from),
                });
              }
            },
          };
        },

        props: {
          handleKeyDown(view, event) {
            const state = pluginKey.getState(view.state);
            if (!state?.active) return false;

            // Let the parent component handle keyboard navigation
            return options.onKeyDown(event);
          },
        },
      }),
    ];
  },
});
