"use client";

import { motion } from "framer-motion";
import type { Product } from "@/data/products";

/* ---------- Dimension map ---------- */
const dimMap = {
  sm: { w: 64, h: 80 },
  md: { w: 96, h: 128 },
  lg: { w: 128, h: 176 },
  xl: { w: 176, h: 240 },
};

/* ---------- Shared helpers ---------- */

/** Lighten a hex colour toward white by `amount` (0..1) */
function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

/** Darken a hex colour toward black by `amount` (0..1) */
function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

/** Mix toward gold for a metallic cap */
function metallicGold(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mr = Math.round(r * 0.5 + 200 * 0.5);
  const mg = Math.round(g * 0.5 + 175 * 0.5);
  const mb = Math.round(b * 0.5 + 130 * 0.5);
  return `#${mr.toString(16).padStart(2, "0")}${mg.toString(16).padStart(2, "0")}${mb.toString(16).padStart(2, "0")}`;
}

/* ====================================================================
   Individual packaging renderers.
   Each returns an SVG group (<g>) positioned inside a viewBox that
   matches the given width/height.
   ==================================================================== */

function BottleShape({ w, h, g, id }: ShapeProps) {
  const capW = w * 0.28;
  const capH = h * 0.12;
  const neckW = w * 0.18;
  const neckH = h * 0.08;
  const bodyW = w * 0.52;
  const bodyH = h * 0.68;
  const bodyX = (w - bodyW) / 2;
  const bodyY = capH + neckH;
  const capX = (w - capW) / 2;
  const neckX = (w - neckW) / 2;
  const r = bodyW * 0.18;
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`cap-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(g[0], 0.35)} />
          <stop offset="100%" stopColor={metallicGold(g[1])} />
        </linearGradient>
        <linearGradient id={`btm-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x={capX} y={0} width={capW} height={capH} rx={capW * 0.3} fill={`url(#cap-${id})`} />
      {/* Neck */}
      <rect x={neckX} y={capH - 1} width={neckW} height={neckH + 2} rx={2} fill={`url(#bg-${id})`} />
      {/* Body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={r} fill={`url(#bg-${id})`} />
      {/* Glass highlight */}
      <rect x={bodyX} y={bodyY} width={bodyW * 0.45} height={bodyH} rx={r} fill={`url(#hl-${id})`} />
      {/* Bottom darken */}
      <rect x={bodyX} y={bodyY + bodyH * 0.65} width={bodyW} height={bodyH * 0.35} rx={r * 0.5} fill={`url(#btm-${id})`} />
      {/* Label area */}
      <LabelGroup x={w / 2} y={bodyY + bodyH * 0.42} size={w} product={id} />
    </g>
  );
}

function JarShape({ w, h, g, id }: ShapeProps) {
  const lidW = w * 0.72;
  const lidH = h * 0.16;
  const bodyW = w * 0.7;
  const bodyH = h * 0.55;
  const lidX = (w - lidW) / 2;
  const bodyX = (w - bodyW) / 2;
  const lidY = h * 0.05;
  const bodyY = lidY + lidH - 2;
  const r = bodyW * 0.22;
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`lid-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(g[0], 0.4)} />
          <stop offset="40%" stopColor={metallicGold(g[0])} />
          <stop offset="100%" stopColor={darken(metallicGold(g[1]), 0.1)} />
        </linearGradient>
        <linearGradient id={`btm-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      {/* Lid bevel highlight */}
      <rect x={lidX - 1} y={lidY - 1} width={lidW + 2} height={lidH * 0.35} rx={lidW * 0.12} fill={lighten(g[0], 0.5)} opacity="0.5" />
      {/* Lid */}
      <rect x={lidX} y={lidY} width={lidW} height={lidH} rx={lidW * 0.1} fill={`url(#lid-${id})`} />
      {/* Body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={r} fill={`url(#bg-${id})`} />
      {/* Glass highlight */}
      <rect x={bodyX} y={bodyY} width={bodyW * 0.42} height={bodyH} rx={r} fill={`url(#hl-${id})`} />
      {/* Bottom darken */}
      <rect x={bodyX} y={bodyY + bodyH * 0.7} width={bodyW} height={bodyH * 0.3} rx={r * 0.5} fill={`url(#btm-${id})`} />
      {/* Label */}
      <LabelGroup x={w / 2} y={bodyY + bodyH * 0.42} size={w} product={id} />
    </g>
  );
}

