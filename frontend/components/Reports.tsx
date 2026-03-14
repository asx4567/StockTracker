"use client"

import { useState } from "react"
import axios from "axios"
import { TrendingDown, Loader2, Calendar, ArrowUpRight, ShieldAlert, X } from "lucide-react"

interface ReportResult {
  symbol: string
  name: string
  current_price: number
  high_price: number
  high_date: string
  latest_cum_avg: number
  latest_date: string
  dma_50: number
  dma_100: number
  dma_200: number
}

interface AnalyzeData {
    date: string
    close: number
    cum_avg: number
}

export default function Reports() {
  const [results, setResults] = useState<ReportResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  
  const [analyzingSymbol, setAnalyzingSymbol] = useState<ReportResult | null>(null)
  const [analyzeData, setAnalyzeData] = useState<AnalyzeData[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const runReport = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("/api/reports/crashing-market")
      setResults(res.data)
      setHasRun(true)
    } catch (err) {
      console.error("Failed to run report:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async (stock: ReportResult) => {
    setAnalyzingSymbol(stock)
    setIsAnalyzing(true)
    setAnalyzeData([])
    try {
        const res = await axios.get("/api/reports/analyze", { params: { symbol: stock.symbol } })
        setAnalyzeData(res.data)
    } catch (err) {
        console.error("Failed to analyze symbol:", err)
    } finally {
        setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-xl shadow-rose-50 relative overflow-hidden">
        {/* ... existing header code ... */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldAlert className="w-32 h-32 text-rose-600" />
        </div>
        
        <div className="relative">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Stocks to Invest in Crashing Market</h3>
            <p className="text-gray-500 max-w-2xl font-medium">
                Identifies resilient equities that stay above their long-term averages (DMA 50/100/200) 
                and show a strictly increasing cumulative price trend since their 52-week high.
            </p>

            <button 
                onClick={runReport}
                disabled={isLoading}
                className="mt-6 bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 active:scale-95 flex items-center gap-3 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingDown className="w-5 h-5" />}
                Generate Opportunity Report
            </button>
        </div>
      </div>

      {hasRun && (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Asset</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                  <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">DMA 50/100/200</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">52W High</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">High Date</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Cum. Avg</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <ShieldAlert className="w-10 h-10 text-gray-200" />
                                <p className="text-gray-400 font-bold">No assets currently meet these strict resilience criteria.</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    results.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-blue-50/30 transition-colors group">
                           <td className="px-6 py-5">
                                <div className="font-black text-gray-900">{stock.symbol}</div>
                                <div className="text-[10px] text-gray-400 font-bold truncate max-w-[120px]">{stock.name}</div>
                            </td>
                            <td className="px-6 py-5 text-right font-black text-gray-900">
                                ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-5 text-right">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="text-[10px] font-black text-blue-500">50: ₹{stock.dma_50?.toFixed(2)}</div>
                                        <div className="bg-blue-50 text-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                            +{(((stock.current_price - stock.dma_50) / stock.dma_50) * 100).toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="text-[10px] font-black text-indigo-500">100: ₹{stock.dma_100?.toFixed(2)}</div>
                                        <div className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                            +{(((stock.current_price - stock.dma_100) / stock.dma_100) * 100).toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="text-[10px] font-black text-purple-500">200: ₹{stock.dma_200?.toFixed(2)}</div>
                                        <div className="bg-purple-50 text-purple-600 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                            +{(((stock.current_price - stock.dma_200) / stock.dma_200) * 100).toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-gray-600">
                                ₹{stock.high_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                    <Calendar className="w-3 h-3" />
                                    {stock.high_date}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <div className="font-black text-blue-600">₹{stock.latest_cum_avg.toFixed(2)}</div>
                                <div className="text-[9px] font-black text-green-500 flex items-center justify-end gap-1">
                                    <ArrowUpRight className="w-2.5 h-2.5" />
                                    INCREASING
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <button 
                                    onClick={() => handleAnalyze(stock)}
                                    className="bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-gray-200 active:scale-95 transition-all"
                                >
                                    ANALYZE
                                </button>
                            </td>
                        </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Analyze Modal */}
      {analyzingSymbol && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                  <div className="absolute top-0 right-0 p-6">
                      <button onClick={() => setAnalyzingSymbol(null)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="p-10">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                              <TrendingDown className="w-8 h-8" />
                          </div>
                          <div>
                              <h4 className="text-2xl font-black text-gray-900">{analyzingSymbol.symbol} Analysis</h4>
                              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{analyzingSymbol.name}</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">52W High Price</p>
                              <p className="text-lg font-black text-gray-900">₹{analyzingSymbol.high_price.toLocaleString('en-IN')}</p>
                              <p className="text-[10px] font-bold text-gray-400">On {analyzingSymbol.high_date}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                              <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Current Cum. Avg</p>
                              <p className="text-lg font-black text-blue-600">₹{analyzingSymbol.latest_cum_avg.toFixed(2)}</p>
                              <p className="text-[10px] font-bold text-blue-400">Since {analyzingSymbol.high_date}</p>
                          </div>
                      </div>

                      <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Cumulative Calculation History</h5>
                          <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                              <div className="max-h-[300px] overflow-y-auto">
                                  <table className="w-full text-xs">
                                      <thead className="sticky top-0 bg-gray-50 z-10">
                                          <tr className="border-b border-gray-200">
                                              <th className="px-4 py-3 text-left font-black text-gray-400 uppercase text-[9px]">Day</th>
                                              <th className="px-4 py-3 text-left font-black text-gray-400 uppercase text-[9px]">Date</th>
                                              <th className="px-4 py-3 text-right font-black text-gray-400 uppercase text-[9px]">Close</th>
                                              <th className="px-4 py-3 text-right font-black text-gray-400 uppercase text-[9px]">Cumulative Avg</th>
                                              <th className="px-4 py-3 text-center font-black text-gray-400 uppercase text-[9px]">Trend</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100 bg-white">
                                          {isAnalyzing ? (
                                              <tr>
                                                  <td colSpan={5} className="py-12 text-center text-gray-400 font-bold">
                                                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                                                      Calculating History...
                                                  </td>
                                              </tr>
                                          ) : (
                                              analyzeData.map((row, i, arr) => {
                                                  const isCumUp = i < arr.length - 1 ? row.cum_avg > arr[i+1].cum_avg : true
                                                  const isCloseUp = i < arr.length - 1 ? row.close > arr[i+1].close : true
                                                  // Day 1 is the oldest record (bottom-most)
                                                  const dayNum = arr.length - i
                                                  
                                                  return (
                                                      <tr key={row.date} className="hover:bg-blue-50/20 transition-colors">
                                                          <td className="px-4 py-3 font-black text-gray-400">#{dayNum}</td>
                                                          <td className="px-4 py-3 font-bold text-gray-500">{row.date}</td>
                                                          <td className="px-4 py-3 text-right font-bold">
                                                              <div className="flex items-center justify-end gap-2">
                                                                  ₹{row.close.toFixed(2)}
                                                                  {isCloseUp ? (
                                                                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                                                                  ) : (
                                                                      <TrendingDown className="w-3 h-3 text-rose-500" />
                                                                  )}
                                                              </div>
                                                          </td>
                                                          <td className="px-4 py-3 text-right font-black text-blue-600">₹{row.cum_avg.toFixed(2)}</td>
                                                          <td className="px-4 py-3 text-center">
                                                              {isCumUp ? (
                                                                  <div className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[8px] font-black inline-flex items-center gap-1">
                                                                      <ArrowUpRight className="w-2.5 h-2.5" />
                                                                      UP
                                                                  </div>
                                                              ) : (
                                                                  <div className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[8px] font-black inline-flex items-center gap-1">
                                                                      <TrendingDown className="w-2.5 h-2.5" />
                                                                      DOWN
                                                                  </div>
                                                              )}
                                                          </td>
                                                      </tr>
                                                  )
                                              })
                                          )}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}
