declare module 'mjml-browser' {
  interface MjmlError {
    line: number;
    message: string;
    tagName: string;
    formattedMessage?: string;
  }

  interface MjmlOptions {
    validationLevel?: 'strict' | 'soft' | 'skip';
    filePath?: string;
    minify?: boolean;
    beautify?: boolean;
  }

  interface MjmlResult {
    html: string;
    errors: MjmlError[];
  }

  function mjml2html(mjml: string, options?: MjmlOptions): MjmlResult;
  export default mjml2html;
}
