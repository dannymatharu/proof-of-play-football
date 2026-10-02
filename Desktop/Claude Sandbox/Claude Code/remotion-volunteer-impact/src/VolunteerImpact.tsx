import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Brand tokens ────────────────────────────────────────────────────────────

const B = {
  green: "#0B3D20",
  greenMid: "#1A5C34",
  greenLight: "#E8F2EB",
  gold: "#B8750E",
  goldLight: "#FDF3E3",
  cream: "#F4F1EB",
  creamDark: "#EAE6DC",
  text: "#1A1A18",
  textMid: "#4A4A44",
  white: "#FFFFFF",
  accentGreen: "#6EE89A",
} as const;

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
`;

const serif = `'Cormorant Garamond', Georgia, serif`;
const sans = `'Outfit', system-ui, sans-serif`;

// ─── Animation utilities ──────────────────────────────────────────────────────

/** Fade opacity in, optionally fade out. */
const fade = (
  frame: number,
  inStart: number,
  inDuration = 18,
  outStart?: number,
  outDuration = 14
): number => {
  let o = interpolate(frame, [inStart, inStart + inDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  if (outStart !== undefined) {
    o *= interpolate(frame, [outStart, outStart + outDuration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return o;
};

/** Spring-based translateY — element slides up from `distance` px. */
const slideUp = (
  frame: number,
  startFrame: number,
  fps: number,
  distance = 36
): number => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 140, mass: 0.5 },
  });
  return (1 - progress) * distance;
};

/** Scale from 0→1 with a spring. */
const springScale = (frame: number, startFrame: number, fps: number): number =>
  spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.6 },
  });

/** Animated integer counter with locale formatting. */
const Counter: React.FC<{
  frame: number;
  start: number;
  end: number;
  target: number;
  prefix?: string;
  suffix?: string;
}> = ({ frame, start, end, target, prefix = "", suffix = "" }) => {
  const value = Math.round(
    interpolate(frame, [start, end], [0, target], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  return (
    <>
      {prefix}
      {value.toLocaleString("en-GB")}
      {suffix}
    </>
  );
};

// ─── Scene 1: HOOK ────────────────────────────────────────────────────────────
// "You think you're just helping out." + "The numbers say otherwise."

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineWidth = interpolate(frame, [42, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: B.green,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
        opacity: fade(frame, 0, 14),
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(184,117,14,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div style={{ textAlign: "center", position: "relative" }}>
        {/* Line 1 */}
        <p
          style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: 52,
            color: B.cream,
            margin: 0,
            letterSpacing: "0.02em",
            lineHeight: 1.25,
            opacity: fade(frame, 6, 20),
            transform: `translateY(${slideUp(frame, 6, fps)}px)`,
          }}
        >
          You think you're
        </p>

        {/* Line 2 — the big italic line */}
        <p
          style={{
            fontFamily: serif,
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: 96,
            color: B.white,
            margin: "4px 0 0",
            lineHeight: 1.05,
            opacity: fade(frame, 18, 22),
            transform: `translateY(${slideUp(frame, 18, fps)}px)`,
          }}
        >
          just helping out.
        </p>

        {/* Gold divider */}
        <div
          style={{
            height: 3,
            width: 64,
            backgroundColor: B.gold,
            margin: "36px auto",
            transformOrigin: "left center",
            transform: `scaleX(${lineWidth})`,
            opacity: lineWidth > 0 ? 1 : 0,
          }}
        />

        {/* Subline */}
        <p
          style={{
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 28,
            color: B.gold,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            margin: 0,
            opacity: fade(frame, 60, 20),
            transform: `translateY(${slideUp(frame, 60, fps, 20)}px)`,
          }}
        >
          The numbers say otherwise.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: CONTEXT ─────────────────────────────────────────────────────────
// Saturday morning. One volunteer. 14 kids.

const ContextScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "1", label: "volunteer" },
    { value: "14", label: "young players" },
    { value: "3 hrs", label: "of their time" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: B.cream,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
        opacity: fade(frame, 0, 14),
      }}
    >
      {/* Top label */}
      <p
        style={{
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 16,
          color: B.gold,
          textTransform: "uppercase",
          letterSpacing: "0.24em",
          margin: "0 0 44px",
          opacity: fade(frame, 5, 18),
        }}
      >
        Every week. Up and down the country.
      </p>

      {/* Main heading */}
      <div
        style={{
          textAlign: "center",
          opacity: fade(frame, 14, 22),
          transform: `translateY(${slideUp(frame, 14, fps)}px)`,
        }}
      >
        <p
          style={{
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 104,
            color: B.green,
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        >
          Saturday
        </p>
        <p
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 80,
            color: B.greenMid,
            margin: "6px 0 0",
            lineHeight: 1,
          }}
        >
          morning.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "52px",
          opacity: fade(frame, 36, 22),
          transform: `translateY(${slideUp(frame, 36, fps, 20)}px)`,
        }}
      >
        {stats.map(({ value, label }, i) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              background: B.white,
              borderRadius: 16,
              padding: "24px 28px",
              minWidth: 180,
              boxShadow: "0 4px 24px rgba(11,61,32,0.1)",
              opacity: fade(frame, 36 + i * 8, 18),
              transform: `translateY(${slideUp(frame, 36 + i * 8, fps, 18)}px)`,
            }}
          >
            <p
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 52,
                color: B.green,
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {value}
            </p>
            <p
              style={{
                fontFamily: sans,
                fontWeight: 400,
                fontSize: 17,
                color: B.textMid,
                margin: "8px 0 0",
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: COUNTER ─────────────────────────────────────────────────────────
// Animated count-up to £320 per session

const CounterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = springScale(frame, 22, fps);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: B.green,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
        opacity: fade(frame, 0, 14),
      }}
    >
      {/* Background ring decoration */}
      <div
        style={{
          position: "absolute",
          width: 780,
          height: 780,
          borderRadius: "50%",
          border: `2px solid rgba(184,117,14,0.12)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          borderRadius: "50%",
          border: `1px solid rgba(184,117,14,0.07)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Label */}
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

      {/* The big number */}
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
          transform: `scale(${interpolate(scaleIn, [0, 1], [0.88, 1])})`,
        }}
      >
        £<Counter frame={frame} start={22} end={72} target={320} />
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
  );
};

// ─── Scene 4: SEASON SCALE ────────────────────────────────────────────────────
// Zoom out: £320 × 32 sessions = £10,240

const SeasonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: B.green,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
        opacity: fade(frame, 0, 14),
      }}
    >
      <p
        style={{
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 34,
          color: B.cream,
          margin: "0 0 12px",
          letterSpacing: "0.02em",
          opacity: fade(frame, 6, 18),
          transform: `translateY(${slideUp(frame, 6, fps, 20)}px)`,
        }}
      >
        Over a full season —
      </p>

      {/* Season total */}
      <p
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 136,
          color: B.gold,
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          opacity: fade(frame, 16, 18),
        }}
      >
        £<Counter frame={frame} start={16} end={52} target={10240} />
      </p>

      <p
        style={{
          fontFamily: serif,
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: 42,
          color: B.white,
          margin: "28px 0 0",
          textAlign: "center",
          lineHeight: 1.4,
          opacity: fade(frame, 48, 16),
          transform: `translateY(${slideUp(frame, 48, fps, 18)}px)`,
        }}
      >
        One volunteer. One team. One season.
      </p>
    </AbsoluteFill>
  );
};

// ─── Scene 5: ND / MH LAYER ───────────────────────────────────────────────────
// The hidden welfare picture

const NDMHScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineWidth = interpolate(frame, [34, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: B.creamDark,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "88px",
        opacity: fade(frame, 0, 14),
      }}
    >
      {/* Top eyebrow */}
      <p
        style={{
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 16,
          color: B.gold,
          textTransform: "uppercase",
          letterSpacing: "0.24em",
          margin: "0 0 36px",
          opacity: fade(frame, 5, 18),
        }}
      >
        There's more to the picture
      </p>

      {/* Main claim */}
      <p
        style={{
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 72,
          color: B.green,
          margin: 0,
          lineHeight: 1.1,
          maxWidth: 860,
          opacity: fade(frame, 14, 22),
          transform: `translateY(${slideUp(frame, 14, fps)}px)`,
        }}
      >
        Clubs are carrying a hidden welfare picture.
      </p>

      {/* Divider */}
      <div
        style={{
          height: 3,
          width: 64,
          backgroundColor: B.gold,
          margin: "36px 0",
          transformOrigin: "left center",
          transform: `scaleX(${lineWidth})`,
          opacity: lineWidth > 0 ? 1 : 0,
        }}
      />

      {/* Body */}
      <p
        style={{
          fontFamily: sans,
          fontWeight: 400,
          fontSize: 30,
          color: B.textMid,
          margin: 0,
          maxWidth: 820,
          lineHeight: 1.55,
          opacity: fade(frame, 38, 20),
          transform: `translateY(${slideUp(frame, 38, fps, 22)}px)`,
        }}
      >
        ND and mental health needs in squads often go unrecognised — and unquantified.
      </p>

      {/* Proof of Play pull-quote */}
      <p
        style={{
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 26,
          color: B.green,
          margin: "28px 0 0",
          opacity: fade(frame, 52, 18),
          transform: `translateY(${slideUp(frame, 52, fps, 18)}px)`,
        }}
      >
        Proof of Play surfaces this too.
      </p>
    </AbsoluteFill>
  );
};

// ─── Scene 6: PROOF OF PLAY CTA ───────────────────────────────────────────────

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: B.green,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
        opacity: fade(frame, 0, 18),
      }}
    >
      {/* Concentric rings — decorative */}
      {[860, 660, 460].map((size, i) => (
        <div
          key={size}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `1px solid rgba(244,241,235,${0.04 + i * 0.02})`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Eyebrow */}
      <p
        style={{
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 20,
          color: B.gold,
          textTransform: "uppercase",
          letterSpacing: "0.32em",
          margin: "0 0 20px",
          opacity: fade(frame, 8, 18),
        }}
      >
        Powered by
      </p>

      {/* Wordmark */}
      <p
        style={{
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 104,
          color: B.white,
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          textAlign: "center",
          opacity: fade(frame, 14, 20),
          transform: `translateY(${slideUp(frame, 14, fps)}px)`,
        }}
      >
        Proof of Play
      </p>

      {/* Gold rule */}
      <div
        style={{
          width: 64,
          height: 3,
          backgroundColor: B.gold,
          margin: "36px auto",
          opacity: fade(frame, 28, 18),
          transform: `scaleX(${interpolate(frame, [28, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })})`,
          transformOrigin: "center",
        }}
      />

      {/* Tagline */}
      <p
        style={{
          fontFamily: serif,
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: 42,
          color: B.cream,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.35,
          opacity: fade(frame, 36, 20),
          transform: `translateY(${slideUp(frame, 36, fps, 20)}px)`,
        }}
      >
        Surface the impact. Know your numbers.
      </p>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────
//
// Timeline (30fps):
//   0  –  90  Scene 1: Hook           (3s)
//  90  – 180  Scene 2: Context cards  (3s)
// 180  – 270  Scene 3: Counter reveal (3s)
// 270  – 330  Scene 4: Season scale   (2s)
// 330  – 390  Scene 5: ND/MH layer    (2s)
// 390  – 450  Scene 6: CTA            (2s)

// Swap track name here to audition a different one:
//   Sunday_Promenade.mp3   — relaxed, warm weekend feel
//   Mental_Architecture.mp3 — more atmospheric, suits the ND/MH layer
//   Midnight_Motion.mp3    — moodier, modern
const AUDIO_TRACK = "Sunday_Promenade.mp3";

export const VolunteerImpact: React.FC<{ format?: "square" | "story" }> = () => {
  const frame = useCurrentFrame();

  // Fade audio out over the last 30 frames (1 second)
  const volume = interpolate(frame, [420, 450], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <style>{FONTS}</style>

      <Audio src={staticFile(AUDIO_TRACK)} volume={volume} />

      <Sequence from={0} durationInFrames={90} name="Hook">
        <HookScene />
      </Sequence>

      <Sequence from={90} durationInFrames={90} name="Context">
        <ContextScene />
      </Sequence>

      <Sequence from={180} durationInFrames={90} name="Counter">
        <CounterScene />
      </Sequence>

      <Sequence from={270} durationInFrames={60} name="Season">
        <SeasonScene />
      </Sequence>

      <Sequence from={330} durationInFrames={60} name="NDMH">
        <NDMHScene />
      </Sequence>

      <Sequence from={390} durationInFrames={60} name="CTA">
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
