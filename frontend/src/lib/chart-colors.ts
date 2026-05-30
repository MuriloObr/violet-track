const COLOR_MAP: Record<string, string> = {
  'red': 'hsl(var(--destructive))',
  'blue': 'hsl(217, 91%, 60%)',
  'green': 'hsl(142, 71%, 45%)',
  'yellow': 'hsl(48, 96%, 53%)',
  'purple': 'hsl(262, 83%, 58%)',
  'pink': 'hsl(330, 81%, 60%)',
  'indigo': 'hsl(239, 84%, 67%)',
  'orange': 'hsl(24, 95%, 53%)',
  'teal': 'hsl(172, 66%, 50%)',
  'cyan': 'hsl(188, 86%, 53%)',
  'gray': 'hsl(var(--muted-foreground))',
};

export function getHexColorForString(text: string): string {
  if (!text) return COLOR_MAP['gray'];
  
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = Object.keys(COLOR_MAP).filter(c => c !== 'gray');
  const index = Math.abs(hash) % colors.length;
  return COLOR_MAP[colors[index]];
}
