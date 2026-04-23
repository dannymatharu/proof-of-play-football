import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PitchBackground } from "./PitchBackground";

const B = {
  green: "#0B3D20",
  gold: "#B8750E",
  cream: "#F4F1EB",
  white: "#FFFFFF",
} as const;

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
`;

const serif = `'Cormorant Garamond', Georgia, serif`;
const sans = `'Outfit', system-ui, sans-serif`;

const fade = (frame: number, start: number, duration = 18): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

const Counter: React.FC<{ frame: number }> = ({ frame }) => {
  const value = Math.round(
    interpolate(frame, [20, 72], [0, 320], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  return <>£{value.toLocaleString("en-GB")}</>;
};

export const PitchTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20, stiffness: 140, mass: 0.5 },
    from: 0.88,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: B.green }}>
      <style>{FONTS}</style>

      {/* Pitch geometry background */}
      <PitchBackground opacity={0.18} />

      {/* Content layer */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
        }}
      >
        {/* Gold label */}
        <p
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 18,
            color: B.gold,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            margin: "0 0 28px",
            opacity: fade(frame, 5, 18),
          }}
        >
          Social value generated
        </p>

        {/* Main counter */}
        <p
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 152,
            color: B.white,
            margin: 0,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            opacity: fade(frame, 16, 18),
            transform: `scale(${scaleIn})`,
          }}
        >
          <Counter frame={frame} />
        </p>

        {/* Per session */}
        <p
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 46,
            color: B.cream,
            margin: "20px 0 0",
            opacity: fade(frame, 68, 18),
          }}
        >
          per session
        </p>

        {/* Methodology badge */}
        <div
          style={{
            marginTop: 48,
            background: "rgba(184,117,14,0.14)",
            border: `1px solid rgba(184,117,14,0.4)`,
            borderRadius: 8,
            padding: "10px 22px",
            opacity: fade(frame, 72, 16),
          }}
        >
          <p
            style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: 15,
              color: B.gold,
              margin: 0,
              letterSpacing: "0.06em",
            }}
          >
            Proof of Play estimate · WELLBY methodology
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