function TubeShape({ w, h, g, id }: ShapeProps) {
  const capW = w * 0.4;
  const capH = h * 0.1;
  const bodyW = w * 0.44;
  const bodyH = h * 0.72;
  const capX = (w - capW) / 2;
  const bodyX = (w - bodyW) / 2;
  const bodyY = capH;
  const r = bodyW * 0.25;
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`cap-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(g[0], 0.3)} />
          <stop offset="100%" stopColor={metallicGold(g[1])} />
        </linearGradient>
        <linearGradient id={`band-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Flat cap */}
      <rect x={capX} y={0} width={capW} height={capH} rx={3} fill={`url(#cap-${id})`} />
      {/* Body */}
      <rect x={bodyX} y={bodyY - 1} width={bodyW} height={bodyH} rx={r} fill={`url(#bg-${id})`} />
      {/* Matte highlight */}
      <rect x={bodyX} y={bodyY} width={bodyW * 0.38} height={bodyH} rx={r} fill={`url(#hl-${id})`} />
      {/* Diagonal label band */}
      <rect
        x={bodyX + bodyW * 0.05}
        y={bodyY + bodyH * 0.3}
        width={bodyW * 0.9}
        height={bodyH * 0.18}
        rx={2}
        fill={`url(#band-${id})`}
        transform={`rotate(-8 ${w / 2} ${bodyY + bodyH * 0.39})`}
      />
      {/* Bottom squeeze shape */}
      <ellipse cx={w / 2} cy={bodyY + bodyH - 2} rx={bodyW * 0.35} ry={4} fill={darken(g[1], 0.1)} opacity="0.3" />
      {/* Label */}
      <LabelGroup x={w / 2} y={bodyY + bodyH * 0.45} size={w} product={id} />
    </g>
  );
}

function SprayShape({ w, h, g, id }: ShapeProps) {
  const pumpW = w * 0.18;
  const pumpH = h * 0.06;
  const nozzleW = w * 0.22;
  const nozzleH = h * 0.04;
  const neckW = w * 0.14;
  const neckH = h * 0.06;
  const bodyW = w * 0.46;
  const bodyH = h * 0.65;
  const bodyX = (w - bodyW) / 2;
  const pumpX = (w - pumpW) / 2;
  const neckX = (w - neckW) / 2;
  const nozzleY = 0;
  const pumpY = nozzleH;
  const neckY = pumpY + pumpH;
  const bodyY = neckY + neckH;
  const r = bodyW * 0.16;
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={lighten(g[0], 0.5)} stopOpacity="0.6" />
          <stop offset="50%" stopColor={g[0]} stopOpacity="0.35" />
          <stop offset="100%" stopColor={g[1]} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`liquid-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g[0]} stopOpacity="0" />
          <stop offset="30%" stopColor={g[0]} stopOpacity="0.15" />
          <stop offset="100%" stopColor={g[1]} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`btm-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      {/* Nozzle tip */}
      <rect x={w / 2 - nozzleW / 2} y={nozzleY} width={nozzleW} height={nozzleH} rx={2} fill={darken(g[1], 0.15)} />
      {/* Pump button */}
      <rect x={pumpX} y={pumpY} width={pumpW} height={pumpH} rx={pumpW * 0.25} fill={metallicGold(g[0])} />
      {/* Neck */}
      <rect x={neckX} y={neckY} width={neckW} height={neckH + 2} rx={2} fill={darken(g[1], 0.08)} />
      {/* Glass body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={r} fill={`url(#glass-${id})`} />
      {/* Liquid inside */}
      <rect x={bodyX + 3} y={bodyY + bodyH * 0.3} width={bodyW - 6} height={bodyH * 0.65} rx={r * 0.8} fill={`url(#liquid-${id})`} />
      {/* Glass highlight */}
      <rect x={bodyX} y={bodyY} width={bodyW * 0.4} height={bodyH} rx={r} fill={`url(#hl-${id})`} />
      {/* Bottom darken */}
      <rect x={bodyX} y={bodyY + bodyH * 0.75} width={bodyW} height={bodyH * 0.25} rx={r * 0.5} fill={`url(#btm-${id})`} />
      {/* Label */}
      <LabelGroup x={w / 2} y={bodyY + bodyH * 0.4} size={w} product={id} />
    </g>
  );
}

