import { useState } from 'react';
import { ChevronRight, X, PanelRightClose } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSchemaForTag } from '@/lib/mjml/schema';
import {
  parseClassNames,
  addClassToNode,
  removeClassFromNode,
} from '@/lib/mjml/attributes';
import type { AttributeSchema, AttributeGroup, MjmlNode } from '@/types/mjml';
import { cn } from '@/lib/utils';

const GROUP_LABELS: Record<AttributeGroup, string> = {
  primary: 'Primary',
  background: 'Background',
  typography: 'Typography',
  border: 'Border',
  inner: 'Inner Styling',
  sizing: 'Sizing',
  spacing: 'Spacing',
  link: 'Link',
  advanced: 'Advanced',
};

const GROUP_ORDER: AttributeGroup[] = [
  'primary',
  'background',
  'typography',
  'border',
  'inner',
  'sizing',
  'spacing',
  'link',
  'advanced',
];

/**
 * Component for picking and managing mj-class values on a block
 */
function ClassPicker({ node }: { node: MjmlNode }) {
  const { definedClasses, updateAttributes } = useEditor();
  const currentClasses = parseClassNames(node.attributes['mj-class']);

  // Don't show if no classes are defined
  if (definedClasses.length === 0) {
    return null;
  }

  const availableClasses = definedClasses.filter(
    (c) => !currentClasses.includes(c)
  );

  const handleAddClass = (className: string) => {
    if (!node._id || !className) return;
    const newAttributes = addClassToNode(node, className);
    updateAttributes(node._id, { 'mj-class': newAttributes['mj-class'] || '' });
  };

  const handleRemoveClass = (className: string) => {
    if (!node._id) return;
    const newAttributes = removeClassFromNode(node, className);
    updateAttributes(node._id, {
      'mj-class': newAttributes['mj-class'] || '',
    });
  };

  return (
    <div className="space-y-2 pb-4 mb-4 border-b border-border">
      <Label className="text-xs font-medium text-foreground-muted">
        Classes
      </Label>
      {currentClasses.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {currentClasses.map((className) => (
            <Badge
              key={className}
              variant="secondary"
              className="text-xs gap-1 pr-1"
            >
              {className}
              <button
                type="button"
                onClick={() => handleRemoveClass(className)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {availableClasses.length > 0 && (
        <Select onValueChange={handleAddClass} value="">
          <SelectTrigger className="h-8 text-xs border-border-subtle">
            <SelectValue placeholder="Add class..." />
          </SelectTrigger>
          <SelectContent>
            {availableClasses.map((className) => (
              <SelectItem key={className} value={className} className="text-xs">
                {className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

interface BlockInspectorProps {
  onTogglePanel?: () => void;
}

export function BlockInspector({ onTogglePanel }: BlockInspectorProps) {
  const { selectedBlock, updateAttributes, getInheritedValue, definedClasses } =
    useEditor();

  if (!selectedBlock) {
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
            <h3 className="text-sm font-semibold text-foreground">Inspector</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-sm text-foreground-muted text-center leading-relaxed">
            Select a block to
            <br />
            edit its properties
          </p>
        </div>
      </div>
    );
  }

  const schema = getSchemaForTag(selectedBlock.tagName);
  const tagLabel =
    selectedBlock.tagName.replace('mj-', '').charAt(0).toUpperCase() +
    selectedBlock.tagName.replace('mj-', '').slice(1);

  const handleAttributeChange = (key: string, value: string) => {
    if (selectedBlock._id) {
      updateAttributes(selectedBlock._id, { [key]: value });
    }
  };

  // Group attributes by their group property
  const groupedAttributes = schema
    ? Object.entries(schema).reduce(
        (acc, [key, attrSchema]) => {
          const group = attrSchema.group || 'primary';
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push({ key, schema: attrSchema });
          return acc;
        },
        {} as Record<string, { key: string; schema: AttributeSchema }[]>
      )
    : {};

  // Check if there are any non-primary groups (to determine if we need collapsibles)
  const hasGroups = Object.keys(groupedAttributes).some(
    (group) => group !== 'primary'
  );

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
          <h3 className="text-sm font-semibold text-foreground">{tagLabel}</h3>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          {/* Class picker - only shows when classes are defined */}
          {definedClasses.length > 0 && <ClassPicker node={selectedBlock} />}

          {schema ? (
            hasGroups ? (
              <GroupedAttributeEditor
                groupedAttributes={groupedAttributes}
                selectedBlock={selectedBlock}
                handleAttributeChange={handleAttributeChange}
              />
            ) : (
              <div className="space-y-5">
                {Object.entries(schema).map(([key, attrSchema]) => (
                  <AttributeEditor
                    key={key}
                    attributeKey={key}
                    schema={attrSchema}
                    value={selectedBlock.attributes[key] || ''}
                    onChange={(value) => handleAttributeChange(key, value)}
                    inheritedValue={getInheritedValue(selectedBlock, key)}
                  />
                ))}
              </div>
            )
          ) : (
            <p className="text-sm text-foreground-muted py-4 text-center">
              No editable properties for this block type.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface GroupedAttributeEditorProps {
  groupedAttributes: Record<string, { key: string; schema: AttributeSchema }[]>;
  selectedBlock: MjmlNode;
  handleAttributeChange: (key: string, value: string) => void;
}

function GroupedAttributeEditor({
  groupedAttributes,
  selectedBlock,
  handleAttributeChange,
}: GroupedAttributeEditorProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { getInheritedValue } = useEditor();

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="space-y-4">
      {GROUP_ORDER.map((group) => {
        const attributes = groupedAttributes[group];
        if (!attributes || attributes.length === 0) return null;

        // Primary group is always expanded without a disclosure
        if (group === 'primary') {
          return (
            <div key={group} className="space-y-5">
              {attributes.map(({ key, schema }) => (
                <AttributeEditor
                  key={key}
                  attributeKey={key}
                  schema={schema}
                  value={selectedBlock.attributes[key] || ''}
                  onChange={(value) => handleAttributeChange(key, value)}
                  inheritedValue={getInheritedValue(selectedBlock, key)}
                />
              ))}
            </div>
          );
        }

        // Other groups use collapsible disclosure
        const isOpen = openGroups[group] || false;

        return (
          <Collapsible
            key={group}
            open={isOpen}
            onOpenChange={() => toggleGroup(group)}
          >
            <CollapsibleTrigger className="flex items-center gap-1 w-full py-2 text-xs font-medium text-foreground-muted hover:text-foreground transition-colors">
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
              {GROUP_LABELS[group]}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-5 pt-2 pb-1">
                {attributes.map(({ key, schema }) => (
                  <AttributeEditor
                    key={key}
                    attributeKey={key}
                    schema={schema}
                    value={selectedBlock.attributes[key] || ''}
                    onChange={(value) => handleAttributeChange(key, value)}
                    inheritedValue={getInheritedValue(selectedBlock, key)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}

interface AttributeEditorProps {
  attributeKey: string;
  schema: AttributeSchema;
  value: string;
  onChange: (value: string) => void;
  inheritedValue?: string;
}

function AttributeEditor({
  attributeKey,
  schema,
  value,
  onChange,
  inheritedValue,
}: AttributeEditorProps) {
  const id = `attr-${attributeKey}`;
  // Use inherited value as placeholder, falling back to schema placeholder/default
  const placeholder =
    inheritedValue || schema.placeholder || schema.default || '';

  switch (schema.type) {
    case 'select': {
      // Ensure we always have a valid non-empty value for Select
      const selectValue =
        value ||
        inheritedValue ||
        schema.default ||
        schema.options?.[0]?.value ||
        'default';
      const handleSelectChange = (newValue: string) => {
        // Convert 'false' placeholder back to empty string for MJML attributes
        onChange(newValue === 'false' ? '' : newValue);
      };
      return (
        <div className="space-y-2">
          <Label
            htmlFor={id}
            className="text-xs font-medium text-foreground-muted"
          >
            {schema.label}
          </Label>
          <Select value={selectValue} onValueChange={handleSelectChange}>
            <SelectTrigger id={id} className="h-8 text-xs border-border-subtle">
              <SelectValue
                placeholder={`Select ${schema.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    case 'color':
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
              value={value || inheritedValue || schema.default || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-10 p-0.5 cursor-pointer rounded-md border-border-subtle"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || '#000000'}
              className="h-8 text-xs flex-1 font-mono border-border-subtle"
            />
          </div>
        </div>
      );

    case 'padding':
      return (
        <div className="space-y-2">
          <Label
            htmlFor={id}
            className="text-xs font-medium text-foreground-muted"
          >
            {schema.label}
          </Label>
          <Input
            id={id}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || '10px 25px'}
            className="h-8 text-xs border-border-subtle"
          />
          <p className="text-[10px] text-foreground-subtle">
            Format: top right bottom left (e.g., 10px 20px)
          </p>
        </div>
      );

    case 'dimension':
      return (
        <div className="space-y-2">
          <Label
            htmlFor={id}
            className="text-xs font-medium text-foreground-muted"
          >
            {schema.label}
          </Label>
          <Input
            id={id}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-8 text-xs border-border-subtle"
          />
        </div>
      );

    case 'url':
      return (
        <div className="space-y-2">
          <Label
            htmlFor={id}
            className="text-xs font-medium text-foreground-muted"
          >
            {schema.label}
          </Label>
          <Input
            id={id}
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'https://...'}
            className="h-8 text-xs border-border-subtle"
          />
        </div>
      );

    case 'text':
    default:
      return (
        <div className="space-y-2">
          <Label
            htmlFor={id}
            className="text-xs font-medium text-foreground-muted"
          >
            {schema.label}
          </Label>
          <Input
            id={id}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-8 text-xs border-border-subtle"
          />
        </div>
      );
  }
}
