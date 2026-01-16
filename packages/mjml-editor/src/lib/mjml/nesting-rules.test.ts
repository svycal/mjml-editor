import { describe, it, expect } from 'vitest';
import {
  ALLOWED_CHILDREN,
  canBeChildOf,
  isContentBlock,
} from './nesting-rules';

describe('nesting-rules', () => {
  describe('ALLOWED_CHILDREN', () => {
    it('should define valid children for mj-body', () => {
      expect(ALLOWED_CHILDREN['mj-body']).toContain('mj-section');
      expect(ALLOWED_CHILDREN['mj-body']).toContain('mj-wrapper');
      expect(ALLOWED_CHILDREN['mj-body']).toContain('mj-hero');
    });

    it('should define valid children for mj-wrapper', () => {
      expect(ALLOWED_CHILDREN['mj-wrapper']).toContain('mj-section');
      expect(ALLOWED_CHILDREN['mj-wrapper']).not.toContain('mj-column');
    });

    it('should define valid children for mj-section', () => {
      expect(ALLOWED_CHILDREN['mj-section']).toContain('mj-column');
      expect(ALLOWED_CHILDREN['mj-section']).toContain('mj-group');
      expect(ALLOWED_CHILDREN['mj-section']).not.toContain('mj-text');
    });

    it('should define valid children for mj-group', () => {
      expect(ALLOWED_CHILDREN['mj-group']).toContain('mj-column');
      expect(ALLOWED_CHILDREN['mj-group']).not.toContain('mj-section');
    });

    it('should define valid children for mj-column', () => {
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-text');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-image');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-button');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-divider');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-spacer');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-social');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-navbar');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-table');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-raw');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-accordion');
      expect(ALLOWED_CHILDREN['mj-column']).toContain('mj-carousel');
      expect(ALLOWED_CHILDREN['mj-column']).not.toContain('mj-section');
      expect(ALLOWED_CHILDREN['mj-column']).not.toContain('mj-column');
    });

    it('should define valid children for mj-hero', () => {
      expect(ALLOWED_CHILDREN['mj-hero']).toContain('mj-text');
      expect(ALLOWED_CHILDREN['mj-hero']).toContain('mj-image');
      expect(ALLOWED_CHILDREN['mj-hero']).toContain('mj-button');
      expect(ALLOWED_CHILDREN['mj-hero']).not.toContain('mj-section');
      expect(ALLOWED_CHILDREN['mj-hero']).not.toContain('mj-column');
    });
  });

  describe('canBeChildOf', () => {
    describe('mj-body as parent', () => {
      it('should allow mj-section as child', () => {
        expect(canBeChildOf('mj-section', 'mj-body')).toBe(true);
      });

      it('should allow mj-wrapper as child', () => {
        expect(canBeChildOf('mj-wrapper', 'mj-body')).toBe(true);
      });

      it('should allow mj-hero as child', () => {
        expect(canBeChildOf('mj-hero', 'mj-body')).toBe(true);
      });

      it('should not allow mj-column as direct child', () => {
        expect(canBeChildOf('mj-column', 'mj-body')).toBe(false);
      });

      it('should not allow content blocks as direct children', () => {
        expect(canBeChildOf('mj-text', 'mj-body')).toBe(false);
        expect(canBeChildOf('mj-image', 'mj-body')).toBe(false);
        expect(canBeChildOf('mj-button', 'mj-body')).toBe(false);
      });
    });

    describe('mj-section as parent', () => {
      it('should allow mj-column as child', () => {
        expect(canBeChildOf('mj-column', 'mj-section')).toBe(true);
      });

      it('should allow mj-group as child', () => {
        expect(canBeChildOf('mj-group', 'mj-section')).toBe(true);
      });

      it('should not allow nested mj-section', () => {
        expect(canBeChildOf('mj-section', 'mj-section')).toBe(false);
      });

      it('should not allow content blocks as direct children', () => {
        expect(canBeChildOf('mj-text', 'mj-section')).toBe(false);
        expect(canBeChildOf('mj-image', 'mj-section')).toBe(false);
      });
    });

    describe('mj-column as parent', () => {
      it('should allow all content blocks', () => {
        expect(canBeChildOf('mj-text', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-image', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-button', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-divider', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-spacer', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-social', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-navbar', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-table', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-raw', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-accordion', 'mj-column')).toBe(true);
        expect(canBeChildOf('mj-carousel', 'mj-column')).toBe(true);
      });

      it('should not allow structural elements', () => {
        expect(canBeChildOf('mj-section', 'mj-column')).toBe(false);
        expect(canBeChildOf('mj-column', 'mj-column')).toBe(false);
        expect(canBeChildOf('mj-wrapper', 'mj-column')).toBe(false);
        expect(canBeChildOf('mj-group', 'mj-column')).toBe(false);
      });
    });

    describe('mj-wrapper as parent', () => {
      it('should allow mj-section as child', () => {
        expect(canBeChildOf('mj-section', 'mj-wrapper')).toBe(true);
      });

      it('should not allow other elements', () => {
        expect(canBeChildOf('mj-column', 'mj-wrapper')).toBe(false);
        expect(canBeChildOf('mj-text', 'mj-wrapper')).toBe(false);
        expect(canBeChildOf('mj-wrapper', 'mj-wrapper')).toBe(false);
      });
    });

    describe('mj-group as parent', () => {
      it('should allow mj-column as child', () => {
        expect(canBeChildOf('mj-column', 'mj-group')).toBe(true);
      });

      it('should not allow other elements', () => {
        expect(canBeChildOf('mj-section', 'mj-group')).toBe(false);
        expect(canBeChildOf('mj-text', 'mj-group')).toBe(false);
        expect(canBeChildOf('mj-group', 'mj-group')).toBe(false);
      });
    });

    describe('mj-hero as parent', () => {
      it('should allow content blocks', () => {
        expect(canBeChildOf('mj-text', 'mj-hero')).toBe(true);
        expect(canBeChildOf('mj-image', 'mj-hero')).toBe(true);
        expect(canBeChildOf('mj-button', 'mj-hero')).toBe(true);
      });

      it('should not allow structural elements', () => {
        expect(canBeChildOf('mj-section', 'mj-hero')).toBe(false);
        expect(canBeChildOf('mj-column', 'mj-hero')).toBe(false);
      });
    });

    describe('unknown parent', () => {
      it('should return false for unknown parent tags', () => {
        expect(canBeChildOf('mj-text', 'mj-unknown')).toBe(false);
        expect(canBeChildOf('mj-section', 'invalid')).toBe(false);
      });
    });
  });

  describe('isContentBlock', () => {
    it('should return true for content blocks', () => {
      expect(isContentBlock('mj-text')).toBe(true);
      expect(isContentBlock('mj-image')).toBe(true);
      expect(isContentBlock('mj-button')).toBe(true);
      expect(isContentBlock('mj-divider')).toBe(true);
      expect(isContentBlock('mj-spacer')).toBe(true);
      expect(isContentBlock('mj-social')).toBe(true);
      expect(isContentBlock('mj-navbar')).toBe(true);
      expect(isContentBlock('mj-table')).toBe(true);
      expect(isContentBlock('mj-raw')).toBe(true);
      expect(isContentBlock('mj-accordion')).toBe(true);
      expect(isContentBlock('mj-carousel')).toBe(true);
    });

    it('should return false for structural elements', () => {
      expect(isContentBlock('mj-body')).toBe(false);
      expect(isContentBlock('mj-section')).toBe(false);
      expect(isContentBlock('mj-column')).toBe(false);
      expect(isContentBlock('mj-wrapper')).toBe(false);
      expect(isContentBlock('mj-group')).toBe(false);
      expect(isContentBlock('mj-hero')).toBe(false);
    });

    it('should return true for unknown tags (they cannot have children)', () => {
      expect(isContentBlock('mj-unknown')).toBe(true);
      expect(isContentBlock('invalid')).toBe(true);
    });
  });
});
