"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { FlowSnapshot } from "@/lib/mock";
import { CountUp } from "./count-up";
import { fmtNum } from "@/lib/liff/format";

interface Scheme {
  bg: string;
  border: string;
  color: string;
  text: string;
}

const SCHEMES: Scheme[] = [
  { bg: "#fef0e8", border: "#fcd9c4", color: "#e07c4f", text: "#c4633a" }, // cafe
  { bg: "#eff6ff", border: "#bfdbfe", color: "#3b82f6", text: "#2563eb" }, // retail
  { bg: "#f0ecfe", border: "#ddd5fd", color: "#8b6cf7", text: "#7c3aed" }, // service
  { bg: "#eef1fe", border: "#dde3fc", color: "#5b7cf7", text: "#4a68d4" }, // entertainment
  { bg: "#f5f5f4", border: "#e7e5e4", color: "#a8a29e", text: "#78716c" }, // others
];
const STORE: Scheme = { bg: "#fef5e0", border: "#fde7a8", color: "#f59e0b", text: "#d97706" };

type FlowNodeData = {
  eyebrow?: string;
  label: string;
  value: string;
  scheme: Scheme;
  hasTarget?: boolean;
  hasSource?: boolean;
};

function FlowNode({ data }: NodeProps) {
  const d = data as FlowNodeData;
  return (
    <div
      style={{
        padding: "8px 14px",
        borderRadius: 12,
        border: `1.5px solid ${d.scheme.border}`,
        background: d.scheme.bg,
        textAlign: "center",
        minWidth: 104,
        boxShadow: "0 2px 8px rgba(0,0,0,.04)",
      }}
    >
      {d.hasTarget && (
        <Handle type="target" position={Position.Top} style={{ background: d.scheme.color, width: 7, height: 7, border: "2px solid #fff" }} />
      )}
      {d.eyebrow && (
        <div style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: ".7px", fontWeight: 600, color: d.scheme.text, opacity: 0.7 }}>
          {d.eyebrow}
        </div>
      )}
      <div style={{ fontSize: 12, fontWeight: 600, color: d.scheme.text }}>{d.label}</div>
      <div className="font-mono-num" style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-1px", color: d.scheme.color }}>
        {d.value}
      </div>
      {d.hasSource && (
        <Handle type="source" position={Position.Bottom} style={{ background: d.scheme.color, width: 7, height: 7, border: "2px solid #fff" }} />
      )}
    </div>
  );
}

const nodeTypes = { flowNode: FlowNode };

const cardCls =
  "relative overflow-hidden rounded-[var(--r)] border bg-[var(--surface)] shadow-[var(--shadow)]";
const sectionLabel =
  "mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider font-mono-num";

function spread(count: number, gap: number): number[] {
  const start = -((count - 1) / 2) * gap;
  return Array.from({ length: count }, (_, i) => start + i * gap);
}

export function FlowView({
  flow,
  storeVisits,
}: {
  flow: FlowSnapshot;
  storeVisits: number;
}) {
  const inbound = flow.categories.filter((c) => c.direction === "inbound");
  const outbound = flow.categories.filter((c) => c.direction === "outbound");

  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = [];
    const es: Edge[] = [];
    const inXs = spread(inbound.length, 150);
    const outXs = spread(outbound.length, 150);

    inbound.forEach((c, i) => {
      const scheme = SCHEMES[i % SCHEMES.length];
      ns.push({
        id: `in-${i}`,
        type: "flowNode",
        position: { x: inXs[i], y: 0 },
        data: { eyebrow: "Inbound", label: c.category, value: fmtNum(c.value), scheme, hasSource: true },
      });
      es.push({
        id: `e-in-${i}`,
        source: `in-${i}`,
        target: "store",
        animated: true,
        label: fmtNum(c.value),
        style: { stroke: scheme.color, strokeWidth: 1.5 },
        labelStyle: { fontSize: 10, fontWeight: 700, fill: scheme.text },
        labelBgStyle: { fill: "#fff" },
      });
    });

    ns.push({
      id: "store",
      type: "flowNode",
      position: { x: -56, y: 220 },
      data: { eyebrow: "My Store", label: "Store Visits", value: fmtNum(storeVisits), scheme: STORE, hasTarget: true, hasSource: true },
    });

    outbound.forEach((c, i) => {
      const scheme = SCHEMES[i % SCHEMES.length];
      ns.push({
        id: `out-${i}`,
        type: "flowNode",
        position: { x: outXs[i], y: 440 },
        data: { eyebrow: "Outbound", label: c.category, value: fmtNum(c.value), scheme, hasTarget: true },
      });
      es.push({
        id: `e-out-${i}`,
        source: "store",
        target: `out-${i}`,
        animated: true,
        label: fmtNum(c.value),
        style: { stroke: scheme.color, strokeWidth: 1.5 },
        labelStyle: { fontSize: 10, fontWeight: 700, fill: scheme.text },
        labelBgStyle: { fill: "#fff" },
      });
    });

    return { nodes: ns, edges: es };
  }, [inbound, outbound, storeVisits]);

  const totals = [
    { label: "Inbound", sub: "เข้ามา", value: flow.inbound, color: "var(--area)" },
    { label: "Internal", sub: "ภายใน", value: flow.internal, color: "var(--total)" },
    { label: "Outbound", sub: "ออกไป", value: flow.outbound, color: "var(--instore)" },
  ];

  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-10">
      {/* Totals */}
      <section className="liff-reveal">
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          Movement Totals
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {totals.map((t) => (
            <div key={t.label} className={`${cardCls} p-3 text-center`} style={{ borderColor: "var(--border)" }}>
              <div className="text-[11px] font-medium" style={{ color: "var(--text-2)" }}>{t.label}</div>
              <CountUp value={t.value} className="font-mono-num text-[22px] font-bold tracking-tight" />
              <div className="text-[10px]" style={{ color: "var(--text-3)" }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagram */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          Category Flow
        </div>
        <div className={`${cardCls}`} style={{ borderColor: "var(--border)" }}>
          <div style={{ height: 420 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.2}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              style={{ background: "transparent" }}
            >
              <Background gap={20} color="rgba(0,0,0,.04)" />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
        </div>
      </section>

      {/* Breakdown */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          Category Breakdown
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <BreakdownCard title="↓ Inbound" color="var(--area)" items={inbound} />
          <BreakdownCard title="↑ Outbound" color="var(--instore)" items={outbound} />
        </div>
      </section>
    </div>
  );
}

function BreakdownCard({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: { category: string; value: number }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className={`${cardCls} p-4`} style={{ borderColor: "var(--border)" }}>
      <div className="mb-2 text-[12px] font-semibold" style={{ color }}>{title}</div>
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <div key={it.category}>
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: "var(--text-2)" }}>{it.category}</span>
              <span className="font-mono-num font-bold" style={{ color }}>{fmtNum(it.value)}</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
              <div className="h-full rounded-full" style={{ width: `${(it.value / max) * 100}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
