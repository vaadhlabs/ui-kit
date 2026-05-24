import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/brand.ts',
    'src/tone.ts',
    'src/typography.ts',
    'src/css-vars.ts',
    'src/blueprint.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
})
