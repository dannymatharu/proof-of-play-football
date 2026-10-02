import React from "react";
import { Composition } from "remotion";
import { VolunteerImpact } from "./VolunteerImpact";
import { PitchTest } from "./PitchTest";

// 450 frames at 30fps = 15 seconds
// Square 1080×1080 for Instagram feed / LinkedIn
// Story version 1080×1920 — same component, layout adapts via CSS

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VolunteerImpact"
        component={VolunteerImpact}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ format: "square" as const }}
      />
      <Composition
        id="VolunteerImpactStory"
        component={VolunteerImpact}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "story" as const }}
      />
      <Composition
        id="PitchTest"
        component={PitchTest}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
