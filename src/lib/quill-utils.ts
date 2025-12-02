/**
 * Extracts plain text from a Quill Delta JSON string
 */
export function extractTextFromQuillDelta(deltaJson: string): string {
  try {
    const delta = JSON.parse(deltaJson);
    if (!delta.ops || !Array.isArray(delta.ops)) {
      return "";
    }

    return delta.ops
      .map((op: any) => {
        if (typeof op.insert === "string") {
          return op.insert;
        }
        return "";
      })
      .join("")
      .trim();
  } catch {
    return "";
  }
}
