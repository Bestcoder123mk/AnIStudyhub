// Tier B liquid-glass lensing filters (see globals.css's "Tier B" comment
// block and theme-provider.tsx's supportsSvgBackdropFilter() check).
//
// Three copies of the same recipe — a procedurally-built two-axis
// displacement map, fed into feDisplacementMap — sized for the three
// rough element footprints this app actually has (see the .glass-refract-*
// comment in globals.css). No external image asset: each map is authored
// directly as SVG gradients, per the liquid-glass-ui skill.
//
// Mounted exactly once, near the root (see layout.tsx) — the filters are
// referenced by id from CSS `backdrop-filter: url(#lg-distort-sm)` etc.,
// so every glass-refract-* surface on the page shares these same three
// <filter> definitions rather than each carrying its own.
function DistortMap({ id, width, height, rx }: { id: string; width: number; height: number; rx: number }) {
  return (
    <>
      <linearGradient id={`lg-map-x-${id}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3a3a3a" />
        <stop offset="50%" stopColor="#808080" />
        <stop offset="100%" stopColor="#c6c6c6" />
      </linearGradient>
      <linearGradient id={`lg-map-y-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a3a3a" />
        <stop offset="50%" stopColor="#808080" />
        <stop offset="100%" stopColor="#c6c6c6" />
      </linearGradient>
      <rect id={`lg-map-x-shape-${id}`} width={width} height={height} rx={rx} fill={`url(#lg-map-x-${id})`} />
      <rect id={`lg-map-y-shape-${id}`} width={width} height={height} rx={rx} fill={`url(#lg-map-y-${id})`} />

      <filter id={`lg-distort-${id}`} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        {/* x-map isolated into the red channel */}
        <feImage href={`#lg-map-x-shape-${id}`} result={`xImg-${id}`} />
        <feColorMatrix
          in={`xImg-${id}`}
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
          result={`xChannel-${id}`}
        />
        {/* y-map isolated into the green channel */}
        <feImage href={`#lg-map-y-shape-${id}`} result={`yImg-${id}`} />
        <feColorMatrix
          in={`yImg-${id}`}
          type="matrix"
          values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
          result={`yChannel-${id}`}
        />
        <feBlend in={`xChannel-${id}`} in2={`yChannel-${id}`} mode="screen" result={`map-${id}`} />
        <feGaussianBlur in={`map-${id}`} stdDeviation="6" result={`mapBlurred-${id}`} />
        <feDisplacementMap
          in="SourceGraphic"
          in2={`mapBlurred-${id}`}
          scale="28"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </>
  );
}

export function LiquidGlassDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {/* sm — buttons, pills, badges, the FAB, museum HUD buttons */}
        <DistortMap id="sm" width={160} height={56} rx={28} />
        {/* md — cards, popovers, dropdowns, museum overlay panels */}
        <DistortMap id="md" width={340} height={200} rx={24} />
        {/* lg — the sidebar, dialogs, sheets */}
        <DistortMap id="lg" width={380} height={620} rx={24} />
      </defs>
    </svg>
  );
}
