"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#eab308";

function EcoMoneyCreditPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const toggle = (id: string) => () => onSelectPart(sel(id) ? null : id);

  return (
    <div style={panelContainerStyle(accent, preview)}>
      <PaintingFrame accent={accent}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* ====== Background SVG scene ====== */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <defs>
              <marker id="gold-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill={accent} />
              </marker>
              <linearGradient id="coin-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <radialGradient id="cycle-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Title */}
            <text x="50" y="5" textAnchor="middle" fontSize="2.6" fill={accent} fontWeight="800" fontFamily="Georgia, serif">
              Money &amp; Credit — From Barter to Digital
            </text>
            <line x1="22" y1="7" x2="78" y2="7" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />

            {/* ===== LEFT: Barter → Money evolution ===== */}
            <rect x="3" y="12" width="27" height="60" rx="1" fill="rgba(234,179,8,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="16.5" y="16" textAnchor="middle" fontSize="1.6" fill={accent} fontWeight="700" fontFamily="Georgia, serif">Barter → Money</text>
            <line x1="3" y1="18" x2="30" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />

            {/* Stage 1: Barter — cow ↔ grain */}
            <text x="16.5" y="21.5" textAnchor="middle" fontSize="1.2" fill="#fde68a" fontStyle="italic">① barter</text>
            {/* cow silhouette */}
            <ellipse cx="7" cy="26" rx="2.2" ry="1.2" fill="#fbbf24" />
            <circle cx="5" cy="25" r="0.9" fill="#fbbf24" />
            <line x1="5.6" y1="24.2" x2="5" y2="23.4" stroke="#fbbf24" strokeWidth="0.18" />
            <line x1="5.2" y1="24.2" x2="4.4" y2="23.4" stroke="#fbbf24" strokeWidth="0.18" />
            <line x1="6" y1="27" x2="6" y2="28" stroke="#fbbf24" strokeWidth="0.18" />
            <line x1="8" y1="27" x2="8" y2="28" stroke="#fbbf24" strokeWidth="0.18" />
            {/* ↔ */}
            <line x1="11" y1="25.4" x2="14" y2="25.4" stroke={accent} strokeWidth="0.3" markerEnd="url(#gold-arrow)" />
            <line x1="14" y1="26.6" x2="11" y2="26.6" stroke={accent} strokeWidth="0.3" markerEnd="url(#gold-arrow)" />
            {/* grain/wheat */}
            <line x1="22" y1="24" x2="22" y2="28.5" stroke="#a3e635" strokeWidth="0.25" />
            <ellipse cx="21.4" cy="24.6" rx="0.5" ry="0.7" fill="#a3e635" transform="rotate(-30 21.4 24.6)" />
            <ellipse cx="22.6" cy="24.6" rx="0.5" ry="0.7" fill="#a3e635" transform="rotate(30 22.6 24.6)" />
            <ellipse cx="21.4" cy="26" rx="0.5" ry="0.7" fill="#a3e635" transform="rotate(-30 21.4 26)" />
            <ellipse cx="22.6" cy="26" rx="0.5" ry="0.7" fill="#a3e635" transform="rotate(30 22.6 26)" />
            <ellipse cx="21.4" cy="27.4" rx="0.5" ry="0.7" fill="#a3e635" transform="rotate(-30 21.4 27.4)" />
            <ellipse cx="22.6" cy="27.4" rx="0.5" ry="0.7" fill="#a3e635" transform="rotate(30 22.6 27.4)" />
            <text x="16.5" y="32" textAnchor="middle" fontSize="1.1" fill="#fcd34d">double coincidence</text>

            {/* arrow down */}
            <line x1="16.5" y1="33" x2="16.5" y2="35.5" stroke={accent} strokeWidth="0.3" markerEnd="url(#gold-arrow)" />

            {/* Stage 2: Commodity money — coins */}
            <text x="16.5" y="38" textAnchor="middle" fontSize="1.2" fill="#fde68a" fontStyle="italic">② commodity money</text>
            <circle cx="14" cy="42" r="1.6" fill="url(#coin-grad)" stroke="#a16207" strokeWidth="0.18" />
            <circle cx="16.5" cy="41.5" r="1.6" fill="url(#coin-grad)" stroke="#a16207" strokeWidth="0.18" />
            <circle cx="19" cy="42" r="1.6" fill="url(#coin-grad)" stroke="#a16207" strokeWidth="0.18" />
            <text x="16.5" y="46" textAnchor="middle" fontSize="1.05" fill="#fcd34d">shells · gold · silver</text>

            {/* arrow down */}
            <line x1="16.5" y1="47" x2="16.5" y2="49.5" stroke={accent} strokeWidth="0.3" markerEnd="url(#gold-arrow)" />

            {/* Stage 3: Fiat money — paper notes */}
            <text x="16.5" y="52" textAnchor="middle" fontSize="1.2" fill="#fde68a" fontStyle="italic">③ fiat money</text>
            <rect x="11" y="54" width="11" height="4" rx="0.5" fill="#fef3c7" stroke="#a16207" strokeWidth="0.2" />
            <text x="16.5" y="57" textAnchor="middle" fontSize="2.2" fill="#a16207" fontWeight="800">₹</text>
            <text x="16.5" y="60.5" textAnchor="middle" fontSize="1.05" fill="#fcd34d">govt-authorized</text>

            {/* arrow down */}
            <line x1="16.5" y1="61.5" x2="16.5" y2="64" stroke={accent} strokeWidth="0.3" markerEnd="url(#gold-arrow)" />

            {/* Stage 4: Digital — UPI */}
            <text x="16.5" y="66.5" textAnchor="middle" fontSize="1.2" fill="#fde68a" fontStyle="italic">④ digital</text>
            <rect x="11" y="68" width="11" height="3.5" rx="0.5" fill="rgba(125,211,252,0.15)" stroke="#7dd3fc" strokeWidth="0.25" />
            <text x="13.5" y="70.7" textAnchor="middle" fontSize="1.6" fill="#7dd3fc" fontWeight="800">UPI</text>
            <line x1="16" y1="70" x2="20" y2="70" stroke="#7dd3fc" strokeWidth="0.25" markerEnd="url(#gold-arrow)" />

            {/* ===== CENTER: Bank Credit Cycle (4 nodes in cycle) ===== */}
            <rect x="33" y="12" width="35" height="60" rx="1" fill="rgba(234,179,8,0.04)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.5" />
            <text x="50.5" y="16" textAnchor="middle" fontSize="1.6" fill={accent} fontWeight="700" fontFamily="Georgia, serif">Bank Credit Cycle</text>
            <line x1="33" y1="18" x2="68" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            <ellipse cx="50.5" cy="42" rx="16" ry="14" fill="url(#cycle-glow)" />

            {/* Nodes (clockwise from top): Depositor → Bank → Borrower → Repayment → Depositor */}
            {/* Depositor (top) */}
            <rect x="42" y="22" width="17" height="7" rx="0.8" fill="#fbbf24" stroke="#a16207" strokeWidth="0.2" />
            <text x="50.5" y="26" textAnchor="middle" fontSize="1.45" fill="#0a0917" fontWeight="800">DEPOSITOR</text>
            <text x="50.5" y="28" textAnchor="middle" fontSize="1.05" fill="#451a03">savings ₹</text>

            {/* Bank (right) */}
            <rect x="55" y="39" width="14" height="7" rx="0.8" fill={accent} stroke="#854d0e" strokeWidth="0.2" />
            <text x="62" y="43" textAnchor="middle" fontSize="1.45" fill="#0a0917" fontWeight="800">BANK</text>
            <text x="62" y="45" textAnchor="middle" fontSize="1.05" fill="#451a03">CRR · SLR · lend</text>

            {/* Borrower (bottom) */}
            <rect x="42" y="55" width="17" height="7" rx="0.8" fill="#fbbf24" stroke="#a16207" strokeWidth="0.2" />
            <text x="50.5" y="59" textAnchor="middle" fontSize="1.45" fill="#0a0917" fontWeight="800">BORROWER</text>
            <text x="50.5" y="61" textAnchor="middle" fontSize="1.05" fill="#451a03">invest · produce</text>

            {/* Repayment (left) */}
            <rect x="32" y="39" width="14" height="7" rx="0.8" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.2" />
            <text x="39" y="43" textAnchor="middle" fontSize="1.35" fill="#0a0917" fontWeight="800">REPAY</text>
            <text x="39" y="45" textAnchor="middle" fontSize="1.05" fill="#1a2e05">₹ + interest</text>

            {/* Cyclic arrows */}
            <path d="M 59,29 Q 64,33 60,39" fill="none" stroke={accent} strokeWidth="0.35" markerEnd="url(#gold-arrow)" />
            <path d="M 60,46 Q 60,52 59,55" fill="none" stroke={accent} strokeWidth="0.35" markerEnd="url(#gold-arrow)" />
            <path d="M 42,59 Q 36,52 39,46" fill="none" stroke={accent} strokeWidth="0.35" markerEnd="url(#gold-arrow)" />
            <path d="M 41,39 Q 42,33 42,29" fill="none" stroke={accent} strokeWidth="0.35" markerEnd="url(#gold-arrow)" />

            {/* arrow labels */}
            <text x="63" y="35" textAnchor="middle" fontSize="1.05" fill="#fde68a">deposit</text>
            <text x="64" y="52" textAnchor="middle" fontSize="1.05" fill="#fde68a">loan</text>
            <text x="36" y="52" textAnchor="middle" fontSize="1.05" fill="#fde68a">repay</text>
            <text x="38" y="35" textAnchor="middle" fontSize="1.05" fill="#fde68a">interest</text>

            {/* caption */}
            <text x="50.5" y="67" textAnchor="middle" fontSize="1.25" fill={accent} fontStyle="italic">fractional reserve · money multiplier</text>
            <text x="50.5" y="69.5" textAnchor="middle" fontSize="1.15" fill="#fcd34d" fontStyle="italic">banks lend deposits → credit creation</text>

            {/* ===== TOP-RIGHT: Formal vs Informal ===== */}
            <rect x="72" y="12" width="25" height="32" rx="1" fill="rgba(234,179,8,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="84.5" y="16" textAnchor="middle" fontSize="1.5" fill={accent} fontWeight="700" fontFamily="Georgia, serif">Formal vs Informal</text>
            <line x1="72" y1="18" x2="97" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            {/* Formal — bank building */}
            <rect x="73.5" y="22" width="11" height="20" rx="0.6" fill="rgba(125,211,252,0.08)" stroke="#7dd3fc" strokeWidth="0.25" />
            <text x="79" y="25" textAnchor="middle" fontSize="1.3" fill="#bae6fd" fontWeight="700">FORMAL</text>
            <polygon points="74.5,27 83.5,27 79,25.5" fill="#7dd3fc" />
            <rect x="74.5" y="27" width="9" height="6" fill="none" stroke="#7dd3fc" strokeWidth="0.2" />
            <rect x="75.5" y="28" width="1" height="5" fill="#7dd3fc" />
            <rect x="77.5" y="28" width="1" height="5" fill="#7dd3fc" />
            <rect x="79.5" y="28" width="1" height="5" fill="#7dd3fc" />
            <rect x="81.5" y="28" width="1" height="5" fill="#7dd3fc" />
            <text x="79" y="36" textAnchor="middle" fontSize="1.05" fill="#7dd3fc">banks · co-ops</text>
            <text x="79" y="38" textAnchor="middle" fontSize="1.05" fill="#7dd3fc">RBI-regulated</text>
            <text x="79" y="40.5" textAnchor="middle" fontSize="1.1" fill="#fde68a" fontWeight="700">8–12% p.a.</text>
            {/* Informal — moneylender */}
            <rect x="85.5" y="22" width="11" height="20" rx="0.6" fill="rgba(248,113,113,0.08)" stroke="#f87171" strokeWidth="0.25" />
            <text x="91" y="25" textAnchor="middle" fontSize="1.3" fill="#fecaca" fontWeight="700">INFORMAL</text>
            {/* person with money bag */}
            <circle cx="91" cy="27.5" r="1" fill="#f87171" />
            <line x1="91" y1="28.5" x2="91" y2="32" stroke="#f87171" strokeWidth="0.3" />
            {/* money bag */}
            <ellipse cx="91" cy="34.5" rx="1.6" ry="1.4" fill="#f87171" />
            <text x="91" y="35.2" textAnchor="middle" fontSize="1.1" fill="#0a0917" fontWeight="800">₹</text>
            <text x="91" y="38" textAnchor="middle" fontSize="1.05" fill="#fca5a5">moneylenders</text>
            <text x="91" y="40" textAnchor="middle" fontSize="1.05" fill="#fca5a5">landlords · traders</text>
            <text x="91" y="41.5" textAnchor="middle" fontSize="1.05" fill="#fde68a" fontWeight="700">30–60% debt traps</text>

            {/* ===== BOTTOM-RIGHT: SHG ===== */}
            <rect x="72" y="46" width="25" height="22" rx="1" fill="rgba(234,179,8,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="84.5" y="50" textAnchor="middle" fontSize="1.45" fill={accent} fontWeight="700" fontFamily="Georgia, serif">SHG · 15–20 women</text>
            <line x1="72" y1="52" x2="97" y2="52" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            {/* circle of women (8 dots around savings box) */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const cx = 84.5 + Math.cos(angle) * 5;
              const cy = 58 + Math.sin(angle) * 3.2;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="0.9" fill="#f9a8d4" />
                  <line x1={cx} y1={cy + 0.9} x2={cx} y2={cy + 1.8} stroke="#f9a8d4" strokeWidth="0.3" />
                </g>
              );
            })}
            {/* savings box in center */}
            <rect x="82.5" y="56" width="4" height="3" rx="0.3" fill={accent} stroke="#854d0e" strokeWidth="0.2" />
            <line x1="83.5" y1="57" x2="85.5" y2="57" stroke="#0a0917" strokeWidth="0.15" />
            <text x="84.5" y="63.5" textAnchor="middle" fontSize="1.1" fill="#fcd34d" fontStyle="italic">save → lend to members</text>
            <text x="84.5" y="65.5" textAnchor="middle" fontSize="1.1" fill="#fcd34d" fontStyle="italic">Grameen · Yunus · 2006</text>

            {/* ===== BOTTOM-CENTER: RBI ===== */}
            <rect x="38" y="74" width="24" height="11" rx="0.8" fill="rgba(234,179,8,0.1)" stroke={accent} strokeWidth="0.3" strokeOpacity="0.7" />
            <polygon points="40,78 50,75 60,78" fill={accent} />
            <rect x="40" y="78" width="20" height="5" fill="none" stroke={accent} strokeWidth="0.25" />
            <rect x="41.5" y="79" width="1" height="4" fill={accent} />
            <rect x="44" y="79" width="1" height="4" fill={accent} />
            <rect x="46.5" y="79" width="1" height="4" fill={accent} />
            <rect x="49" y="79" width="1" height="4" fill={accent} />
            <rect x="51.5" y="79" width="1" height="4" fill={accent} />
            <rect x="54" y="79" width="1" height="4" fill={accent} />
            <rect x="56.5" y="79" width="1" height="4" fill={accent} />
            <text x="50" y="73" textAnchor="middle" fontSize="1.4" fill={accent} fontWeight="700" fontFamily="Georgia, serif">RBI — Reserve Bank of India</text>
            <text x="50" y="85" textAnchor="middle" fontSize="1.1" fill="#fde68a" fontStyle="italic">central bank · issues ₹ · controls money supply</text>
          </svg>

          {/* ===== Hotspots ===== */}
          <Hotspot id="money-evolution" selected={sel("money-evolution")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="① Barter → Money"
            style={{ left: "3%", top: "12%", width: "27%", height: "60%" }}>
            <></>
          </Hotspot>
          <Hotspot id="credit-cycle" selected={sel("credit-cycle")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="② Bank Credit Cycle"
            style={{ left: "33%", top: "12%", width: "35%", height: "60%" }}>
            <></>
          </Hotspot>
          <Hotspot id="formal-informal" selected={sel("formal-informal")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="③ Formal vs Informal"
            style={{ left: "72%", top: "12%", width: "25%", height: "32%" }}>
            <></>
          </Hotspot>
          <Hotspot id="shg" selected={sel("shg")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="④ Self-Help Groups"
            style={{ left: "72%", top: "46%", width: "25%", height: "22%" }}>
            <></>
          </Hotspot>
          <Hotspot id="rbi" selected={sel("rbi")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="⑤ RBI"
            style={{ left: "38%", top: "73%", width: "24%", height: "13%" }}>
            <></>
          </Hotspot>

          {/* ===== Tags ===== */}
          <Tag n={1} x={5} y={10} accent={accent} selected={sel("money-evolution")} onClick={toggle("money-evolution")} preview={preview} />
          <Tag n={2} x={35} y={10} accent={accent} selected={sel("credit-cycle")} onClick={toggle("credit-cycle")} preview={preview} />
          <Tag n={3} x={74} y={10} accent={accent} selected={sel("formal-informal")} onClick={toggle("formal-informal")} preview={preview} />
          <Tag n={4} x={74} y={44} accent={accent} selected={sel("shg")} onClick={toggle("shg")} preview={preview} />
          <Tag n={5} x={40} y={71} accent={accent} selected={sel("rbi")} onClick={toggle("rbi")} preview={preview} />

          {/* ===== Plaque ===== */}
          <Plaque title="Money and Credit" caption="Chapter 19 · Why money replaced barter, how banks create credit" accent={accent} />
        </div>
      </PaintingFrame>
    </div>
  );
}

export const EcoMoneyCreditExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "eco-money-credit",
  chapterId: 19,
  track: "ssc",
  title: "Money and Credit",
  subtitle: "Barter, banks, lenders, SHGs & the RBI",
  description:
    "Watch money evolve from barter to UPI, follow the bank credit cycle, and compare formal lenders with moneylenders and self-help groups.",
  accent,
  icon: "💰",
  parts: [
    {
      id: "money-evolution",
      name: "Barter → Money",
      info: "Barter requires a double coincidence of wants — you must find someone who wants what you have AND has what you want. Commodity money (cowrie shells, gold, silver) partly solved this. Fiat money — currency notes and coins — has no intrinsic value; it is authorised by the government as legal tender. Modern forms: cheques, NEFT, IMPS, UPI — electronic money moving as data.",
    },
    {
      id: "credit-cycle",
      name: "Bank Credit Cycle",
      info: "Banks accept deposits from savers, keep a fraction as reserve (CRR with RBI, SLR in govt bonds) and lend the rest to borrowers at a higher rate. The interest spread (lend rate − deposit rate) is the bank's income. Borrowers invest in business, repay with interest, and the cycle continues. Because banks lend out most deposits, the banking system 'creates' credit — the money multiplier = 1 ÷ CRR.",
    },
    {
      id: "formal-informal",
      name: "Formal vs Informal Credit",
      info: "Formal sector — banks, cooperatives, supervised by the RBI; cheaper loans at 8–12% p.a., transparent rules, but paperwork-heavy. Informal sector — moneylenders, traders, landlords, relatives; no regulation, 30–60% interest, often leading to debt traps. About 85% of rural poor still depend on informal credit. The RBI aims to expand formal credit to the poor.",
    },
    {
      id: "shg",
      name: "Self-Help Groups",
      info: "An SHG is a group of 15–20 rural poor — mostly women — who save regularly and lend small amounts to members from the pooled savings. Without collateral, members can get cheap credit and start small businesses. Inspired by the Grameen Bank of Bangladesh founded by Muhammad Yunus (Nobel Peace Prize 2006). SHGs reduce dependence on moneylenders and empower women.",
    },
    {
      id: "rbi",
      name: "Reserve Bank of India",
      info: "The RBI is India's central bank. It issues currency notes (₹2, ₹5, ₹10, ₹20, ₹50, ₹100, ₹500, ₹1000 — ₹1 notes and coins come from the Government). It controls the money supply via the repo rate (at which it lends to banks), CRR (cash reserve ratio, e.g. 4%) and SLR (statutory liquidity ratio, e.g. 18%). It acts as banker to the government and to commercial banks, and supervises the whole banking system.",
    },
  ],
  Panel: EcoMoneyCreditPanel,
};
