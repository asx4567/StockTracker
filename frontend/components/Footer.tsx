"use client"

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-12 md:px-12 border-t border-gray-100 mt-20 text-center">
      <div className="max-w-3xl mx-auto space-y-4 mb-10">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="font-bold text-gray-500">SEBI Regulatory Disclaimer:</span> Investment in securities market are subject to market risks. Read all the related documents carefully before investing. 
          This platform is for educational purposes only and does not constitute financial advice or stock recommendations.
        </p>
      </div>
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] opacity-60">
        © {new Date().getFullYear()} Bharat Market Trends • All Rights Reserved
      </p>
    </footer>
  )
}
