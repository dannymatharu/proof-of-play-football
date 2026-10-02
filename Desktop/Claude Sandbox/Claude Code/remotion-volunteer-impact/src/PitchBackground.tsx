import React from "react";

// Standard pitch dimensions in metres:
// 105m × 68m | Centre circle r=9.15m | Penalty area 16.5m deep × 40.32m wide
// Goal area 5.5m deep × 18.32m wide | Penalty spot 11m from goal line

const S = 1080 / 105; // px per metre — pitch fills full width

const PH = 68 * S;          // pitch height in px ≈ 699
const PY = (1080 - PH) / 2; // vertical offset to centre in 1080px frame ≈ 190

const px = (m: number) => m * S;
const py = (m: number) => PY + m * S;
const pr = (m: number) => m * S;

// Penalty arc: the arc of circle (r=9.15m, centred on penalty spot) that lies
// outside the penalty area. Half-chord where arc meets penalty area edge:
// sqrt(9.15² − 5.5²) = 7.313m
const ARC_HALF_CHORD = pr(7.313);
const ARC_R = pr(9.15);

export const PitchBackground: React.FC<{ opacity?: number }> = ({
  opacity = 0.18,
}) => (
  <svg
    width={1080}
    height={1080}
    viewBox="0 0 1080 1080"
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
  >
    <g
      stroke="#F4F1EB"
      strokeWidth={2.2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    >
      {/* ── Pitch boundary ─────────────────────────────── */}
      <rect x={0} y={PY} width={px(105)} height={PH} />

      {/* ── Halfway line ───────────────────────────────── */}
      <line x1={px(52.5)} y1={PY} x2={px(52.5)} y2={PY + PH} />

      {/* ── Centre circle ──────────────────────────────── */}
      <circle cx={px(52.5)} cy={py(34)} r={ARC_R} />

      {/* ── Centre spot ────────────────────────────────── */}
      <circle cx={px(52.5)} cy={py(34)} r={pr(0.35)} fill="#F4F1EB" />

      {/* ── Left penalty area ──────────────────────────── */}
      <rect
        x={0}
        y={py(13.84)}
        width={px(16.5)}
        height={py(54.16) - py(13.84)}
      />

      {/* ── Right penalty area ─────────────────────────── */}
      <rect
        x={px(88.5)}
        y={py(13.84)}
        width={px(16.5)}
        height={py(54.16) - py(13.84)}
      />

      {/* ── Left goal area (6-yard box) ────────────────── */}
      <rect
        x={0}
        y={py(24.84)}
        width={px(5.5)}
        height={py(43.16) - py(24.84)}
      />

      {/* ── Right goal area ────────────────────────────── */}
      <rect
        x={px(99.5)}
        y={py(24.84)}
        width={px(5.5)}
        height={py(43.16) - py(24.84)}
      />

      {/* ── Left penalty spot ──────────────────────────── */}
      <circle cx={px(11)} cy={py(34)} r={pr(0.35)} fill="#F4F1EB" />

      {/* ── Right penalty spot ─────────────────────────── */}
      <circle cx={px(94)} cy={py(34)} r={pr(0.35)} fill="#F4F1EB" />

      {/* ── Left penalty arc (bulges toward centre) ────── */}
      <path
        d={`M ${px(16.5)} ${py(34) - ARC_HALF_CHORD}
            A ${ARC_R} ${ARC_R} 0 0 1
            ${px(16.5)} ${py(34) + ARC_HALF_CHORD}`}
      />

      {/* ── Right penalty arc ──────────────────────────── */}
      <path
        d={`M ${px(88.5)} ${py(34) - ARC_HALF_CHORD}
            A ${ARC_R} ${ARC_R} 0 0 0
            ${px(88.5)} ${py(34) + ARC_HALF_CHORD}`}
      />

      {/* ── Corner arcs (r=1m) ─────────────────────────── */}
      {/* Top-left */}
      <path
        d={`M ${px(1)} ${PY} A ${pr(1)} ${pr(1)} 0 0 1 0 ${py(1)}`}
      />
      {/* Top-right */}
      <path
        d={`M ${px(104)} ${PY} A ${pr(1)} ${pr(1)} 0 0 0 ${px(105)} ${py(1)}`}
      />
      {/* Bottom-left */}
      <path
        d={`M 0 ${py(67)} A ${pr(1)} ${pr(1)} 0 0 1 ${px(1)} ${py(68)}`}
      />
      {/* Bottom-right */}
      <path
        d={`M ${px(105)} ${py(67)} A ${pr(1)} ${pr(1)} 0 0 0 ${px(104)} ${py(68)}`}
      />
    </g>
  </svg>
);
