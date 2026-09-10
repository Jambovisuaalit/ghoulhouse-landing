# GhoulHouse landing redesign direction

Status: visual rebuild, not incremental polish.

## Problems in current production
- too many bordered boxes and micro-labels competing for attention
- hero contains too many simultaneous ideas
- repeated black/white card systems flatten hierarchy
- multiple CSS override layers make spacing and responsive behavior hard to reason about
- content examples and problem/solution sections are visually repetitive
- mobile header is cramped by logo + CTA
- strong brand colors are used too continuously instead of as controlled accents

## New visual direction
- premium Finnish editorial / architecture studio feel
- generous negative space
- one dominant idea per viewport
- large Anton headlines, restrained Montserrat body typography
- GHOST as primary canvas, INK as text and occasional full-bleed sections, SIGNAL RED only for emphasis/CTA
- fewer borders; use scale, alignment, whitespace and image cropping for hierarchy
- hero: left-aligned message + one large visual transformation panel
- RAW → FINAL becomes the main proof mechanism
- problem/solution reduced to a concise narrative strip
- process becomes three editorial columns, not cards
- examples become an asymmetric editorial grid, not six equal boxes
- pricing becomes one clean offer module
- founder and FAQ visually quiet
- mobile: logo only + compact CTA, no oversized header density

## Guardrails
- keep canonical offer and claims unchanged
- preserve IDs used by navigation and QA
- preserve no-JS form submission
- preserve accessibility, SEO, structured data and lead pipeline
- do not present concept imagery as customer work
- do not deploy to production before visual preview review
