import type { ComponentType } from "react";

export interface ExhibitPart {
  id: string;
  name: string;
  info: string;
}

export type ExhibitKind = "3d" | "panel";
export type ExhibitTrack = "science" | "ssc";

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
}

// 3D model props (Three.js statue)
export interface ExhibitModelProps {
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
  preview?: boolean;
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
