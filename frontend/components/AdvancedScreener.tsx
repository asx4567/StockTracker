import { useState, useEffect } from "react"
import { Plus, Trash2, Filter, Settings2, X, Save, FolderOpen, History } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Rule {
  id: string
  left: string
  op: string
  right: string
  joiner: "AND" | "OR"
}

interface SavedFilter {
    name: string
    rules: Rule[]
}

interface AdvancedScreenerProps {
  rules: Rule[]
  setRules: (rules: Rule[]) => void
  onApply: () => void
}

const FIELDS = ["Price", "Open", "High", "Low", "Volume", "DMA20", "DMA50", "DMA100", "DMA200", "RSI", "MACD", "MACDSignal", "MACDHist"]
const OPERATORS = [">", "<", ">=", "<=", "=="]
const STORAGE_KEY = "mk-stock-filters"

export default function AdvancedScreener({ rules, setRules, onApply }: AdvancedScreenerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])

  // Load saved filters on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
        try {
            setSavedFilters(JSON.parse(saved))
        } catch (e) {
            console.error("Failed to parse saved filters")
        }
    }
  }, [])

  const addRule = () => {
    const newRule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      left: "Price",
      op: ">",
      right: "DMA20",
      joiner: "AND"
    }
    setRules([...rules, newRule])
  }

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id))
  }

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const handleSave = () => {
    if (!filterName.trim() || rules.length === 0) return
    
    const newFilters = [...savedFilters, { name: filterName, rules }]
    setSavedFilters(newFilters)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters))
    setFilterName("")
  }

  const deleteFilter = (index: number) => {
    const newFilters = savedFilters.filter((_, i) => i !== index)
    setSavedFilters(newFilters)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters))
  }

  return (
    <div className="mb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
          isOpen ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
        )}
      >
        <Settings2 className="w-4 h-4" />
        Advanced Screener
        <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] ml-1">{rules.length} Rules</span>
      </button>

      {isOpen && (
        <div className="mt-4 p-6 bg-white rounded-3xl border border-blue-100 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 max-w-4xl">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rule Builder Section */}
            <div className="lg:col-span-2 border-r border-gray-100 pr-0 lg:pr-8">
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Logical Rule Builder</h3>
                </div>

                <div className="space-y-4">
                    {rules.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm font-medium">No rules added yet. Click plus to start.</p>
                        </div>
                    )}
                    {rules.map((rule, idx) => {
                    const isValue = !FIELDS.includes(rule.right)
                    
                    return (
                        <div key={rule.id} className="relative">
                        {idx > 0 && (
                            <div className="flex items-center gap-2 mb-2 ml-4">
                            <div className="h-px bg-gray-100 flex-1" />
                            <select 
                                className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-[10px] font-black text-blue-600 outline-none hover:bg-white transition-all shadow-sm cursor-pointer"
                                value={rule.joiner}
                                onChange={(e) => updateRule(rule.id, { joiner: e.target.value as "AND" | "OR" })}
                            >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                            </select>
                            <div className="h-px bg-gray-100 flex-1" />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 group shadow-sm">
                            <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-400 mb-1 uppercase ml-1">Field</span>
                            <select 
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={rule.left}
                                onChange={(e) => updateRule(rule.id, { left: e.target.value })}
                            >
                                {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            </div>

                            <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-400 mb-1 uppercase ml-1">Op</span>
                            <select 
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={rule.op}
                                onChange={(e) => updateRule(rule.id, { op: e.target.value })}
                            >
                                {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            </div>

                            <div className="flex flex-col flex-1 min-w-[150px]">
                            <span className="text-[9px] font-black text-gray-400 mb-1 uppercase ml-1">Compare With</span>
                            <div className="flex items-center gap-2">
                                {isValue ? (
                                <input 
                                    type="number"
                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Value"
                                    value={rule.right}
                                    onChange={(e) => updateRule(rule.id, { right: e.target.value })}
                                />
                                ) : (
                                <select 
                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                                    value={rule.right}
                                    onChange={(e) => updateRule(rule.id, { right: e.target.value })}
                                >
                                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                                )}
                                
                                <button 
                                onClick={() => updateRule(rule.id, { right: isValue ? "Price" : "0" })}
                                className={cn(
                                    "p-2 rounded-lg border transition-all",
                                    isValue ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-blue-50 border-blue-200 text-blue-600"
                                )}
                                title={isValue ? "Switch to Field" : "Switch to Value"}
                                >
                                {isValue ? <span className="text-[10px] font-black">123</span> : <span className="text-[10px] font-black">ABC</span>}
                                </button>
                            </div>
                            </div>

                            <div className="flex flex-col self-end pb-1.5">
                            <button 
                                onClick={() => removeRule(rule.id)}
                                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            </div>
                        </div>
                        </div>
                    )
                    })}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                    <button 
                        onClick={addRule}
                        className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:translate-x-1 transition-transform"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Rule
                    </button>

                    <button 
                        onClick={onApply}
                        className="bg-gray-900 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                    >
                        Apply Screeners
                    </button>
                </div>
            </div>

            {/* Saved Filters Section */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <History className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Saved Filters</h3>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Save Current As</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Screen Name..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                        <button 
                            onClick={handleSave}
                            disabled={!filterName.trim() || rules.length === 0}
                            className="bg-white border border-gray-200 p-2 rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-all"
                        >
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {savedFilters.length === 0 && (
                        <p className="text-center py-8 text-gray-400 text-xs font-medium">No saved filters yet.</p>
                    )}
                    {savedFilters.map((filter, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 group transition-all">
                            <button 
                                onClick={() => setRules(filter.rules)}
                                className="flex-1 text-left"
                            >
                                <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{filter.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{filter.rules.length} Rules</p>
                            </button>
                            <button 
                                onClick={() => deleteFilter(i)}
                                className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
