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
import { getDefaultBlock, getSchemaForTag } from '@/lib/mjml/schema';
import {
  extractMjmlAttributes,
  getInheritedValue as getInheritedValueUtil,
  resolveNodeAttributes,
  getDefinedClasses,
  type MjmlAttributesConfig,
} from '@/lib/mjml/attributes';

const MAX_HISTORY = 50;

/**
 * Ensure the document has an mj-head with mj-attributes
 */
function ensureMjAttributes(document: MjmlNode): MjmlNode {
  let head = document.children?.find((c) => c.tagName === 'mj-head');
  let needsUpdate = false;

  if (!head) {
    head = {
      tagName: 'mj-head',
      attributes: {},
      children: [],
      _id: uuidv4(),
    };
    needsUpdate = true;
  }

  let mjAttributes = head.children?.find((c) => c.tagName === 'mj-attributes');
  if (!mjAttributes) {
    mjAttributes = {
      tagName: 'mj-attributes',
      attributes: {},
      children: [],
      _id: uuidv4(),
    };
    head = {
      ...head,
      children: [...(head.children || []), mjAttributes],
    };
    needsUpdate = true;
  }

  if (!needsUpdate) {
    return document;
  }

  // Ensure head is first child
  const otherChildren =
    document.children?.filter((c) => c.tagName !== 'mj-head') || [];
  return {
    ...document,
    children: [head, ...otherChildren],
  };
}

/**
 * Update mj-attributes in the document
 */
function updateMjAttributesInDocument(
  document: MjmlNode,
  attributeType: 'all' | 'element' | 'class',
  target: string | null,
  attributes: Record<string, string>
): MjmlNode {
  const docWithAttrs = ensureMjAttributes(document);
  const head = docWithAttrs.children?.find((c) => c.tagName === 'mj-head');
  if (!head) return document;

  const mjAttributes = head.children?.find(
    (c) => c.tagName === 'mj-attributes'
  );
  if (!mjAttributes) return document;

  const updatedChildren = [...(mjAttributes.children || [])];

  if (attributeType === 'all') {
    // Update or create mj-all
    const allIndex = updatedChildren.findIndex((c) => c.tagName === 'mj-all');
    const allNode: MjmlNode = {
      tagName: 'mj-all',
      attributes:
        allIndex >= 0
          ? { ...updatedChildren[allIndex].attributes, ...attributes }
          : attributes,
      _id: allIndex >= 0 ? updatedChildren[allIndex]._id : uuidv4(),
    };

    if (allIndex >= 0) {
      updatedChildren[allIndex] = allNode;
    } else {
      updatedChildren.unshift(allNode);
    }
  } else if (attributeType === 'element' && target) {
    // Update or create element-specific defaults (e.g., mj-text)
    const elementIndex = updatedChildren.findIndex((c) => c.tagName === target);
    const elementNode: MjmlNode = {
      tagName: target,
      attributes:
        elementIndex >= 0
          ? { ...updatedChildren[elementIndex].attributes, ...attributes }
          : attributes,
      _id: elementIndex >= 0 ? updatedChildren[elementIndex]._id : uuidv4(),
    };

    if (elementIndex >= 0) {
      updatedChildren[elementIndex] = elementNode;
    } else {
      updatedChildren.push(elementNode);
    }
  } else if (attributeType === 'class' && target) {
    // Update or create mj-class
    const classIndex = updatedChildren.findIndex(
      (c) => c.tagName === 'mj-class' && c.attributes['name'] === target
    );
    const classNode: MjmlNode = {
      tagName: 'mj-class',
      attributes:
        classIndex >= 0
          ? {
              ...updatedChildren[classIndex].attributes,
              name: target,
              ...attributes,
            }
          : { name: target, ...attributes },
      _id: classIndex >= 0 ? updatedChildren[classIndex]._id : uuidv4(),
    };

    if (classIndex >= 0) {
      updatedChildren[classIndex] = classNode;
    } else {
      updatedChildren.push(classNode);
    }
  }

  // Update the mj-attributes node
  const updatedMjAttributes = {
    ...mjAttributes,
    children: updatedChildren,
  };

  // Update head
  const updatedHead = {
    ...head,
    children: head.children?.map((c) =>
      c.tagName === 'mj-attributes' ? updatedMjAttributes : c
    ),
  };

  // Update document
  return {
    ...docWithAttrs,
    children: docWithAttrs.children?.map((c) =>
      c.tagName === 'mj-head' ? updatedHead : c
    ),
  };
}

/**
 * Add a new class to mj-attributes
 */
function addClassToDocument(document: MjmlNode, className: string): MjmlNode {
  return updateMjAttributesInDocument(document, 'class', className, {});
}

/**
 * Remove a class from mj-attributes
 */
