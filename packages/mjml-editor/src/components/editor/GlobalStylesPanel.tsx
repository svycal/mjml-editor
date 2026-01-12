import { useState } from 'react';
import { Plus, X, ChevronRight, PanelRightClose } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { FontEditor } from './FontEditor';

// Common attributes for mj-all
const ALL_ELEMENTS_SCHEMA: Record<
  string,
  { type: string; label: string; placeholder?: string }
> = {
  'font-family': {
    type: 'text',
    label: 'Font Family',
    placeholder: 'Ubuntu, Helvetica, Arial, sans-serif',
  },
  'font-size': { type: 'dimension', label: 'Font Size', placeholder: '13px' },
  color: { type: 'color', label: 'Text Color' },
  'line-height': {
    type: 'dimension',
    label: 'Line Height',
    placeholder: '1.5',
  },
  padding: { type: 'padding', label: 'Padding', placeholder: '10px 25px' },
};

// Element types that can have defaults
const ELEMENT_TYPES = [
  { value: 'mj-text', label: 'Text' },
  { value: 'mj-button', label: 'Button' },
  { value: 'mj-image', label: 'Image' },
  { value: 'mj-section', label: 'Section' },
  { value: 'mj-column', label: 'Column' },
  { value: 'mj-divider', label: 'Divider' },
  { value: 'mj-spacer', label: 'Spacer' },
];

interface GlobalStylesPanelProps {
  onClose?: () => void;
  onTogglePanel?: () => void;
}

