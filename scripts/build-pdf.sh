#!/usr/bin/env bash
# Regenerate the downloadable CV PDF from the site itself, using the print
# stylesheet in public/styles.css. Run this after changing CV content so the
# PDF and the page stay in sync.
#
#   ./scripts/build-pdf.sh
#
# Requires a Chrome/Chromium binary. Set CHROME to override autodetection.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public/assets/Jacobus-Nagel-CV.pdf"
PORT="${PORT:-4180}"

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in /opt/pw-browsers/chromium-*/chrome-linux/chrome \
           "$(command -v google-chrome || true)" \
           "$(command -v chromium || true)" \
           "$(command -v chromium-browser || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
  done
fi
if [ -z "$CHROME" ]; then
  echo "No Chrome/Chromium found. Set CHROME=/path/to/chrome" >&2
  exit 1
fi

STAGE="$(mktemp -d)"
cleanup() { pkill -f "http.server $PORT" 2>/dev/null || true; rm -rf "$STAGE"; }
trap cleanup EXIT

cp -r "$ROOT/public/." "$STAGE/"

# <details> content is not rendered while collapsed, so the earlier roles would
# be missing from the PDF. Expand them for the print render.
python3 - "$STAGE/index.html" <<'PY'
import re, sys
p = sys.argv[1]
html = open(p, encoding='utf-8').read()
html = re.sub(r'<details(?![^>]*\bopen\b)', '<details open', html)
open(p, 'w', encoding='utf-8').write(html)
PY

python3 -m http.server "$PORT" --directory "$STAGE" >/dev/null 2>&1 &
sleep 1

"$CHROME" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --virtual-time-budget=5000 --print-to-pdf="$OUT" \
  "http://localhost:$PORT/" >/dev/null 2>&1

echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
