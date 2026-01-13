import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

const pluginKey = new PluginKey('liquidHighlight');

// Regex patterns for Liquid syntax
const LIQUID_VARIABLE_REGEX = /\{\{[^{}]*\}\}/g;
const LIQUID_TAG_REGEX = /\{%[^{}]*%\}/g;

function findLiquidMatches(
  doc: ProseMirrorNode
): { from: number; to: number; type: 'variable' | 'tag' }[] {
  const matches: { from: number; to: number; type: 'variable' | 'tag' }[] = [];

  doc.descendants((node: ProseMirrorNode, pos: number) => {
    if (!node.isText || !node.text) return;

    const text = node.text;

    // Find variable matches {{ ... }}
    let match;
    LIQUID_VARIABLE_REGEX.lastIndex = 0;
    while ((match = LIQUID_VARIABLE_REGEX.exec(text)) !== null) {
      matches.push({
        from: pos + match.index,
        to: pos + match.index + match[0].length,
        type: 'variable',
      });
    }

    // Find tag matches {% ... %}
    LIQUID_TAG_REGEX.lastIndex = 0;
    while ((match = LIQUID_TAG_REGEX.exec(text)) !== null) {
      matches.push({
        from: pos + match.index,
        to: pos + match.index + match[0].length,
        type: 'tag',
      });
    }
  });

  return matches;
}

function createDecorations(doc: ProseMirrorNode): DecorationSet {
  const matches = findLiquidMatches(doc);
  const decorations = matches.map((match) =>
    Decoration.inline(match.from, match.to, {
      class: 'liquid-highlight',
    })
  );

  return DecorationSet.create(doc, decorations);
}

export const LiquidHighlight = Extension.create({
  name: 'liquidHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: pluginKey,

        state: {
          init(_, { doc }) {
            return createDecorations(doc);
          },

          apply(tr, oldDecorations) {
            // Only rebuild decorations if the document changed
            if (tr.docChanged) {
              return createDecorations(tr.doc);
            }
            return oldDecorations.map(tr.mapping, tr.doc);
          },
        },

        props: {
          decorations(state) {
            return pluginKey.getState(state);
          },
        },
      }),
    ];
  },
});
