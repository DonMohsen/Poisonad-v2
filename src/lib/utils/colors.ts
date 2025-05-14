export function darkenHexColor(hex: string, amount = 100): string {
  const parsed = hex.replace(/^#/, '');
  if (parsed.length !== 6) return hex;

  const r = Math.max(0, parseInt(parsed.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(parsed.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(parsed.slice(4, 6), 16) - amount);

  return (
    '#' +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function extractHexFromTailwindClass(classStr: string): string | null {
  const match = classStr.match(/\[#([0-9a-fA-F]{6})\]/);
  return match ? `#${match[1]}` : null;
}
