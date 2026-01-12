import { useState } from 'react';
import { Plus, X, ChevronRight, ExternalLink } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// Popular Google Fonts presets for convenience
const FONT_PRESETS = [
  {
    name: 'Roboto',
    href: 'https://fonts.googleapis.com/css?family=Roboto:400,700',
  },
  {
    name: 'Open Sans',
    href: 'https://fonts.googleapis.com/css?family=Open+Sans:400,700',
  },
  {
    name: 'Lato',
    href: 'https://fonts.googleapis.com/css?family=Lato:400,700',
  },
  {
    name: 'Montserrat',
    href: 'https://fonts.googleapis.com/css?family=Montserrat:400,700',
  },
  {
    name: 'Raleway',
    href: 'https://fonts.googleapis.com/css?family=Raleway:400,700',
  },
  {
    name: 'Poppins',
    href: 'https://fonts.googleapis.com/css?family=Poppins:400,700',
  },
  {
    name: 'Inter',
    href: 'https://fonts.googleapis.com/css?family=Inter:400,700',
  },
  {
    name: 'Playfair Display',
    href: 'https://fonts.googleapis.com/css?family=Playfair+Display:400,700',
  },
];

export function FontEditor() {
  const { fonts, addFont, removeFont, updateFont } = useEditor();
  const [newFontName, setNewFontName] = useState('');
  const [newFontHref, setNewFontHref] = useState('');
  const [openFonts, setOpenFonts] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleFont = (fontName: string) => {
    setOpenFonts((prev) => ({ ...prev, [fontName]: !prev[fontName] }));
  };

  const handleAddFont = () => {
    if (newFontName.trim() && newFontHref.trim()) {
      addFont(newFontName.trim(), newFontHref.trim());
      setNewFontName('');
      setNewFontHref('');
      setShowAddForm(false);
      setOpenFonts((prev) => ({ ...prev, [newFontName.trim()]: true }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newFontName.trim() && newFontHref.trim()) {
      e.preventDefault();
      handleAddFont();
    }
  };

  const handleAddPreset = (preset: (typeof FONT_PRESETS)[0]) => {
    if (!fonts.find((f) => f.name === preset.name)) {
      addFont(preset.name, preset.href);
    }
  };

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-4 space-y-4">
        <p className="text-xs text-foreground-muted">
          Add web fonts to use in your email. Custom fonts have limited email
          client support, so always include fallback fonts.
        </p>

        {/* Quick add presets */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground-muted">
            Quick Add (Google Fonts)
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {FONT_PRESETS.map((preset) => {
              const isAdded = fonts.some((f) => f.name === preset.name);
              return (
                <Button
                  key={preset.name}
                  size="sm"
                  variant={isAdded ? 'secondary' : 'outline'}
                  disabled={isAdded}
                  onClick={() => handleAddPreset(preset)}
                  className="h-7 text-xs"
                >
                  {preset.name}
                  {isAdded && (
                    <span className="ml-1 text-muted-foreground">✓</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Add custom font form */}
        <div className="space-y-2">
          {!showAddForm ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Font
            </Button>
          ) : (
            <div className="border border-border rounded-md p-3 space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Font Name</Label>
                <Input
                  type="text"
                  placeholder="e.g., Raleway"
                  value={newFontName}
                  onChange={(e) => setNewFontName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">CSS URL</Label>
                <Input
                  type="url"
                  placeholder="https://fonts.googleapis.com/css?family=..."
                  value={newFontHref}
                  onChange={(e) => setNewFontHref(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddFont}
                  disabled={!newFontName.trim() || !newFontHref.trim()}
                >
                  Add Font
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewFontName('');
                    setNewFontHref('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* List of added fonts */}
        {fonts.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground-muted">
              Added Fonts
            </Label>
            {fonts.map((font) => {
              const isOpen = openFonts[font.name] || false;
              return (
                <Collapsible
                  key={font.name}
                  open={isOpen}
                  onOpenChange={() => toggleFont(font.name)}
                >
                  <div className="flex items-center gap-1">
                    <CollapsibleTrigger className="flex items-center gap-2 flex-1 py-2 px-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors">
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isOpen && 'rotate-90'
                        )}
                      />
                      <span
                        style={{ fontFamily: `"${font.name}", sans-serif` }}
                      >
                        {font.name}
                      </span>
                    </CollapsibleTrigger>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFont(font.name);
                      }}
                      className="p-1 text-foreground-muted hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <CollapsibleContent>
                    <div className="pl-6 pr-2 py-2 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs">CSS URL</Label>
                        <div className="flex gap-2">
                          <Input
                            type="url"
                            value={font.href}
                            onChange={(e) =>
                              updateFont(font.name, e.target.value)
                            }
                            className="h-8 text-xs flex-1 font-mono"
                          />
                          <a
                            href={font.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      <div className="text-xs text-foreground-muted">
                        Use in font-family:{' '}
                        <code className="bg-muted px-1 py-0.5 rounded">
                          {font.name}, sans-serif
                        </code>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}

        {fonts.length === 0 && (
          <p className="text-xs text-foreground-muted text-center py-4">
            No custom fonts added yet
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
