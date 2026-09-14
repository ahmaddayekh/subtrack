import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const svg = "scripts/icon-source.svg";

const targets = [
  { file: "public/icons/icon-192.png", size: 192, pad: 0 },
  { file: "public/icons/icon-512.png", size: 512, pad: 0 },
  { file: "public/icons/maskable-192.png", size: 192, pad: 24 },
  { file: "public/icons/maskable-512.png", size: 512, pad: 64 },
  { file: "public/apple-touch-icon.png", size: 180, pad: 0 },
];

for (const t of targets) {
  const inner = t.size - t.pad * 2;
  const base = sharp(svg, { density: 384 }).resize(inner, inner);
  if (t.pad > 0) {
    await base
      .extend({
        top: t.pad,
        bottom: t.pad,
        left: t.pad,
        right: t.pad,
        background: { r: 124, g: 58, b: 237, alpha: 1 },
      })
      .png()
      .toFile(t.file);
  } else {
    await base.png().toFile(t.file);
  }
  console.log("wrote", t.file);
}