function DropperShape({ w, h, g, id }: ShapeProps) {
  const bulbW = w * 0.24;
  const bulbH = h * 0.1;
  const pipetteW = w * 0.06;
  const pipetteH = h * 0.1;
  const neckW = w * 0.16;
  const neckH = h * 0.05;
  const bodyW = w * 0.44;
  const bodyH = h * 0.6;
  const bodyX = (w - bodyW) / 2;
  const bulbX = (w - bulbW) / 2;
  const pipetteX = (w - pipetteW) / 2;
  const bulbY = 0;
  const pipetteY = bulbH;
  const neckY = pipetteY + pipetteH;
  const neckX = (w - neckW) / 2;
  const bodyY = neckY + neckH;
  const r = bodyW * 0.2;
  // Amber tones
  const amber1 = "#D4A56A";
  const amber2 = "#B8863A";
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`amber-${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={lighten(amber1, 0.3)} stopOpacity="0.5" />
          <stop offset="50%" stopColor={amber1} stopOpacity="0.35" />
          <stop offset="100%" stopColor={amber2} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`btm-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Rubber bulb */}
      <ellipse cx={w / 2} cy={bulbH * 0.55} rx={bulbW / 2} ry={bulbH * 0.55} fill={darken(g[1], 0.2)} />
      {/* Glass pipette */}
      <rect x={pipetteX} y={pipetteY} width={pipetteW} height={pipetteH} rx={1} fill={lighten(amber1, 0.4)} opacity="0.7" />
      {/* Neck collar */}
      <rect x={neckX} y={neckY} width={neckW} height={neckH + 1} rx={2} fill={metallicGold(g[0])} />
      {/* Amber glass body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={r} fill={`url(#amber-${id})`} />
      {/* Product colour inside */}
      <rect x={bodyX + 3} y={bodyY + bodyH * 0.25} width={bodyW - 6} height={bodyH * 0.7} rx={r * 0.8} fill={`url(#bg-${id})`} opacity="0.35" />
      {/* Glass highlight */}
      <rect x={bodyX} y={bodyY} width={bodyW * 0.38} height={bodyH} rx={r} fill={`url(#hl-${id})`} />
      {/* Bottom darken */}
      <rect x={bodyX} y={bodyY + bodyH * 0.72} width={bodyW} height={bodyH * 0.28} rx={r * 0.5} fill={`url(#btm-${id})`} />
      {/* Label */}
      <LabelGroup x={w / 2} y={bodyY + bodyH * 0.4} size={w} product={id} />
    </g>
  );
}

function StickShape({ w, h, g, id }: ShapeProps) {
  const capW = w * 0.36;
  const capH = h * 0.18;
  const bodyW = w * 0.34;
  const bodyH = h * 0.62;
  const capX = (w - capW) / 2;
  const bodyX = (w - bodyW) / 2;
  const bodyY = capH - 1;
  const r = bodyW * 0.3;
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`cap-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(g[0], 0.45)} />
          <stop offset="50%" stopColor={metallicGold(g[0])} />
          <stop offset="100%" stopColor={metallicGold(g[1])} />
        </linearGradient>
      </defs>
      {/* Metallic cap */}
      <rect x={capX} y={0} width={capW} height={capH} rx={capW * 0.28} fill={`url(#cap-${id})`} />
      {/* Cap bevel line */}
      <line x1={capX + 3} y1={capH - 1} x2={capX + capW - 3} y2={capH - 1} stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
      {/* Cylindrical body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={r} fill={`url(#bg-${id})`} />
      {/* Highlight */}
      <rect x={bodyX} y={bodyY} width={bodyW * 0.4} height={bodyH} rx={r} fill={`url(#hl-${id})`} />
      {/* Twist lines */}
      {[0.7, 0.78, 0.86].map((frac) => (
        <line
          key={frac}
          x1={bodyX + 3}
          y1={bodyY + bodyH * frac}
          x2={bodyX + bodyW - 3}
          y2={bodyY + bodyH * frac}
          stroke={darken(g[1], 0.15)}
          strokeOpacity="0.25"
          strokeWidth="0.5"
        />
      ))}
      {/* Label */}
      <LabelGroup x={w / 2} y={bodyY + bodyH * 0.38} size={w} product={id} />
    </g>
  );
}

