/**
 * tokens.stories.tsx — visual reference for @tensorcost/tokens
 *
 * This is a pure docs/visual page: no component under test, just
 * color swatches, tone chips, and typography specimens so you can
 * confirm the token values render correctly in both palette modes.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  BRAND_TOKENS_LIGHT,
  BRAND_TOKENS_DARK,
  TONE_LIGHT,
  TONE_DARK,
  TYPOGRAPHY_TOKENS,
  type ToneKind,
} from './index.js'

// ---------------------------------------------------------------------------
// Swatch / chip primitives — plain HTML so no MUI dep in @tensorcost/tokens.
// ---------------------------------------------------------------------------

function ColorSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, margin: '6px 8px 6px 0' }}>
      <div
        style={{
          width: 72, height: 44,
          background: value,
          borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.12)',
        }}
      />
      <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#334155', lineHeight: 1.4 }}>{label}</span>
      <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#64748B' }}>{value}</span>
    </div>
  )
}

function PaletteGrid({ tokens }: { tokens: Record<string, string> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, margin: '12px 0 24px' }}>
      {Object.entries(tokens)
        .filter(([, v]) => v.startsWith('#') || v.startsWith('rgba'))
        .map(([k, v]) => (
          <ColorSwatch key={k} label={k} value={v} />
        ))}
    </div>
  )
}

function ToneChip({ kind, tokens, mode }: { kind: ToneKind; tokens: { bg: string; fg: string; border: string }; mode: string }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 999,
        background: tokens.bg, color: tokens.fg,
        border: `1.5px solid ${tokens.border}`,
        fontSize: 11, fontWeight: 500, fontFamily: 'system-ui',
        margin: '4px 8px 4px 0',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: tokens.fg, flexShrink: 0 }} />
      {kind} · {mode}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Wrapper component — this is what Storybook renders.
// ---------------------------------------------------------------------------

const TONE_KINDS: ToneKind[] = ['good', 'bad', 'warn', 'info', 'neutral']

function TokensOverview() {
  return (
    <div style={{ padding: '24px 32px', fontFamily: "'Inter', system-ui, sans-serif", maxWidth: 900 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#0F172A' }}>
        Design Tokens
      </h2>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 32, marginTop: 0 }}>
        Visual reference for <code>@tensorcost/tokens</code>. Use the toolbar light/dark toggle
        above to switch the MUI ThemeProvider context; the token values here come directly
        from the exported token objects.
      </p>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Brand colors — light
      </h3>
      <PaletteGrid tokens={BRAND_TOKENS_LIGHT as unknown as Record<string, string>} />

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Brand colors — dark
      </h3>
      <PaletteGrid tokens={BRAND_TOKENS_DARK as unknown as Record<string, string>} />

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Tone palette
      </h3>
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, marginTop: 0 }}>
        Five semantic tones for chips, callouts, and status pills — bg/fg/border in light and dark.
      </p>
      <div style={{ marginBottom: 24 }}>
        {TONE_KINDS.map((kind) => (
          <div key={kind} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, width: 56, color: '#64748B', fontWeight: 600 }}>{kind}</span>
            <ToneChip kind={kind} tokens={TONE_LIGHT[kind]} mode="light" />
            <ToneChip kind={kind} tokens={TONE_DARK[kind]} mode="dark" />
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Typography scale
      </h3>
      <div style={{ marginBottom: 24 }}>
        {(
          [
            { key: 'h4',      style: { ...TYPOGRAPHY_TOKENS.h4,       fontFamily: TYPOGRAPHY_TOKENS.fontFamily }, text: 'Acme Platform — h4 heading' },
            { key: 'h5',      style: { ...TYPOGRAPHY_TOKENS.h5,       fontFamily: TYPOGRAPHY_TOKENS.fontFamily }, text: 'Usage breakdown — h5 heading' },
            { key: 'h6',      style: { ...TYPOGRAPHY_TOKENS.h6,       fontFamily: TYPOGRAPHY_TOKENS.fontFamily }, text: 'Last 30 days — h6 heading' },
            { key: 'overline',style: { ...TYPOGRAPHY_TOKENS.overline, fontFamily: TYPOGRAPHY_TOKENS.fontFamily, textTransform: 'uppercase' as const }, text: 'SECTION LABEL — overline' },
            { key: 'button',  style: { fontWeight: TYPOGRAPHY_TOKENS.button.fontWeight, fontSize: '0.8125rem', fontFamily: TYPOGRAPHY_TOKENS.fontFamily }, text: 'Get started — button' },
          ] as const
        ).map(({ key, style, text }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={style as React.CSSProperties}>{text}</div>
            <div style={{ marginTop: 2, fontFamily: 'monospace', fontSize: 9, color: '#94A3B8' }}>
              {key}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Radius scale
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 24 }}>
        {(
          [
            { label: 'radiusSm', value: BRAND_TOKENS_LIGHT.radiusSm, w: 64, h: 64 },
            { label: 'radiusMd', value: BRAND_TOKENS_LIGHT.radiusMd, w: 64, h: 64 },
            { label: 'radiusLg', value: BRAND_TOKENS_LIGHT.radiusLg, w: 64, h: 64 },
            { label: 'radiusXl', value: BRAND_TOKENS_LIGHT.radiusXl, w: 64, h: 64 },
            { label: 'radiusPill', value: BRAND_TOKENS_LIGHT.radiusPill, w: 96, h: 32 },
          ] as const
        ).map(({ label, value, w, h }) => (
          <div key={label} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '0 16px 16px 0' }}>
            <div style={{ width: w, height: h, background: '#3B82F6', borderRadius: value, opacity: 0.8 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#334155' }}>{label}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#64748B' }}>{value}</span>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Motion tokens
      </h3>
      <table style={{ borderCollapse: 'collapse', fontSize: 12, marginBottom: 24 }}>
        <tbody>
          {(
            ['motionFast', 'motionDrawerOpen', 'motionDrawerClose'] as const
          ).map((key) => (
            <tr key={key}>
              <td style={{ fontFamily: 'monospace', fontSize: 11, paddingRight: 24, paddingBottom: 6, color: '#3B82F6', fontWeight: 600 }}>{key}</td>
              <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#334155', paddingBottom: 6 }}>{BRAND_TOKENS_LIGHT[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CSF3 exports
// ---------------------------------------------------------------------------

const meta: Meta<typeof TokensOverview> = {
  title: 'Foundation/Brand',
  component: TokensOverview,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Visual reference for all `@tensorcost/tokens` values. Color swatches, tone chips, typography specimen, and radius scale.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TokensOverview>

export const TokensOverviewStory: Story = {
  name: 'Overview',
}
