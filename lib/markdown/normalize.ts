export function stripLeadingH1(content: string | undefined): string | undefined {
  if (!content) return content;

  // Remove ATX H1: lines starting with "# " and following blank line(s)
  const removedAtx = content.replace(/^\s*#\s.+(\r?\n)+/, '');

  // Remove Setext H1: title line followed by a line of ===
  const lines = removedAtx.split(/\r?\n/);
  if (lines.length >= 2 && /^=+$/.test(lines[1].trim())) {
    return lines.slice(2).join('\n');
  }

  return removedAtx;
}

