import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  Unlink,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sanitizeHtmlForMjml, mjmlToTiptapHtml } from '@/lib/html-utils';

interface TiptapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export interface TiptapEditorRef {
  focus: () => void;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  function TiptapEditor({ content, onUpdate, style, className }, ref) {
    const initialContent = useMemo(() => mjmlToTiptapHtml(content), []);
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);
    const [linkInputVisible, setLinkInputVisible] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const linkInputRef = useRef<HTMLInputElement>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Virtual element for Floating UI - represents the text selection
    const virtualEl = useRef<{
      getBoundingClientRect: () => DOMRect;
    } | null>(null);

    const { refs, floatingStyles } = useFloating({
      placement: 'top',
      middleware: [offset(8), flip(), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate,
    });

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: false,
          blockquote: false,
          bulletList: false,
          orderedList: false,
          codeBlock: false,
          code: false,
          horizontalRule: false,
          bold: {},
          italic: {},
          strike: {},
          hardBreak: {},
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        }),
      ],
      content: initialContent,
      autofocus: false,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: 'outline-none',
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onUpdate(sanitizeHtmlForMjml(html));
      },
      onSelectionUpdate: ({ editor }) => {
        const { from, to, empty } = editor.state.selection;

        // Clear any pending hide timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }

        if (empty) {
          // Don't hide if link input is open
          if (!linkInputVisible) {
            // Debounce hiding to handle double-click selection
            hideTimeoutRef.current = setTimeout(() => {
              setIsToolbarVisible(false);
            }, 100);
          }
          return;
        }

        // Create virtual element from selection
        const { view } = editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);

        const rect = {
          x: start.left,
          y: start.top,
          width: end.left - start.left,
          height: end.bottom - start.top,
          top: start.top,
          left: start.left,
          right: end.left,
          bottom: end.bottom,
          toJSON: () => rect,
        };
        virtualEl.current = {
          getBoundingClientRect: () => rect,
        };

        refs.setReference(virtualEl.current);
        setIsToolbarVisible(true);
      },
    });

    // Handle link button click
    const handleLinkClick = useCallback(() => {
      if (!editor) return;

      const existingUrl = (editor.getAttributes('link').href as string) || '';
      setLinkUrl(existingUrl);
      setLinkInputVisible(true);

      // Focus the input after it renders
      setTimeout(() => {
        linkInputRef.current?.focus();
        linkInputRef.current?.select();
      }, 0);
    }, [editor]);

    // Apply link
    const applyLink = useCallback(() => {
      if (!editor) return;

      if (linkUrl) {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: linkUrl })
          .run();
      }
      setLinkInputVisible(false);
      setLinkUrl('');
    }, [editor, linkUrl]);

    // Remove link
    const removeLink = useCallback(() => {
      if (!editor) return;
      editor.chain().focus().unsetLink().run();
      setLinkInputVisible(false);
      setLinkUrl('');
    }, [editor]);

    // Close link input and refocus editor
    const closeLinkInput = useCallback(() => {
      setLinkInputVisible(false);
      setLinkUrl('');
      editor?.commands.focus();
    }, [editor]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus();
      },
    }));

    if (!editor) {
      return null;
    }

    const isLinkActive = editor.isActive('link');

    return (
      <div className="relative">
        {/* Floating toolbar */}
        {isToolbarVisible && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            {linkInputVisible ? (
              // Link input mode
              <div className="flex items-center gap-1 px-1">
                <Input
                  ref={linkInputRef}
                  type="url"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyLink();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      closeLinkInput();
                    }
                  }}
                  className="h-7 w-48 text-sm"
                />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={applyLink}
                  title="Apply link"
                >
                  <Check className="size-4" />
                </Button>
                {isLinkActive && (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={removeLink}
                    title="Remove link"
                  >
                    <Unlink className="size-4" />
                  </Button>
                )}
              </div>
            ) : (
              // Format buttons mode
              <>
                <FormatButton
                  active={editor.isActive('bold')}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  title="Bold (Cmd+B)"
                >
                  <Bold className="size-4" />
                </FormatButton>
                <FormatButton
                  active={editor.isActive('italic')}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  title="Italic (Cmd+I)"
                >
                  <Italic className="size-4" />
                </FormatButton>
                <FormatButton
                  active={editor.isActive('underline')}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  title="Underline (Cmd+U)"
                >
                  <UnderlineIcon className="size-4" />
                </FormatButton>
                <FormatButton
                  active={editor.isActive('strike')}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  title="Strikethrough"
                >
                  <Strikethrough className="size-4" />
                </FormatButton>
                <Separator />
                <FormatButton
                  active={isLinkActive}
                  onClick={handleLinkClick}
                  title={isLinkActive ? 'Edit link' : 'Add link'}
                >
                  <LinkIcon className="size-4" />
                </FormatButton>
              </>
            )}
          </div>
        )}

        <EditorContent editor={editor} style={style} className={className} />
      </div>
    );
  }
);

function FormatButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'flex items-center justify-center size-7 rounded-md transition-colors',
        'hover:bg-accent',
        active && 'bg-accent text-accent-foreground'
      )}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-5 bg-border mx-1" />;
}
