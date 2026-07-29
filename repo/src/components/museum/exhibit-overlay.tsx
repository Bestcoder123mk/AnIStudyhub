"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Lightformer, SoftShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { X, ChevronLeft, MousePointerClick, RotateCw, Frame, ArrowRight, Check } from "lucide-react";
import type { ExhibitDefinition } from "./exhibits/types";

export function ExhibitOverlay({
  exhibit,
  onClose,
  onContinueTour,
  isLastStop,
}: {
  exhibit: ExhibitDefinition;
  onClose: () => void;
  onContinueTour?: () => void;
  isLastStop?: boolean;
}) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const activePart = exhibit.parts.find((p) => p.id === selectedPart) || null;

  return (
    <div className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md flex flex-col animate-float-up">
      {/* top bar */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border glass-strong">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-lg hover:bg-muted"
        >
          <ChevronLeft className="size-4" /> Gallery
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="size-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: `${exhibit.accent}22`, border: `1px solid ${exhibit.accent}55` }}
          >
            {exhibit.icon}
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-base sm:text-lg leading-tight truncate" style={{ color: exhibit.accent }}>
              {exhibit.title}
            </h2>
            <p className="text-[11px] text-muted-foreground truncate">{exhibit.subtitle}</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${exhibit.accent}1a`, color: exhibit.accent }}>
            {exhibit.kind === "3d" ? <><RotateCw className="size-3" /> 3D Statue</> : <><Frame className="size-3" /> Interactive Panel</>}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Stage */}
        <div className="flex-1 relative min-h-[45vh] lg:min-h-0" style={{ background: "radial-gradient(circle at 50% 40%, #15122a 0%, #07060f 70%)" }}>
          {exhibit.kind === "3d" && exhibit.Model ? (
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [0, 1.2, 6], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.4} color="#fff8ee" />
              <directionalLight position={[4, 8, 4]} intensity={0.9} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
              <spotLight position={[0, 6, 0]} angle={0.6} penumbra={0.7} intensity={40} color={exhibit.accent} target-position={[0, 0, 0]} distance={14} decay={2} />
              <SoftShadows size={24} samples={12} focus={0.6} />
              <Environment resolution={256} frames={1}>
                <Lightformer intensity={2} color="#fff8ee" position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
                <Lightformer intensity={0.6} color="#ffe8c8" position={[-5, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
                <Lightformer intensity={0.5} color="#ffffff" position={[5, 3, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
              </Environment>
              <group position={[0, 0.2, 0]}>
                <exhibit.Model selectedPart={selectedPart} onSelectPart={(id) => setSelectedPart(id === selectedPart ? null : id)} />
              </group>
              <ContactShadows position={[0, -1.8, 0]} opacity={0.55} scale={10} blur={2.8} far={4} color="#000000" />
              <OrbitControls
                enablePan={false}
                minDistance={3}
                maxDistance={9}
                minPolarAngle={0.3}
                maxPolarAngle={Math.PI / 2 + 0.2}
                autoRotate={!selectedPart}
                autoRotateSpeed={0.6}
              />
              <EffectComposer multisampling={0} enableNormalPass={false}>
                <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.3} intensity={0.5} mipmapBlur />
                <Vignette eskil={false} offset={0.2} darkness={0.5} />
                <SMAA />
              </EffectComposer>
            </Canvas>
          ) : exhibit.Panel ? (
            <exhibit.Panel selectedPart={selectedPart} onSelectPart={(id) => setSelectedPart(id === selectedPart ? null : id)} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Exhibit unavailable</div>
          )}

          {/* hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[11px] text-muted-foreground glass-strong rounded-full px-4 py-2 pointer-events-none">
            {exhibit.kind === "3d" ? (
              <>
                <span className="flex items-center gap-1.5"><RotateCw className="size-3" /> Drag to rotate</span>
                <span className="flex items-center gap-1.5"><MousePointerClick className="size-3" /> Click parts to learn</span>
              </>
            ) : (
              <span className="flex items-center gap-1.5"><MousePointerClick className="size-3" /> Click highlighted regions in the painting</span>
            )}
          </div>
        </div>

        {/* info panel */}
        <aside className="lg:w-[360px] border-t lg:border-t-0 lg:border-l border-border bg-card/40 flex flex-col max-h-[55vh] lg:max-h-none">
          <div className="p-4 sm:p-5 overflow-y-auto scroll-thin flex-1">
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{exhibit.description}</p>

            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Interactive Parts</div>
            <div className="space-y-1.5 mb-5">
              {exhibit.parts.map((p) => {
                const active = selectedPart === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPart(active ? null : p.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition flex items-center gap-2.5 ${
                      active
                        ? "bg-primary/15 border-primary/50"
                        : "bg-muted/30 border-border hover:border-border hover:bg-muted/60"
                    }`}
                  >
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ background: exhibit.accent, boxShadow: active ? `0 0 8px ${exhibit.accent}` : "none" }}
                    />
                    <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* selected part detail */}
            {activePart ? (
              <div className="rounded-xl p-4 glass animate-pop-in" style={{ borderColor: `${exhibit.accent}40` }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: exhibit.accent }}>
                  {activePart.name}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{activePart.info}</p>
              </div>
            ) : (
              <div className="rounded-xl p-4 bg-muted/30 border border-border text-sm text-muted-foreground text-center">
                {exhibit.kind === "3d"
                  ? "Select a part above or click directly on the model to learn about it."
                  : "Select a part above or click the highlighted regions in the painting."}
              </div>
            )}
            {onContinueTour && (
              <button
                onClick={onContinueTour}
                className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-1.5"
                style={{ background: exhibit.accent }}
              >
                {isLastStop ? (<><Check className="size-4" /> Finish Tour</>) : (<>Continue Tour <ArrowRight className="size-4" /></>)}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