function removeClassFromDocument(
  document: MjmlNode,
  className: string
): MjmlNode {
  const head = document.children?.find((c) => c.tagName === 'mj-head');
  if (!head) return document;

  const mjAttributes = head.children?.find(
    (c) => c.tagName === 'mj-attributes'
  );
  if (!mjAttributes) return document;

  const updatedChildren =
    mjAttributes.children?.filter(
      (c) => !(c.tagName === 'mj-class' && c.attributes['name'] === className)
    ) || [];

  const updatedMjAttributes = {
    ...mjAttributes,
    children: updatedChildren,
  };

  const updatedHead = {
    ...head,
    children: head.children?.map((c) =>
      c.tagName === 'mj-attributes' ? updatedMjAttributes : c
    ),
  };

  return {
    ...document,
    children: document.children?.map((c) =>
      c.tagName === 'mj-head' ? updatedHead : c
    ),
  };
}

/**
 * Rename a class in mj-attributes
 */
function renameClassInDocument(
  document: MjmlNode,
  oldName: string,
  newName: string
): MjmlNode {
  const head = document.children?.find((c) => c.tagName === 'mj-head');
  if (!head) return document;

  const mjAttributes = head.children?.find(
    (c) => c.tagName === 'mj-attributes'
  );
  if (!mjAttributes) return document;

  const updatedChildren =
    mjAttributes.children?.map((c) => {
      if (c.tagName === 'mj-class' && c.attributes['name'] === oldName) {
        return {
          ...c,
          attributes: { ...c.attributes, name: newName },
        };
      }
      return c;
    }) || [];

  const updatedMjAttributes = {
    ...mjAttributes,
    children: updatedChildren,
  };

  const updatedHead = {
    ...head,
    children: head.children?.map((c) =>
      c.tagName === 'mj-attributes' ? updatedMjAttributes : c
    ),
  };

  return {
    ...document,
    children: document.children?.map((c) =>
      c.tagName === 'mj-head' ? updatedHead : c
    ),
  };
}

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

    case 'UPDATE_MJML_ATTRIBUTE': {
      const { attributeType, target, attributes } = action.payload;
      const newDocument = updateMjAttributesInDocument(
        state.document,
        attributeType,
        target,
        attributes
      );

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

    case 'ADD_CLASS': {
      const newDocument = addClassToDocument(state.document, action.payload);

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

    case 'REMOVE_CLASS': {
      const newDocument = removeClassFromDocument(
        state.document,
        action.payload
      );

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

    case 'RENAME_CLASS': {
      const { oldName, newName } = action.payload;
      const newDocument = renameClassInDocument(
        state.document,
        oldName,
        newName
      );

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
  // mj-attributes support
  mjmlAttributes: MjmlAttributesConfig;
  definedClasses: string[];
  getResolvedAttributes: (node: MjmlNode) => Record<string, string>;
  getInheritedValue: (
    node: MjmlNode,
    attributeKey: string
  ) => string | undefined;
  updateMjmlAttribute: (
    attributeType: 'all' | 'element' | 'class',
    target: string | null,
    attributes: Record<string, string>
  ) => void;
  addClass: (name: string) => void;
  removeClass: (name: string) => void;
  renameClass: (oldName: string, newName: string) => void;
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

  // mj-attributes support - computed values
  const mjmlAttributes = useMemo(
    () => extractMjmlAttributes(state.document),
    [state.document]
  );

  const definedClasses = useMemo(
    () => getDefinedClasses(state.document),
    [state.document]
  );

  const getResolvedAttributes = useCallback(
    (node: MjmlNode) => resolveNodeAttributes(node, mjmlAttributes),
    [mjmlAttributes]
  );

  const getInheritedValue = useCallback(
    (node: MjmlNode, attributeKey: string) => {
      const schema = getSchemaForTag(node.tagName);
      return getInheritedValueUtil(node, attributeKey, mjmlAttributes, schema);
    },
    [mjmlAttributes]
  );

  // mj-attributes support - actions
  const updateMjmlAttribute = useCallback(
    (
      attributeType: 'all' | 'element' | 'class',
      target: string | null,
      attributes: Record<string, string>
    ) => {
      dispatch({
        type: 'UPDATE_MJML_ATTRIBUTE',
        payload: { attributeType, target, attributes },
      });
    },
    []
  );

  const addClass = useCallback((name: string) => {
    dispatch({ type: 'ADD_CLASS', payload: name });
  }, []);

  const removeClass = useCallback((name: string) => {
    dispatch({ type: 'REMOVE_CLASS', payload: name });
  }, []);

  const renameClass = useCallback((oldName: string, newName: string) => {
    dispatch({ type: 'RENAME_CLASS', payload: { oldName, newName } });
  }, []);

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
      // mj-attributes support
      mjmlAttributes,
      definedClasses,
      getResolvedAttributes,
      getInheritedValue,
      updateMjmlAttribute,
      addClass,
      removeClass,
      renameClass,
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
      mjmlAttributes,
      definedClasses,
      getResolvedAttributes,
      getInheritedValue,
      updateMjmlAttribute,
      addClass,
      removeClass,
      renameClass,
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
