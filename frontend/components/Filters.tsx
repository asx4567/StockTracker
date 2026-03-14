"use client"

import { Search, Calendar, ChevronDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface FiltersProps {
  metadata: {
    types: string[]
    stocks: { symbol: string; name: string }[]
    dates: string[]
    latest_date: string | null
  }
  filters: {
    type: string
    symbol: string
    company_name: string
    date: string
  }
  setFilters: (filters: any) => void
}

export default function Filters({ metadata, filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-6 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl mb-8">
      <div className="flex-1 min-w-[200px] relative">
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider ml-1">Symbol / Company</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full bg-white/50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={filters.company_name}
            onChange={(e) => setFilters({ ...filters, company_name: e.target.value })}
          />
        </div>
      </div>

      <div className="w-[180px] relative">
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider ml-1">Type</label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="w-full appearance-none bg-white/50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="All">All Types</option>
            {metadata.types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="w-[200px] relative">
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider ml-1">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="w-full appearance-none bg-white/50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          >
            {metadata.dates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
