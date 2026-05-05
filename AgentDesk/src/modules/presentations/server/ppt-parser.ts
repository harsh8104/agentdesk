import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { nanoid } from "nanoid";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pptxTextParser = require("pptx-text-parser");

export interface ParsedSlide {
  slideNumber: number;
  textContent: string;
}

/**
 * Parse a .pptx file buffer and extract text content per slide.
 * Writes the buffer to a temp file since pptx-text-parser requires a file path.
 */
export async function parsePptx(buffer: Buffer): Promise<ParsedSlide[]> {
  // Write buffer to a temp file
  const tempPath = join(tmpdir(), `pptx-${nanoid()}.pptx`);

  try {
    await writeFile(tempPath, buffer);

    // Parse in "json" mode to get per-slide text as { 'Slide 0': 'text', ... }
    const result = await pptxTextParser(tempPath, "json");

    const slides: ParsedSlide[] = Object.entries(result).map(
      ([_key, text], index) => ({
        slideNumber: index + 1,
        textContent: String(text || ""),
      })
    );

    return slides;
  } finally {
    // Clean up temp file
    try {
      await unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}
