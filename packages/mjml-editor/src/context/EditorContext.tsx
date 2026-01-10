/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  MjmlNode,
  EditorState,
  EditorAction,
  ContentBlockType,
} from '@/types/mjml';
import {
  updateNode,
  deleteNode,
  insertNode,
  moveNode,
  cloneNode,
  addIds,
  findNodeById,
} from '@/lib/mjml/parser';
import { getDefaultBlock } from '@/lib/mjml/schema';

const MAX_HISTORY = 50;

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.payload };

    case 'UPDATE_ATTRIBUTES': {
      const { id, attributes } = action.payload;
      const newDocument = updateNode(state.document, id, (node) => ({
        ...node,
        attributes: { ...node.attributes, ...attributes },
      }));

      // Add to history
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        cloneNode(newDocument),
      ].slice(-MAX_HISTORY);

      return {
        ...state,
        document: newDocument,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case 'UPDATE_CONTENT': {
      const { id, content } = action.payload;
      const newDocument = updateNode(state.document, id, (node) => ({
        ...node,
        content,
      }));

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        cloneNode(newDocument),
      ].slice(-MAX_HISTORY);

      return {
        ...state,
        document: newDocument,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case 'ADD_BLOCK': {
      const { parentId, index, block } = action.payload;
      const newDocument = insertNode(state.document, parentId, index, block);

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        cloneNode(newDocument),
      ].slice(-MAX_HISTORY);

      return {
        ...state,
        document: newDocument,
        selectedBlockId: block._id || null,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case 'DELETE_BLOCK': {
      const newDocument = deleteNode(state.document, action.payload);

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        cloneNode(newDocument),
      ].slice(-MAX_HISTORY);

      return {
        ...state,
        document: newDocument,
        selectedBlockId:
          state.selectedBlockId === action.payload
            ? null
            : state.selectedBlockId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case 'MOVE_BLOCK': {
      const { id, newParentId, newIndex } = action.payload;
      const newDocument = moveNode(state.document, id, newParentId, newIndex);

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        cloneNode(newDocument),
      ].slice(-MAX_HISTORY);

      return {
        ...state,
        document: newDocument,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case 'SET_DOCUMENT': {
      const document = addIds(action.payload);
      return {
        ...state,
        document,
        selectedBlockId: null,
        history: [cloneNode(document)],
        historyIndex: 0,
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        document: cloneNode(state.history[newIndex]),
        historyIndex: newIndex,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        document: cloneNode(state.history[newIndex]),
        historyIndex: newIndex,
      };
    }

    default:
      return state;
  }
}

interface EditorContextValue {
  state: EditorState;
  selectBlock: (id: string | null) => void;
  updateAttributes: (id: string, attributes: Record<string, string>) => void;
  updateContent: (id: string, content: string) => void;
  addBlock: (
    parentId: string,
    index: number,
    blockType: ContentBlockType
  ) => void;
  addSection: () => void;
  addColumn: (sectionId: string) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, newParentId: string, newIndex: number) => void;
  setDocument: (document: MjmlNode) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedBlock: MjmlNode | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

interface EditorProviderProps {
  children: ReactNode;
  initialDocument: MjmlNode;
}

export function EditorProvider({
  children,
  initialDocument,
}: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, {
    document: addIds(initialDocument),
    selectedBlockId: null,
    history: [cloneNode(addIds(initialDocument))],
    historyIndex: 0,
  });

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: id });
  }, []);

  const updateAttributes = useCallback(
    (id: string, attributes: Record<string, string>) => {
      dispatch({ type: 'UPDATE_ATTRIBUTES', payload: { id, attributes } });
    },
    []
  );

  const updateContent = useCallback((id: string, content: string) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: { id, content } });
  }, []);

  const addBlock = useCallback(
    (parentId: string, index: number, blockType: ContentBlockType) => {
      const defaults = getDefaultBlock(blockType);
      const block: MjmlNode = {
        tagName: blockType,
        attributes: defaults.attributes,
        content: defaults.content,
        _id: uuidv4(),
      };
      dispatch({ type: 'ADD_BLOCK', payload: { parentId, index, block } });
    },
    []
  );

  const addSection = useCallback(() => {
    // Find the body node
    const body = state.document.children?.find((c) => c.tagName === 'mj-body');
    if (!body?._id) return;

    const section: MjmlNode = {
      tagName: 'mj-section',
      attributes: {},
      _id: uuidv4(),
      children: [
        {
          tagName: 'mj-column',
          attributes: {},
          _id: uuidv4(),
          children: [],
        },
      ],
    };

    const index = body.children?.length || 0;
    dispatch({
      type: 'ADD_BLOCK',
      payload: { parentId: body._id, index, block: section },
    });
  }, [state.document]);

  const addColumn = useCallback(
    (sectionId: string) => {
      const section = findNodeById(state.document, sectionId);
      if (!section) return;

      const column: MjmlNode = {
        tagName: 'mj-column',
        attributes: {},
        _id: uuidv4(),
        children: [],
      };

      const index = section.children?.length || 0;
      dispatch({
        type: 'ADD_BLOCK',
        payload: { parentId: sectionId, index, block: column },
      });
    },
    [state.document]
  );

  const deleteBlockFn = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  }, []);

  const moveBlockFn = useCallback(
    (id: string, newParentId: string, newIndex: number) => {
      dispatch({ type: 'MOVE_BLOCK', payload: { id, newParentId, newIndex } });
    },
    []
  );

  const setDocument = useCallback((document: MjmlNode) => {
    dispatch({ type: 'SET_DOCUMENT', payload: document });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const selectedBlock = useMemo(() => {
    if (!state.selectedBlockId) return null;
    return findNodeById(state.document, state.selectedBlockId);
  }, [state.document, state.selectedBlockId]);

  const value: EditorContextValue = useMemo(
    () => ({
      state,
      selectBlock,
      updateAttributes,
      updateContent,
      addBlock,
      addSection,
      addColumn,
      deleteBlock: deleteBlockFn,
      moveBlock: moveBlockFn,
      setDocument,
      undo,
      redo,
      canUndo: state.historyIndex > 0,
      canRedo: state.historyIndex < state.history.length - 1,
      selectedBlock,
    }),
    [
      state,
      selectBlock,
      updateAttributes,
      updateContent,
      addBlock,
      addSection,
      addColumn,
      deleteBlockFn,
      moveBlockFn,
      setDocument,
      undo,
      redo,
      selectedBlock,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
