import { 
  Type, 
  Image as ImageIcon, 
  MousePointerClick, 
  Minus, 
  ArrowUpDown, 
  Columns, 
  Square,
  BoxSelect
} from 'lucide-react';

interface BlockIconProps {
  type: string;
  className?: string;
}

export function BlockIcon({ type, className }: BlockIconProps) {
  switch (type) {
    case 'mj-section':
      return <Square className={className} />;
    case 'mj-column':
      return <Columns className={className} />;
    case 'mj-text':
      return <Type className={className} />;
    case 'mj-image':
      return <ImageIcon className={className} />;
    case 'mj-button':
      return <MousePointerClick className={className} />;
    case 'mj-divider':
      return <Minus className={className} />;
    case 'mj-spacer':
      return <ArrowUpDown className={className} />;
    default:
      return <BoxSelect className={className} />;
  }
}
