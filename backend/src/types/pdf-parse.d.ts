declare module 'pdf-parse' {
  interface PdfData {
    text: string;
    numpages: number;
    info: Record<string, any>;
  }
  function pdfParse(dataBuffer: Buffer): Promise<PdfData>;
  export default pdfParse;
}
