#!/usr/bin/env python3
"""One-off asset pipeline for the NEAS proof of concept.

Generates modern derivatives of the committed source images and fonts. The
originals are never modified: they stay in the repository root and are still
served as the <picture> fallback for browsers without WebP.

Outputs
-------
img/<name>-450.webp   small variant (1x phone / 2x nothing)
img/<name>-<W>.webp   large variant, capped at the source width (never upscaled)
fonts/*.woff2         Brotli-compressed webfonts (~30% smaller than WOFF)

Run:  python tools/optimize-assets.py
Deps: pillow, fonttools, brotli
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG_OUT = ROOT / "img"

# Widest the images are ever displayed is a single column at the 480px
# breakpoint (~448 CSS px). 450w covers 1x, the large variant covers 2x.
SMALL_WIDTH = 450
MAX_WIDTH = 900

PHOTOS = [
    "DH9A0233.jpg",
    "DWL50061.jpg",
    "DWL50141.jpg",
    "DWL50646.jpg",
    "mascot_image.png",
]
LOGO = "NEAS-Logo.png"


def kb(path: Path) -> int:
    return path.stat().st_size // 1024


def encode(im: Image.Image, dest: Path, quality: int) -> None:
    """Write a WebP, preserving alpha when the source has it."""
    params = {"quality": quality, "method": 6}
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        params["exact"] = False
    else:
        im = im.convert("RGB")
    im.save(dest, "WEBP", **params)


def variants(name: str, quality: int = 80) -> None:
    src = ROOT / name
    stem = Path(name).stem
    with Image.open(src) as im:
        w, h = im.size
        targets = {min(w, MAX_WIDTH)}
        if w > SMALL_WIDTH:
            targets.add(SMALL_WIDTH)
        for tw in sorted(targets):
            th = round(h * tw / w)
            out = IMG_OUT / f"{stem}-{tw}.webp"
            resized = im if tw == w else im.resize((tw, th), Image.LANCZOS)
            encode(resized, out, quality)
            print(f"  {out.name:34} {tw}x{th:<5} {kb(out)}KB")


def fonts() -> None:
    from fontTools.ttLib import TTFont

    for ttf in sorted((ROOT / "fonts").glob("*.ttf")):
        out = ttf.with_suffix(".woff2")
        font = TTFont(ttf)
        font.flavor = "woff2"
        font.save(out)
        print(f"  {out.name:34} {kb(ttf)}KB TTF -> {kb(out)}KB WOFF2")


def main() -> None:
    IMG_OUT.mkdir(exist_ok=True)
    print("Images:")
    for name in PHOTOS:
        variants(name)
    # The logo is line art on transparency; it keeps more quality and is only
    # ever rendered at ~640 CSS px wide, so one variant at source width is enough.
    print("Logo:")
    variants(LOGO, quality=90)
    print("Fonts:")
    fonts()
    total = sum(p.stat().st_size for p in IMG_OUT.iterdir()) // 1024
    print(f"\nimg/ total: {total}KB")


if __name__ == "__main__":
    main()
