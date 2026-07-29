"use client";
import type { ExhibitDefinition } from "./types";

// Science — 3D exhibits (14 chapters)
import { HeartExhibit } from "./heart";
import { NeuronExhibit } from "./neuron";
import { DnaExhibit } from "./dna";
import { AtomExhibit } from "./atom";
import { CircuitExhibit } from "./circuit";
import { PrismExhibit } from "./prism";
import { ReactionExhibit } from "./reaction";
import { PhScaleExhibit } from "./ph-scale";
import { ReactivityExhibit } from "./reactivity";
import { PeriodicTableExhibit } from "./periodic-table";
import { FlowerExhibit } from "./flower";
import { EyeExhibit } from "./eye";
import { MagnetismExhibit } from "./magnetism";
import { EcosystemExhibit } from "./ecosystem";

// SSC — interactive painting panels (20 chapters)
import { HistNationalismEuropeExhibit } from "./hist-nationalism-europe";
import { HistNationalismIndiaExhibit } from "./hist-nationalism-india";
import { HistGlobalWorldExhibit } from "./hist-global-world";
import { HistPrintCultureExhibit } from "./hist-print-culture";
import { GeoResourcesExhibit } from "./geo-resources";
import { GeoForestWildlifeExhibit } from "./geo-forest-wildlife";
import { GeoWaterExhibit } from "./geo-water";
import { GeoAgricultureExhibit } from "./geo-agriculture";
import { GeoMineralsExhibit } from "./geo-minerals";
import { GeoManufacturingExhibit } from "./geo-manufacturing";
import { PolPowerSharingExhibit } from "./pol-power-sharing";
import { PolFederalismExhibit } from "./pol-federalism";
import { PolDiversityExhibit } from "./pol-diversity";
import { PolGenderReligionCasteExhibit } from "./pol-gender-religion-caste";
import { PolPartiesExhibit } from "./pol-parties";
import { PolOutcomesExhibit } from "./pol-outcomes";
import { EcoDevelopmentExhibit } from "./eco-development";
import { EcoSectorsExhibit } from "./eco-sectors";
import { EcoMoneyCreditExhibit } from "./eco-money-credit";
import { EcoGlobalisationExhibit } from "./eco-globalisation";

// Ordered by chapter — Science first (14), then SSC (20)
export const EXHIBITS: ExhibitDefinition[] = [
  // Science — 3D
  ReactionExhibit,        // Ch1
  PhScaleExhibit,         // Ch2
  ReactivityExhibit,      // Ch3
  AtomExhibit,            // Ch4
  PeriodicTableExhibit,   // Ch5
  HeartExhibit,           // Ch6
  NeuronExhibit,          // Ch7
  FlowerExhibit,          // Ch8
  DnaExhibit,             // Ch9
  PrismExhibit,           // Ch10
  EyeExhibit,             // Ch11
  CircuitExhibit,         // Ch12
  MagnetismExhibit,       // Ch13
  EcosystemExhibit,       // Ch14
  // SSC — Panels
  HistNationalismEuropeExhibit,   // Ch1
  HistNationalismIndiaExhibit,    // Ch2
  HistGlobalWorldExhibit,         // Ch3
  HistPrintCultureExhibit,        // Ch4
  GeoResourcesExhibit,            // Ch5
  GeoForestWildlifeExhibit,       // Ch6
  GeoWaterExhibit,                // Ch7
  GeoAgricultureExhibit,          // Ch8
  GeoMineralsExhibit,             // Ch9
  GeoManufacturingExhibit,        // Ch10
  PolPowerSharingExhibit,         // Ch11
  PolFederalismExhibit,           // Ch12
  PolDiversityExhibit,            // Ch13
  PolGenderReligionCasteExhibit,  // Ch14
  PolPartiesExhibit,              // Ch15
  PolOutcomesExhibit,             // Ch16
  EcoDevelopmentExhibit,          // Ch17
  EcoSectorsExhibit,              // Ch18
  EcoMoneyCreditExhibit,          // Ch19
  EcoGlobalisationExhibit,        // Ch20
];

export const EXHIBIT_MAP: Record<string, ExhibitDefinition> = Object.fromEntries(
  EXHIBITS.map((e) => [e.id, e])
);
