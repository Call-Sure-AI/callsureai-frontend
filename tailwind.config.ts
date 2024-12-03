import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";
import animatePlugin from "tailwindcss-animate";
const {
    default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      // Default Tailwind Breakpoints
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',

      // Extra Small Devices (Older/Compact Phones)
      'xxs': {'max': '320px'},     // iPhone 4, iPhone 5/SE (1st gen)
      'xs': {'min': '321px', 'max': '375px'},  // iPhone SE

      // Small Devices (Smaller Smartphones)
      'sm-mobile': {'min': '376px', 'max': '390px'},  // iPhone 12/13 Mini

      // Medium Devices (Average Smartphones)
      'mobile': {'min': '391px', 'max': '414px'},     // iPhone XR, 11, etc.

      // Large Devices (Larger Smartphones)
      'lg-mobile': {'min': '415px', 'max': '428px'},  // iPhone Pro Max

      // Extra Large Devices (Phablets)
      'xl-mobile': {'min': '429px', 'max': '480px'},  // Larger Android devices

      // Small Tablets & Landscape Phones
      'sm-tablet': {'min': '481px', 'max': '640px'},  // Small tablets

      // Medium Tablets
      'tablet': {'min': '641px', 'max': '768px'},     // iPads

      // Large Tablets
      'lg-tablet': {'min': '769px', 'max': '1024px'}, // iPad Pro

      // Special Cases
      'landscape': {'raw': '(orientation: landscape)'},
      'tall': {'raw': '(min-height: 800px)'},
      'fold': {'min': '280px', 'max': '320px'},       // Galaxy Fold closed
      'unfold': {'min': '717px', 'max': '721px'},     // Galaxy Fold open
    },
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        primaryBlue: 'hsl(var(--primary-blue))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        gradient: {
          '0%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
          '100%': {
            'background-position': '0% 50%'
          }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        gradient: 'gradient 8s linear infinite'
      }
    }
  },
  plugins: [
    animatePlugin,
    function addVariablesForColors({ addBase, theme }: PluginAPI) {
      const allColors = flattenColorPalette(theme("colors"));
      const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, String(val)])
      );
    
      addBase({
        ":root": newVars as Record<string, string>
      });
    },
  ],
};

export default config;