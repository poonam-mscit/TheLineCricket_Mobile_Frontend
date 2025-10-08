import { PageType } from '../types/pages';

// Color Palettes for Page Types
export const PageColors = {
  academy: {
    primary: '#8B5CF6', // purple-500
    secondary: '#7C3AED', // purple-600
    dark: '#6D28D9', // purple-700
    light: '#A78BFA', // purple-400
    background: '#F5F3FF', // purple-50
  },
  community: {
    primary: '#3B82F6', // blue-500 (changed from indigo for better visibility)
    secondary: '#2563EB', // blue-600
    dark: '#1D4ED8', // blue-700
    light: '#60A5FA', // blue-400
    background: '#EFF6FF', // blue-50
  },
  venue: {
    primary: '#10B981', // green-500
    secondary: '#059669', // green-600
    dark: '#047857', // green-700
    light: '#34D399', // green-400
    background: '#ECFDF5', // green-50
  }
};

// Shared Design System
export const PageTheme = {
  colors: {
    primary: '#FF6B33',
    secondary: '#2E4B5F',
    accent: '#5D798E',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF'
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#E5E7EB'
  },
  
  typography: {
    h1: { fontSize: 24, fontWeight: 'bold' as const, lineHeight: 32 },
    h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: 'normal' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: 'normal' as const, lineHeight: 20 },
    small: { fontSize: 12, fontWeight: 'normal' as const, lineHeight: 16 }
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8
    }
  }
};

// Icon Mappings
export const PageIcons: Record<PageType, string> = {
  academy: '🏫',
  community: '👥',
  venue: '🏟️'
};

// Helper Functions
export const getPageColor = (type: PageType): string => {
  return PageColors[type].primary;
};

export const getPageGradientColors = (type: PageType): [string, string] => {
  return [PageColors[type].primary, PageColors[type].dark];
};

export const getPageIcon = (type: PageType): string => {
  return PageIcons[type];
};

export const getPageTypeLabel = (type: PageType): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export const getPageDescription = (type: PageType): string => {
  const descriptions: Record<PageType, string> = {
    academy: 'Create a cricket academy to showcase your coaching programs and facilities',
    community: 'Build a community for cricket enthusiasts to connect and share',
    venue: 'List your cricket venue for bookings and events'
  };
  return descriptions[type];
};