export function GlobalStylesPanel({
  onClose,
  onTogglePanel,
}: GlobalStylesPanelProps) {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex flex-col h-full">
      <div className="h-11 px-4 flex items-center justify-between border-b border-border bg-inspector-header">
        <div className="flex items-center gap-2">
          {onTogglePanel && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onTogglePanel}
              className="h-7 w-7 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent"
              title="Collapse panel"
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          )}
          <h3 className="text-sm font-semibold text-foreground">
            Global Styles
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="mx-4 mt-3 w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="elements">By Type</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="fonts">Fonts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1 min-h-0">
          <AllElementsEditor />
        </TabsContent>

        <TabsContent value="elements" className="flex-1 min-h-0">
          <ElementTypeEditor />
        </TabsContent>

        <TabsContent value="classes" className="flex-1 min-h-0">
          <ClassEditor />
        </TabsContent>

        <TabsContent value="fonts" className="flex-1 min-h-0">
          <FontEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AllElementsEditor() {
  const { mjmlAttributes, updateMjmlAttribute } = useEditor();

  const handleChange = (key: string, value: string) => {
    updateMjmlAttribute('all', null, { [key]: value });
  };

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-4 space-y-4">
        <p className="text-xs text-foreground-muted">
          These styles apply to all elements in your email.
        </p>
        {Object.entries(ALL_ELEMENTS_SCHEMA).map(([key, schema]) => (
          <AttributeInput
            key={key}
            attributeKey={key}
            schema={schema}
            value={mjmlAttributes.all[key] || ''}
            onChange={(value) => handleChange(key, value)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function ElementTypeEditor() {
  const { mjmlAttributes, updateMjmlAttribute } = useEditor();
  const [openElements, setOpenElements] = useState<Record<string, boolean>>({});

  const toggleElement = (element: string) => {
    setOpenElements((prev) => ({ ...prev, [element]: !prev[element] }));
  };

  const handleChange = (tagName: string, key: string, value: string) => {
    updateMjmlAttribute('element', tagName, { [key]: value });
  };

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-4 space-y-2">
        <p className="text-xs text-foreground-muted mb-4">
          Set default styles for specific element types.
        </p>
        {ELEMENT_TYPES.map(({ value: tagName, label }) => {
          const isOpen = openElements[tagName] || false;
          const hasValues =
            Object.keys(mjmlAttributes.elements[tagName] || {}).length > 0;

          return (
            <Collapsible
              key={tagName}
              open={isOpen}
              onOpenChange={() => toggleElement(tagName)}
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 px-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isOpen && 'rotate-90'
                  )}
                />
                {label}
                {hasValues && (
                  <span className="ml-auto text-xs text-foreground-muted">
                    {Object.keys(mjmlAttributes.elements[tagName] || {}).length}{' '}
                    style(s)
                  </span>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-6 pr-2 py-2 space-y-4">
                  {Object.entries(ALL_ELEMENTS_SCHEMA).map(([key, schema]) => (
                    <AttributeInput
                      key={key}
                      attributeKey={key}
                      schema={schema}
                      value={mjmlAttributes.elements[tagName]?.[key] || ''}
                      onChange={(value) => handleChange(tagName, key, value)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function ClassEditor() {
  const {
    mjmlAttributes,
    definedClasses,
    addClass,
    removeClass,
    updateMjmlAttribute,
  } = useEditor();
  const [newClassName, setNewClassName] = useState('');
  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({});

  const toggleClass = (className: string) => {
    setOpenClasses((prev) => ({ ...prev, [className]: !prev[className] }));
  };

  const handleAddClass = () => {
    if (newClassName.trim() && !definedClasses.includes(newClassName.trim())) {
      addClass(newClassName.trim());
      setNewClassName('');
      // Auto-expand the new class
      setOpenClasses((prev) => ({ ...prev, [newClassName.trim()]: true }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddClass();
    }
  };

  const handleChange = (className: string, key: string, value: string) => {
    updateMjmlAttribute('class', className, { [key]: value });
  };

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-4 space-y-4">
        <p className="text-xs text-foreground-muted">
          Create reusable style classes that can be applied to elements.
        </p>

        {/* Add new class */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="New class name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-xs flex-1"
          />
          <Button
            size="sm"
            onClick={handleAddClass}
            disabled={
              !newClassName.trim() ||
              definedClasses.includes(newClassName.trim())
            }
            className="h-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* List of classes */}
        {definedClasses.length === 0 ? (
          <p className="text-xs text-foreground-muted text-center py-4">
            No classes defined yet
          </p>
        ) : (
          <div className="space-y-2">
            {definedClasses.map((className) => {
              const isOpen = openClasses[className] || false;
              const classAttrs = mjmlAttributes.classes[className] || {};
              const attrCount = Object.keys(classAttrs).length;

              return (
                <Collapsible
                  key={className}
                  open={isOpen}
                  onOpenChange={() => toggleClass(className)}
                >
                  <div className="flex items-center gap-1">
                    <CollapsibleTrigger className="flex items-center gap-2 flex-1 py-2 px-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors">
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isOpen && 'rotate-90'
                        )}
                      />
                      <span className="font-mono">.{className}</span>
                      {attrCount > 0 && (
                        <span className="ml-auto text-xs text-foreground-muted">
                          {attrCount} style(s)
                        </span>
                      )}
                    </CollapsibleTrigger>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeClass(className);
                      }}
                      className="p-1 text-foreground-muted hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <CollapsibleContent>
                    <div className="pl-6 pr-2 py-2 space-y-4">
                      {Object.entries(ALL_ELEMENTS_SCHEMA).map(
                        ([key, schema]) => (
                          <AttributeInput
                            key={key}
                            attributeKey={key}
                            schema={schema}
                            value={classAttrs[key] || ''}
                            onChange={(value) =>
                              handleChange(className, key, value)
                            }
                          />
                        )
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface AttributeInputProps {
  attributeKey: string;
  schema: { type: string; label: string; placeholder?: string };
  value: string;
  onChange: (value: string) => void;
}

function AttributeInput({
  attributeKey,
  schema,
  value,
  onChange,
}: AttributeInputProps) {
  const id = `global-${attributeKey}`;

  if (schema.type === 'color') {
    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className="text-xs font-medium text-foreground-muted"
        >
          {schema.label}
        </Label>
        <div className="flex gap-2">
          <Input
            id={id}
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-10 p-0.5 cursor-pointer rounded-md border-border-subtle"
          />
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder || '#000000'}
            className="h-8 text-xs flex-1 font-mono border-border-subtle"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-medium text-foreground-muted">
        {schema.label}
      </Label>
      <Input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={schema.placeholder || ''}
        className="h-8 text-xs border-border-subtle"
      />
    </div>
  );
}
