import { describe, it, expect } from 'vitest';
import { parseMjml } from './parser';

describe('parseMjml', () => {
  describe('ampersand escaping in URLs', () => {
    it('should parse URLs with unescaped ampersands', () => {
      const mjml = `<mjml>
        <mj-head>
          <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter&display=swap"></mj-font>
        </mj-head>
        <mj-body></mj-body>
      </mjml>`;

      const result = parseMjml(mjml);
      expect(result.tagName).toBe('mjml');

      const head = result.children?.find((c) => c.tagName === 'mj-head');
      const font = head?.children?.find((c) => c.tagName === 'mj-font');
      expect(font?.attributes?.href).toBe(
        'https://fonts.googleapis.com/css2?family=Inter&display=swap'
      );
    });

    it('should handle multiple ampersands in URL', () => {
      const mjml = `<mjml>
        <mj-head>
          <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&subset=latin&display=swap"></mj-font>
        </mj-head>
        <mj-body></mj-body>
      </mjml>`;

      const result = parseMjml(mjml);
      const head = result.children?.find((c) => c.tagName === 'mj-head');
      const font = head?.children?.find((c) => c.tagName === 'mj-font');
      expect(font?.attributes?.href).toBe(
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&subset=latin&display=swap'
      );
    });

    it('should not double-escape already escaped ampersands', () => {
      const mjml = `<mjml>
        <mj-head>
          <mj-font name="Inter" href="https://example.com?a=1&amp;b=2"></mj-font>
        </mj-head>
        <mj-body></mj-body>
      </mjml>`;

      const result = parseMjml(mjml);
      const head = result.children?.find((c) => c.tagName === 'mj-head');
      const font = head?.children?.find((c) => c.tagName === 'mj-font');
      expect(font?.attributes?.href).toBe('https://example.com?a=1&b=2');
    });

    it('should preserve other XML entities', () => {
      const mjml = `<mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text css-class="test&lt;class"></mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>`;

      const result = parseMjml(mjml);
      const body = result.children?.find((c) => c.tagName === 'mj-body');
      const section = body?.children?.[0];
      const column = section?.children?.[0];
      const text = column?.children?.[0];
      expect(text?.attributes?.['css-class']).toBe('test<class');
    });

    it('should handle the complex Google Fonts URL from user report', () => {
      const mjml = `<mjml>
        <mj-head>
          <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"></mj-font>
        </mj-head>
        <mj-body></mj-body>
      </mjml>`;

      const result = parseMjml(mjml);
      expect(result.tagName).toBe('mjml');

      const head = result.children?.find((c) => c.tagName === 'mj-head');
      const font = head?.children?.find((c) => c.tagName === 'mj-font');
      expect(font?.attributes?.href).toBe(
        'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
      );
    });
  });

  describe('attribute values with quotes', () => {
    it('should handle single quotes inside double-quoted attributes', () => {
      const mjml = `<mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text font-family="'Inter',Helvetica,Arial,sans-serif"></mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>`;

      const result = parseMjml(mjml);
      expect(result.tagName).toBe('mjml');

      const body = result.children?.find((c) => c.tagName === 'mj-body');
      const section = body?.children?.[0];
      const column = section?.children?.[0];
      const text = column?.children?.[0];
      expect(text?.attributes?.['font-family']).toBe(
        "'Inter',Helvetica,Arial,sans-serif"
      );
    });

    it('should handle double quotes inside single-quoted attributes', () => {
      const mjml = `<mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text font-family='"Inter",Helvetica,Arial,sans-serif'></mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>`;

      const result = parseMjml(mjml);
      expect(result.tagName).toBe('mjml');

      const body = result.children?.find((c) => c.tagName === 'mj-body');
      const section = body?.children?.[0];
      const column = section?.children?.[0];
      const text = column?.children?.[0];
      expect(text?.attributes?.['font-family']).toBe(
        '"Inter",Helvetica,Arial,sans-serif'
      );
    });
  });

  describe('basic parsing', () => {
    it('should parse valid MJML', () => {
      const mjml = `<mjml><mj-body></mj-body></mjml>`;
      const result = parseMjml(mjml);
      expect(result.tagName).toBe('mjml');
    });

    it('should return empty document for invalid MJML', () => {
      const mjml = `<invalid><broken>`;
      const result = parseMjml(mjml);
      expect(result.tagName).toBe('mjml');
    });
  });
});
