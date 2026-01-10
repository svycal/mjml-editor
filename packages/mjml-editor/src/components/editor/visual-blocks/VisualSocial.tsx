import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import type { MjmlNode } from '@/types/mjml';

interface VisualSocialProps {
  node: MjmlNode;
}

// Simple social icon placeholders
const socialIcons: Record<string, string> = {
  facebook: 'f',
  twitter: '𝕏',
  instagram: '📷',
  linkedin: 'in',
  youtube: '▶',
  github: '⌥',
};

export function VisualSocial({ node }: VisualSocialProps) {
  const { state, selectBlock } = useEditor();
  const isSelected = state.selectedBlockId === node._id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node._id!);
  };

  // Parse attributes
  const mode = node.attributes['mode'] || 'horizontal';
  const align = node.attributes['align'] || 'center';
  const padding = node.attributes['padding'] || '10px 25px';
  const iconSize = node.attributes['icon-size'] || '20px';

  // Get social elements
  const socialElements =
    node.children?.filter((c) => c.tagName === 'mj-social-element') || [];

  // Convert align to flexbox
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-indigo-500 ring-inset'
      )}
      style={{ padding }}
      onClick={handleClick}
    >
      <div
        className={cn(
          'flex gap-2',
          mode === 'vertical' && 'flex-col items-center'
        )}
        style={{ justifyContent }}
      >
        {socialElements.map((element, index) => {
          const name = element.attributes['name'] || 'link';
          const bgColor = element.attributes['background-color'] || '#333';
          const icon = socialIcons[name.toLowerCase()] || '🔗';

          return (
            <div
              key={element._id || index}
              className="rounded-full flex items-center justify-center text-white font-bold"
              style={{
                width: iconSize,
                height: iconSize,
                backgroundColor: bgColor,
                fontSize: `calc(${iconSize} * 0.5)`,
              }}
            >
              {icon}
            </div>
          );
        })}

        {socialElements.length === 0 && (
          <span className="text-sm text-muted-foreground">
            Add social icons
          </span>
        )}
      </div>
    </div>
  );
}
