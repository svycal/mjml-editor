import { useState } from 'react';
import { Plus, Type, Image, MousePointerClick, Minus, MoveVertical, LayoutTemplate } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { contentBlockTypes } from '@/lib/mjml/schema';
import type { ContentBlockType } from '@/types/mjml';
import { cn } from '@/lib/utils';

const blockIcons: Record<ContentBlockType, React.ReactNode> = {
  'mj-text': <Type className="h-4 w-4" />,
  'mj-image': <Image className="h-4 w-4" />,
  'mj-button': <MousePointerClick className="h-4 w-4" />,
  'mj-divider': <Minus className="h-4 w-4" />,
  'mj-spacer': <MoveVertical className="h-4 w-4" />,
};

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
      <div className="flex justify-center py-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-3 text-xs text-foreground-muted',
                'opacity-0 hover:opacity-100 transition-smooth',
                'hover:bg-accent hover:text-foreground',
                isOpen && 'opacity-100 bg-accent'
              )}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add section
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1.5 shadow-framer-lg" align="center">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 h-9 px-3 text-sm font-normal hover:bg-accent"
              onClick={handleAddSection}
            >
              <LayoutTemplate className="h-4 w-4 text-foreground-muted" />
              New Section
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center', showLabel ? 'py-3' : 'py-1.5')}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-foreground-muted transition-smooth',
              showLabel
                ? 'h-8 px-3 text-xs hover:bg-accent hover:text-foreground'
                : 'h-5 w-5 rounded-full opacity-0 hover:opacity-100 hover:bg-accent',
              isOpen && 'opacity-100 bg-accent'
            )}
          >
            {showLabel ? (
              <>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add block
              </>
            ) : (
              <Plus className="h-3 w-3" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-1.5 shadow-framer-lg" align="center">
          <div className="space-y-0.5">
            {contentBlockTypes.map((block) => (
              <Button
                key={block.type}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 px-3 text-sm font-normal hover:bg-accent"
                onClick={() => handleAddBlock(block.type)}
              >
                <span className="text-foreground-muted">
                  {blockIcons[block.type]}
                </span>
                {block.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