function BarShape({ w, h, g, id }: ShapeProps) {
  const plateW = w * 0.72;
  const plateH = h * 0.08;
  const barW = w * 0.52;
  const barH = h * 0.45;
  const plateX = (w - plateW) / 2;
  const barX = (w - barW) / 2;
  const plateY = h * 0.6;
  const barY = plateY - barH + 4;
  // Heart shape approximation using a path
  const cx = w / 2;
  const topY = barY;
  const hW = barW * 0.5;
  const hH = barH;
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`plate-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DDD0" />
          <stop offset="100%" stopColor="#D4C8B8" />
        </linearGradient>
      </defs>
      {/* Dish / plate */}
      <ellipse cx={w / 2} cy={plateY + plateH / 2} rx={plateW / 2} ry={plateH} fill={`url(#plate-${id})`} />
      <ellipse cx={w / 2} cy={plateY + plateH / 2} rx={plateW / 2 - 3} ry={plateH - 2} fill="white" opacity="0.15" />
      {/* Heart-shaped bar */}
      <path
        d={`M ${cx} ${topY + hH}
            C ${cx - hW * 0.6} ${topY + hH * 0.7}, ${cx - hW} ${topY + hH * 0.35}, ${cx - hW * 0.55} ${topY + hH * 0.1}
            Q ${cx - hW * 0.25} ${topY - hH * 0.08}, ${cx} ${topY + hH * 0.28}
            Q ${cx + hW * 0.25} ${topY - hH * 0.08}, ${cx + hW * 0.55} ${topY + hH * 0.1}
            C ${cx + hW} ${topY + hH * 0.35}, ${cx + hW * 0.6} ${topY + hH * 0.7}, ${cx} ${topY + hH} Z`}
        fill={`url(#bg-${id})`}
      />
      {/* Highlight on bar */}
      <path
        d={`M ${cx} ${topY + hH}
            C ${cx - hW * 0.6} ${topY + hH * 0.7}, ${cx - hW} ${topY + hH * 0.35}, ${cx - hW * 0.55} ${topY + hH * 0.1}
            Q ${cx - hW * 0.25} ${topY - hH * 0.08}, ${cx} ${topY + hH * 0.28}
            Q ${cx + hW * 0.25} ${topY - hH * 0.08}, ${cx + hW * 0.55} ${topY + hH * 0.1}
            C ${cx + hW} ${topY + hH * 0.35}, ${cx + hW * 0.6} ${topY + hH * 0.7}, ${cx} ${topY + hH} Z`}
        fill={`url(#hl-${id})`}
      />
      {/* Label */}
      <LabelGroup x={w / 2} y={topY + hH * 0.5} size={w} product={id} />
    </g>
  );
}

function PotShape({ w, h, g, id }: ShapeProps) {
  const lidW = w * 0.62;
  const lidH = h * 0.2;
  const bodyW = w * 0.66;
  const bodyH = h * 0.46;
  const lidX = (w - lidW) / 2;
  const bodyX = (w - bodyW) / 2;
  const lidY = h * 0.08;
  const bodyY = lidY + lidH - 3;
  const r = bodyW * 0.3;
  return (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="100%" stopColor={g[1]} />
        </linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`lid-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(g[0], 0.45)} />
          <stop offset="50%" stopColor={metallicGold(g[0])} />
          <stop offset="100%" stopColor={darken(metallicGold(g[1]), 0.08)} />
        </linearGradient>
        <linearGradient id={`btm-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      {/* Domed lid */}
      <ellipse cx={w / 2} cy={lidY + lidH * 0.25} rx={lidW * 0.35} ry={lidH * 0.35} fill={lighten(metallicGold(g[0]), 0.25)} opacity="0.6" />
      <rect x={lidX} y={lidY + lidH * 0.3} width={lidW} height={lidH * 0.7} rx={lidW * 0.12} fill={`url(#lid-${id})`} />
      {/* Lid bevel */}
      <line x1={lidX + 4} y1={lidY + lidH - 1} x2={lidX + lidW - 4} y2={lidY + lidH - 1} stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
      {/* Body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={r} fill={`url(#bg-${id})`} />
      {/* Glass highlight */}
      <rect x={bodyX} y={bodyY} width={bodyW * 0.4} height={bodyH} rx={r} fill={`url(#hl-${id})`} />
      {/* Bottom darken */}
      <rect x={bodyX} y={bodyY + bodyH * 0.7} width={bodyW} height={bodyH * 0.3} rx={r * 0.5} fill={`url(#btm-${id})`} />
      {/* Label */}
      <LabelGroup x={w / 2} y={bodyY + bodyH * 0.4} size={w} product={id} />
    </g>
  );
}

