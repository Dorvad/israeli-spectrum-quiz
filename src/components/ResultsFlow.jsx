import { useMemo } from 'react';
import { Background, ReactFlow, Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { cn, formatScore } from '@/lib/utils';

function ScoreNode({ data }) {
  const toneClass = data.tone === 'right'
    ? 'from-red-400/90 to-amber-200/90'
    : data.tone === 'left'
      ? 'from-cyan-300/90 to-blue-400/90'
      : 'from-white/90 to-fuchsia-200/90';

  return (
    <div className="relative min-w-44 rounded-[1.3rem] border border-white/[0.15] bg-slate-950/[0.85] p-4 text-right shadow-[0_18px_55px_rgba(0,0,0,.35)] backdrop-blur-xl">
      <Handle type="target" position={Position.Top} className="!border-0 !bg-cyan-200" />
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-fuchsia-200" />
      <div className={cn('absolute -right-2 -top-2 h-7 w-7 rounded-full bg-gradient-to-br shadow-[0_0_30px_rgba(255,255,255,.35)]', toneClass)} />
      <div className="text-xs font-black text-slate-400">{data.kicker}</div>
      <div className="mt-1 text-lg font-black text-white">{data.label}</div>
      <div className="mt-2 font-mono text-2xl font-black text-cyan-100">{formatScore(data.score)}</div>
      <Badge className="mt-2 bg-white/[0.05]">{data.classification}</Badge>
    </div>
  );
}

const nodeTypes = { score: ScoreNode };

const DIM_POSITIONS = [
  { x: -240, y: 220 },
  { x: 40, y: 220 },
  { x: -240, y: 420 },
  { x: 40, y: 420 },
];

export function ResultsFlow({ results }) {
  const { nodes, edges } = useMemo(() => {
    const finalNode = {
      id: 'final',
      type: 'score',
      position: { x: -100, y: 0 },
      data: {
        kicker: 'ציון משוקלל',
        label: results.classification,
        score: results.score,
        classification: 'סיכום כללי',
        tone: results.tone,
      }
    };

    const dimNodes = results.dimensions.map((dimension, index) => ({
      id: dimension.id,
      type: 'score',
      position: DIM_POSITIONS[index],
      data: {
        kicker: `${Math.round(dimension.weight * 100)}% מהמודל`,
        label: dimension.shortLabel,
        score: dimension.value,
        classification: dimension.classification,
        tone: dimension.tone,
      }
    }));

    const edges = dimNodes.map((node, index) => ({
      id: `final-${node.id}`,
      source: 'final',
      target: node.id,
      animated: true,
      style: {
        stroke: ['#67e8f9', '#f0abfc', '#fde047', '#f87171'][index],
        strokeWidth: 2,
        opacity: 0.72,
      }
    }));

    return { nodes: [finalNode, ...dimNodes], edges };
  }, [results]);

  return (
    <div className="relative h-[580px] overflow-hidden rounded-[2rem] border border-white/[0.10] bg-slate-950/[0.50] shadow-inner shadow-white/5">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={false}
        zoomOnScroll={false}
        preventScrolling={false}
        fitView
        fitViewOptions={{ padding: 0.24 }}
      >
        <Background color="rgba(255,255,255,.12)" gap={28} size={1} />
      </ReactFlow>
    </div>
  );
}
