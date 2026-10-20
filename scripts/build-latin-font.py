"""Reproduce the site subset from the immutable full-font Git object.

Offline after installing fonttools[woff]==4.61.1 and brotli==1.2.0.
No runtime dependency is added. See src/app/fonts/README.md.
"""
import hashlib
import io
from pathlib import Path
import subprocess
import sys

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE_COMMIT = '66eb5db74efd989c0c00f8f6daa8eaeaab6496d3'
FONT = 'src/app/fonts/Montserrat-Variable.woff2'
SOURCE_SHA256 = '927cc51086ea02223ffe0c78312ab104f29bf4618213d1edaa58720b8fe62767'
RANGES = [(0, 0x17F), (0x300, 0x36F), (0x2000, 0x206F),
          (0x20A0, 0x20CF), (0x2100, 0x214F), (0x2190, 0x21FF), (0xFB00, 0xFB06)]

source = subprocess.check_output(['git', 'show', f'{SOURCE_COMMIT}:{FONT}'], cwd=ROOT)
assert hashlib.sha256(source).hexdigest() == SOURCE_SHA256, 'Original font identity mismatch'
before = TTFont(io.BytesIO(source), recalcTimestamp=False)
original_map = before.getBestCmap()
font = TTFont(io.BytesIO(source), recalcTimestamp=False)
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=[n for start, end in RANGES for n in range(start, end + 1)]
                   + [0x2212, 0xFEFF, 0xFFFD])
subsetter.subset(font)
font.flavor = 'woff2'
output = io.BytesIO()
font.save(output)
result = output.getvalue()
after = TTFont(io.BytesIO(result), recalcTimestamp=False)
new_map = after.getBestCmap()
assert set(original_map).intersection(range(0x180)) <= set(new_map), 'European Latin coverage lost'
assert before['fvar'].axes[0].minValue == after['fvar'].axes[0].minValue
assert before['fvar'].axes[0].maxValue == after['fvar'].axes[0].maxValue

# Every character already supported by the original in current literal site sources
# must remain supported; this catches accents, arrows, currency and punctuation.
characters = set()
for directory in ['src/app', 'src/components', 'src/config', 'src/data']:
    for path in (ROOT / directory).rglob('*'):
        if path.suffix in {'.ts', '.tsx', '.css'}:
            characters.update(map(ord, path.read_text()))
assert characters.intersection(original_map) <= set(new_map), 'Existing site character coverage lost'

# Check advance widths and decomposed outlines at representative UI weights.
for weight in [400, 700, 900]:
    old_set = before.getGlyphSet(location={'wght': weight})
    new_set = after.getGlyphSet(location={'wght': weight})
    for codepoint, name in new_map.items():
        old_glyph = old_set[original_map[codepoint]]
        new_glyph = new_set[name]
        assert old_glyph.width == new_glyph.width, f'Advance changed: U+{codepoint:04X}/{weight}'
        old_pen = DecomposingRecordingPen(old_set)
        new_pen = DecomposingRecordingPen(new_set)
        old_glyph.draw(old_pen)
        new_glyph.draw(new_pen)
        assert old_pen.value == new_pen.value, f'Outline changed: U+{codepoint:04X}/{weight}'

if '--check' in sys.argv:
    assert (ROOT / FONT).read_bytes() == result, 'Committed font differs from reproducible subset'
else:
    (ROOT / FONT).write_bytes(result)
print(f'Font QA PASS: {len(source)} → {len(result)} bytes, {len(new_map)} characters; '
      'source coverage, variable axis, widths and outlines verified at 400/700/900')