/* ---------- Shared label sub-group ---------- */
interface ShapeProps {
  w: number;
  h: number;
  g: [string, string];
  id: string;
}

function LabelGroup({ x, y, size, product: _product }: { x: number; y: number; size: number; product: string }) {
  const fs = Math.max(3.5, size * 0.06);
  return (
    <g>
      {/* Decorative line */}
      <line x1={x - size * 0.14} y1={y - fs * 1.5} x2={x + size * 0.14} y2={y - fs * 1.5} stroke="white" strokeOpacity="0.35" strokeWidth="0.4" />
      {/* Brand name */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fillOpacity="0.85"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="600"
        fontSize={fs}
        letterSpacing={fs * 0.2}
      >
        ASRAR LALLA
      </text>
      {/* Moroccan dots */}
      {[-1, 0, 1].map((offset) => (
        <circle
          key={offset}
          cx={x + offset * (fs * 0.55)}
          cy={y + fs * 1.2}
          r={fs * 0.15}
          fill="white"
          fillOpacity="0.45"
        />
      ))}
      {/* Bottom decorative line */}
      <line x1={x - size * 0.1} y1={y + fs * 2} x2={x + size * 0.1} y2={y + fs * 2} stroke="white" strokeOpacity="0.2" strokeWidth="0.3" />
    </g>
  );
}

/* ---------- Packaging dispatcher ---------- */
const packagingRenderer: Record<string, React.FC<ShapeProps>> = {
  bottle: BottleShape,
  jar: JarShape,
  tube: TubeShape,
  spray: SprayShape,
  dropper: DropperShape,
  stick: StickShape,
  bar: BarShape,
  pot: PotShape,
};

/* ====================================================================
   Main component
   ==================================================================== */
export default function ProductVisual({
  product,
  size = "md",
  animate = true,
}: {
  product: Product;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}) {
  const dims = dimMap[size];
  const Renderer = packagingRenderer[product.packaging] || packagingRenderer.bottle;
  const uid = `pv-${product.id}-${size}`;

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: dims.w, height: dims.h }}
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={
        animate
          ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <svg
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Drop shadow beneath product */}
        <defs>
          <radialGradient id={`shadow-${uid}`}>
            <stop offset="0%" stopColor={product.gradient[1]} stopOpacity="0.25" />
            <stop offset="100%" stopColor={product.gradient[1]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx={dims.w / 2}
          cy={dims.h - 4}
          rx={dims.w * 0.32}
          ry={4}
          fill={`url(#shadow-${uid})`}
        />

        {/* Product shape */}
        <Renderer
          w={dims.w}
          h={dims.h - 10}
          g={product.gradient}
          id={uid}
        />

        {/* Animated shimmer overlay */}
        <defs>
          <clipPath id={`clip-${uid}`}>
            <rect x={0} y={0} width={dims.w} height={dims.h} />
          </clipPath>
        </defs>
        <g clipPath={`url(#clip-${uid})`}>
          <rect
            x={0}
            y={0}
            width={dims.w * 0.35}
            height={dims.h}
            rx={4}
            fill="url(#shimmer-grad)"
            opacity="0.18"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`${-dims.w * 0.5} 0;${dims.w * 1.5} 0`}
              dur="4s"
              repeatCount="indefinite"
            />
          </rect>
        </g>

        {/* Shimmer gradient (shared) */}
        <defs>
          <linearGradient id="shimmer-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
