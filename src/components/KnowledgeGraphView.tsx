/**
 * NutriSense - Nutrition Knowledge Graph Explorer (Chapter 12)
 * Interactive Neo4j-style Visual Graph with Node/Edge Inspector
 * and Cypher Query Simulator.
 */

import React, { useState } from 'react';
import { KG_NODES, KG_EDGES } from '../data/knowledgeGraphData';
import { KnowledgeGraphNode, KnowledgeGraphEdge } from '../types/nutrition';
import {
  Network,
  Filter,
  Terminal,
  Sparkles,
  Info,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';

export const KnowledgeGraphView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('bf_ascorbate');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [cypherQuery, setCypherQuery] = useState<string>(
    `MATCH (iron:Nutrient {name: 'Non-Heme Iron'})<-[:CONTAINS]-(food:Food)\nMATCH (vitC:Nutrient {name: 'Vitamin C'})-[:ENHANCES_ABSORPTION]->(iron)\nMATCH (vitCFood:Food)-[:CONTAINS]->(vitC)\nRETURN food.name AS PlantIron, vitCFood.name AS AscorbateSynergy`
  );
  const [queryResultText, setQueryResultText] = useState<string | null>(null);

  const selectedNode = KG_NODES.find((n) => n.id === selectedNodeId) || KG_NODES[0];

  // Connected edges
  const connectedEdges = KG_EDGES.filter(
    (e) => e.source === selectedNode.id || e.target === selectedNode.id
  );

  const filteredNodes =
    activeCategoryFilter === 'all'
      ? KG_NODES
      : KG_NODES.filter((n) => n.category.toLowerCase() === activeCategoryFilter.toLowerCase());

  // Category Colors
  const getCategoryColor = (category: KnowledgeGraphNode['category']) => {
    switch (category) {
      case 'Food':
        return { bg: 'fill-emerald-500', stroke: 'stroke-emerald-600', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
      case 'Nutrient':
        return { bg: 'fill-indigo-500', stroke: 'stroke-indigo-600', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' };
      case 'BioavailabilityFactor':
        return { bg: 'fill-amber-500', stroke: 'stroke-amber-600', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' };
      case 'CookingMethod':
        return { bg: 'fill-teal-500', stroke: 'stroke-teal-600', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-800' };
      case 'HealthCondition':
        return { bg: 'fill-rose-500', stroke: 'stroke-rose-600', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' };
      default:
        return { bg: 'fill-slate-500', stroke: 'stroke-slate-600', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-800' };
    }
  };

  const executeCypherQuery = (q: string) => {
    if (q.includes('ENHANCES_ABSORPTION') || q.includes('AscorbateSynergy')) {
      setQueryResultText(`
Cypher Execution Output (Neo4j GDS Engine):
Records matched: 4 multi-hop paths found (Execution time: 2.1ms)
┌─────────────────────────────────┬─────────────────────────────────┬──────────────────────────────────┐
│ PlantIron (Fe³⁺ Source)         │ AscorbateSynergy (Vit C Source) │ Absorption Multiplier            │
├─────────────────────────────────┼─────────────────────────────────┼──────────────────────────────────┤
│ Yellow Lentils (Moong Dal)      │ Fresh Lemon Juice               │ +350% duodenal bioavailability   │
│ Baby Spinach                    │ Red Bell Pepper                 │ +300% uptake (oxalate overcome)  │
│ Sprouted Moong                  │ Indian Gooseberry (Amla)        │ +400% maximal ionic reduction    │
│ Steamed Brown Rice              │ Broccoli Florets                │ +250% mineral chelation          │
└─────────────────────────────────┴─────────────────────────────────┴──────────────────────────────────┘
Scientific Annotation: Hallberg et al. (1989) Am J Clin Nutr; Sandberg (2002) Br J Nutr.`);
    } else if (q.includes('Retention') || q.includes('retention') || q.includes('CookingMethod')) {
      setQueryResultText(`
Cypher Execution Output (Gastronomy GDS Traversal):
Query: MATCH (f:Food {name: 'Baby Spinach'})-[:PREPARED_BY]->(cm:CookingMethod)-[:AFFECTS_RETENTION]->(rf:RetentionFactor)
Records matched: 4 cooking methods evaluated
┌────────────────────────┬──────────────────────────┬──────────────────────────┬───────────────────────┐
│ CookingMethod          │ Vitamin C Retention (%)  │ Folate Retention (%)     │ Leaching Classification│
├────────────────────────┼──────────────────────────┼──────────────────────────┼───────────────────────┤
│ Steaming               │ 85%                      │ 85%                      │ Low                   │
│ Sautéing with oil      │ 70%                      │ 70%                      │ Low (Micellar boost)  │
│ Raw                    │ 100%                     │ 100%                     │ None                  │
│ Boiling (Water)        │ 42%                      │ 50%                      │ High (Water Leached)  │
└────────────────────────┴──────────────────────────┴──────────────────────────┴───────────────────────┘
Reference: USDA Nutrient Retention Factors Release 6; Yuan et al. (2009).`);
    } else {
      setQueryResultText(`
Cypher Execution Output:
Traversal matched 12 entities and 18 typed directed relationships across the Neo4j ontology.
Path: (HealthProfile {anemia: true}) -[:MODIFIES_REQUIREMENT]-> (Non-Heme Iron) <-[:CONTAINS]- (Moong Dal)
Optimal pairing node: (Fresh Lemon Juice) -[:ENHANCES_ABSORPTION]-> (Non-Heme Iron).`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Chapter 12: Nutrition Knowledge Graph (NKG)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Multi-Hop Nutrition Knowledge Graph Explorer
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Neo4j graph modeling Food, Nutrients, Cooking Methods, Bioavailability Enhancers/Inhibitors, and Health Conditions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['all', 'food', 'nutrient', 'bioavailabilityfactor', 'cookingmethod', 'healthcondition'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize text-xs font-medium transition-colors ${
                activeCategoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all'
                ? 'All Nodes'
                : cat === 'bioavailabilityfactor'
                ? 'Bioavailability'
                : cat === 'cookingmethod'
                ? 'Cooking'
                : cat === 'healthcondition'
                ? 'Conditions'
                : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Visual Graph */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white shadow-md relative flex flex-col justify-between min-h-[460px]">
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300 pb-3 border-b border-slate-800">
            <span className="font-semibold text-slate-400">Graph Schema Categories:</span>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Food</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Nutrient</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Bioavailability Factor</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Cooking Method</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Health Condition</span>
              </span>
            </div>
          </div>

          {/* Visual SVG Nodes Grid */}
          <div className="py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-auto">
            {filteredNodes.map((node) => {
              const colors = getCategoryColor(node.category);
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/20 border-white shadow-md scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider truncate">
                      {node.category}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs leading-snug mt-1">
                    {node.label}
                  </div>
                  <p className="text-[10px] text-slate-300 line-clamp-2 mt-1">
                    {node.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>💡 Click any node to inspect multi-hop traversal relationships & citations.</span>
            <span className="text-slate-500">Total Entities: {KG_NODES.length} · Edges: {KG_EDGES.length}</span>
          </div>
        </div>

        {/* Right: Node Details Inspector & Cypher Console */}
        <div className="space-y-5">
          {/* Selected Node Details */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    getCategoryColor(selectedNode.category).badge
                  }`}
                >
                  {selectedNode.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">{selectedNode.label}</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                :{selectedNode.id}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{selectedNode.description}</p>

            {/* Connected Relationships */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Active Graph Edges ({connectedEdges.length}):
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {connectedEdges.map((edge) => {
                  const isSource = edge.source === selectedNode.id;
                  const otherNodeId = isSource ? edge.target : edge.source;
                  const otherNode = KG_NODES.find((n) => n.id === otherNodeId);

                  return (
                    <div
                      key={edge.id}
                      onClick={() => otherNode && setSelectedNodeId(otherNode.id)}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer text-xs space-y-1 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="text-emerald-600 font-mono">
                            {isSource ? `-${edge.relationship}->` : `<-${edge.relationship}-`}
                          </span>
                          <span>{otherNode?.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-700 font-medium capitalize">
                          {otherNode?.category}
                        </span>
                      </div>
                      {edge.evidence && (
                        <p className="text-[10px] text-slate-700 italic">{edge.evidence}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cypher Query Simulator (Chapter 12.5) */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>Neo4j Cypher Simulator (Chapter 12.5)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">neo4j://nutrisense-graph</span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              <button
                onClick={() => {
                  const q = `MATCH (iron:Nutrient {name: 'Non-Heme Iron'})<-[:CONTAINS]-(food:Food)\nMATCH (vitC:Nutrient {name: 'Vitamin C'})-[:ENHANCES_ABSORPTION]->(iron)\nMATCH (vitCFood:Food)-[:CONTAINS]->(vitC)\nRETURN food.name AS PlantIron, vitCFood.name AS AscorbateSynergy`;
                  setCypherQuery(q);
                  executeCypherQuery(q);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Query 1: Iron Synergy
              </button>
              <button
                onClick={() => {
                  const q = `MATCH (f:Food {name: 'Baby Spinach'})-[:PREPARED_BY]->(cm:CookingMethod)\nMATCH (cm)-[:AFFECTS_RETENTION]->(rf:RetentionFactor)-[:FOR_NUTRIENT]->(n:Nutrient {name: 'Vitamin C'})\nRETURN cm.method_name, rf.retention_percentage ORDER BY rf.retention_percentage DESC`;
                  setCypherQuery(q);
                  executeCypherQuery(q);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Query 2: Retention
              </button>
            </div>

            <textarea
              rows={3}
              value={cypherQuery}
              onChange={(e) => setCypherQuery(e.target.value)}
              className="w-full bg-slate-950 font-mono text-[11px] p-2.5 rounded-lg border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={() => executeCypherQuery(cypherQuery)}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Run Cypher Query</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {queryResultText && (
              <pre className="p-2.5 rounded bg-slate-950 text-[10px] text-slate-300 overflow-x-auto font-mono whitespace-pre border border-slate-800">
                {queryResultText}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
