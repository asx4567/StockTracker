"use client"

import { TrendingUp, TrendingDown, Info, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stock {
  symbol: string
  name: string
  type: string
  sector: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  dma_20: number | null
  dma_50: number | null
  dma_100: number | null
  dma_200: number | null
  rsi_14: number | null
  macd_line: number | null
  macd_signal: number | null
  macd_hist: number | null
}

interface StockTableProps {
  stocks: Stock[]
  isLoading: boolean
}

export default function StockTable({ stocks, isLoading }: StockTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          {[1, 2, 3, 4, 5, 10].map((i) => (
            <div key={i} className="h-12 bg-gray-50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (stocks.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Info className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No stocks found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">OHLCV</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Indicators</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">DMA (20/50/100/200)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {stocks.map((stock) => (
            <StockRow key={stock.symbol} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StockRow({ stock }: { stock: Stock }) {
  const isPositive = stock.close >= stock.open

  return (
    <tr className="group hover:bg-blue-50/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-black text-gray-900 uppercase group-hover:text-blue-600 transition-colors">
            {stock.symbol}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[150px]">
            {stock.name}
          </span>
          <span className="mt-1 inline-block w-fit px-1.5 py-0.5 rounded-md bg-gray-100 text-[8px] font-black text-gray-500 uppercase tracking-tighter">
            {stock.type}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-md font-black text-gray-900">
            ₹{stock.close.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <div className={cn(
            "flex items-center gap-0.5 text-[10px] font-bold",
            isPositive ? "text-emerald-500" : "text-rose-500"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {((Math.abs(stock.close - stock.open) / stock.open) * 100).toFixed(2)}%
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-4 text-[11px]">
          <Metric label="O" value={stock.open} />
          <Metric label="H" value={stock.high} color="text-emerald-600" />
          <Metric label="L" value={stock.low} color="text-rose-600" />
          <Metric label="V" value={stock.volume} isCompact />
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <IndicatorBox label="RSI" value={stock.rsi_14} 
            color={stock.rsi_14 && stock.rsi_14 > 70 ? "text-rose-600" : stock.rsi_14 && stock.rsi_14 < 30 ? "text-emerald-600" : "text-blue-600"} 
          />
          <IndicatorBox label="MACD" value={stock.macd_line} />
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <DMAChip label="D20" value={stock.dma_20} />
          <DMAChip label="D50" value={stock.dma_50} />
          <DMAChip label="D100" value={stock.dma_100} />
          <DMAChip label="D200" value={stock.dma_200} />
        </div>
      </td>
    </tr>
  )
}

function Metric({ label, value, color = "text-gray-900", isCompact = false }: { label: string, value: number | null, color?: string, isCompact?: boolean }) {
  const displayValue = value === null ? "-" : 
    isCompact ? formatCompactNumber(value) : 
    value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="text-center">
      <span className="text-[9px] font-black text-gray-300 block mb-0.5 uppercase">{label}</span>
      <span className={cn("font-bold whitespace-nowrap", color)}>{displayValue}</span>
    </div>
  )
}

function IndicatorBox({ label, value, color = "text-gray-900" }: { label: string, value: number | null, color?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-2 py-1 border border-gray-100 min-w-[50px] text-center">
      <span className="text-[8px] font-black text-gray-400 block uppercase leading-none mb-0.5">{label}</span>
      <span className={cn("text-[11px] font-black", color)}>{value ? value.toFixed(2) : "-"}</span>
    </div>
  )
}

function DMAChip({ label, value }: { label: string, value: number | null }) {
  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg px-1.5 py-1 min-w-[55px] shadow-sm">
      <span className="text-[7px] font-black text-gray-400 leading-none">{label}</span>
      <span className="text-[10px] font-bold text-gray-700">{value ? value.toFixed(2) : "-"}</span>
    </div>
  )
}

function formatCompactNumber(number: number) {
  if (number < 1000) return number.toString();
  if (number >= 1000 && number < 100000) return (number / 1000).toFixed(2) + "K";
  if (number >= 100000 && number < 10000000) return (number / 100000).toFixed(2) + "L";
  return (number / 10000000).toFixed(2) + "Cr";
}
