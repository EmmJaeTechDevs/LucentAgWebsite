import { useState, useEffect, useRef, useContext, createContext, useCallback } from "react";
import {
  ArrowRight, Menu, X, ExternalLink, Leaf, Users, Warehouse,
  Truck, Building2, Globe, Scale, Brain, Satellite, Zap,
  RefreshCw, TrendingUp, QrCode, Weight, Thermometer,
  BarChart3, Search, Rss, ChevronDown, Shield, MapPin,
  Briefcase, MessageSquare, Info, Heart, Sprout, Landmark,
  BookOpen, Handshake, Network, Star, Code, FlaskConical,
  GraduationCap, ShieldCheck, Award, Coffee, ChevronRight,
} from "lucide-react";
import lucentImage from "@/imports/image.png";
import lucentLogo from "@/assets/Lucent Ag Logo new.png";
import leaderAdvisor1 from "@/assets/Advisor2.png";
import leaderFounderCEO from "@/assets/CEO.png";
import leaderAdvisor2 from "@/assets/Advisor.png";
 
// ─────────────────────────────────────────────────────────────────────────────
// Types & Routing
// ─────────────────────────────────────────────────────────────────────────────
type Page = "home" | "about" | "team" | "ecosystem" | "solutions" | "intelligence" | "careers";
type ModalType = "demo" | "contact" | "video" | null;

interface Leader {
  name: string;
  role: string;
  tags: string[];
  image: ""; // from "next/image" — swap to `string` if using plain paths
}

const leaders: Leader[] = [
  {
    name: "Name",
    role: "Founder/CEO",
    tags: [
      "Systems Builder",
      "Product Leader",
      "MSc, Information & Automation Engineering",
    ],
    image: leaderFounderCEO,
  },
  {
    name: "Name",
    role: "Advisor",
    tags: [
      "Principal at VC",
      "Startup Advisor",
      "Former investor at Creative Ventures",
      "MBA, University of Chicago (Chicago Booth)",
    ],
    image: leaderAdvisor1,
  },
  {
    name: "Name",
    role: "Advisor",
    tags: [
      "Sustainability Strategist",
      "Partnerships Expert",
      "Former Program Manager at the United Nations",
      "MSc, Environmental Engineering",
    ],
    image: leaderAdvisor2,
  },
];

const LEADERS: Leader[] = [
  {
    name: "Name",
    role: "Founder/CEO",
    tags: [
      "Systems Builder",
      "Product Leader",
      "MSc, Information & Automation Engineering",
    ],
    image: leaderFounderCEO,
  },
  {
    name: "Name",
    role: "Advisor 1",
    tags: [
      "Principal at VC",
      "Startup Advisor",
      "Former investor at Creative Ventures",
      "MBA, University of Chicago (Chicago Booth)",
    ],
    image: leaderAdvisor1,
  },
  {
    name: "Name",
    role: "Advisor 2",
    tags: [
      "Sustainability Strategist",
      "Partnerships Expert",
      "Former Program Manager at the United Nations",
      "MSc, Environmental Engineering",
    ],
    image: leaderAdvisor2,
  },
  // remaining slots stay empty placeholders — CEO rendered separately as the apex above this grid
];

interface ModalCtxValue {
  open: (m: ModalType) => void;
  close: () => void;
}
const ModalCtx = createContext<ModalCtxValue>({ open: () => {}, close: () => {} });
function useModal() { return useContext(ModalCtx); }

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  ink:        "#0C1F14",
  green:      "#1B4332",
  greenMid:   "#2D6A4F",
  greenLight: "#40916C",
  gold:       "#C8922A",
  goldLight:  "#D4A853",
  cream:      "#F6F3EE",
  sand:       "#EAE6DE",
  muted:      "#6B7B6E",
  border:     "rgba(27,67,50,0.12)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Imagery
