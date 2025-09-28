// LIGHT OPTIONS

const CLAUDE_GEN = {
  headerBackground:'#2C2C3E',
  headerText: '#FFFFFF',
  background: '#f5f5f0',        // Warm off-white background
  surface: '#FFFFFF',           // Pure white for cards/surfaces
  primary: '#A8E6CF',           // Same green for consistency
  text: '#2C2C3E',             // Dark text (inverted from dark theme)
  textSecondary: '#666666',     // Gray secondary text
  border: '#e0e0e0',           // Light gray borders
} as const;

const CLASSIC_NEWSPAPER = {
  headerBackground:'#F5F2E8',
  headerText: '#1A472A',
  background: '#F5F2E8',
  surface: '#FEFCF7',
  primary: '#1A472A',
  primaryTransparent: '#1a472a88',
  text: '#2C2C2C',
  textSecondary: '#565656',
  border: '#D4CFC4',
} as const;

const SEPIA_SCHOLAR = {
  headerBackground:'#2C2C3E',
  headerText: '#FFFFFF',
  background: '#F6F0E4',
  surface: '#FBF7F0',
  primary: '#A0522D',
  text: '#3C2E1E',
  textSecondary: '#5C421E',
  border: '#E8DDD0',
} as const;

const CREAM_COFFEE = {
  headerBackground:'#2C2C3E',
  headerText: '#FFFFFF',
  background: '#F8F4E6',
  surface: '#FCFAF4',
  primary: '#6F4E37',
  text: '#3C2414',
  textSecondary: '#6B4914',
  border: '#E8E0D0',
} as const;

const RECYCLED_PAPER = {
  headerBackground:'#2C2C3E',
  headerText: '#FFFFFF',
  background: '#F5F3F0',
  surface: '#FAFAF8',
  primary: '#7B6143',
  text: '#3E3E3E',
  textSecondary: '#606060',
  border: '#E5E1DC',
} as const;

const OATMEAL = {
  headerBackground:'#2C2C3E',
  headerText: '#FFFFFF',
  background: '#F6F4F0',
  surface: '#FBFAF8',
  primary: '#A0522D',
  text: '#2F2F2F',
  textSecondary: '#6B5D45',
  border: '#EFEBE6',
} as const;

const EGGSHELL = {
  headerBackground:'#2C2C3E',
  headerText: '#FFFFFF',
  background: '#F0F0DC',
  surface: '#F8F8F0',
  primary: '#8B7D6B',
  text: '#2F2F2F',
  textSecondary: '#595959',
  border: '#E8E8DC',
} as const;

const INDIGO_MIND_YOLO_LIGHT = {
  background: '#fafafa',
  surface: '#ffffff',
  primary: '#6366f1', 
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
} as const;

const STEEL_BLUE_YOLO_LIGHT = {
  background: '#fafafa',
  surface: '#ffffff',
  primary: '#334155',
  text: '#1f2937', 
  textSecondary: '#6b7280',
  border: '#e5e7eb',
} as const;

const PURPLE_SAPPHIRE_YOLO_LIGHT = {
  background: '#fafafa',
  surface: '#ffffff',
  primary: '#6366f1',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#ccccd8ff',
} as const;


const COLOR_SCHEMES = {
  // LIGHT THEMES
  CLAUDE_GEN,
  CLASSIC_NEWSPAPER,
  SEPIA_SCHOLAR,
  CREAM_COFFEE,
  RECYCLED_PAPER,
  OATMEAL,
  EGGSHELL,
  INDIGO_MIND_YOLO_LIGHT,
  STEEL_BLUE_YOLO_LIGHT,
  PURPLE_SAPPHIRE_YOLO_LIGHT,
}

const LIGHT_COLORS = COLOR_SCHEMES.PURPLE_SAPPHIRE_YOLO_LIGHT

export default LIGHT_COLORS;