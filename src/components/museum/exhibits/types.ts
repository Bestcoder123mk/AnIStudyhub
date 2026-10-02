import type { ComponentType } from "react";

export interface ExhibitPart {
  id: string;
  name: string;
  info: string;
}

export type ExhibitKind = "3d" | "panel";
export type ExhibitTrack = "science" | "ssc" | "maths" | "english" | "sanskrit";

export interface ExhibitMeta {
  id: string;
  chapterId: number;
  track: ExhibitTrack;
  title: string;
  subtitle: string;
  description: string;
  accent: string; // hex color
  icon: string; // emoji
  parts: ExhibitPart[];
  /** Model supports the Focus Viewer's "Explode" slider (pulls parts apart
   *  along their own axis to reveal internal structure — e.g. the heart's
   *  4 chambers, or a neuron's myelin sheath peeling off the axon). Only
   *  exhibits that opt in show the slider; every other 3D exhibit is
   *  unaffected. */
  explodable?: boolean;
}

// 3D model props (Three.js statue)
export interface ExhibitModelProps {
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
  preview?: boolean;
  /** 0 = assembled, 1 = fully exploded. Only consumed by models with
   *  `explodable: true` on their ExhibitMeta; safe to ignore/omit otherwise
   *  since it always defaults to 0 (assembled) when not passed. */
  explode?: number;
}

// 2D panel props (interactive SVG/CSS "painting")
export interface PanelSceneProps {
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
  preview?: boolean;
}

export interface ExhibitDefinition extends ExhibitMeta {
  kind: ExhibitKind;
  Model?: ComponentType<ExhibitModelProps>;  // for kind === "3d"
  Panel?: ComponentType<PanelSceneProps>;     // for kind === "panel"
}
