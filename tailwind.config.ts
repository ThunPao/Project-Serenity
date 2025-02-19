import { myJuliaTheme } from './src/theme';

import { join } from 'path';
import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ["'Noto Sans Thai'", 'serif'],
        noto2: ["'Noto Sans Thai Looped'", 'serif'],
        pixel: ["'Pixelify Sans'", 'serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    skeleton({
      themes: {
        // preset: ["skeleton"],
        custom: [
          myJuliaTheme
        ]
      }
    })
  ]
} satisfies Config;

export default config;
