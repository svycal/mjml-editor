import mjml2html from 'mjml-browser';
import { serializeMjml } from './parser';
import type { MjmlNode } from '@/types/mjml';

export interface RenderResult {
  html: string;
  errors: { line: number; message: string; tagName: string }[];
}

/**
 * Render MJML JSON to HTML
 */
export function renderMjml(document: MjmlNode): RenderResult {
  try {
    const mjmlString = serializeMjml(document);
    const result = mjml2html(mjmlString, {
      validationLevel: 'soft',
    });

    return {
      html: result.html,
      errors: result.errors || [],
    };
  } catch (error) {
    console.error('MJML render error:', error);
    return {
      html: '<p style="color: red; padding: 20px;">Error rendering email preview</p>',
      errors: [{ line: 0, message: String(error), tagName: 'mjml' }],
    };
  }
}

/**
 * Render MJML string to HTML
 */
export function renderMjmlString(mjmlString: string): RenderResult {
  try {
    const result = mjml2html(mjmlString, {
      validationLevel: 'soft',
    });

    return {
      html: result.html,
      errors: result.errors || [],
    };
  } catch (error) {
    console.error('MJML render error:', error);
    return {
      html: '<p style="color: red; padding: 20px;">Error rendering email preview</p>',
      errors: [{ line: 0, message: String(error), tagName: 'mjml' }],
    };
  }
}
