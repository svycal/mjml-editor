import type { MjmlNode } from '@/types/mjml';
import { VisualText } from './VisualText';
import { VisualImage } from './VisualImage';
import { VisualButton } from './VisualButton';
import { VisualDivider } from './VisualDivider';
import { VisualSpacer } from './VisualSpacer';
import { VisualSocial } from './VisualSocial';
import { VisualRaw } from './VisualRaw';

interface VisualBlockProps {
  node: MjmlNode;
}

export function VisualBlock({ node }: VisualBlockProps) {
  switch (node.tagName) {
    case 'mj-text':
      return <VisualText node={node} />;
    case 'mj-image':
      return <VisualImage node={node} />;
    case 'mj-button':
      return <VisualButton node={node} />;
    case 'mj-divider':
      return <VisualDivider node={node} />;
    case 'mj-spacer':
      return <VisualSpacer node={node} />;
    case 'mj-social':
      return <VisualSocial node={node} />;
    case 'mj-raw':
      return <VisualRaw node={node} />;
    default:
      return (
        <div className="p-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          Unsupported block: {node.tagName}
        </div>
      );
  }
}
