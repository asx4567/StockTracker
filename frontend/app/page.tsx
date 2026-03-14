"use client"

import { useState, useEffect } from "react"
import { BarChart3, PieChart, LayoutGrid } from "lucide-react"
import axios from "axios"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Filters from "@/components/Filters"
import StockTable from "@/components/StockTable"
import AdvancedScreener, { Rule } from "@/components/AdvancedScreener"
import Reports from "@/components/Reports"
import { cn } from "@/lib/utils"

const API_BASE = "/api"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports">("dashboard")
  const [metadata, setMetadata] = useState({
    types: [],
    stocks: [],
    dates: [],
    latest_date: null
  })
  const [filters, setFilters] = useState({
    type: "Equity",
    symbol: "",
    company_name: "",
    date: ""
  })
  const [rules, setRules] = useState<Rule[]>([])
  const [stocks, setStocks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch metadata once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await axios.get(`${API_BASE}/metadata`)
        setMetadata(res.data)
        if (res.data.latest_date) {
            setFilters(prev => ({ ...prev, date: res.data.latest_date }))
        }
      } catch (err) {
        console.error("Failed to fetch metadata:", err)
      }
    }
    fetchMetadata()
  }, [])

  // Fetch stocks whenever basic filters change or rules are applied
  const fetchStocks = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/stocks`, {
        params: {
          type: filters.type,
          symbol: filters.symbol || undefined,
          company_name: filters.company_name || undefined,
          target_date: filters.date,
          rules: rules.length > 0 ? JSON.stringify(rules) : undefined
        }
      })
      setStocks(res.data)
    } catch (err) {
      console.error("Failed to fetch stocks:", err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (metadata.latest_date || filters.date) {
        fetchStocks()
    }
  }, [filters, metadata.latest_date])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchStocks()
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="max-w-7xl mx-auto px-6 py-4 md:px-12">

        {activeTab === "dashboard" ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Filters 
                    metadata={metadata} 
                    filters={filters} 
                    setFilters={setFilters} 
                />

                <AdvancedScreener 
                    rules={rules} 
                    setRules={setRules} 
                    onApply={fetchStocks} 
                />
                
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-800">Market Overview</h2>
                    </div>
                    {filters.date && (
                        <div className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
                            Showing Data: {filters.date}
                        </div>
                    )}
                </div>

                <StockTable stocks={stocks} isLoading={isLoading} />
            </div>
        ) : (
            <Reports />
        )}
      </div>

      <Footer />
    </main>
  )
}
