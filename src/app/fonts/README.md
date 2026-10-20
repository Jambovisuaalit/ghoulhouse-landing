# Local Montserrat — European Latin subset

Bundled locally; production builds do not fetch Google Fonts. The same variable
Montserrat design and original weight axis are retained. Layout declares 400–900.
SIL Open Font License 1.1 and original copyright remain in [OFL.txt](OFL.txt).

Original source: https://github.com/google/fonts/tree/main/ofl/montserrat,
downloaded 6 October 2026 and converted from TTF to WOFF2. The complete 216,236-byte
font is preserved in Git commit 66eb5db74efd989c0c00f8f6daa8eaeaab6496d3 at this path;
SHA-256 927cc51086ea02223ffe0c78312ab104f29bf4618213d1edaa58720b8fe62767.

The site subset is 82,356 bytes (61.9% smaller), with 434 mapped characters. It keeps
all originally supported European Latin characters U+0000–017F (including Finnish
and Swedish), combining marks U+0300–036F, punctuation U+2000–206F, currency
U+20A0–20CF, letterlike symbols U+2100–214F, arrows U+2190–21FF, supported ligatures
U+FB00–FB06, and U+2212/FEFF/FFFD where available in the original. All layout features
are retained with their required glyph dependencies. Fonts do not gain glyphs absent
from the original. Other scripts use the existing system fallback; restore or split
the full source font before introducing a new site language requiring those glyphs.

Rebuild/check in an isolated Python environment:

```bash
python -m venv /tmp/ghoulhouse-font-build
/tmp/ghoulhouse-font-build/bin/pip install 'fonttools[woff]==4.61.1' 'brotli==1.2.0'
/tmp/ghoulhouse-font-build/bin/python scripts/build-latin-font.py --check
```

The source commit must be available locally; shallow checkouts can fetch it with
git fetch --depth=1 origin 66eb5db74efd989c0c00f8f6daa8eaeaab6496d3. Omit --check to
rebuild, then update docs/resources.json's hash and size in the same PR.
The recipe verifies source hash, all currently used supported literal characters,
axis bounds, advance widths and decomposed outlines at weights 400/700/900, and
byte-for-byte reproducibility. It adds no Python dependency to the web runtime.
