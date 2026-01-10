import { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { contentBlockTypes } from '@/lib/mjml/schema';
import type { ContentBlockType } from '@/types/mjml';
import { cn } from '@/lib/utils';

interface AddBlockButtonProps {
  parentId: string;
  index: number;
  showLabel?: boolean;
  isSection?: boolean;
}

export function AddBlockButton({ parentId, index, showLabel = false, isSection = false }: AddBlockButtonProps) {
  const { addBlock, addSection } = useEditor();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddBlock = (type: ContentBlockType) => {
    addBlock(parentId, index, type);
    setIsOpen(false);
  };

  const handleAddSection = () => {
    addSection();
    setIsOpen(false);
  };

  if (isSection) {
    return (
      <div className="flex justify-center py-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-6 text-xs text-muted-foreground opacity-0 hover:opacity-100 transition-opacity',
                isOpen && 'opacity-100'
              )}
            >
              + Add section
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="center">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-8"
                onClick={handleAddSection}
              >
                <span className="w-6 text-center mr-2">▭</span>
                New Section
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center', showLabel ? 'py-2' : 'py-1')}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs text-muted-foreground transition-opacity',
              showLabel
                ? 'h-8'
                : 'h-4 opacity-0 hover:opacity-100',
              isOpen && 'opacity-100'
            )}
          >
            {showLabel ? '+ Add block' : '+'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="center">
          <div className="space-y-1">
            {contentBlockTypes.map((block) => (
              <Button
                key={block.type}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-8"
                onClick={() => handleAddBlock(block.type)}
              >
                <span className="w-6 text-center mr-2">{block.icon}</span>
                {block.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
