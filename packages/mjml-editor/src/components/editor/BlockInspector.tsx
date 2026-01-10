import { useEditor } from '@/context/EditorContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSchemaForTag } from '@/lib/mjml/schema';
import type { AttributeSchema } from '@/types/mjml';

export function BlockInspector() {
  const { selectedBlock, updateAttributes } = useEditor();

  if (!selectedBlock) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-11 px-4 flex items-center border-b border-border bg-inspector-header">
          <h3 className="text-sm font-semibold text-foreground">Inspector</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-sm text-foreground-muted text-center leading-relaxed">
            Select a block to<br />edit its properties
          </p>
        </div>
      </div>
    );
  }

  const schema = getSchemaForTag(selectedBlock.tagName);
  const tagLabel = selectedBlock.tagName.replace('mj-', '').charAt(0).toUpperCase() +
    selectedBlock.tagName.replace('mj-', '').slice(1);

  const handleAttributeChange = (key: string, value: string) => {
    if (selectedBlock._id) {
      updateAttributes(selectedBlock._id, { [key]: value });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-11 px-4 flex items-center border-b border-border bg-inspector-header">
        <h3 className="text-sm font-semibold text-foreground">{tagLabel}</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {schema ? (
            Object.entries(schema).map(([key, attrSchema]) => (
              <AttributeEditor
                key={key}
                attributeKey={key}
                schema={attrSchema}
                value={selectedBlock.attributes[key] || ''}
                onChange={(value) => handleAttributeChange(key, value)}
              />
            ))
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

interface AttributeEditorProps {
  attributeKey: string;
  schema: AttributeSchema;
  value: string;
  onChange: (value: string) => void;
}

function AttributeEditor({ attributeKey, schema, value, onChange }: AttributeEditorProps) {
  const id = `attr-${attributeKey}`;

  switch (schema.type) {
    case 'select': {
      // Ensure we always have a valid non-empty value for Select
      const selectValue = value || schema.default || schema.options?.[0]?.value || 'default';
      const handleSelectChange = (newValue: string) => {
        // Convert 'false' placeholder back to empty string for MJML attributes
        onChange(newValue === 'false' ? '' : newValue);
      };
      return (
        <div className="space-y-2">
          <Label htmlFor={id} className="text-xs font-medium text-foreground-muted">
            {schema.label}
          </Label>
          <Select value={selectValue} onValueChange={handleSelectChange}>
            <SelectTrigger id={id} className="h-8 text-xs border-border-subtle">
              <SelectValue placeholder={`Select ${schema.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
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
          <Label htmlFor={id} className="text-xs font-medium text-foreground-muted">
            {schema.label}
          </Label>
          <div className="flex gap-2">
            <Input
              id={id}
              type="color"
              value={value || schema.default || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-10 p-0.5 cursor-pointer rounded-md border-border-subtle"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={schema.default || '#000000'}
              className="h-8 text-xs flex-1 font-mono border-border-subtle"
            />
          </div>
        </div>
      );

    case 'padding':
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
            placeholder={schema.default || '10px 25px'}
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
          <Label htmlFor={id} className="text-xs font-medium text-foreground-muted">
            {schema.label}
          </Label>
          <Input
            id={id}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder || schema.default || ''}
            className="h-8 text-xs border-border-subtle"
          />
        </div>
      );

    case 'url':
      return (
        <div className="space-y-2">
          <Label htmlFor={id} className="text-xs font-medium text-foreground-muted">
            {schema.label}
          </Label>
          <Input
            id={id}
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder || 'https://...'}
            className="h-8 text-xs border-border-subtle"
          />
        </div>
      );

    case 'text':
    default:
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
            placeholder={schema.placeholder || schema.default || ''}
            className="h-8 text-xs border-border-subtle"
          />
        </div>
      );
  }
}
