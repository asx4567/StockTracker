"use client"

import { TrendingUp, LayoutGrid, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  activeTab: "dashboard" | "reports"
  setActiveTab: (tab: "dashboard" | "reports") => void
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="relative overflow-hidden bg-white border-b border-gray-100 px-6 py-8 md:px-12">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3 group hover:rotate-0 transition-transform duration-300">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
              Bharat Market <span className="text-blue-600">Trends</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">Financial Freedom For All</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-2xl border border-gray-100 shadow-sm">
            <button 
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all",
                    activeTab === "dashboard" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-900"
                )}
            >
                <LayoutGrid className="w-4 h-4" />
                DASHBOARD
            </button>
            <button 
                onClick={() => setActiveTab("reports")}
                className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all",
                    activeTab === "reports" ? "bg-white text-rose-600 shadow-sm" : "text-gray-400 hover:text-gray-900"
                )}
            >
                <PieChart className="w-4 h-4" />
                REPORTS
            </button>
        </div>
      </div>
    </header>
  )
}