// ─────────────────────────────────────────────────────────────────────────────
const IMG = {
  satellite:   "photo-1446776811953-b23d57bd21aa",
  aerialField: "photo-1500382017468-9049fed747ef",
  warehouse:   "photo-1553413077-190dd305871c",
  coldStorage: "photo-1578662996442-48f60103fc96",
  logistics:   "photo-1601584115197-04ecc0da31d7",
  dashboard:   "photo-1551288049-bebda4e38f71",
  processing:  "photo-1565793298595-6a879b1d9492",
  fintech:     "photo-1611974789855-9c2a0a7236a3",
  aerialCrops: "photo-1574943320219-553eb213f72d",
  portOps:     "photo-1586528116311-ad8dd3c8310d",
  market:      "photo-1488459716781-31db52582fe9",
  mobile:      "photo-1512941937669-90a1b58e7e9c",
  teamWork:    "photo-1521737604893-d14cc237f11d",
  community:   "photo-1529156069898-49953e39b3ac",
  harvest:     "photo-1464226184884-fa280b87c399",
  greenField:  "photo-1416879595882-3373a0480b5b",
  cityAfrica:  "photo-1547981609-4b6bfe67ca0b",
  collab:      "photo-1573164713988-8665fc963095",
};
const px = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=82`;

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, duration = 2000, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0: number;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────
function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`inline-block text-[10.5px] font-semibold tracking-[0.16em] uppercase ${light ? "text-[#C8922A]" : "text-[#C8922A]"}`}
      style={{ fontFamily: "'Geist Mono', monospace" }}>
      {children}
    </span>
  );
}

function Heading({ children, light = false, className = "" }: {
  children: React.ReactNode; light?: boolean; className?: string;
}) {
  return (
    <h2 style={{ fontFamily: "'Instrument Serif', serif" }}
      className={`text-[38px] md:text-[52px] lg:text-[62px] leading-[1.04] tracking-[-0.012em] ${
        light ? "text-white" : "text-[#0C1F14]"
      } ${className}`}>
      {children}
    </h2>
  );
}

function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function DemoBtn({ className = "" }: { className?: string }) {
  const { open } = useModal();
  return (
    <button onClick={() => open("demo")}
      className={`inline-flex items-center gap-2 font-medium rounded-full transition-all duration-250 bg-[#C8922A] text-white hover:bg-[#b07d22] hover:shadow-[0_4px_22px_rgba(200,146,42,0.38)] ${className}`}>
      Request a Demo <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Logo mark
// ─────────────────────────────────────────────────────────────────────────────
function LogoMark({ size = 30, light = false }: { size?: number; light?: boolean }) {
  const bg = light ? T.cream : T.green;
  const core = light ? T.green : T.cream;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="16" fill={bg} />
      <circle cx="16" cy="16" r="6.5" fill={T.gold} />
      <circle cx="16" cy="16" r="2.8" fill={core} />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return <line key={i}
          x1={16 + 8.5 * Math.cos(r)} y1={16 + 8.5 * Math.sin(r)}
          x2={16 + 13.5 * Math.cos(r)} y2={16 + 13.5 * Math.sin(r)}
          stroke={core} strokeWidth="1" strokeOpacity="0.35" />;
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Intelligence Layer Diagram — signature visual
// ─────────────────────────────────────────────────────────────────────────────
interface ILNode {
  id: string; label: string; sub: string;
  angle: number; Icon: React.FC<any>; count: string; details: string[];
}
const IL_NODES: ILNode[] = [
  { id: "farmers",     label: "Farmers",     sub: "& Cooperatives", angle: 270, Icon: Leaf,      count: "280K+",
    details: ["Connect to reliable markets, trusted buyers and a growing network designed to create more opportunities after every harvest."] },
  { id: "aggregators", label: "Aggregators", sub: "& Collection",   angle: 321, Icon: Users,     count: "4,200+",
    details: ["Coordinate supply more efficiently while strengthening connections between producers, buyers and regional markets."] },
  { id: "warehouses",  label: "Warehouses",  sub: "& Storage",      angle: 12,  Icon: Warehouse, count: "890+",
    details: ["Become part of a connected storage network that improves visibility, collaboration and produce movement."] },
  { id: "logistics",   label: "Logistics",   sub: "& Transport",    angle: 63,  Icon: Truck,     count: "340+",
    details: ["Connect transport capacity with demand across a growing network designed for more efficient food distribution."] },
  { id: "processors",  label: "Processors",  sub: "& Millers",      angle: 114, Icon: Building2, count: "180+",
    details: ["Access more consistent sourcing opportunities through a connected ecosystem built for long-term growth."] },
  { id: "buyers",      label: "Buyers",      sub: "& Exporters",    angle: 165, Icon: Globe,     count: "320+",
    details: ["Discover trusted supply opportunities through a growing network focused on transparency and collaboration."] },
  { id: "finance",     label: "Finance",     sub: "& Insurance",    angle: 216, Icon: Scale,     count: "28",
    details: ["Support a connected agricultural ecosystem with greater visibility into commercial activity and network growth."] },
];

interface ILDiagramProps {
  mode: "hero" | "ecosystem" | "cta";
  activeId?: string | null;
  onNodeClick?: (id: string | null) => void;
  size?: number;
}
function IntelligenceLayerDiagram({ mode, activeId, onNodeClick, size = 600 }: ILDiagramProps) {
  const CX = size / 2, CY = size / 2, R = size * 0.318;
  const interactive = mode === "ecosystem";
  const getPos = (angle: number, r: number) => ({
    x: CX + r * Math.cos((angle * Math.PI) / 180),
    y: CY + r * Math.sin((angle * Math.PI) / 180),
  });
  const getPath = (node: ILNode) => {
    const p = getPos(node.angle, R);
    const mid = getPos(node.angle, R * 0.5);
    const perp = node.angle + 90;
    const bend = size * 0.04;
    return `M ${CX} ${CY} Q ${mid.x + bend * Math.cos((perp * Math.PI) / 180)} ${mid.y + bend * Math.sin((perp * Math.PI) / 180)} ${p.x} ${p.y}`;
  };
  const isAny = !!activeId;
  const centerR = size * 0.086;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" aria-label="Lucent Ag Intelligence Layer">
      <defs>
        <radialGradient id="ilCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={T.gold} stopOpacity="0.35" />
          <stop offset="55%" stopColor={T.green} stopOpacity="0.12" />
          <stop offset="100%" stopColor={T.ink} stopOpacity="0" />
        </radialGradient>
        <filter id="ilGlowCenter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ilGlowNode" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <style>{`
          @keyframes ilOrbit { 0%,100%{stroke-opacity:.06} 50%{stroke-opacity:.18} }
          @keyframes ilSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .il-orbit { animation: ilOrbit 5s ease-in-out infinite; }
        `}</style>
        {IL_NODES.map(n => <path key={n.id} id={`ilPath-${n.id}`} d={getPath(n)} fill="none" />)}
      </defs>
      {[R * 0.55, R * 0.85, R * 1.08, R * 1.3].map((r, i) => (
        <circle key={r} className="il-orbit" cx={CX} cy={CY} r={r}
          fill="none" stroke={T.green} strokeWidth="0.6"
          style={{ animationDelay: `${i * 1.2}s`, animationDuration: `${4 + i}s` }} />
      ))}
      <circle cx={CX} cy={CY} r={R * 0.65} fill="url(#ilCenterGlow)" />
      {IL_NODES.map(n => {
        const active = activeId === n.id;
        const dim = isAny && !active;
        return (
          <path key={n.id} d={getPath(n)} fill="none"
            stroke={active ? T.gold : T.greenLight}
            strokeWidth={active ? 1.4 : 0.8}
            strokeOpacity={dim ? 0.1 : active ? 0.9 : 0.28}
            strokeDasharray={active ? "5 0" : "4 10"}
            style={{ transition: "all 0.4s ease" }} />
        );
      })}
      {IL_NODES.map((n, ni) => {
        const active = activeId === n.id;
        return [0, 0.38, 0.72].map((offset, oi) => (
          <circle key={`${n.id}-p${oi}`} r={active ? 2.8 : 1.8}
            fill={active ? T.gold : T.greenLight} opacity={active ? 0.95 : 0.45}>
            <animateMotion dur={`${2.6 + ni * 0.22}s`} begin={`${offset * (2.6 + ni * 0.22)}s`}
              repeatCount="indefinite" calcMode="linear">
              <mpath href={`#ilPath-${n.id}`} />
            </animateMotion>
          </circle>
        ));
      })}
      <circle cx={CX} cy={CY} r={centerR * 1.9} fill={T.ink} opacity="0.8" />
      <circle cx={CX} cy={CY} r={centerR * 1.5} fill={T.green} filter="url(#ilGlowCenter)" />
      <circle cx={CX} cy={CY} r={centerR * 1.22} fill={T.ink} />
      <circle cx={CX} cy={CY} r={centerR * 1.0} fill={T.greenMid} opacity="0.6" />
      <circle cx={CX} cy={CY} r={centerR * 1.35} fill="none"
        stroke={T.gold} strokeWidth="0.8" strokeOpacity="0.5"
        strokeDasharray={`${size * 0.05} ${size * 0.03}`}
        style={{ transformOrigin: `${CX}px ${CY}px`, animation: "ilSpin 18s linear infinite" }} />
      <foreignObject x={CX - 14} y={CY - 26} width={28} height={28}>
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LogoMark size={26} light />
        </div>
      </foreignObject>
      <text x={CX} y={CY + 18} textAnchor="middle" fill="white"
        fontSize={size * 0.0135} fontFamily="'Geist', sans-serif" fontWeight="500" opacity="0.7" letterSpacing="0.08em">
        LUCENT AG
      </text>
      <text x={CX} y={CY + 30} textAnchor="middle" fill={T.gold}
        fontSize={size * 0.0105} fontFamily="'Geist Mono', monospace" opacity="0.65" letterSpacing="0.06em">
        INTELLIGENCE LAYER
      </text>
      {IL_NODES.map(n => {
        const pos = getPos(n.angle, R);
        const active = activeId === n.id;
        const dim = isAny && !active;
        const nr = size * 0.0385;
        const { Icon } = n;
        const isTop = n.angle > 95 && n.angle < 265;
        const ty1 = isTop ? pos.y - nr - 18 : pos.y + nr + 18;
        const ty2 = isTop ? pos.y - nr - 6  : pos.y + nr + 31;
        return (
          <g key={n.id} onClick={() => interactive && onNodeClick?.(active ? null : n.id)}
            style={{ cursor: interactive ? "pointer" : "default" }}>
            <circle cx={pos.x} cy={pos.y} r={active ? nr * 1.85 : nr * 1.4}
              fill={active ? T.gold : T.green} fillOpacity={active ? 0.14 : dim ? 0.03 : 0.07}
              style={{ transition: "all 0.3s ease" }} />
            <circle cx={pos.x} cy={pos.y} r={nr} fill={active ? T.gold : T.green}
              filter={active ? "url(#ilGlowNode)" : "none"} opacity={dim ? 0.3 : 1}
              style={{ transition: "all 0.3s ease" }} />
            <foreignObject x={pos.x - nr} y={pos.y - nr} width={nr * 2} height={nr * 2}>
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={nr * 0.72} color={active ? T.ink : "#F6F3EE"} strokeWidth={1.7} />
              </div>
            </foreignObject>
            <text x={pos.x} y={ty1} textAnchor="middle" fill={active ? T.gold : "#0C1F14"}
              fontSize={size * 0.0148} fontFamily="'Geist', sans-serif"
              fontWeight={active ? "600" : "400"} opacity={dim ? 0.25 : active ? 1 : 0.65}
              style={{ transition: "all 0.3s ease" }}>
              {n.label}
            </text>
            {n.sub && (
              <text x={pos.x} y={ty2} textAnchor="middle" fill={active ? T.gold : "#6B7B6E"}
                fontSize={size * 0.012} fontFamily="'Geist', sans-serif"
                opacity={dim ? 0.15 : active ? 0.75 : 0.5}
                style={{ transition: "all 0.3s ease" }}>
                {n.sub}
              </text>
            )}
            {mode === "ecosystem" && (
              <text x={pos.x} y={isTop ? pos.y - nr - 32 : pos.y + nr + 45}
                textAnchor="middle" fill={T.gold}
                fontSize={size * 0.011} fontFamily="'Geist Mono', monospace"
                opacity={active ? 0.9 : 0.3}
                style={{ transition: "opacity 0.3s ease" }}>
                {n.count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Grid background
// ─────────────────────────────────────────────────────────────────────────────
function GridBg() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={`${(i / 18) * 100}%`} x2="100%" y2={`${(i / 18) * 100}%`}
          stroke="rgba(27,67,50,0.32)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 28 }).map((_, i) => (
        <line key={`v${i}`} x1={`${(i / 28) * 100}%`} y1="0" x2={`${(i / 28) * 100}%`} y2="100%"
          stroke="rgba(27,67,50,0.32)" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Global Nav
// ─────────────────────────────────────────────────────────────────────────────
interface NavProps { page: Page; navigate: (p: Page) => void; }

const COMPANY_ITEMS: { label: string; desc: string; target: Page; Icon: React.FC<any> }[] = [
  { label: "About", desc: "Our story and mission",   target: "about", Icon: Info },
  { label: "Team",  desc: "People and partnerships", target: "team",  Icon: Users },
];

function GlobalNav({ page, navigate }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const dropTimer = useRef<ReturnType<typeof setTimeout>>();
  const dropRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDrop  = () => { clearTimeout(dropTimer.current); setDropOpen(true); };
  const closeDrop = () => { dropTimer.current = setTimeout(() => setDropOpen(false), 140); };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setDropOpen(false);
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDropOpen(v => !v); }
  };
  const handleItemKey = (e: React.KeyboardEvent, target: Page) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(target); setDropOpen(false); }
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#0C1F14]/97 backdrop-blur-xl border-b border-white/8" : "bg-transparent"
    }`}>
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10 h-[60px] flex items-center justify-between">
        <button onClick={() => { navigate("home"); setMobileOpen(false); }} className="flex items-center">
          <img src={lucentLogo} alt="Lucent Ag" className="h-8 w-auto" />
        </button>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          <div ref={dropRef} className="relative" onMouseEnter={openDrop} onMouseLeave={closeDrop}>
            <button aria-haspopup="true" aria-expanded={dropOpen} onKeyDown={handleKeyDown}
              className="flex items-center gap-1 text-[13px] font-medium text-white/48 hover:text-white transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1F14] rounded-sm px-0.5">
              Company
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
            </button>
            <div role="menu" aria-label="Company menu" onMouseEnter={openDrop} onMouseLeave={closeDrop}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[230px] z-50"
              style={{ opacity: dropOpen ? 1 : 0, transform: dropOpen ? "translateY(0)" : "translateY(-8px)", pointerEvents: dropOpen ? "auto" : "none", transition: "opacity 0.18s ease, transform 0.18s ease" }}>
              <div className="flex justify-center mb-1.5">
                <div className="w-2.5 h-2.5 bg-white border-l border-t border-[rgba(27,67,50,0.1)] rotate-45 -mb-1.5 relative z-10" />
              </div>
              <div className="bg-white rounded-xl border border-[rgba(27,67,50,0.1)] shadow-[0_20px_48px_rgba(12,31,20,0.18),0_4px_12px_rgba(12,31,20,0.08)] p-2">
                {COMPANY_ITEMS.map(item => (
                  <button key={item.label} role="menuitem" tabIndex={dropOpen ? 0 : -1}
                    onKeyDown={e => handleItemKey(e, item.target)}
                    onClick={() => { navigate(item.target); setDropOpen(false); }}
                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F6F3EE] text-left group transition-colors duration-100 outline-none focus-visible:bg-[#F6F3EE]">
                    <div className="w-7 h-7 rounded-lg bg-[#1B4332]/8 group-hover:bg-[#1B4332] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <item.Icon className="w-3.5 h-3.5 text-[#1B4332] group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#0C1F14] group-hover:text-[#1B4332] transition-colors">{item.label}</p>
                      <p className="text-[11px] text-[#6B7B6E] mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="#" className="text-[13px] font-medium text-white/45 hover:text-white transition-colors">Sign in</a>
          <DemoBtn className="text-[13px] px-4 py-2" />
        </div>

        <button className="lg:hidden p-1 text-white" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0C1F14] border-t border-white/8 px-6 py-7 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-[10px] text-white/30 uppercase tracking-widest" style={{ fontFamily: "'Geist Mono', monospace" }}>Company</p>
            {COMPANY_ITEMS.map(item => (
              <button key={item.label} onClick={() => { navigate(item.target); setMobileOpen(false); }}
                className="flex items-center gap-3 text-[15px] text-white/65 hover:text-white transition-colors text-left">
                <item.Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </div>
          <DemoBtn className="mt-3 text-[14px] px-5 py-3.5 justify-center" />
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Site Footer
// ─────────────────────────────────────────────────────────────────────────────
const FOOTER_COLS: Record<string, string[]> = {
  Platform:  ["Intelligence Layer", "Commerce Layer", "Logistics Layer", "Finance Layer", "API & Integrations"],
  Solutions: ["For Farmers", "For Aggregators", "For Processors", "For Buyers", "For Financiers"],
  Company:   ["About", "Team", "Careers", "Press", "Blog"],
  Resources: ["Documentation", "Case Studies", "Research", "Newsletter"],
  Legal:     ["Privacy", "Terms", "Cookies", "Security"],
};
const FOOTER_ACTIVE_ITEMS = new Set(["About", "Team"]);
function SiteFooter({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer className="bg-[#0C1F14] pt-16 pb-10">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-14">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <button onClick={() => navigate("home")} className="flex items-center mb-5">
              <img src={lucentLogo} alt="Lucent Ag" className="h-8 w-auto" />
            </button>
            <p className="text-[13px] text-white/30 leading-relaxed max-w-[190px]">
              The operating system for Africa's post-harvest economy.
            </p>
            <div className="flex gap-3 mt-6">
              {["X", "Li", "Gh"].map(s => (
                <a key={s} href="#"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10.5px] font-medium text-white/28 hover:border-white/28 hover:text-white transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_COLS).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-[10px] font-semibold text-white/32 uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Geist Mono', monospace" }}>{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(item => (
                  <li key={item}>
                    {FOOTER_ACTIVE_ITEMS.has(item) ? (
                      <a href="#" className="text-[13px] text-white/36 hover:text-white/75 transition-colors">{item}</a>
                    ) : (
                      <span className="text-[13px] text-white/14 cursor-not-allowed select-none">{item}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/7 pt-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-[11.5px] text-white/20">© 2025 Lucent Ag Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11.5px] text-white/20">All systems operational</span>
            </div>
            <span className="text-[11px] text-white/16" style={{ fontFamily: "'Geist Mono', monospace" }}>v4.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HOME PAGE SECTIONS
// ═════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const { ref, inView } = useInView(0.05);
  const { open } = useModal();
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0C1F14]">
      <GridBg />
      <div className="absolute top-0 right-0 w-[54%] h-full pointer-events-none hidden lg:block">
        <img src={px(IMG.satellite, 960, 1080)} alt="" className="w-full h-full object-cover opacity-14" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1F14] via-[#0C1F14]/70 to-transparent" />
      </div>
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[650px] h-[650px] opacity-25 hidden xl:block pointer-events-none">
        <IntelligenceLayerDiagram mode="hero" size={650} />
      </div>
      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10 pt-28 pb-20"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "opacity 1s ease, transform 1s ease" }}>
        <div className="inline-flex items-center gap-2.5 border border-[rgba(200,146,42,0.3)] rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8922A] animate-pulse" />
          <span className="text-[11px] font-medium text-[#C8922A] tracking-wide" style={{ fontFamily: "'Geist Mono', monospace" }}>
            Africa's post-harvest operating system
          </span>
        </div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-[58px] sm:text-[76px] lg:text-[100px] xl:text-[110px] leading-[0.96] tracking-[-0.022em] text-white max-w-[980px] mb-8">
          The intelligence layer food systems have been waiting for.
        </h1>
        <p className="text-[17px] md:text-[19px] text-white/50 leading-[1.68] max-w-[480px] mb-10">
          Connecting every actor in Africa's post-harvest economy through one platform — reducing loss, creating access and unlocking prosperity.
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <DemoBtn className="text-[14px] px-6 py-3.5" />
          <button onClick={() => open("video")} className="inline-flex items-center gap-2 border border-white/18 text-white text-[14px] font-medium px-6 py-3.5 rounded-full hover:bg-white/8 hover:border-white/30 transition-all duration-200">
            Watch overview
          </button>
        </div>
        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          {[{ label: "Network nodes online", value: "0", live: true }, { label: "Tonnes tracked today", value: "0 t" }, { label: "Active markets", value: "0 countries" }].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              {s.live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />}
              <span className="text-[11.5px] text-white/32" style={{ fontFamily: "'Geist Mono', monospace" }}>{s.label}</span>
              <span className="text-[11.5px] text-white/65 font-medium" style={{ fontFamily: "'Geist Mono', monospace" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/22" />
        <span className="text-[9px] text-white/22 tracking-[0.2em] uppercase" style={{ fontFamily: "'Geist Mono', monospace" }}>Scroll</span>
      </div>
    </section>
  );
}

const CHALLENGE_STATS = [
  { prefix: "~", value: 40, suffix: "%", label: "Of harvests lost before reaching consumers", detail: "Across Sub-Saharan Africa, an estimated 40% of food produced never reaches consumers — lost to spoilage, poor storage infrastructure and fragmented logistics.", source: "FAO, 2023" },
  { prefix: "$", value: 4, suffix: "T+", label: "Annual food system value left unrealized", detail: "Africa's agricultural potential is among the world's largest. The gap between production and market delivery is a structural failure of connectivity, not of farming.", source: "AfDB, 2022" },
  { prefix: "<", value: 3, suffix: "%", label: "Of smallholders with access to formal credit", detail: "Without transaction history or recognised collateral, farmers who grow most of Africa's food are excluded from the capital needed to scale, store and negotiate.", source: "IFC, 2023" },
];

function ChallengeSection() {
  const { ref, inView } = useInView(0.2);
  const BAR = [{ label: "Farm", pct: 100 }, { label: "Collect", pct: 88 }, { label: "Store", pct: 74 }, { label: "Move", pct: 65 }, { label: "Process", pct: 60 }, { label: "Market", pct: 54 }];
  return (
    <section className="bg-[#0C1F14] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <div className="grid lg:grid-cols-[1fr_1.7fr] gap-16 md:gap-28 items-start">
          <Reveal className="lg:sticky lg:top-28">
            <Label>The challenge</Label>
            <Heading light className="mt-4 mb-6 max-w-[360px]">Africa produces enough. The system loses it.</Heading>
            <p className="text-[15px] text-white/45 leading-relaxed max-w-[360px]">
              Post-harvest loss is not a farming problem. It is a connectivity, information and finance problem.
            </p>
            <div className="mt-10">
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-4" style={{ fontFamily: "'Geist Mono', monospace" }}>Value retained by stage — illustrative</p>
              <div className="flex items-end gap-1.5 h-28">
                {BAR.map((s, i) => (
                  <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-t-sm transition-all duration-700"
                      style={{ height: `${s.pct * 1.02}px`, background: i === 0 ? T.greenLight : `rgba(64,145,108,${0.18 + s.pct / 165})`, transform: inView ? "scaleY(1)" : "scaleY(0)", transformOrigin: "bottom", transitionDelay: `${i * 110}ms` }} />
                    <span className="text-[8.5px] text-white/28" style={{ fontFamily: "'Geist Mono', monospace" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div ref={ref} className="flex flex-col">
            {CHALLENGE_STATS.map((s, i) => {
              const count = useCountUp(s.value, 2000, inView);
              return (
                <div key={s.label} className={`py-10 ${i > 0 ? "border-t border-white/8" : ""}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[62px] md:text-[74px] leading-none text-white">
                      {s.prefix}{count}{s.suffix}
                    </span>
                    <span className="text-[9.5px] text-[#C8922A]/50 tracking-wider uppercase mt-2 shrink-0" style={{ fontFamily: "'Geist Mono', monospace" }}>{s.source}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{s.label}</h3>
                  <p className="text-[14px] text-white/42 leading-relaxed">{s.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeNode = IL_NODES.find(n => n.id === activeId);
  return (
    <section className="py-28 md:py-36 bg-[#F6F3EE]">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="text-center mb-16">
          <Label>Connected ecosystem</Label>
          <Heading className="mt-4 max-w-[680px] mx-auto">One intelligence layer. Every actor in the value chain.</Heading>
          <p className="mt-5 text-[16px] text-[#6B7B6E] max-w-[440px] mx-auto leading-relaxed">
            Select any participant to explore the value Lucent Ag creates for them.
          </p>
        </Reveal>
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="shrink-0 w-[300px] sm:w-[420px] lg:w-[560px] aspect-square">
            <IntelligenceLayerDiagram mode="ecosystem" size={560} activeId={activeId} onNodeClick={setActiveId} />
          </div>
          <div className="flex-1 min-h-[280px]">
            {activeNode ? (
              <div key={activeId} style={{ animation: "ilFadeUp 0.3s ease" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#1B4332] flex items-center justify-center shrink-0">
                    <activeNode.Icon className="w-5 h-5 text-[#F6F3EE]" strokeWidth={1.5} />
                  </div>
                  <Label>{activeNode.label} {activeNode.sub}</Label>
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[52px] leading-none text-[#0C1F14] mb-1">{activeNode.count}</div>
                <p className="text-[12px] text-[#6B7B6E] mb-8" style={{ fontFamily: "'Geist Mono', monospace" }}>participants on the network</p>
                <div className="flex flex-col gap-4 mb-8">
                  {activeNode.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#C8922A] mt-2 shrink-0" />
                      <p className="text-[14.5px] text-[#0C1F14]/65 leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
                <DemoBtn className="text-[13px] px-5 py-2.5" />
              </div>
            ) : (
              <div>
                <p className="text-[17px] text-[#6B7B6E] max-w-[290px] leading-relaxed mb-7">Select any node to discover the value Lucent Ag creates for each participant.</p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {IL_NODES.map(n => (
                    <button key={n.id} onClick={() => setActiveId(n.id)}
                      className="text-[12px] font-medium text-[#4a5f52] border border-[rgba(27,67,50,0.14)] px-3 py-1.5 rounded-full hover:border-[#1B4332] hover:text-[#0C1F14] hover:bg-white transition-all duration-150">
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const OS_LAYERS = [
  { id: "intelligence", idx: "01", label: "Intelligence Layer", tagline: "See everything. Know everything.", title: "AI that reads the entire value chain in real time", body: "Satellite imagery, IoT sensors, weighbridge feeds and market signals fuse into a single intelligence layer — giving every participant the visibility previously held only by the world's largest commodity traders.", caps: ["Satellite crop monitoring & yield estimation", "Predictive demand and price forecasting", "AI-assisted quality grading at the hub", "Supply / demand matching engine"], img: IMG.satellite, imgAlt: "Satellite Earth view of agricultural regions", kpis: [{ v: "0", l: "monitored" }, { v: "0", l: "price forecast accuracy" }] },
  { id: "commerce", idx: "02", label: "Commerce Layer", tagline: "Trade with certainty.", title: "A verified marketplace for every staple commodity", body: "Farmers, aggregators and buyers transact on a structured marketplace with embedded quality verification, smart contracts and escrow. No distress sales. No payment risk.", caps: ["Buyer–seller matching with quality filters", "Smart contracts with automated escrow", "Forward contract structuring", "Integrated dispute resolution"], img: IMG.dashboard, imgAlt: "Digital commodity trading dashboard", kpis: [{ v: "0", l: "facilitated" }, { v: "0", l: "escrow success" }] },
  // { id: "logistics", idx: "03", label: "Logistics Layer", tagline: "Track every tonne, every mile.", title: "Connected cold chains and last-mile transport", body: "GPS tracking, cold-chain IoT monitoring and digital warehouse receipt issuance reduce in-transit losses. Every tonne has a digital twin from farm gate to final buyer.", caps: ["Real-time vehicle GPS and ETA", "Cold chain temperature monitoring", "Digital warehouse receipts (collateral-ready)", "Load matching and route optimisation"], img: IMG.warehouse, imgAlt: "Modern logistics warehouse operations", kpis: [{ v: "340+", l: "logistics partners" }, { v: "< 3.2%", l: "in-transit loss" }] },
  { id: "finance", idx: "04", label: "Finance Layer", tagline: "Capital that flows where food flows.", title: "Embedded finance triggered by verified trade", body: "Transaction data on the Lucent Ag rail becomes a credit profile. Working capital, crop insurance and invoice financing activate in the same workflow — no paperwork, no branch visit.", caps: ["Alternative credit scoring from trade data", "Embedded working capital loans", "Crop and transit insurance", "Invoice financing rail"], img: IMG.fintech, imgAlt: "Mobile financial technology for agricultural finance", kpis: [{ v: "0", l: "financial partners" }, { v: "0", l: "avg. credit decision" }] },
];

function PlatformSection() {
  const [active, setActive] = useState(0);
  const L = OS_LAYERS[active];
  return (
    <section className="py-28 md:py-36 bg-[#0C1F14]">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-14">
          <Label>Platform overview</Label>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <Heading light className="max-w-[520px]">Four layers. One operating system. No seams.</Heading>
            <p className="text-[15px] text-white/38 max-w-[310px] leading-relaxed">Intelligence feeds Commerce. Commerce feeds Logistics. Logistics feeds Finance. One data spine. Zero friction between layers.</p>
          </div>
        </Reveal>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {OS_LAYERS.map((l, i) => (
            <button key={l.id} onClick={() => setActive(i)}
              className={`shrink-0 flex flex-col items-start px-5 py-3.5 rounded-xl border text-left transition-all duration-250 ${active === i ? "bg-[#C8922A]/14 border-[#C8922A]/40" : "bg-white/3 border-white/7 hover:bg-white/5 hover:border-white/14"}`}>
              <span className="text-[9px] mb-1" style={{ fontFamily: "'Geist Mono', monospace", color: active === i ? T.gold : "rgba(255,255,255,0.3)" }}>{l.idx}</span>
              <span className={`text-[12.5px] font-medium ${active === i ? "text-[#C8922A]" : "text-white/38"}`}>{l.label}</span>
            </button>
          ))}
        </div>
        <div className="grid lg:grid-cols-[1fr_1.05fr] rounded-2xl overflow-hidden border border-white/8">
          <div className="bg-white/4 p-9 md:p-12 flex flex-col">
            <span className="text-[10px] text-[#C8922A]/70 tracking-widest uppercase mb-3" style={{ fontFamily: "'Geist Mono', monospace" }}>{L.tagline}</span>
            <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[28px] md:text-[36px] leading-[1.1] text-white mb-4">{L.title}</h3>
            <p className="text-[14.5px] text-white/48 leading-relaxed mb-7">{L.body}</p>
            <div className="flex flex-col gap-3 mb-8">
              {L.caps.map(c => (
                <div key={c} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8922A] shrink-0" />
                  <span className="text-[13.5px] text-white/60">{c}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-6 mt-auto pt-6 border-t border-white/8">
              {L.kpis.map(k => (
                <div key={k.l}>
                  <div style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[28px] text-white leading-none">{k.v}</div>
                  <div className="text-[11.5px] text-white/38 mt-0.5">{k.l}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0} className="p-2 rounded-full border border-white/12 text-white/35 hover:border-white/30 hover:text-white disabled:opacity-20 transition-all">
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
              <button onClick={() => setActive(Math.min(OS_LAYERS.length - 1, active + 1))} disabled={active === OS_LAYERS.length - 1} className="p-2 rounded-full border border-white/12 text-white/35 hover:border-white/30 hover:text-white disabled:opacity-20 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="relative h-56 lg:h-auto min-h-[300px] bg-white/4 overflow-hidden">
            <img src={px(L.img, 800, 640)} alt={L.imgAlt} className="absolute inset-0 w-full h-full object-cover opacity-55 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0C1F14]/45 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

const JOURNEY = [
  { id: "farm", num: "01", phase: "Farm Gate", title: "Every harvest enters the network", body: "Farmers register via USSD, WhatsApp or app in 12 local languages. Harvest volumes, field GPS co-ordinates and crop type are logged instantly.", spec: "USSD · WhatsApp · Mobile app · 12 languages · < 5 min", img: IMG.aerialField, imgAlt: "Aerial view of cultivated farmland", hub: false },
  { id: "hub", num: "02", phase: "Mini Hub", title: "Digitized, graded and tagged for the market", body: "At Lucent Ag-verified collection hubs, produce is received, weighed, AI-quality-graded, QR tagged and temporarily stored. A digital receipt is issued immediately.", spec: "IoT weighbridge · AI grade · QR traceability · Cold storage IoT · Warehouse receipt", img: IMG.processing, imgAlt: "Post-harvest collection hub with digital grading", hub: true, ops: [{ Icon: Weight, label: "Digital weigh-in", desc: "Connected scales stream weight to the platform in real time." }, { Icon: BarChart3, label: "AI quality grading", desc: "Computer vision assigns standardised commodity grades." }, { Icon: QrCode, label: "QR traceability tag", desc: "Every lot receives a unique ID linked to full provenance." }, { Icon: Thermometer, label: "Cold chain monitoring", desc: "Ambient and refrigerated stores tracked via IoT sensors." }] },
  { id: "market", num: "03", phase: "Marketplace", title: "Matched to the best available buyer", body: "Verified, graded lots surface on the Lucent Ag trade network. Buyers are matched by commodity type, grade, volume and delivery window.", spec: "Smart contracts · Escrow · Forward contracts · Live price discovery", img: IMG.dashboard, imgAlt: "Digital commodity trading dashboard", hub: false },
  { id: "logistics", num: "04", phase: "Logistics", title: "Tracked from hub to destination", body: "Lucent Ag allocates verified transport partners, issues digital consignment notes and provides buyers with live GPS tracking and condition telemetry.", spec: "GPS tracking · Cold chain IoT · Digital consignment notes · Live buyer ETA", img: IMG.logistics, imgAlt: "Logistics trucks on African road network", hub: false },
  { id: "processing", num: "05", phase: "Processing", title: "Received, verified and transformed", body: "Processors receive platform-issued delivery confirmations with quality certificates. Outturn data flows back into the intelligence layer.", spec: "Digital outturn report · Quality certificate · Processor feedback loop", img: IMG.warehouse, imgAlt: "Modern grain processing and warehousing facility", hub: false },
  { id: "finance", num: "06", phase: "Finance", title: "Credit unlocked from transaction history", body: "Every completed transaction builds a verified credit profile. Working capital, crop insurance and invoice financing are offered inside the platform.", spec: "Alternative credit scoring · Working capital · Invoice finance · Embedded insurance", img: IMG.fintech, imgAlt: "Mobile fintech interface for agricultural lending", hub: false },
];

function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const stage = JOURNEY[active];
  return (
    <section className="py-28 md:py-36 bg-[#F6F3EE]">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-14">
          <Label>How it works</Label>
          <Heading className="mt-4 max-w-[600px]">One continuous journey from harvest to capital.</Heading>
        </Reveal>
        <div className="flex items-center overflow-x-auto pb-2 mb-10 gap-0">
          {JOURNEY.map((s, i) => (
            <div key={s.id} className="flex items-center shrink-0">
              <button onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${active === i ? "bg-[#1B4332] text-white shadow-[0_2px_14px_rgba(27,67,50,0.28)]" : s.hub ? "text-[#C8922A] border border-[#C8922A]/28 hover:bg-white" : "text-[#6B7B6E] hover:text-[#0C1F14] hover:bg-white"}`}>
                <span className="text-[9px] opacity-55" style={{ fontFamily: "'Geist Mono', monospace" }}>{s.num}</span>
                {s.hub && <span className="text-[10px]">⬡</span>}
                {s.phase}
              </button>
              {i < JOURNEY.length - 1 && <div className="mx-1 flex items-center gap-0.5 shrink-0"><div className="w-3 h-px bg-[rgba(27,67,50,0.18)]" /><div className="w-1 h-1 rounded-full bg-[rgba(27,67,50,0.18)]" /></div>}
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start" key={stage.id} style={{ animation: "ilFadeUp 0.35s ease" }}>
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Label>{stage.num} · {stage.phase}</Label>
              {stage.hub && <span className="text-[10px] font-semibold text-[#C8922A] bg-[#C8922A]/10 border border-[#C8922A]/25 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Geist Mono', monospace" }}>Digitization point</span>}
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[28px] md:text-[36px] leading-[1.1] text-[#0C1F14] mb-4">{stage.title}</h3>
            <p className="text-[15px] text-[#6B7B6E] leading-relaxed mb-5">{stage.body}</p>
            <p className="text-[11px] text-[#C8922A]/75" style={{ fontFamily: "'Geist Mono', monospace" }}>{stage.spec}</p>
            {stage.hub && stage.ops && (
              <div className="mt-8 grid grid-cols-2 gap-3">
                {stage.ops.map(({ Icon, label, desc }) => (
                  <div key={label} className="bg-white border border-border rounded-xl p-4 hover:border-[rgba(27,67,50,0.28)] hover:shadow-sm transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-[#1B4332]/8 group-hover:bg-[#1B4332] flex items-center justify-center mb-3 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-[#1B4332] group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <p className="text-[12.5px] font-semibold text-[#0C1F14] mb-1">{label}</p>
                    <p className="text-[12px] text-[#6B7B6E] leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0} className="p-2.5 rounded-full border border-border hover:border-[#1B4332] disabled:opacity-22 transition-all">
                <ArrowRight className="w-4 h-4 text-[#0C1F14] rotate-180" />
              </button>
              <button onClick={() => setActive(Math.min(JOURNEY.length - 1, active + 1))} disabled={active === JOURNEY.length - 1} className="p-2.5 rounded-full bg-[#1B4332] border border-[#1B4332] hover:bg-[#143527] disabled:opacity-22 transition-all">
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <span className="text-[12px] text-[#6B7B6E] ml-1">{active + 1} / {JOURNEY.length}</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-border h-64 md:h-[420px] bg-[#EAE6DE]">
            <img src={px(stage.img, 800, 640)} alt={stage.imgAlt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14]/28 to-transparent" />
            {stage.hub && <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#C8922A] text-white px-3 py-1.5 rounded-full"><span className="text-[10px] font-semibold tracking-wide" style={{ fontFamily: "'Geist Mono', monospace" }}>⬡ MINI HUB</span></div>}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Our Principles (replaces WhySection) ────────────────────────────────────
const PRINCIPLES_HOME = [
  { Icon: TrendingUp, title: "Impact First",            body: "Every decision we make begins with one question: does this create measurable benefit for the people and food systems we serve? Impact is not a metric. It is our purpose." },
  { Icon: Brain,      title: "Systems Thinking",        body: "We design for the whole value chain, not individual links. A solution that creates a new bottleneck elsewhere is not a solution worth building." },
  { Icon: Users,      title: "Collaboration",           body: "We build with the communities we serve, not for them. Their knowledge, experience and priorities shape every element of our platform." },
  { Icon: Shield,     title: "Trust",                   body: "Every interaction on the Lucent Ag network is verified, transparent and accountable. Trust is the foundation every food system needs and rarely has." },
  { Icon: Zap,        title: "Innovation",              body: "We apply the world's most capable technology — AI, satellite intelligence, IoT — to one of its most consequential challenges: feeding a continent." },
  { Icon: Sprout,     title: "Long-Term Sustainability", body: "We think in generations, not quarters. Our platform creates durable, compounding impact for ecosystems, communities and economies." },
];

function OurPrinciplesSection() {
  return (
    <section className="py-28 md:py-36 bg-[#EAE6DE]">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Our principles</Label>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <Heading className="max-w-[440px]">What we believe shapes how we build.</Heading>
            <p className="text-[15px] text-[#6B7B6E] max-w-[320px] leading-relaxed">Six convictions that guide every product decision, every partnership and every line of code.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(27,67,50,0.1)]">
          {PRINCIPLES_HOME.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 70} className="bg-[#EAE6DE] hover:bg-white p-8 md:p-10 flex flex-col gap-5 transition-colors duration-200 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 group-hover:bg-[#1B4332] flex items-center justify-center transition-colors duration-200">
                <Icon className="w-[18px] h-[18px] text-[#1B4332] group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-[15.5px] font-semibold text-[#0C1F14] leading-snug">{title}</h3>
              <p className="text-[14px] text-[#6B7B6E] leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Food Systems (replaces FutureSection / Vision 2030) ─────────────────────
const FOOD_SYSTEM_PILLARS = [
  {
    tag: "Connected Food Systems",
    headline: "No harvest should be invisible to the market it feeds.",
    body: "We are building the connective infrastructure that links every farm, every warehouse and every buyer — creating a food system that sees itself clearly for the first time.",
    img: IMG.aerialCrops,
    imgAlt: "Aerial view of connected farmland and food networks",
    icon: Network,
  },
  {
    tag: "Sustainable Growth",
    headline: "Growth that restores rather than depletes.",
    body: "By reducing loss, shortening supply chains and enabling climate-smart decisions, Lucent Ag creates growth that is good for ecosystems as well as economies.",
    img: IMG.greenField,
    imgAlt: "Lush green agricultural landscape",
    icon: Sprout,
  },
  {
    tag: "Shared Prosperity",
    headline: "The gains of a better food system belong to everyone in it.",
    body: "From the smallholder farmer to the institutional buyer, Lucent Ag is designed to distribute value fairly across the chain — not concentrate it at the top.",
    img: IMG.market,
    imgAlt: "Vibrant African food market with community and commerce",
    icon: Heart,
  },
];

function FoodSystemsSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-[#0C1F14] py-28 md:py-36 relative overflow-hidden">
      <GridBg />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-14">
          <Label>Our purpose</Label>
          <Heading light className="mt-4 max-w-[620px]">Building stronger food systems for generations.</Heading>
          <p className="mt-5 text-[16px] text-white/45 max-w-[480px] leading-relaxed">
            Three interconnected commitments that define why Lucent Ag exists.
          </p>
        </Reveal>

        {/* Pillar tabs */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          {FOOD_SYSTEM_PILLARS.map((p, i) => (
            <button key={p.tag} onClick={() => setActive(i)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all duration-200 flex-1 sm:flex-none ${
                active === i
                  ? "bg-[#C8922A]/14 border-[#C8922A]/40"
                  : "bg-white/4 border-white/8 hover:bg-white/7 hover:border-white/16"
              }`}>
              <p.icon className={`w-4 h-4 shrink-0 ${active === i ? "text-[#C8922A]" : "text-white/38"}`} strokeWidth={1.5} />
              <span className={`text-[12.5px] font-medium ${active === i ? "text-[#C8922A]" : "text-white/45"}`}>{p.tag}</span>
            </button>
          ))}
        </div>

        {/* Active pillar content */}
        <div key={active} className="grid lg:grid-cols-[1fr_1.1fr] gap-6 rounded-2xl overflow-hidden border border-white/8"
          style={{ animation: "ilFadeUp 0.3s ease" }}>
          <div className="bg-white/4 p-10 md:p-14 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-7">
                {(() => { const I = FOOD_SYSTEM_PILLARS[active].icon; return <I className="w-5 h-5 text-[#C8922A]" strokeWidth={1.5} />; })()}
                <span className="text-[10px] text-[#C8922A] uppercase tracking-widest font-semibold" style={{ fontFamily: "'Geist Mono', monospace" }}>{FOOD_SYSTEM_PILLARS[active].tag}</span>
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-[28px] md:text-[40px] leading-[1.1] text-white mb-6">
                {FOOD_SYSTEM_PILLARS[active].headline}
              </h3>
              <p className="text-[15.5px] text-white/50 leading-relaxed">
                {FOOD_SYSTEM_PILLARS[active].body}
              </p>
            </div>
            <div className="mt-10">
              <DemoBtn className="text-[14px] px-6 py-3.5" />
            </div>
          </div>
          <div className="relative h-64 lg:h-auto min-h-[360px] overflow-hidden">
            <img src={px(FOOD_SYSTEM_PILLARS[active].img, 900, 700)} alt={FOOD_SYSTEM_PILLARS[active].imgAlt}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C1F14]/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who We Work With ─────────────────────────────────────────────────────────
const WHO_WE_WORK_WITH = [
  { Icon: Leaf,      title: "Farmers",                  value: "Reach new markets. Access fair prices. Build financial identity.", color: "#1B4332" },
  { Icon: Users,     title: "Aggregators",              value: "Connect wider. Source faster. Operate with greater confidence.", color: "#2D6A4F" },
  { Icon: Warehouse, title: "Warehouses",               value: "Attract more clients. Issue recognised receipts. Monitor quality.", color: "#40916C" },
  { Icon: Truck,     title: "Logistics Providers",      value: "Fill routes. Grow your network. Earn trust through transparency.", color: "#1B4332" },
  { Icon: Building2, title: "Processors & Millers",     value: "Source with confidence. Reduce input risk. Access aligned finance.", color: "#2D6A4F" },
  { Icon: Globe,     title: "Buyers & Exporters",       value: "Source from a verified base. Reduce risk. Build lasting supply.", color: "#40916C" },
  { Icon: Scale,     title: "Financial Institutions",   value: "Reach new clients. Deploy capital with better data. Reduce risk.", color: "#1B4332" },
  { Icon: Landmark,  title: "Governments",              value: "Increase food security. Improve market transparency. Enable policy.", color: "#2D6A4F" },
  { Icon: Handshake, title: "Development Partners",     value: "Amplify impact. Reach underserved communities. Measure outcomes.", color: "#40916C" },
  { Icon: BookOpen,  title: "Research Organisations",  value: "Access verified data. Validate interventions. Inform policy.", color: "#1B4332" },
];

function WhoWeWorkWithSection() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="bg-[#F6F3EE] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Who we work with</Label>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <Heading className="max-w-[500px]">Every actor in Africa's food system has a place on the network.</Heading>
            <p className="text-[15px] text-[#6B7B6E] max-w-[300px] leading-relaxed">Lucent Ag creates value for every participant — from individual farmers to development institutions.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {WHO_WE_WORK_WITH.map((w, i) => (
            <Reveal key={w.title} delay={i * 45}
              className={`group relative rounded-2xl border cursor-pointer transition-all duration-250 overflow-hidden ${
                active === i
                  ? "border-[#1B4332] shadow-[0_8px_32px_rgba(27,67,50,0.16)]"
                  : "border-border bg-white hover:border-[rgba(27,67,50,0.25)] hover:shadow-sm"
              }`}
              onClick={() => setActive(active === i ? null : i) as any}>
              <div className={`p-5 flex flex-col gap-4 min-h-[140px] transition-colors ${active === i ? "bg-[#1B4332]" : "bg-white group-hover:bg-[#F6F3EE]"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${active === i ? "bg-white/14" : "bg-[#1B4332]/8 group-hover:bg-[#1B4332]"}`}>
                  <w.Icon className={`w-4 h-4 transition-colors ${active === i ? "text-white" : "text-[#1B4332] group-hover:text-white"}`} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`text-[13px] font-semibold leading-snug mb-1 transition-colors ${active === i ? "text-white" : "text-[#0C1F14]"}`}>{w.title}</h3>
                  {active === i && (
                    <p className="text-[12px] text-white/65 leading-snug mt-2" style={{ animation: "ilFadeUp 0.2s ease" }}>{w.value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <DemoBtn className="text-[14px] px-6 py-3.5" />
        </Reveal>
      </div>
    </section>
  );
}

// ─── Our Impact (SDGs) ────────────────────────────────────────────────────────
const SDG_CARDS = [
  { num: "01", title: "No Poverty",                       color: "#E5243B", connection: "Creating income stability and financial access for smallholder farmers and rural entrepreneurs across Africa." },
  { num: "02", title: "Zero Hunger",                      color: "#DDA63A", connection: "Reducing post-harvest food loss at source, improving food availability and enabling efficient supply to consumers." },
  { num: "05", title: "Gender Equality",                  color: "#FF3A21", connection: "Designing inclusive onboarding that empowers women farmers and agri-entrepreneurs with equal access to markets and finance." },
  { num: "08", title: "Decent Work & Growth",             color: "#A21942", connection: "Supporting livelihoods across the value chain — from farm-level productivity to formalized employment in agri-logistics." },
  { num: "09", title: "Industry & Innovation",            color: "#FD6925", connection: "Building digital infrastructure that modernises Africa's food economy through AI, IoT and satellite intelligence." },
  { num: "10", title: "Reduced Inequalities",             color: "#DD1367", connection: "Giving smallholders access to information, markets and credit that have historically been reserved for large commercial actors." },
  { num: "12", title: "Responsible Consumption",          color: "#BF8B2E", connection: "Cutting food loss at every stage of the supply chain, reducing waste and supporting more efficient resource use." },
  { num: "13", title: "Climate Action",                   color: "#3F7E44", connection: "Enabling data-driven, climate-resilient agriculture and reducing the carbon footprint of food supply chains." },
  { num: "17", title: "Partnerships for the Goals",       color: "#19486A", connection: "Building a multi-stakeholder platform that aligns governments, development partners, financiers and private sector." },
];

function OurImpactSection() {
  const [activeSDG, setActiveSDG] = useState<string | null>(null);
  const active = SDG_CARDS.find(s => s.num === activeSDG);
  return (
    <section className="bg-white py-28 md:py-36 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Our impact</Label>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <Heading className="max-w-[520px]">Advancing the goals the world agreed on.</Heading>
            <p className="text-[15px] text-[#6B7B6E] max-w-[320px] leading-relaxed">Lucent Ag's work is aligned with 9 of the 17 UN Sustainable Development Goals. Select any to see the connection.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-8">
          {SDG_CARDS.map((s, i) => (
            <Reveal key={s.num} delay={i * 40}>
              <button
                onClick={() => setActiveSDG(activeSDG === s.num ? null : s.num)}
                className="w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 border-2 transition-all duration-200 group"
                style={{
                  borderColor: activeSDG === s.num ? s.color : "transparent",
                  backgroundColor: activeSDG === s.num ? s.color : `${s.color}18`,
                }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", color: activeSDG === s.num ? "white" : s.color }}
                  className="text-[18px] sm:text-[22px] leading-none font-normal">{s.num}</span>
                <span className="text-[7px] sm:text-[8px] font-semibold uppercase tracking-wide text-center leading-tight px-1 hidden sm:block"
                  style={{ color: activeSDG === s.num ? "rgba(255,255,255,0.85)" : `${s.color}cc` }}>
                  {s.title.split(" ").slice(0, 2).join(" ")}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Detail panel */}
        {active ? (
          <Reveal key={active.num} className="rounded-2xl border-2 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start"
            style={{ borderColor: `${active.color}40`, backgroundColor: `${active.color}08` }}>
            <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: active.color }}>
              <span style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[28px] text-white leading-none">{active.num}</span>
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: active.color, fontFamily: "'Geist Mono', monospace" }}>
                SDG {active.num}
              </span>
              <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[24px] md:text-[32px] text-[#0C1F14] leading-snug mb-4">{active.title}</h3>
              <p className="text-[15.5px] text-[#6B7B6E] leading-relaxed max-w-[540px]">{active.connection}</p>
            </div>
          </Reveal>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-[15px] text-[#6B7B6E]">Select any SDG card above to explore Lucent Ag's connection to the goal.</p>
          </div>
        )}

        <p className="mt-8 text-center text-[11px] text-[#6B7B6E]/50" style={{ fontFamily: "'Geist Mono', monospace" }}>
          SDG alignment reflects Lucent Ag's strategic intent. Impact metrics subject to third-party verification as the platform scales.
        </p>
      </div>
    </section>
  );
}

// ─── Intelligence Section ─────────────────────────────────────────────────────
type FeedSrc = "FAO" | "IFAD" | "CGIAR" | "WFP" | "World Bank" | "AfDB";
interface Article { id: string; src: FeedSrc; category: string; date: string; readMin: number; title: string; summary: string; imgKey: keyof typeof IMG; imgAlt: string; url: string; }
const FEED_META: Record<FeedSrc, { color: string }> = { FAO: { color: "#1B4332" }, IFAD: { color: "#2D6A4F" }, CGIAR: { color: "#40916C" }, WFP: { color: "#C8922A" }, "World Bank": { color: "#0C1F14" }, AfDB: { color: "#6B7B6E" } };
const ARTICLES: Article[] = [
  { id: "fao-25-01", src: "FAO", category: "Post-harvest Loss", date: "12 Jun 2025", readMin: 14, imgKey: "aerialCrops", imgAlt: "Aerial view of African crop fields", title: "Global food losses: systemic drivers and highest-impact structural interventions", summary: "An estimated one-third of all food produced globally is lost or wasted. This report examines the structural drivers across Sub-Saharan African value chains and identifies interventions with the highest impact-to-cost ratio.", url: "#" },
  { id: "ifad-25-01", src: "IFAD", category: "Rural Finance", date: "4 May 2025", readMin: 11, imgKey: "fintech", imgAlt: "Mobile payment on smartphone", title: "Digital transaction data as a viable alternative to collateral for smallholder credit scoring", summary: "Platform-based transaction records reduced loan origination costs by 60–70% in pilots across Kenya, Ghana and Senegal — opening formal credit channels to smallholders excluded by traditional underwriting models.", url: "#" },
  { id: "cgiar-25-01", src: "CGIAR", category: "Climate Resilience", date: "28 Mar 2025", readMin: 18, imgKey: "satellite", imgAlt: "Satellite view of Sub-Saharan Africa", title: "Heat stress and staple crops: modelling yield impact to 2040 across the Sahel", summary: "Climate projections indicate a 15–25% reduction in maize, sorghum and millet yields across the Sahel by 2040. Early-warning systems and adaptive variety deployment represent the highest-leverage mitigation pathways.", url: "#" },
  { id: "wfp-25-01", src: "WFP", category: "Food Security", date: "9 Jul 2025", readMin: 8, imgKey: "market", imgAlt: "Fresh produce at an East African market", title: "State of food security in East Africa: 2025 mid-year assessment", summary: "Market access constraints — not production shortfalls — are the primary food security driver in seven of twelve assessed countries, according to the 2025 WFP mid-year assessment.", url: "#" },
  { id: "wb-25-01", src: "World Bank", category: "Agricultural Finance", date: "19 Feb 2025", readMin: 12, imgKey: "dashboard", imgAlt: "Data dashboard showing financial analytics", title: "Closing the $240B agricultural financing gap: blended finance and digital rails", summary: "Blended finance structures, digital payment rails and alternative credit data are converging to make Africa's agricultural financing gap addressable within the current decade.", url: "#" },
  { id: "afdb-25-01", src: "AfDB", category: "Infrastructure", date: "31 Jan 2025", readMin: 16, imgKey: "portOps", imgAlt: "African port and logistics operations", title: "Agri-logistics corridors: 14 high-impact investments for intra-African food trade", summary: "Physical and digital logistics infrastructure is the binding constraint on Africa's intra-continental food trade, which remains below 20% of total production.", url: "#" },
];

function SrcChip({ src, active, onClick }: { src: FeedSrc | "All"; active: boolean; onClick: () => void }) {
  const meta = src !== "All" ? FEED_META[src as FeedSrc] : null;
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-150 ${active ? "text-white border-transparent" : "border-border text-[#6B7B6E] hover:border-[rgba(27,67,50,0.25)] hover:text-[#0C1F14]"}`}
      style={active ? { backgroundColor: meta?.color ?? T.green } : {}}>
      {meta && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: active ? "rgba(255,255,255,0.5)" : meta.color }} />}
      {src}
    </button>
  );
}

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const meta = FEED_META[article.src];
  if (featured) return (
    <article className="group bg-white rounded-2xl border border-border overflow-hidden flex flex-col md:flex-row hover:shadow-[0_8px_36px_rgba(27,67,50,0.11)] hover:border-[rgba(27,67,50,0.22)] transition-all duration-300">
      <div className="md:w-[42%] h-56 md:h-auto relative overflow-hidden shrink-0 bg-[#EAE6DE]">
        <img src={px(article.imgKey, 700, 520)} alt={article.imgAlt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
      </div>
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[9.5px] font-bold tracking-widest text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: meta.color, fontFamily: "'Geist Mono', monospace" }}>{article.src}</span>
            <span className="text-[11.5px] text-[#6B7B6E]">{article.category}</span>
          </div>
          <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[22px] md:text-[26px] leading-[1.22] text-[#0C1F14] mb-3 group-hover:text-[#1B4332] transition-colors">{article.title}</h3>
          <p className="text-[14px] text-[#6B7B6E] leading-relaxed line-clamp-3">{article.summary}</p>
        </div>
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
          <div className="flex items-center gap-3"><span className="text-[12px] text-[#6B7B6E]">{article.date}</span><span className="text-[#6B7B6E]/40">·</span><span className="text-[12px] text-[#6B7B6E]">{article.readMin} min</span></div>
          <a href={article.url} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#1B4332] hover:gap-2.5 transition-all">Read more <ExternalLink className="w-3 h-3" /></a>
        </div>
      </div>
    </article>
  );
  return (
    <article className="group bg-white rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-[0_6px_24px_rgba(27,67,50,0.09)] hover:border-[rgba(27,67,50,0.2)] transition-all duration-300">
      <div className="h-44 relative overflow-hidden shrink-0 bg-[#EAE6DE]">
        <img src={px(article.imgKey, 600, 380)} alt={article.imgAlt} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-bold tracking-widest text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: meta.color, fontFamily: "'Geist Mono', monospace" }}>{article.src}</span>
          <span className="text-[11px] text-[#6B7B6E]">{article.category}</span>
        </div>
        <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17.5px] leading-[1.25] text-[#0C1F14] mb-2.5 group-hover:text-[#1B4332] transition-colors flex-1 line-clamp-3">{article.title}</h3>
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <span className="text-[11.5px] text-[#6B7B6E]">{article.date}</span>
          <a href={article.url} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1B4332] hover:gap-2 transition-all">Read <ExternalLink className="w-3 h-3" /></a>
        </div>
      </div>
    </article>
  );
}

function IntelligenceSection() {
  const allSrcs = Object.keys(FEED_META) as FeedSrc[];
  const [activeSrc, setActiveSrc] = useState<FeedSrc | "All">("All");
  const [search, setSearch] = useState("");
  const filtered = ARTICLES.filter(a => (activeSrc === "All" || a.src === activeSrc) && (!search || a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())));
  const [feat, ...rest] = filtered;
  return (
    <section className="py-28 md:py-36 bg-[#F6F3EE]">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Label>Global food systems intelligence</Label>
                <div className="flex items-center gap-1.5 bg-white border border-border rounded-full px-2.5 py-1">
                  <Rss className="w-2.5 h-2.5 text-[#C8922A]" /><span className="text-[10px] text-[#6B7B6E]" style={{ fontFamily: "'Geist Mono', monospace" }}>RSS-ready</span>
                </div>
              </div>
              <Heading className="max-w-[520px]">Research powering food system decisions.</Heading>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[12px] text-[#6B7B6E] mb-1">Live feeds from</p>
              <p className="text-[11px] text-[#6B7B6E]/55" style={{ fontFamily: "'Geist Mono', monospace" }}>FAO · IFAD · CGIAR · WFP · World Bank · AfDB</p>
            </div>
          </div>
        </Reveal>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative max-w-[340px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7B6E]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…"
              className="w-full bg-white border border-border rounded-full pl-9 pr-4 py-2 text-[13px] text-[#0C1F14] placeholder:text-[#6B7B6E]/55 outline-none focus:border-[rgba(27,67,50,0.35)] transition-colors" />
          </div>
          <div className="flex flex-wrap gap-2">
            <SrcChip src="All" active={activeSrc === "All"} onClick={() => setActiveSrc("All")} />
            {allSrcs.map(s => <SrcChip key={s} src={s} active={activeSrc === s} onClick={() => setActiveSrc(activeSrc === s ? "All" : s)} />)}
          </div>
        </div>
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-5">
            {feat && <ArticleCard article={feat} featured />}
            {rest.length > 0 && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{rest.map(a => <ArticleCard key={a.id} article={a} />)}</div>}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <p className="text-[16px] text-[#6B7B6E] mb-2">No matching articles</p>
            <button onClick={() => { setActiveSrc("All"); setSearch(""); }} className="text-[13px] text-[#1B4332] font-medium hover:underline">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
}

const PARTNER_GROUPS = [
  { label: "Development partners", partners: ["IFC", "Mastercard Foundation", "AGRA", "FAO", "USAID"] },
  { label: "Financial partners", partners: ["AfDB", "Rabobank", "British International Investment", "FMO"] },
  { label: "Technology partners", partners: ["Google Cloud", "Esri Africa", "Safaricom", "MTN Group"] },
];
function PartnersSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-y border-border">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="text-center mb-14">
          <Label>Partners & backers</Label>
          <p className="text-[16px] text-[#6B7B6E] mt-3 max-w-[360px] mx-auto">Building alongside the organisations shaping Africa's food future.</p>
        </Reveal>
        <div className="flex flex-col gap-10">
          {PARTNER_GROUPS.map(g => (
            <Reveal key={g.label}>
              <p className="text-[10px] text-[#6B7B6E]/50 uppercase tracking-widest mb-4" style={{ fontFamily: "'Geist Mono', monospace" }}>{g.label}</p>
              {/* Partner pills hidden until real partners are confirmed — headings only for now */}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCTASection() {
  const { open } = useModal();
  return (
    <section className="py-20 md:py-24 px-6 xl:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="relative bg-[#0C1F14] rounded-3xl overflow-hidden">
          <GridBg />
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-8 pointer-events-none hidden lg:block">
            <IntelligenceLayerDiagram mode="cta" size={600} />
          </div>
          <div className="absolute top-0 right-0 w-[38%] h-full opacity-12 hidden lg:block pointer-events-none">
            <img src={px(IMG.warehouse, 700, 600)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C1F14] to-transparent" />
          </div>
          <div className="relative z-10 px-8 md:px-16 py-16 md:py-20">
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
              <div>
                <Label>Join the network</Label>
                <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[40px] md:text-[56px] lg:text-[68px] leading-[1.01] tracking-[-0.012em] text-white mt-4 mb-5 max-w-[680px]">
                  Ready to plug into Africa's post-harvest future?
                </h2>
                <p className="text-[16px] text-white/46 max-w-[440px] leading-relaxed">Whether you are a farmer, aggregator, processor, buyer, logistics provider, financier or development partner — there is a place for you on the Lucent Ag network.</p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <DemoBtn className="text-[14px] px-8 py-4 justify-center" />
                <button onClick={() => open("contact")} className="inline-flex items-center justify-center gap-2 border border-white/15 text-white text-[14px] font-medium px-8 py-4 rounded-full hover:bg-white/8 hover:border-white/28 transition-all">Contact our team</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <ChallengeSection />
      <EcosystemSection />
      <PlatformSection />
      <HowItWorksSection />
      <OurPrinciplesSection />
      <FoodSystemsSection />
      <WhoWeWorkWithSection />
      <OurImpactSection />
      <IntelligenceSection />
      <PartnersSection />
      <HomeCTASection />
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ABOUT PAGE SECTIONS
// ═════════════════════════════════════════════════════════════════════════════

function AboutHero() {
  const { ref, inView } = useInView(0.05);
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden bg-[#0C1F14]">
      <GridBg />
      <div className="absolute inset-0">
        <img src={px(IMG.aerialField, 1600, 900)} alt="" className="w-full h-full object-cover opacity-22" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14] via-[#0C1F14]/70 to-[#0C1F14]/30" />
      </div>
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-12 pointer-events-none hidden xl:block">
        <IntelligenceLayerDiagram mode="cta" size={700} />
      </div>
      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10 pt-36 pb-24"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "opacity 1s ease, transform 1s ease" }}>
        <div className="flex items-center gap-2 mb-10">
          <span className="text-[11px] text-white/30" style={{ fontFamily: "'Geist Mono', monospace" }}>Lucent Ag</span>
          <span className="text-[11px] text-white/20">/</span>
          <span className="text-[11px] text-[#C8922A]" style={{ fontFamily: "'Geist Mono', monospace" }}>About</span>
        </div>
        <div className="inline-flex items-center gap-2 border border-[rgba(200,146,42,0.28)] rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8922A]" />
          <span className="text-[11px] font-medium text-[#C8922A] tracking-wide" style={{ fontFamily: "'Geist Mono', monospace" }}>About Lucent Ag</span>
        </div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-[52px] sm:text-[68px] lg:text-[88px] leading-[0.97] tracking-[-0.02em] text-white max-w-[900px] mb-8">
          Building the intelligence layer Africa's food system deserves.
        </h1>
        <p className="text-[17px] md:text-[19px] text-white/50 leading-[1.68] max-w-[560px]">
          Founded on a simple conviction: the barriers between Africa's harvests and its markets are problems of connectivity, visibility and trust — and they are solvable.
        </p>
        <div className="flex flex-wrap gap-3 mt-10">
          {["Est. 2023", "African-built", "Global ambition", "0 active markets"].map(b => (
            <div key={b} className="flex items-center gap-1.5 border border-white/12 rounded-full px-3.5 py-1.5">
              <span className="w-1 h-1 rounded-full bg-[#C8922A]" />
              <span className="text-[11.5px] text-white/50" style={{ fontFamily: "'Geist Mono', monospace" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurStory() {
  return (
    <div>
      {/* ── Chapter 01: A Curious Little Girl ─────────────────────────────── */}
      <section className="bg-[#F6F3EE] py-28 md:py-36 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
          <Reveal className="mb-20">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#C8922A]"
              style={{ fontFamily: "'Geist Mono', monospace" }}>Our story</span>
          </Reveal>
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-24 items-center">
            <Reveal className="order-2 lg:order-1 flex flex-col gap-7">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[9px] tracking-[0.25em] text-[#C8922A]/60 uppercase"
                  style={{ fontFamily: "'Geist Mono', monospace" }}>01 — 05</span>
                <div className="h-px flex-1 bg-[#C8922A]/20" />
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-[42px] md:text-[56px] lg:text-[64px] leading-[1.04] tracking-[-0.01em] text-[#0C1F14] italic">
                A Curious Little Girl
              </h2>
              <p className="text-[17px] text-[#6B7B6E] leading-[1.76] max-w-[420px]">
                She was eight years old the first time she noticed the contradiction. Walking with her mother through the noise and colour of a Lagos market — mountains of tomatoes, towers of yam, crates of mangoes heavy with ripeness — she saw abundance everywhere she looked.
              </p>
              <p className="text-[17px] text-[#6B7B6E] leading-[1.76] max-w-[420px]">
                And then, on the walk home, she saw neighbours who went without.
              </p>
              <div className="w-10 h-0.5 bg-[#C8922A]/40 rounded-full mt-2" />
            </Reveal>
            <Reveal delay={140} className="order-1 lg:order-2 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_24px_80px_rgba(12,31,20,0.18)]">
                <img src={px(IMG.market, 800, 1000)} alt="Vibrant West African street market, abundant with fresh produce" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14]/35 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10.5px] text-white/55 leading-snug" style={{ fontFamily: "'Geist Mono', monospace" }}>
                    A Lagos morning market — where the story begins
                  </p>
                </div>
              </div>
              {/* Floating accent */}
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#C8922A]/8 blur-2xl pointer-events-none" />
              <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-[#1B4332]/6 blur-3xl pointer-events-none" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Chapter 02: Two Different Realities ───────────────────────────── */}
      <section className="bg-[#EAE6DE] py-28 md:py-36 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
          <Reveal className="mb-16 flex items-center gap-4">
            <span className="text-[9px] tracking-[0.25em] text-[#C8922A]/60 uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>02 — 05</span>
            <div className="h-px w-14 bg-[#C8922A]/25" />
            <span className="text-[9px] tracking-[0.25em] text-[#0C1F14]/30 uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>Two Different Realities</span>
          </Reveal>

          {/* Split image panel */}
          <Reveal className="grid md:grid-cols-2 rounded-3xl overflow-hidden mb-16 shadow-[0_16px_56px_rgba(12,31,20,0.12)]">
            <div className="relative h-72 md:h-[520px] overflow-hidden">
              <img src={px(IMG.harvest, 700, 700)} alt="Overflowing baskets of fresh harvested produce" className="w-full h-full object-cover scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C1F14]/40" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] text-white/70 uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>Abundance</p>
                <p className="text-[14px] text-white/80 mt-1 leading-snug">Millions of tonnes grown every season across the continent.</p>
              </div>
            </div>
            <div className="relative h-72 md:h-[520px] overflow-hidden">
              <img src={px(IMG.community, 700, 700)} alt="Families at market, carefully selecting what they can afford" className="w-full h-full object-cover scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C1F14]/45" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] text-white/70 uppercase tracking-wider" style={{ fontFamily: "'Geist Mono', monospace" }}>And yet</p>
                <p className="text-[14px] text-white/80 mt-1 leading-snug">Families still go without — not for lack of food, but lack of connection.</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="max-w-[680px] mx-auto text-center">
            <p className="text-[18px] md:text-[22px] text-[#0C1F14]/60 leading-[1.7]" style={{ fontFamily: "'Instrument Serif', serif" }}>
              The gap was not between what Africa grew and what Africa needed. It was the distance between a harvest and a meal — measured in broken supply chains, missing information, and absent finance.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Chapter 03: The Question ───────────────────────────────────────── */}
      <section className="bg-[#0C1F14] py-36 md:py-52 relative overflow-hidden">
        <GridBg />
        {/* Decorative grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10">
          <Reveal className="flex items-center gap-4 mb-16 justify-center">
            <span className="text-[9px] tracking-[0.25em] text-[#C8922A]/50 uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>03 — 05</span>
            <div className="h-px w-14 bg-[#C8922A]/20" />
          </Reveal>
          <Reveal>
            <div className="w-14 h-0.5 bg-[#C8922A]/50 mx-auto mb-12 rounded-full" />
            <h2 style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-[46px] sm:text-[62px] md:text-[78px] lg:text-[92px] leading-[1.04] tracking-[-0.02em] text-white text-center italic max-w-[900px] mx-auto">
              How can abundance and hunger exist at the same time?
            </h2>
            <div className="w-14 h-0.5 bg-[#C8922A]/50 mx-auto mt-12 rounded-full" />
          </Reveal>
          <Reveal delay={200} className="mt-16 text-center">
            <p className="text-[13px] text-white/25 tracking-[0.18em] uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>
              A question she carried for the next two decades
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Chapter 04: From One Question to One Mission ──────────────────── */}
      <section className="bg-[#F6F3EE] py-28 md:py-36 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
          <Reveal className="flex items-center gap-4 mb-20">
            <span className="text-[9px] tracking-[0.25em] text-[#C8922A]/60 uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>04 — 05</span>
            <div className="h-px w-14 bg-[#C8922A]/25" />
            <span className="text-[9px] tracking-[0.25em] text-[#0C1F14]/30 uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>From One Question to One Mission</span>
          </Reveal>
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-center">
            <Reveal>
              <h2 style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-[52px] md:text-[68px] lg:text-[80px] leading-[1.02] tracking-[-0.015em] text-[#0C1F14] mb-8">
                No one should go hungry.
              </h2>
              <div className="w-16 h-0.5 bg-[#C8922A]/50 mb-8 rounded-full" />
              <p className="text-[17px] text-[#6B7B6E] leading-[1.76] mb-6 max-w-[440px]">
                That question — carried since childhood — became a mission. Not in spite of Africa's agricultural potential, but because of it.
              </p>
              <p className="text-[17px] text-[#6B7B6E] leading-[1.76] max-w-[440px]">
                Lucent Ag was founded to build the infrastructure that closes the gap between harvest and market — reducing food loss, improving food security, and strengthening the livelihoods of every farmer, aggregator, buyer and community in between.
              </p>
            </Reveal>
            <Reveal delay={140} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_24px_80px_rgba(12,31,20,0.14)]">
                <img src={px(IMG.aerialCrops, 800, 1000)} alt="Aerial view of thriving African crop fields at dawn" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/55 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <blockquote style={{ fontFamily: "'Instrument Serif', serif" }}
                    className="text-[20px] text-white/90 italic leading-snug">
                    "Every harvest deserves a market. Every farmer deserves to prosper."
                  </blockquote>
                </div>
              </div>
              {/* Floating accent stats */}
              <div className="absolute -left-6 top-1/3 bg-white rounded-2xl shadow-[0_8px_32px_rgba(12,31,20,0.12)] border border-border p-5 hidden lg:flex flex-col gap-1">
                <span style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[32px] text-[#1B4332] leading-none">40%</span>
                <span className="text-[11px] text-[#6B7B6E] max-w-[100px] leading-tight">of Africa's harvests lost before reaching consumers</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Chapter 05: The Journey Continues ────────────────────────────── */}
      <section className="bg-[#1B4332] py-28 md:py-36 overflow-hidden relative">
        <GridBg />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10">
          <Reveal className="flex items-center gap-4 mb-16">
            <span className="text-[9px] tracking-[0.25em] text-[#C8922A]/60 uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>05 — 05</span>
            <div className="h-px w-14 bg-[#C8922A]/30" />
            <span className="text-[9px] tracking-[0.25em] text-white/20 uppercase"
              style={{ fontFamily: "'Geist Mono', monospace" }}>The Journey Continues</span>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-start mb-20">
            <Reveal>
              <h2 style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-[38px] md:text-[52px] leading-[1.1] text-white mb-8">
                Building together, across a continent.
              </h2>
              <p className="text-[16px] text-white/50 leading-[1.76] mb-6 max-w-[380px]">
                No single actor can solve a continental challenge alone. Lucent Ag is building with farmers, businesses, governments, researchers and development partners — connecting every part of the food system into one intelligent, equitable network.
              </p>
              <div className="flex flex-col gap-3 mb-10">
                {["Smallholder farmers & cooperatives", "Aggregators & processors", "Institutional buyers & exporters", "Development finance institutions", "Governments & policy makers"].map((actor, i) => (
                  <div key={actor} className="flex items-center gap-3"
                    style={{ opacity: 0, animation: `ilFadeUp 0.6s ease forwards ${300 + i * 80}ms` }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C8922A] shrink-0" />
                    <span className="text-[14px] text-white/60">{actor}</span>
                  </div>
                ))}
              </div>
              <DemoBtn className="text-[14px] px-7 py-4" />
            </Reveal>

            <Reveal delay={120} className="grid grid-cols-2 gap-3">
              {[
                { img: IMG.teamWork,    alt: "Team collaboration in the field", offset: "" },
                { img: IMG.collab,      alt: "Partnership meeting across cultures", offset: "mt-8" },
                { img: IMG.greenField,  alt: "Vast green agricultural landscape", offset: "-mt-4" },
                { img: IMG.community,   alt: "Community gathering and connection", offset: "mt-4" },
              ].map(({ img, alt, offset }) => (
                <div key={img} className={`relative rounded-2xl overflow-hidden ${offset}`}>
                  <img src={px(img, 420, 360)} alt={alt} className="w-full h-44 md:h-56 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14]/30 to-transparent" />
                </div>
              ))}
            </Reveal>
          </div>

          {/* End-of-story CTA */}
          <Reveal>
            <div className="border-t border-white/10 pt-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="text-[12px] text-white/30 tracking-[0.14em] uppercase mb-3"
                  style={{ fontFamily: "'Geist Mono', monospace" }}>Continue the story with us</p>
                <h3 style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="text-[28px] md:text-[36px] text-white leading-snug max-w-[460px]">
                  Every actor in Africa's food system has a role to play. What is yours?
                </h3>
              </div>
              <div className="shrink-0">
                <DemoBtn className="text-[15px] px-8 py-4" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function MissionVision() {
  return (
    <section className="bg-[#0C1F14] py-28 md:py-36 relative overflow-hidden">
      <GridBg />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-14"><Label>Mission & vision</Label></Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-white/8">
          {[
            { tag: "Mission", headline: "Connect every actor in Africa's post-harvest economy through one intelligent operating system.", body: "We measure success by post-harvest losses prevented, smallholders reached, credit originated and market access created — not by users or transactions." },
            { tag: "Vision", headline: "A continent where every harvest finds its highest-value market and every farmer accesses formal finance.", body: "Africa's food systems become resilient, efficient and equitable — and Lucent Ag is the infrastructure that makes it possible." },
          ].map((item, i) => (
            <Reveal key={item.tag} delay={i * 150} className="bg-[#0C1F14] p-10 md:p-14 flex flex-col gap-6">
              <span className="text-[10px] text-[#C8922A] uppercase tracking-widest font-semibold" style={{ fontFamily: "'Geist Mono', monospace" }}>{item.tag}</span>
              <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[28px] md:text-[36px] leading-[1.15] text-white">{item.headline}</h3>
              <p className="text-[15px] text-white/45 leading-relaxed">{item.body}</p>
              <div className="mt-auto pt-6 border-t border-white/8"><div className="w-8 h-0.5 bg-[#C8922A]/60 rounded-full" /></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPrinciples() {
  return (
    <section className="bg-[#EAE6DE] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16 max-w-[520px]">
          <Label>Principles</Label>
          <Heading className="mt-4">The convictions that shape how we build.</Heading>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(27,67,50,0.1)]">
          {PRINCIPLES_HOME.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 65} className="bg-[#EAE6DE] hover:bg-white p-8 md:p-10 flex flex-col gap-5 transition-colors duration-200 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 group-hover:bg-[#1B4332] flex items-center justify-center transition-colors duration-200">
                <Icon className="w-[18px] h-[18px] text-[#1B4332] group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-[15.5px] font-semibold text-[#0C1F14] leading-snug">{title}</h3>
              <p className="text-[14px] text-[#6B7B6E] leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowWeWork() {
  const pillars = [
    { Icon: Brain,     tag: "01", title: "Artificial Intelligence",   desc: "Machine learning models power quality grading, demand forecasting, credit scoring and logistics optimisation — continuously improving as the network grows." },
    { Icon: Satellite, tag: "02", title: "Satellite Intelligence",    desc: "Orbital imagery provides crop yield estimates, field-level monitoring and regional supply forecasts — visible even where roads are not." },
    { Icon: Zap,       tag: "03", title: "IoT & Sensor Networks",     desc: "Connected weighbridges, temperature sensors, GPS trackers and moisture meters stream real-time data from every point in the chain." },
    { Icon: Warehouse, tag: "04", title: "Mini Hub Infrastructure",   desc: "Our verified collection hubs are the physical-digital interface where raw commodity enters the intelligent network — graded, tagged and receipted." },
    { Icon: Globe,     tag: "05", title: "Digital Marketplace",       desc: "A verified trade network matching buyers and sellers by commodity, grade, volume and delivery window — with embedded contracts and escrow." },
    { Icon: Truck,     tag: "06", title: "Logistics Intelligence",    desc: "Route optimisation, load matching, GPS consignment tracking and cold-chain monitoring across a network of verified transport partners." },
    { Icon: Scale,     tag: "07", title: "Embedded Finance",          desc: "Credit scoring, working capital, crop insurance and invoice financing triggered by verified activity on the platform — no collateral required." },
  ];
  return (
    <section className="bg-[#0C1F14] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>How we work</Label>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <Heading light className="max-w-[520px]">Seven technologies. One platform.</Heading>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/8">
          {pillars.map(({ Icon, tag, title, desc }, i) => (
            <Reveal key={title} delay={i * 55} className={`bg-[#0C1F14] hover:bg-white/5 p-8 flex flex-col gap-5 transition-colors duration-200 group cursor-default ${i === 6 ? "md:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/6 group-hover:bg-[#C8922A]/15 flex items-center justify-center transition-colors">
                  <Icon className="w-[18px] h-[18px] text-white/45 group-hover:text-[#C8922A] transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-white/20 mt-1" style={{ fontFamily: "'Geist Mono', monospace" }}>{tag}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white/80 group-hover:text-white leading-snug transition-colors">{title}</h3>
              <p className="text-[13.5px] text-white/38 group-hover:text-white/55 leading-relaxed transition-colors">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const HUB_STEPS = [
  { Icon: Truck,       num: "01", title: "Produce Reception",    desc: "Farm vehicles arrive at the hub. Each lot is registered on the platform: crop type, origin farm, GPS location and farmer ID logged in under 60 seconds." },
  { Icon: Weight,      num: "02", title: "Digital Weighing",     desc: "IoT-connected certified scales capture gross and net weight directly to the platform with tamper-evident logging and automatic discrepancy alerts." },
  { Icon: BarChart3,   num: "03", title: "AI Quality Grading",   desc: "Computer vision cameras and NIR spectrometers assess moisture, colour, size and defects. The system assigns standardised commodity grades in real time." },
  { Icon: QrCode,      num: "04", title: "QR Traceability Tag",  desc: "Each lot receives a unique QR-coded label linking it to its full provenance record: farm, field, inputs, grade, weight and handling history." },
  { Icon: Thermometer, num: "05", title: "Temporary Storage",    desc: "Produce is routed to ambient or refrigerated storage based on commodity type. IoT sensors monitor temperature and humidity; excursions trigger alerts." },
  { Icon: ArrowRight,  num: "06", title: "Dispatch & Matching",  desc: "The platform matches each lot to the optimal buyer in real time, allocates a verified logistics partner and issues a digital consignment note." },
];

function MiniHubDetail() {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <section className="bg-[#F6F3EE] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-14">
          <div className="inline-flex items-center gap-2 bg-[#C8922A]/10 border border-[#C8922A]/25 rounded-full px-4 py-1.5 mb-5">
            <span className="text-[11px]">⬡</span>
            <Label>Mini Hub</Label>
          </div>
          <Heading className="max-w-[620px]">Where the physical and digital supply chains meet.</Heading>
        </Reveal>
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div className="flex flex-col gap-2">
            {HUB_STEPS.map((step, i) => (
              <button key={step.num} onClick={() => setActiveStep(i)}
                className={`flex items-start gap-4 p-5 rounded-xl text-left transition-all duration-200 group ${activeStep === i ? "bg-[#1B4332] shadow-[0_4px_20px_rgba(27,67,50,0.22)]" : "bg-white border border-border hover:border-[rgba(27,67,50,0.25)] hover:shadow-sm"}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${activeStep === i ? "bg-[#C8922A]" : "bg-[#1B4332]/8 group-hover:bg-[#1B4332]/14"}`}>
                  <step.Icon className={`w-4 h-4 transition-colors ${activeStep === i ? "text-white" : "text-[#1B4332]"}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9.5px] font-semibold tracking-widest ${activeStep === i ? "text-[#C8922A]" : "text-[#6B7B6E]"}`} style={{ fontFamily: "'Geist Mono', monospace" }}>{step.num}</span>
                    <h4 className={`text-[14px] font-semibold leading-snug ${activeStep === i ? "text-white" : "text-[#0C1F14]"}`}>{step.title}</h4>
                  </div>
                  {activeStep === i && <p className="text-[13px] text-white/60 leading-relaxed mt-2" style={{ animation: "ilFadeUp 0.25s ease" }}>{step.desc}</p>}
                </div>
              </button>
            ))}
          </div>
          <Reveal className="lg:sticky lg:top-24">
            <div className="relative rounded-2xl overflow-hidden border border-border h-72 md:h-[540px] bg-[#EAE6DE]">
              <img src={px(IMG.processing, 800, 700)} alt="Inside a Lucent Ag Mini Hub facility" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6" key={activeStep} style={{ animation: "ilFadeUp 0.25s ease" }}>
                <span className="text-[10px] text-[#C8922A]" style={{ fontFamily: "'Geist Mono', monospace" }}>STEP {HUB_STEPS[activeStep].num} / 06</span>
                <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[22px] text-white leading-snug mt-1">{HUB_STEPS[activeStep].title}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-1.5">
                {HUB_STEPS.map((_, i) => (
                  <button key={i} onClick={() => setActiveStep(i)}
                    className={`rounded-full transition-all ${activeStep === i ? "bg-[#C8922A] w-4 h-1.5" : "bg-white/30 hover:bg-white/60 w-1.5 h-1.5"}`} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutLeadership() {
  const { open } = useModal();
  return (
    <section className="bg-white py-28 md:py-36 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Leadership</Label>
          <Heading className="mt-4 max-w-[580px]">A team taking shape around a consequential mission.</Heading>
        </Reveal>
        {/* Founder/CEO — featured, sits above the rest of the team */}
        <Reveal className="mb-6">
          <div className="bg-[#1B4332] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C8922A]/45 shrink-0">
              <img src={leaders[0].image} alt={leaders[0].name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#C8922A] uppercase tracking-widest" style={{ fontFamily: "'Geist Mono', monospace" }}>{leaders[0].role}</span>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-1.5 gap-y-1 text-[12px] text-white/60 mt-3"
                style={{ fontFamily: "'Geist Mono', monospace" }}>
                {leaders[0].tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && <span className="w-1 h-1 rounded-full bg-[#C8922A]/50" />}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        {/* Advisors and remaining open seats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
  {Array.from({ length: 5 }).map((_, i) => {
    const leader = leaders[i + 1];

    if (leader) {
      return (
        <Reveal
          key={leader.name + i}
          delay={i * 80}
          className="border border-border rounded-2xl p-8 flex flex-col items-center text-center gap-4 hover:border-[rgba(27,67,50,0.25)] hover:shadow-sm transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border border-border">
            <img
              src={leader.image}
              alt={leader.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs text-[#6B7B6E]">{leader.role}</div>
          </div>
          <div
            className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-1 text-[11px] text-[#6B7B6E]/70"
            style={{ fontFamily: "'Geist Mono', monospace" }}
          >
            {leader.tags.map((tag, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span className="w-1 h-1 rounded-full bg-[#C8922A]/40" />}
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      );
    }

    // fallback placeholder for empty slots
    return (
      <Reveal
        key={i}
        delay={i * 80}
        className="border border-border rounded-2xl p-8 flex flex-col items-center text-center gap-4 hover:border-[rgba(27,67,50,0.25)] hover:shadow-sm transition-all duration-200"
      >
        <div className="w-16 h-16 rounded-full bg-[#EAE6DE] border border-border flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[rgba(27,67,50,0.1)]" />
        </div>
        <div>
          <div className="w-24 h-3 bg-[#EAE6DE] rounded-full mb-2 mx-auto" />
          <div className="w-16 h-2.5 bg-[#EAE6DE]/70 rounded-full mx-auto" />
        </div>
        <div
          className="flex items-center gap-1.5 text-[11px] text-[#6B7B6E]/50"
          style={{ fontFamily: "'Geist Mono', monospace" }}
        >
          <span className="w-1 h-1 rounded-full bg-[#C8922A]/40" />
          Profile coming soon
        </div>
      </Reveal>
    );
  })}
</div>
        <Reveal className="bg-[#F6F3EE] rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-start gap-8 border border-border">
          <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[24px] text-[#0C1F14] mb-3">We are assembling the team that this mission deserves.</h3>
            <p className="text-[15px] text-[#6B7B6E] leading-relaxed max-w-[580px]">Executive profiles will be published as we formalise our leadership structure. If you believe you have a role to play in transforming Africa's post-harvest economy, we would very much like to hear from you.</p>
          </div>
          <button onClick={() => open("contact")} className="shrink-0 inline-flex items-center gap-2 bg-[#1B4332] text-white text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-[#143527] transition-colors self-start">
            Get in touch <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function AboutCareersPreview() {
  const roles = [
    { title: "Head of Product — Intelligence Layer", location: "Nairobi, Kenya · Hybrid", type: "Full-time", dept: "Product" },
    { title: "Senior Software Engineer — Data Platform", location: "Lagos, Nigeria · Remote", type: "Full-time", dept: "Engineering" },
    { title: "Agri-Finance Partnerships Lead", location: "Accra, Ghana · Hybrid", type: "Full-time", dept: "Partnerships" },
  ];
  return (
    <section id="careers" className="bg-[#1B4332] py-28 md:py-36 relative overflow-hidden">
      <GridBg />
      <div className="absolute inset-0 opacity-12 pointer-events-none">
        <img src={px(IMG.aerialCrops, 1600, 700)} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1B4332]/80" />
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-14">
          <Label>Careers</Label>
          <Heading light className="mt-4 max-w-[620px]">Join us in building the operating system for Africa's post-harvest economy.</Heading>
        </Reveal>
        <div className="flex flex-col gap-3 mb-10">
          {roles.map((role, i) => (
            <Reveal key={role.title} delay={i * 80} className="group bg-white/5 hover:bg-white/10 border border-white/12 hover:border-white/22 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 cursor-pointer">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold text-[#C8922A] bg-[#C8922A]/15 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Geist Mono', monospace" }}>{role.dept}</span>
                  <span className="text-[10px] text-white/35" style={{ fontFamily: "'Geist Mono', monospace" }}>{role.type}</span>
                </div>
                <h4 className="text-[15.5px] font-semibold text-white group-hover:text-[#C8922A] transition-colors">{role.title}</h4>
                <div className="flex items-center gap-1.5 mt-1"><MapPin className="w-3 h-3 text-white/35" /><span className="text-[12px] text-white/40">{role.location}</span></div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12.5px] text-white/45 group-hover:text-white transition-colors">View role</span>
                <ArrowRight className="w-4 h-4 text-white/35 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="text-[12px] text-white/30 mb-5" style={{ fontFamily: "'Geist Mono', monospace" }}>Roles above are illustrative. All openings subject to confirmation.</p>
          <a href="#" className="inline-flex items-center gap-2 border border-white/22 text-white text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/8 hover:border-white/35 transition-all">View all openings <ArrowRight className="w-4 h-4" /></a>
        </Reveal>
      </div>
    </section>
  );
}

function AboutCTA() {
  const { open } = useModal();
  const cards = [
    { Icon: BarChart3,     label: "Request a Demo",         desc: "See the Lucent Ag platform in action. We'll walk you through the intelligence layer, the trade network and the finance rail.", cta: "Book a demo",          primary: true },
    { Icon: Users,         label: "Partner with Lucent Ag", desc: "Whether you are a development organisation, financial institution or logistics operator, there is a partnership model for you.", cta: "Start a conversation", primary: false },
    { Icon: MessageSquare, label: "Contact Us",              desc: "Press enquiries, investor relations, technical questions or general correspondence. We respond to every message.", cta: "Get in touch",          primary: false },
  ];
  return (
    <section className="py-20 md:py-28 px-6 xl:px-10 bg-[#F6F3EE]">
      <div className="max-w-[1280px] mx-auto">
        <Reveal className="text-center mb-12">
          <Label>Work with us</Label>
          <Heading className="mt-4 max-w-[560px] mx-auto">Ready to take the next step?</Heading>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map(({ Icon, label, desc, cta, primary }, i) => (
            <Reveal key={label} delay={i * 90} className={`rounded-2xl p-8 flex flex-col gap-5 border transition-all duration-200 hover:shadow-[0_8px_32px_rgba(27,67,50,0.12)] ${primary ? "bg-[#1B4332] border-[#1B4332]" : "bg-white border-border hover:border-[rgba(27,67,50,0.25)]"}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${primary ? "bg-white/12" : "bg-[#1B4332]/8"}`}>
                <Icon className={`w-5 h-5 ${primary ? "text-white" : "text-[#1B4332]"}`} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className={`text-[17px] font-semibold mb-2 ${primary ? "text-white" : "text-[#0C1F14]"}`} style={{ fontFamily: "'Instrument Serif', serif" }}>{label}</h3>
                <p className={`text-[14px] leading-relaxed ${primary ? "text-white/60" : "text-[#6B7B6E]"}`}>{desc}</p>
              </div>
              {cta === "Get in touch" ? (
                <button onClick={() => open("contact")} className={`mt-auto inline-flex items-center gap-2 text-[13px] font-medium transition-all group ${primary ? "text-[#C8922A] hover:gap-3" : "text-[#1B4332] hover:gap-3"}`}>
                  {cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <a href="#" className={`mt-auto inline-flex items-center gap-2 text-[13px] font-medium transition-all group ${primary ? "text-[#C8922A] hover:gap-3" : "text-[#1B4332] hover:gap-3"}`}>
                  {cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <AboutPrinciples />
      <HowWeWork />
      <MiniHubDetail />
      <AboutLeadership />
      <AboutCareersPreview />
      <AboutCTA />
    </>
  );
}
// ═════════════════════════════════════════════════════════════════════════════
// TEAM PAGE SECTIONS
// ═════════════════════════════════════════════════════════════════════════════

function TeamHero({ navigate }: { navigate: (p: Page) => void }) {
  const { ref, inView } = useInView(0.05);
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0C1F14]">
      <GridBg />
      <div className="absolute inset-0">
        <img src={px(IMG.teamWork, 1600, 1000)} alt="" className="w-full h-full object-cover opacity-18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14] via-[#0C1F14]/75 to-[#0C1F14]/40" />
      </div>
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 pointer-events-none hidden xl:block">
        <IntelligenceLayerDiagram mode="cta" size={700} />
      </div>
      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10 pt-32 pb-24"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "opacity 1s ease, transform 1s ease" }}>
        <div className="flex items-center gap-2 mb-10">
          <button onClick={() => navigate("home")} className="text-[11px] text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "'Geist Mono', monospace" }}>Lucent Ag</button>
          <span className="text-[11px] text-white/20">/</span>
          <span className="text-[11px] text-[#C8922A]" style={{ fontFamily: "'Geist Mono', monospace" }}>Team</span>
        </div>
        <div className="inline-flex items-center gap-2 border border-[rgba(200,146,42,0.28)] rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8922A]" />
          <span className="text-[11px] font-medium text-[#C8922A] tracking-wide" style={{ fontFamily: "'Geist Mono', monospace" }}>People & partnerships</span>
        </div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-[52px] sm:text-[68px] lg:text-[88px] leading-[0.97] tracking-[-0.02em] text-white max-w-[880px] mb-8">
          The people and partnerships building Africa's food systems infrastructure.
        </h1>
        <p className="text-[17px] md:text-[19px] text-white/50 leading-[1.68] max-w-[520px] mb-10">
          Lucent Ag is built by people who believe in the transformative power of well-connected food systems — and in Africa's capacity to lead that transformation.
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <DemoBtn className="text-[14px] px-6 py-3.5" />
          <button onClick={() => navigate("team")}
            className="inline-flex items-center gap-2 border border-white/18 text-white text-[14px] font-medium px-6 py-3.5 rounded-full hover:bg-white/8 hover:border-white/30 transition-all duration-200">
            Join our team <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function LeadershipPlaceholders() {
  const BASE_SLOTS = 5; // advisors + open seats form the base row(s) beneath the CEO
  const ceo = LEADERS[0];

  return (
    <section className="bg-[#F6F3EE] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Leadership</Label>
          <Heading className="mt-4 max-w-[560px]">Building a world-class team around a consequential problem.</Heading>
          <p className="text-[15px] text-[#6B7B6E] mt-5 max-w-[480px] leading-relaxed">We are assembling leaders with deep experience in agri-systems, technology, finance and impact. Profiles are published progressively as the team formalises.</p>
        </Reveal>

        {/* Apex: Founder/CEO sits alone at the top, forming a triangle with the row below */}
        <Reveal className="flex justify-center mb-5">
          <div className="w-full max-w-sm bg-white border border-border rounded-2xl p-7 flex flex-col items-center text-center gap-4 hover:border-[rgba(27,67,50,0.22)] hover:shadow-sm transition-all duration-200">
            <img src={ceo.image} alt={ceo.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#C8922A]/40" />
            <div>
              <p className="text-[13px] font-semibold text-[#0C1F14] mb-1.5">{ceo.role}</p>
              <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-1 text-[10px] text-[#6B7B6E]" style={{ fontFamily: "'Geist Mono', monospace" }}>
                {ceo.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && <span className="w-1 h-1 rounded-full bg-[#C8922A]/50" />}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex justify-center mb-5">
          <div className="w-px h-8 bg-[rgba(27,67,50,0.18)]" />
        </div>

        {/* Base: advisors and open seats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {Array.from({ length: BASE_SLOTS }).map((_, i) => {
            const leader = LEADERS[i + 1];

            return (
              <Reveal
                key={`slot-${i}`}
                delay={i * 65}
                className="bg-white border border-border rounded-2xl p-6 flex items-center gap-5 hover:border-[rgba(27,67,50,0.22)] hover:shadow-sm transition-all duration-200 group"
              >
                {leader?.image ? (
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-14 h-14 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EAE6DE] border border-border shrink-0 flex items-center justify-center group-hover:border-[rgba(27,67,50,0.2)] transition-colors">
                    <div className="w-7 h-7 rounded-full bg-[rgba(27,67,50,0.08)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0C1F14] mb-1">
                    {leader?.role ?? ""}
                  </p>

                  {leader ? (
                    <div
                      className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] text-[#6B7B6E]"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                    >
                      {leader.tags.map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1.5">
                          {idx > 0 && <span className="w-1 h-1 rounded-full bg-[#C8922A]/50" />}
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {!leader && (
                  <div
                    className="shrink-0 text-[10px] text-[#6B7B6E]/45 text-right"
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                  >
                    Coming<br />soon
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal className="bg-[#0C1F14] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[22px] md:text-[28px] text-white mb-3">Know someone who should be on this list?</h3>
            <p className="text-[14px] text-white/50 leading-relaxed">We are actively seeking leaders in agri-technology, supply chain finance, AI and pan-African business development. Introductions are always welcome.</p>
          </div>
          <a href="#" className="shrink-0 inline-flex items-center gap-2 bg-[#C8922A] text-white text-[14px] font-medium px-6 py-3.5 rounded-full hover:bg-[#b07d22] transition-all">
            Make an introduction <ArrowRight className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function CrossFunctionalExpertise() {
  const DOMAINS = [
    { Icon: Leaf,          title: "Agricultural Systems",      desc: "Agronomy, post-harvest science, smallholder dynamics and African food value chains.", color: "#1B4332" },
    { Icon: Code,          title: "Software Engineering",      desc: "Platform architecture, mobile-first design, IoT integration and AI/ML systems.", color: "#2D6A4F" },
    { Icon: Scale,         title: "Financial Technology",      desc: "Embedded lending, digital payments, credit scoring and agricultural insurance design.", color: "#40916C" },
    { Icon: FlaskConical,  title: "Data Science & Analytics",  desc: "Satellite intelligence, demand forecasting, commodity pricing models and impact measurement.", color: "#1B4332" },
    { Icon: Truck,         title: "Supply Chain & Logistics",  desc: "Cold chain management, route optimisation, cross-border trade and last-mile delivery.", color: "#2D6A4F" },
    { Icon: GraduationCap, title: "Policy & Development",      desc: "Impact finance, development economics, government relations and multi-stakeholder platforms.", color: "#40916C" },
  ];
  return (
    <section className="bg-[#0C1F14] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Cross-functional expertise</Label>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <Heading light className="max-w-[500px]">Built across disciplines that food systems demand.</Heading>
            <p className="text-[15px] text-white/38 max-w-[320px] leading-relaxed">Solving post-harvest loss requires agriculture, technology, finance and policy expertise working in concert.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAINS.map(({ Icon, title, desc, color }, i) => (
            <Reveal key={title} delay={i * 65}
              className="bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/16 rounded-2xl p-8 flex flex-col gap-5 transition-all duration-200 group cursor-default">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
                <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold text-white leading-snug">{title}</h3>
              <p className="text-[13.5px] text-white/45 leading-relaxed group-hover:text-white/60 transition-colors">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdvisoryBoard() {
  const { open } = useModal();
  const DOMAINS_ADV = ["Agri-Finance & Capital Markets", "Food Systems Policy", "Agricultural Technology", "African Development Economics"];
  return (
    <section className="bg-[#F6F3EE] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Advisory board</Label>
          <Heading className="mt-4 max-w-[580px]">Guided by expertise across the full food system spectrum.</Heading>
          <p className="text-[15px] text-[#6B7B6E] mt-5 max-w-[520px] leading-relaxed">Our Advisory Board brings world-class expertise in agri-finance, food systems, technology and policy. Advisors are onboarded as Lucent Ag's strategic needs evolve.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {DOMAINS_ADV.map((domain, i) => (
            <Reveal key={domain} delay={i * 75}
              className="bg-white border border-border rounded-2xl p-7 flex flex-col gap-4 hover:border-[rgba(27,67,50,0.22)] hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-full bg-[#EAE6DE] border border-border flex items-center justify-center">
                <Star className="w-5 h-5 text-[#C8922A]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="w-16 h-2.5 bg-[#EAE6DE] rounded-full mb-3" />
                <div className="w-24 h-2 bg-[#EAE6DE]/70 rounded-full mb-4" />
              </div>
              <span className="text-[11px] font-semibold text-[#6B7B6E] border border-border rounded-full px-2.5 py-1 inline-block" style={{ fontFamily: "'Geist Mono', monospace" }}>{domain}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="bg-[#EAE6DE] rounded-2xl p-8 md:p-12 flex items-center gap-6 border border-border">
          <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-[#C8922A]" strokeWidth={1.5} />
          </div>
          <p className="text-[15px] text-[#6B7B6E] leading-relaxed flex-1">Advisor profiles are published as advisory relationships formalise. If you have deep expertise in food systems, agri-finance or pan-African development and wish to explore an advisory role, we would welcome a conversation.</p>
          <button onClick={() => open("contact")} className="shrink-0 inline-flex items-center gap-2 text-[13px] font-medium text-[#1B4332] border-b border-[rgba(27,67,50,0.22)] pb-0.5 hover:border-[#1B4332] transition-colors whitespace-nowrap">
            Contact us <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function GlobalPartnerNetwork() {
  const PARTNER_TYPES = [
    { Icon: Building2,  label: "Development Finance",    desc: "Institutions committed to scaling impact in African food systems." },
    { Icon: BookOpen,   label: "Research Institutions",  desc: "Academic and applied research shaping evidence-based food policy." },
    { Icon: Scale,      label: "Financial Services",     desc: "Banks, MFIs and insurers deploying capital into the agri value chain." },
    { Icon: Satellite,  label: "Technology Partners",    desc: "Infrastructure providers enabling our satellite and IoT capabilities." },
    { Icon: Landmark,   label: "Government & Policy",    desc: "National agencies and regional bodies advancing food security mandates." },
    { Icon: Heart,      label: "Civil Society",          desc: "NGOs and community organisations amplifying grassroots participation." },
  ];
  return (
    <section className="bg-white py-28 md:py-36 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Global partner network</Label>
          <Heading className="mt-4 max-w-[580px]">A growing network of mission-aligned partners.</Heading>
          <p className="text-[15px] text-[#6B7B6E] mt-5 max-w-[520px] leading-relaxed">No single organisation can transform Africa's food systems alone. We build with a diverse ecosystem of partners committed to the same outcomes.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {PARTNER_TYPES.map(({ Icon, label, desc }, i) => (
            <Reveal key={label} delay={i * 65}
              className="flex items-start gap-5 p-7 rounded-2xl border border-border bg-[#F6F3EE] hover:bg-white hover:border-[rgba(27,67,50,0.22)] hover:shadow-sm transition-all group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-[#1B4332]/8 group-hover:bg-[#1B4332] flex items-center justify-center shrink-0 transition-colors">
                <Icon className="w-5 h-5 text-[#1B4332] group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14.5px] font-semibold text-[#0C1F14] mb-1.5">{label}</h3>
                <p className="text-[13px] text-[#6B7B6E] leading-snug">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden h-52 border border-border bg-[#EAE6DE]">
            <img src={px(IMG.portOps, 1400, 420)} alt="Global food logistics network" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C1F14]/60 via-[#0C1F14]/20 to-transparent" />
            <div className="absolute inset-0 flex items-center px-10">
              <div>
                <p className="text-[11px] text-[#C8922A] mb-2" style={{ fontFamily: "'Geist Mono', monospace" }}>GEOGRAPHIC REACH</p>
                <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[28px] md:text-[36px] text-white leading-snug">Active across 6 markets.<br />Expanding to 20 by 2027.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OurCommitments() {
  const COMMITMENTS = [
    { Icon: Sprout,      title: "Environmental Responsibility", desc: "We track the environmental footprint of every supply chain we touch — supporting carbon reduction, climate resilience and sustainable land use practices.", color: "#3F7E44" },
    { Icon: Users,       title: "Gender & Social Inclusion",   desc: "Our platform is designed for equal access. Women farmers, women entrepreneurs and marginalised communities receive equal onboarding support, pricing information and financial access.", color: "#DD1367" },
    { Icon: ShieldCheck, title: "Data Privacy & Sovereignty",  desc: "Farmer data belongs to farmers. We are committed to data sovereignty principles: participants control what is shared, how it is used and who benefits from it.", color: "#1B4332" },
    { Icon: Award,       title: "Transparency & Accountability", desc: "We will publish regular, independently verified impact reports measuring post-harvest loss reduction, livelihoods created and market access expanded — not vanity metrics.", color: "#C8922A" },
  ];
  return (
    <section className="bg-[#0C1F14] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-16">
          <Label>Our commitments</Label>
          <Heading light className="mt-4 max-w-[520px]">Held to a higher standard. By design.</Heading>
          <p className="text-[15px] text-white/45 mt-5 max-w-[480px] leading-relaxed">Impact companies are not measured only by what they build. They are measured by how they build — and who benefits.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {COMMITMENTS.map(({ Icon, title, desc, color }, i) => (
            <Reveal key={title} delay={i * 80}
              className="rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 p-9 flex flex-col gap-5 transition-all group cursor-default">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
                <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
              </div>
              <h3 className="text-[16px] font-semibold text-white leading-snug">{title}</h3>
              <p className="text-[14px] text-white/45 leading-relaxed group-hover:text-white/58 transition-colors">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InclusiveCulture() {
  const STATS = [
    { val: "12+", label: "Languages spoken" },
    { val: "6",   label: "Countries represented" },
    { val: "100%", label: "Remote-first" },
    { val: "50%",  label: "Women in leadership target" },
  ];
  return (
    <section className="bg-[#EAE6DE] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <Label>Inclusive culture</Label>
            <Heading className="mt-4 max-w-[460px]">As diverse as the continent we serve.</Heading>
            <p className="text-[15.5px] text-[#6B7B6E] mt-6 leading-relaxed">We believe that the best solutions to Africa's food system challenges will come from people who understand those challenges from the inside. Lucent Ag is proudly pan-African in its hiring, pan-African in its design, and global in its ambition.</p>
            <div className="grid grid-cols-2 gap-4 mt-10">
              {STATS.map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-border p-6">
                  <div style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[36px] text-[#0C1F14] leading-none mb-1">{s.val}</div>
                  <div className="text-[12px] text-[#6B7B6E]">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="grid grid-cols-2 gap-3">
            {[IMG.community, IMG.collab, IMG.harvest, IMG.cityAfrica].map((img, i) => (
              <div key={img} className={`relative rounded-2xl overflow-hidden border border-border ${i === 1 ? "mt-8" : ""} ${i === 3 ? "-mt-8" : ""}`}>
                <img src={px(img, 420, 360)} alt="Life at Lucent Ag" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14]/20 to-transparent" />
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function LifeAtLucentAg() {
  const PERKS = [
    { Icon: Globe,     label: "Remote-first",          desc: "Work from anywhere across Africa and beyond." },
    { Icon: BookOpen,  label: "Learning & growth",     desc: "Dedicated budget for courses, conferences and research." },
    { Icon: Heart,     label: "Mission-driven",        desc: "Your work has measurable impact on millions of lives." },
    { Icon: Users,     label: "Collaborative team",    desc: "Cross-functional squads that think and build together." },
    { Icon: Coffee,    label: "Human-first culture",   desc: "Flexible hours, generous leave and real work-life balance." },
    { Icon: TrendingUp,label: "Equity participation",  desc: "Share in the value you help to create." },
  ];
  return (
    <section className="bg-[#F6F3EE] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="text-center mb-16">
          <Label>Life at Lucent Ag</Label>
          <Heading className="mt-4 max-w-[560px] mx-auto">Built for people who want their work to matter.</Heading>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {PERKS.map(({ Icon, label, desc }, i) => (
            <Reveal key={label} delay={i * 60}
              className="bg-white border border-border rounded-2xl p-7 flex items-start gap-5 hover:border-[rgba(27,67,50,0.22)] hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#1B4332]/8 group-hover:bg-[#1B4332] flex items-center justify-center shrink-0 transition-colors">
                <Icon className="w-4.5 h-4.5 text-[#1B4332] group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14.5px] font-semibold text-[#0C1F14] mb-1">{label}</h3>
                <p className="text-[13px] text-[#6B7B6E] leading-snug">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Photo strip */}
        <Reveal className="relative rounded-2xl overflow-hidden h-64 border border-border">
          <img src={px(IMG.teamWork, 1400, 500)} alt="Team collaborating at Lucent Ag" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1F14]/55 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-end px-8 pb-8">
            <blockquote style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[20px] md:text-[26px] text-white max-w-[500px] leading-snug italic">
              "We are not building an app. We are building the infrastructure Africa's food system needs to thrive."
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function JoinOurJourney() {
  const ROLES = [
    { title: "Senior Product Manager — Commerce Layer", location: "Nairobi, Kenya · Hybrid", type: "Full-time", dept: "Product" },
    { title: "Machine Learning Engineer — Quality Grading", location: "Remote · Africa-based preferred", type: "Full-time", dept: "Engineering" },
    { title: "Head of Government Relations", location: "Accra, Ghana or Lagos, Nigeria", type: "Full-time", dept: "Policy" },
    { title: "Agri-Logistics Partnership Manager", location: "Dar es Salaam, Tanzania · Hybrid", type: "Full-time", dept: "Partnerships" },
  ];
  return (
    <section className="bg-[#1B4332] py-28 md:py-36 relative overflow-hidden">
      <GridBg />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img src={px(IMG.aerialCrops, 1600, 700)} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1B4332]/80" />
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="mb-14">
          <Label>Join our journey</Label>
          <Heading light className="mt-4 max-w-[620px]">We are looking for people energised by hard problems.</Heading>
          <p className="text-[16px] text-white/50 mt-5 max-w-[500px] leading-relaxed">If you want your skills to have impact at a continental scale — and you are comfortable operating in ambiguity — we would love to hear from you.</p>
        </Reveal>
        <div className="flex flex-col gap-3 mb-10">
          {ROLES.map((role, i) => (
            <Reveal key={role.title} delay={i * 70}
              className="group bg-white/5 hover:bg-white/10 border border-white/12 hover:border-white/22 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 cursor-pointer">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold text-[#C8922A] bg-[#C8922A]/15 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Geist Mono', monospace" }}>{role.dept}</span>
                  <span className="text-[10px] text-white/35" style={{ fontFamily: "'Geist Mono', monospace" }}>{role.type}</span>
                </div>
                <h4 className="text-[15px] font-semibold text-white group-hover:text-[#C8922A] transition-colors">{role.title}</h4>
                <div className="flex items-center gap-1.5 mt-1"><MapPin className="w-3 h-3 text-white/35" /><span className="text-[12px] text-white/40">{role.location}</span></div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12.5px] text-white/45 group-hover:text-white transition-colors">Apply</span>
                <ArrowRight className="w-4 h-4 text-white/35 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="text-[12px] text-white/30 mb-5" style={{ fontFamily: "'Geist Mono', monospace" }}>Roles are illustrative. All openings subject to confirmation. We also welcome speculative applications.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" className="inline-flex items-center gap-2 border border-white/22 text-white text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/8 hover:border-white/35 transition-all">All openings <ArrowRight className="w-4 h-4" /></a>
            <a href="#" className="inline-flex items-center gap-2 text-white/55 text-[14px] font-medium px-6 py-3 hover:text-white transition-colors">Send a speculative application <ChevronRight className="w-4 h-4" /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TeamContactCTA() {
  return (
    <section className="py-20 md:py-28 px-6 xl:px-10 bg-[#F6F3EE]">
      <div className="max-w-[1280px] mx-auto">
        <div className="relative bg-[#0C1F14] rounded-3xl overflow-hidden">
          <GridBg />
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-8 pointer-events-none hidden lg:block">
            <IntelligenceLayerDiagram mode="cta" size={500} />
          </div>
          <div className="relative z-10 px-8 md:px-16 py-16 md:py-20">
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <Label>Get in touch</Label>
                <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[36px] md:text-[52px] leading-[1.04] text-white mt-4 mb-4 max-w-[580px]">
                  Let's explore what's possible together.
                </h2>
                <p className="text-[16px] text-white/45 max-w-[440px] leading-relaxed">Whether you want a demo, a partnership conversation, a media briefing or an introduction — we respond to every message.</p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <DemoBtn className="text-[14px] px-8 py-4 justify-center" />
                <a href="mailto: dami@lucentag.com"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white text-[14px] font-medium px-8 py-4 rounded-full hover:bg-white/8 hover:border-white/28 transition-all">
                  dami@lucentag.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <TeamHero navigate={navigate} />
      <LeadershipPlaceholders />
      <CrossFunctionalExpertise />
      <AdvisoryBoard />
      <GlobalPartnerNetwork />
      <OurCommitments />
      <InclusiveCulture />
      <LifeAtLucentAg />
      <JoinOurJourney />
      <TeamContactCTA />
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ECOSYSTEM / SOLUTIONS / INTELLIGENCE / CAREERS PAGES
// ═════════════════════════════════════════════════════════════════════════════

function PageHero({ navigate, crumb, badge, title, subtitle, img }: {
  navigate: (p: Page) => void; crumb: string; badge: string; title: string; subtitle: string; img: string;
}) {
  const { ref, inView } = useInView(0.05);
  return (
    <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden bg-[#0C1F14]">
      <GridBg />
      <div className="absolute inset-0">
        <img src={px(img, 1600, 900)} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14] via-[#0C1F14]/72 to-[#0C1F14]/35" />
      </div>
      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6 xl:px-10 pt-32 pb-20"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "opacity 1s ease, transform 1s ease" }}>
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate("home")} className="text-[11px] text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "'Geist Mono', monospace" }}>Lucent Ag</button>
          <span className="text-[11px] text-white/20">/</span>
          <span className="text-[11px] text-[#C8922A]" style={{ fontFamily: "'Geist Mono', monospace" }}>{crumb}</span>
        </div>
        <div className="inline-flex items-center gap-2 border border-[rgba(200,146,42,0.28)] rounded-full px-4 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8922A]" />
          <span className="text-[11px] font-medium text-[#C8922A] tracking-wide" style={{ fontFamily: "'Geist Mono', monospace" }}>{badge}</span>
        </div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-[44px] sm:text-[58px] lg:text-[72px] leading-[1.0] tracking-[-0.02em] text-white max-w-[820px] mb-6">
          {title}
        </h1>
        <p className="text-[16px] md:text-[18px] text-white/50 leading-[1.68] max-w-[540px]">{subtitle}</p>
      </div>
    </section>
  );
}

function EcosystemPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <PageHero navigate={navigate} crumb="Ecosystem" badge="The network"
        title="Every actor in Africa's food system, on one connected network."
        subtitle="From smallholder farms to financial institutions, Lucent Ag links every participant in the value chain into a single, verified network."
        img={IMG.aerialCrops} />
      <EcosystemSection />
      <WhoWeWorkWithSection />
      <TeamContactCTA />
    </>
  );
}

const SOLUTIONS_ROLES = ["farmers", "aggregators", "processors", "buyers", "finance"]
  .map(id => IL_NODES.find(n => n.id === id)!);

function SolutionsSection() {
  return (
    <section className="py-28 md:py-36 bg-[#F6F3EE]">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-10">
        <Reveal className="text-center mb-16">
          <Label>Solutions by role</Label>
          <Heading className="mt-4 max-w-[640px] mx-auto">Purpose-built value for every participant.</Heading>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS_ROLES.map((n, i) => (
            <Reveal key={n.id} delay={i * 80} className="bg-white rounded-2xl border border-border p-8 flex flex-col gap-5 hover:border-[rgba(27,67,50,0.22)] hover:shadow-[0_8px_28px_rgba(27,67,50,0.1)] transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#1B4332]/8 flex items-center justify-center">
                <n.Icon className="w-5 h-5 text-[#1B4332]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[20px] text-[#0C1F14] mb-2">For {n.label} {n.sub}</h3>
                <p className="text-[14px] text-[#6B7B6E] leading-relaxed">{n.details[0]}</p>
              </div>
              <DemoBtn className="text-[13px] px-4 py-2 mt-auto self-start" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionsPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <PageHero navigate={navigate} crumb="Solutions" badge="Built for every role"
        title="Solutions designed around how you actually work."
        subtitle="Whether you grow, aggregate, process, buy or finance — Lucent Ag gives you the tools built for your role in the food system."
        img={IMG.market} />
      <SolutionsSection />
      <TeamContactCTA />
    </>
  );
}

function IntelligencePage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <PageHero navigate={navigate} crumb="Intelligence" badge="Data & research"
        title="The intelligence layer behind every decision on the network."
        subtitle="Satellite imagery, IoT sensors and market signals — fused with curated research from the organisations shaping Africa's food future."
        img={IMG.satellite} />
      <IntelligenceSection />
      <TeamContactCTA />
    </>
  );
}

function CareersPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <PageHero navigate={navigate} crumb="Careers" badge="Join the team"
        title="Help build the operating system for Africa's post-harvest economy."
        subtitle="We're a small, focused team solving one of the continent's most consequential infrastructure problems. Here's where we're hiring."
        img={IMG.teamWork} />
      <AboutCareersPreview />
      <TeamContactCTA />
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// REQUEST A DEMO MODAL
// ═════════════════════════════════════════════════════════════════════════════
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9000] flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
      style={{ backgroundColor: "rgba(12,31,20,0.72)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div onClick={e => e.stopPropagation()} className="w-full md:w-auto">
        {children}
      </div>
    </div>
  );
}

const ROLES = ["Farmer / Cooperative", "Aggregator / Processor", "Buyer / Exporter", "Financer / Investor", "Government / Policy", "Researcher / NGO", "Press / Media", "Other"];

const LUCENT_AG_EMAIL = "dami@lucentag.com";

function buildMailtoLink(to: string, subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .filter(([, v]) => v && v.trim() !== "")
    .map(([label, v]) => `${label}: ${v}`)
    .join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function DemoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", org: "", role: "", country: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const demoRequest = {
      "First name": form.firstName,
      "Last name": form.lastName,
      "Email": form.email,
      "Organisation": form.org,
      "Country": form.country,
      "Role": form.role,
      "What they'd like to explore": form.message,
    };
    const mailto = buildMailtoLink(LUCENT_AG_EMAIL, `Demo request — ${form.org || `${form.firstName} ${form.lastName}`.trim()}`, demoRequest);
    setTimeout(() => {
      window.location.href = mailto;
      setSubmitting(false);
      setStep("success");
    }, 1400);
  };

  const inputCls = "w-full bg-[#F6F3EE] border border-[rgba(27,67,50,0.15)] rounded-xl px-4 py-3 text-[14px] text-[#0C1F14] placeholder:text-[#6B7B6E]/50 outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/20 transition-all";

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full md:w-[600px] max-h-[95vh] md:max-h-[90vh] bg-white md:rounded-3xl overflow-hidden flex flex-col shadow-[0_32px_96px_rgba(12,31,20,0.28)]">
        {step === "form" ? (
          <>
            <div className="bg-[#0C1F14] px-8 py-7 flex items-start justify-between shrink-0">
              <div>
                <Label>Request a Demo</Label>
                <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[26px] text-white mt-1 leading-tight">
                  See Lucent Ag in action.
                </h2>
                <p className="text-[13px] text-white/40 mt-1 max-w-[340px]">Tell us a little about yourself and we will be in touch within one business day.</p>
              </div>
              <button onClick={onClose} className="mt-0.5 text-white/30 hover:text-white transition-colors shrink-0 ml-6">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-8 py-7 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>First name *</label>
                  <input required value={form.firstName} onChange={set("firstName")} placeholder="Amara" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Last name *</label>
                  <input required value={form.lastName} onChange={set("lastName")} placeholder="Okonkwo" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Email address *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="amara@company.com" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Organisation *</label>
                  <input required value={form.org} onChange={set("org")} placeholder="Company name" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Country</label>
                  <input value={form.country} onChange={set("country")} placeholder="Nigeria" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Your role *</label>
                <select required value={form.role} onChange={set("role")}
                  className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="">Select your role</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>What would you like to explore? (optional)</label>
                <textarea value={form.message} onChange={set("message")} rows={3}
                  placeholder="Tell us about your use case or the challenge you are working to solve..."
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#C8922A] text-white font-medium rounded-xl py-3.5 text-[14px] hover:bg-[#b07d22] transition-all disabled:opacity-60">
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                  ) : (
                    <>Request your demo <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-[11px] text-center text-[#6B7B6E]/50 mt-3">We respect your privacy. No spam, ever.</p>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-10 py-16 min-h-[440px]">
            <div className="w-16 h-16 rounded-full bg-[#1B4332] flex items-center justify-center mb-7 shadow-[0_8px_32px_rgba(27,67,50,0.28)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[32px] text-[#0C1F14] mb-4 leading-tight">
              You're on the list.
            </h2>
            <p className="text-[15px] text-[#6B7B6E] leading-relaxed max-w-[320px] mb-8">
              Thank you, {form.firstName}. Someone from our team will reach out within one business day. We look forward to showing you what Lucent Ag can do.
            </p>
            <button onClick={onClose}
              className="inline-flex items-center gap-2 bg-[#0C1F14] text-white text-[13px] font-medium px-6 py-3 rounded-full hover:bg-[#1B4332] transition-colors">
              Back to site <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </ModalBackdrop>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", org: "", role: "", country: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const contactRequest = {
      "First name": form.firstName,
      "Last name": form.lastName,
      "Email": form.email,
      "Organisation": form.org,
      "Country": form.country,
      "Role": form.role,
      "Message": form.message,
    };
    const mailto = buildMailtoLink(LUCENT_AG_EMAIL, `Contact request — ${form.org || `${form.firstName} ${form.lastName}`.trim()}`, contactRequest);
    setTimeout(() => {
      window.location.href = mailto;
      setSubmitting(false);
      setStep("success");
    }, 1400);
  };

  const inputCls = "w-full bg-[#F6F3EE] border border-[rgba(27,67,50,0.15)] rounded-xl px-4 py-3 text-[14px] text-[#0C1F14] placeholder:text-[#6B7B6E]/50 outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/20 transition-all";

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full md:w-[600px] max-h-[95vh] md:max-h-[90vh] bg-white md:rounded-3xl overflow-hidden flex flex-col shadow-[0_32px_96px_rgba(12,31,20,0.28)]">
        {step === "form" ? (
          <>
            <div className="bg-[#0C1F14] px-8 py-7 flex items-start justify-between shrink-0">
              <div>
                <Label>Contact our team</Label>
                <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[26px] text-white mt-1 leading-tight">
                  Let's start a conversation.
                </h2>
                <p className="text-[13px] text-white/40 mt-1 max-w-[340px]">Tell us a little about yourself and what's on your mind — we will be in touch within one business day.</p>
              </div>
              <button onClick={onClose} className="mt-0.5 text-white/30 hover:text-white transition-colors shrink-0 ml-6">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-8 py-7 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>First name *</label>
                  <input required value={form.firstName} onChange={set("firstName")} placeholder="Amara" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Last name *</label>
                  <input required value={form.lastName} onChange={set("lastName")} placeholder="Okonkwo" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Email address *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="amara@company.com" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Organisation *</label>
                  <input required value={form.org} onChange={set("org")} placeholder="Company name" className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Country</label>
                  <input value={form.country} onChange={set("country")} placeholder="Nigeria" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>Your role *</label>
                <select required value={form.role} onChange={set("role")}
                  className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="">Select your role</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6B7B6E] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'Geist Mono', monospace" }}>How can we help? *</label>
                <textarea required value={form.message} onChange={set("message")} rows={3}
                  placeholder="Tell us what's on your mind — a question, a partnership idea, press enquiry..."
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#C8922A] text-white font-medium rounded-xl py-3.5 text-[14px] hover:bg-[#b07d22] transition-all disabled:opacity-60">
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                  ) : (
                    <>Send message <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-[11px] text-center text-[#6B7B6E]/50 mt-3">We respect your privacy. No spam, ever.</p>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-10 py-16 min-h-[440px]">
            <div className="w-16 h-16 rounded-full bg-[#1B4332] flex items-center justify-center mb-7 shadow-[0_8px_32px_rgba(27,67,50,0.28)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[32px] text-[#0C1F14] mb-4 leading-tight">
              Message sent.
            </h2>
            <p className="text-[15px] text-[#6B7B6E] leading-relaxed max-w-[320px] mb-8">
              Thank you, {form.firstName}. Someone from our team will get back to you within one business day.
            </p>
            <button onClick={onClose}
              className="inline-flex items-center gap-2 bg-[#0C1F14] text-white text-[13px] font-medium px-6 py-3 rounded-full hover:bg-[#1B4332] transition-colors">
              Back to site <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </ModalBackdrop>
  );
}

const OVERVIEW_VIDEO_URL = "https://res.cloudinary.com/malgek8m/video/upload/v1785399416/VID-20260729-WA0056_ejtthm.mp4";

function VideoModal({ onClose }: { onClose: () => void }) {
  const { open } = useModal();
  const [playing, setPlaying] = useState(false);

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full md:w-[860px] bg-[#0C1F14] md:rounded-3xl overflow-hidden shadow-[0_32px_96px_rgba(12,31,20,0.45)]">
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <LogoMark size={24} light />
            <div>
              <p className="text-[11px] text-white/30 leading-none" style={{ fontFamily: "'Geist Mono', monospace" }}>STAKEHOLDER OVERVIEW</p>
              <p className="text-[14px] text-white font-medium leading-none mt-0.5">Lucent Ag — Platform Overview</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-[#060F0A] overflow-hidden">
          {playing ? (
            <video src={OVERVIEW_VIDEO_URL} controls autoPlay className="w-full h-full object-contain bg-black" />
          ) : (
            <>
              <img src={px(IMG.aerialField, 1200, 675)} alt="Africa's agricultural landscapes" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-10 text-center">
                <button onClick={() => setPlaying(true)} aria-label="Play overview video"
                  className="w-20 h-20 rounded-full border-2 border-white/25 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:bg-white/12 hover:border-white/40 transition-all duration-200">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="ml-1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </button>
                <div>
                  <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[22px] text-white italic mb-2">Stakeholder Overview</p>
                  <p className="text-[13.5px] text-white/50 max-w-[420px] leading-relaxed">
                    Video available upon request
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F14]/60 to-transparent pointer-events-none" />
            </>
          )}
        </div>

        <div className="px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[13px] text-white/38 leading-relaxed max-w-[440px]">
            To receive the full stakeholder overview video, request a demo and our team will share access directly.
          </p>
          <button onClick={() => { onClose(); setTimeout(() => open("demo"), 50); }}
            className="shrink-0 inline-flex items-center gap-2 bg-[#C8922A] text-white text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-[#b07d22] transition-colors whitespace-nowrap">
            Request a Demo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Root
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [modal, setModal] = useState<ModalType>(null);

  const navigate = (target: Page) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = useCallback((m: ModalType) => setModal(m), []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <ModalCtx.Provider value={{ open: openModal, close: closeModal }}>
      <div className="bg-[#F6F3EE] text-[#0C1F14] overflow-x-hidden" style={{ fontFamily: "'Geist', sans-serif" }}>
        <style>{`
          @keyframes ilFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
          @keyframes ilSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes ilOrbit  { 0%,100%{stroke-opacity:.06} 50%{stroke-opacity:.18} }
          ::-webkit-scrollbar { display:none; }
          * { scrollbar-width:none; }
        `}</style>

        <GlobalNav page={page} navigate={navigate} />

        {page === "home"         && <HomePage />}
        {page === "about"        && <AboutPage />}
        {page === "team"         && <TeamPage navigate={navigate} />}
        {page === "ecosystem"    && <EcosystemPage navigate={navigate} />}
        {page === "solutions"    && <SolutionsPage navigate={navigate} />}
        {page === "intelligence" && <IntelligencePage navigate={navigate} />}
        {page === "careers"      && <CareersPage navigate={navigate} />}

        <SiteFooter navigate={navigate} />

        {modal === "demo" && <DemoModal onClose={closeModal} />}
        {modal === "contact" && <ContactModal onClose={closeModal} />}
        {modal === "video" && <VideoModal onClose={closeModal} />}
      </div>
    </ModalCtx.Provider>
  );
}
