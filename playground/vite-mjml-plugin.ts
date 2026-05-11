import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

/**
 * Vite plugin that serves a POST /api/render endpoint for MJML rendering.
 * Uses the server-side `mjml` package (Node.js only).
 */
export function mjmlRenderPlugin(): Plugin {
  return {
    name: 'mjml-render',
    configureServer(server) {
      server.middlewares.use('/api/render', (async (
        req: IncomingMessage,
        res: ServerResponse
      ) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }

        try {
          const mjmlString = await readBody(req);
          const mjml2html = (await import('mjml')).default;
          const result = await mjml2html(mjmlString, {
            validationLevel: 'soft',
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              html: result.html,
              errors: result.errors || [],
            })
          );
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              html: '',
              errors: [
                {
                  line: 0,
                  message: String(error),
                  tagName: 'mjml',
                },
              ],
            })
          );
        }
      }) as Parameters<typeof server.middlewares.use>[1]);
    },
  };
}
