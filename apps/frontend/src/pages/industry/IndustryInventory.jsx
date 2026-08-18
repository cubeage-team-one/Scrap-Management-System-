import React, { useState } from "react";

// --- Sample Data ---
const ITEMS = [
  { id: 1, material: "Copper Scrap (Millberry)", category: "Non-Ferrous", quantity: "12.5 MT", warehouse: "Pune - Unit 2", condition: "Clean", status: "Published", statusClass: "bg-blue-50 text-blue-600 border-blue-100" },
  { id: 2, material: "Steel Turnings", category: "Ferrous", quantity: "48 MT", warehouse: "Jamshedpur - Yard A", condition: "Oily", status: "Live Auction", statusClass: "bg-rose-50 text-rose-600 border-rose-100", isLive: true },
  { id: 3, material: "Aluminium Extrusion 6063", category: "Non-Ferrous", quantity: "21.2 MT", warehouse: "Chennai - Plant 1", condition: "Clean", status: "Available", statusClass: "bg-sky-50 text-sky-700 border-sky-100" },
  { id: 4, material: "Brass Honey Scrap", category: "Non-Ferrous", quantity: "6.8 MT", warehouse: "Rajkot - Store 3", condition: "Mixed", status: "Pending", statusClass: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: 5, material: "HDPE Plastic Regrind", category: "Polymer", quantity: "33 MT", warehouse: "Surat - Warehouse B", condition: "Baled", status: "Approved", statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: 6, material: "E-Waste PCB Assorted", category: "E-Waste", quantity: "4.4 MT", warehouse: "Bengaluru - Hub", condition: "Sorted", status: "Sold", statusClass: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { id: 7, material: "CNC Machine Parts", category: "Machinery", quantity: "18 Units", warehouse: "Pune - Unit 2", condition: "Used", status: "Draft", statusClass: "bg-slate-100 text-slate-600 border-slate-200" },
  { id: 8, material: "Cotton Textile Waste", category: "Textile", quantity: "26.7 MT", warehouse: "Tiruppur - Shed 4", condition: "Baled", status: "Published", statusClass: "bg-blue-50 text-blue-600 border-blue-100" },
  { id: 9, material: "Kraft Paper Waste", category: "Paper", quantity: "52 MT", warehouse: "Nagpur - Depot", condition: "Dry", status: "Auction Ended", statusClass: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { id: 10, material: "Rubber Tyre Scrap", category: "Rubber", quantity: "40 MT", warehouse: "Ludhiana - Yard", condition: "Shredded", status: "Completed", statusClass: "bg-teal-50 text-teal-700 border-teal-200" },
];

const LOGS = [
  { id: "LOG-9021", date: "2026-08-18 14:15", material: "Copper Scrap (Millberry)", type: "Inward", qty: "+ 4.2 MT", ref: "PO-88219", operator: "Ramesh Sharma", status: "Verified", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "LOG-9020", date: "2026-08-18 11:30", material: "Steel Turnings", type: "Outward", qty: "- 12.0 MT", ref: "SO-44012", operator: "Vikram Singh", status: "Dispatched", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "LOG-9019", date: "2026-08-17 16:45", material: "Aluminium Extrusion 6063", type: "Inward", qty: "+ 8.5 MT", ref: "PO-88204", operator: "Sanjay Patel", status: "Verified", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "LOG-9018", date: "2026-08-17 09:10", material: "HDPE Plastic Regrind", type: "Adjustment", qty: "- 1.5 MT", ref: "AUDIT-102", operator: "Priya Nair", status: "Approved", badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { id: "LOG-9017", date: "2026-08-16 15:20", material: "Rubber Tyre Scrap", type: "Inward", qty: "+ 15.0 MT", ref: "PO-88190", operator: "Amit Kumar", status: "Verified", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "LOG-9016", date: "2026-08-16 10:05", material: "Brass Honey Scrap", type: "Outward", qty: "- 3.2 MT", ref: "SO-43998", operator: "Deepak Verma", status: "Dispatched", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
];

const MOVEMENTS = [
  { id: "MOV-301", material: "Steel Turnings", origin: "Jamshedpur - Yard A", destination: "Kolkata Terminal 3", vehicle: "MH-12-PQ-9081", driver: "Gurpreet Singh", status: "In Transit", badgeClass: "bg-blue-50 text-blue-700 border-blue-200", eta: "4 Hours" },
  { id: "MOV-300", material: "Copper Scrap", origin: "Pune - Unit 2", destination: "Mumbai Port Hub", vehicle: "MH-14-CW-4420", driver: "Sunil Mane", status: "Delivered", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", eta: "Completed" },
  { id: "MOV-299", material: "HDPE Plastic", origin: "Surat - Warehouse B", destination: "Ahmedabad Depot 1", vehicle: "GJ-05-XX-1102", driver: "Ketan Mehta", status: "Delivered", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", eta: "Completed" },
  { id: "MOV-298", material: "Aluminium Extrusion", origin: "Chennai - Plant 1", destination: "Bengaluru Hub", vehicle: "TN-09-AB-7731", driver: "K. Murugan", status: "Pending", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", eta: "Tomorrow" },
];

const WAREHOUSES = [
  { id: "WH-01", name: "Pune - Unit 2", manager: "Rajesh Patil", location: "Pune, Maharashtra", totalCap: "500 MT", occupiedCap: "410 MT", utilization: 82, materialsCount: 16 },
  { id: "WH-02", name: "Jamshedpur - Yard A", manager: "Sunil Tudu", location: "Jamshedpur, Jharkhand", totalCap: "800 MT", occupiedCap: "640 MT", utilization: 80, materialsCount: 24 },
  { id: "WH-03", name: "Chennai - Plant 1", manager: "S. Ramanathan", location: "Chennai, Tamil Nadu", totalCap: "450 MT", occupiedCap: "315 MT", utilization: 70, materialsCount: 12 },
  { id: "WH-04", name: "Surat - Warehouse B", manager: "Chirag Shah", location: "Surat, Gujarat", totalCap: "350 MT", occupiedCap: "245 MT", utilization: 70, materialsCount: 18 },
  { id: "WH-05", name: "Rajkot - Store 3", manager: "Bhavik Solanki", location: "Rajkot, Gujarat", totalCap: "250 MT", occupiedCap: "140 MT", utilization: 56, materialsCount: 9 },
  { id: "WH-06", name: "Bengaluru - Hub", manager: "Anand Murthy", location: "Bengaluru, Karnataka", totalCap: "300 MT", occupiedCap: "180 MT", utilization: 60, materialsCount: 14 },
];

const CATEGORIES = [
  { name: "Ferrous", pct: 38, weight: "232.5 MT", color: "#2563EB", strokeDash: "91 148", offset: "0" },
  { name: "Non-Ferrous", pct: 26, weight: "159.1 MT", color: "#10B981", strokeDash: "62 177", offset: "-91" },
  { name: "Polymers", pct: 16, weight: "97.9 MT", color: "#F59E0B", strokeDash: "38 201", offset: "-153" },
  { name: "E-Waste", pct: 11, weight: "67.3 MT", color: "#EF4444", strokeDash: "26 213", offset: "-191" },
  { name: "Paper", pct: 9, weight: "55.2 MT", color: "#6366F1", strokeDash: "22 217", offset: "-217" },
];

const IndustryInventory = () => {
  const [tab, setTab] = useState("current");
  const [stock, setStock] = useState(ITEMS);
  const [search, setSearch] = useState("");
  const [hoverCat, setHoverCat] = useState(null);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [adj, setAdj] = useState({ id: "1", type: "Inward", qty: "" });

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const onAdjust = (e) => {
    e.preventDefault();
    if (!adj.qty || Number(adj.qty) <= 0) return;
    const q = parseFloat(adj.qty);
    setStock((prev) => prev.map((s) => s.id === parseInt(adj.id) ? { ...s, quantity: `${(parseFloat(s.quantity) + (adj.type === "Inward" ? q : -q)).toFixed(1)} ${s.quantity.includes("Units") ? "Units" : "MT"}` } : s));
    setModal(null); setAdj({ id: "1", type: "Inward", qty: "" }); notify("Stock updated!");
  };

  const donutInfo = hoverCat || { name: "Total Stock", weight: "612 MT", pct: 100 };
  const filtered = stock.filter((s) => s.material.toLowerCase().includes(search.toLowerCase()) || s.warehouse.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-3 sm:p-5 lg:p-8 space-y-5 font-sans">
      <style>{`@keyframes drawDonut { from { stroke-dasharray: 0 239; } } .animate-donut { animation: drawDonut 1.2s ease-out forwards; }`}</style>
      
      {/* Toast Notification */}
      {toast && <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs shadow-xl flex items-center gap-2 border border-slate-700"><span className="w-2 h-2 rounded-full bg-emerald-400" />{toast}</div>}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">SmartScrap AI &gt; <span className="text-slate-600 font-semibold">Inventory</span></div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inventory management</h1>
          <p className="text-xs sm:text-sm text-slate-500">Live stock positions, movements and warehouse utilisation.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal("adjust")} className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 shadow-xs cursor-pointer">Stock adjustment</button>
          <button onClick={() => setModal("export")} className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs cursor-pointer">Export stock report</button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Total Stock", v: "1,325 MT", c: "+4.8%", bg: "bg-blue-50 text-blue-600", i: "📦" },
          { l: "Inward (30d)", v: "612 MT", c: "+8.1%", bg: "bg-emerald-50 text-emerald-600", i: "↙" },
          { l: "Outward (30d)", v: "548 MT", c: "+5.2%", bg: "bg-amber-50 text-amber-600", i: "↗" },
          { l: "Warehouse Utilisation", v: "72%", c: "+3 pts", bg: "bg-sky-50 text-sky-600", i: "🏢" }
        ].map((m) => (
          <div key={m.l} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex justify-between items-center mb-2"><span className="text-xs text-slate-500">{m.l}</span><span className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center text-xs font-bold`}>{m.i}</span></div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">{m.v}</div>
            <div className="text-[11px] font-semibold text-emerald-600">↗ {m.c}</div>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-1.5 pb-1 min-w-max">
          {[["current","Current stock"], ["history","Stock history"], ["movement","Material movement"], ["summary","Warehouse summary"], ["analytics","Analytics"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 text-xs font-medium rounded-lg cursor-pointer ${tab === k ? "bg-white text-slate-900 shadow-2xs border border-slate-200" : "text-slate-500 hover:bg-slate-100/60"}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* TAB 1: CURRENT STOCK */}
      {tab === "current" && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center gap-2">
            <h2 className="font-semibold text-slate-900 text-sm">Current stock</h2>
            <input type="text" placeholder="Search material..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-1.5 bg-slate-50 border rounded-lg text-xs w-48 sm:w-64 focus:outline-none" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b bg-slate-50/50 text-[10px] text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Material</th><th className="py-2.5 px-3">Category</th><th className="py-2.5 px-3">Quantity</th><th className="py-2.5 px-3">Warehouse</th><th className="py-2.5 px-3">Condition</th><th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {filtered.map((r) => (
                  <tr key={r.id} onClick={() => setSelected(r)} className="hover:bg-slate-50 cursor-pointer">
                    <td className="py-3 px-3 font-semibold text-slate-900">{r.material}</td>
                    <td className="py-3 px-3 text-slate-600">{r.category}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{r.quantity}</td>
                    <td className="py-3 px-3 text-slate-600">{r.warehouse}</td>
                    <td className="py-3 px-3 text-slate-600">{r.condition}</td>
                    <td className="py-3 px-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${r.statusClass}`}>{r.isLive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse mr-1" />}{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK HISTORY */}
      {tab === "history" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border space-y-3">
            <div className="flex justify-between items-center"><h3 className="font-bold text-slate-900 text-sm">Weekly Movement Trend</h3><div className="flex gap-3 text-xs font-medium text-slate-600"><span className="flex items-center gap-1"><i className="w-2.5 h-2.5 bg-indigo-600 rounded inline-block" />Inward</span><span className="flex items-center gap-1"><i className="w-2.5 h-2.5 bg-amber-500 rounded inline-block" />Outward</span></div></div>
            <div className="h-40 flex items-end justify-between gap-2 pt-4 pb-2 px-2 bg-slate-50 rounded-lg">
              {[{ d: "Mon", i: 45, o: 30 }, { d: "Tue", i: 62, o: 48 }, { d: "Wed", i: 85, o: 52 }, { d: "Thu", i: 40, o: 65 }, { d: "Fri", i: 95, o: 70 }, { d: "Sat", i: 75, o: 50 }, { d: "Sun", i: 30, o: 20 }].map((g) => (
                <div key={g.d} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="flex items-end gap-1 h-28">
                    <div className="w-3 bg-indigo-600 rounded-t" style={{ height: `${g.i}%` }} title={`Inward: ${g.i} MT`} />
                    <div className="w-3 bg-amber-500 rounded-t" style={{ height: `${g.o}%` }} title={`Outward: ${g.o} MT`} />
                  </div>
                  <span className="text-[10px] text-slate-500">{g.d}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Audit Register</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                <thead><tr className="border-b bg-slate-50/50 text-[10px] text-slate-400 uppercase"><th className="py-2.5 px-3">Log ID</th><th className="py-2.5 px-3">Date</th><th className="py-2.5 px-3">Material</th><th className="py-2.5 px-3">Type</th><th className="py-2.5 px-3">Qty</th><th className="py-2.5 px-3">Ref</th><th className="py-2.5 px-3">Operator</th><th className="py-2.5 px-3">Status</th></tr></thead>
                <tbody className="divide-y text-slate-700">
                  {LOGS.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50"><td className="py-2.5 px-3 font-mono">{l.id}</td><td className="py-2.5 px-3">{l.date}</td><td className="py-2.5 px-3 font-semibold">{l.material}</td><td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] border ${l.badgeClass}`}>{l.type}</span></td><td className={`py-2.5 px-3 font-semibold ${l.type === "Inward" ? "text-indigo-600" : "text-amber-600"}`}>{l.qty}</td><td className="py-2.5 px-3 font-mono">{l.ref}</td><td className="py-2.5 px-3">{l.operator}</td><td className="py-2.5 px-3 text-emerald-600 font-medium">✓ {l.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MATERIAL MOVEMENT */}
      {tab === "movement" && (
        <div className="bg-white rounded-xl border p-4 space-y-3">
          <h2 className="font-bold text-slate-900 text-sm">Material Movement & Logistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead><tr className="border-b bg-slate-50/50 text-[10px] text-slate-400 uppercase"><th className="py-2.5 px-3">Transfer ID</th><th className="py-2.5 px-3">Material</th><th className="py-2.5 px-3">Origin</th><th className="py-2.5 px-3">Destination</th><th className="py-2.5 px-3">Vehicle</th><th className="py-2.5 px-3">Status</th><th className="py-2.5 px-3">ETA</th></tr></thead>
              <tbody className="divide-y text-slate-700">
                {MOVEMENTS.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50"><td className="py-2.5 px-3 font-mono">{m.id}</td><td className="py-2.5 px-3 font-semibold">{m.material}</td><td className="py-2.5 px-3">{m.origin}</td><td className="py-2.5 px-3">{m.destination}</td><td className="py-2.5 px-3"><div className="font-mono">{m.vehicle}</div><div className="text-[10px] text-slate-400">{m.driver}</div></td><td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] border ${m.badgeClass}`}>{m.status}</span></td><td className="py-2.5 px-3">{m.eta}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: WAREHOUSE SUMMARY */}
      {tab === "summary" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WAREHOUSES.map((w) => (
            <div key={w.id} className="bg-white p-4 rounded-xl border space-y-3">
              <div className="flex justify-between items-start"><div><h3 className="font-bold text-slate-900 text-sm">{w.name}</h3><p className="text-xs text-slate-500">📍 {w.location}</p></div><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{w.materialsCount} Materials</span></div>
              <div><div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Occupancy</span><span className="font-bold text-slate-900">{w.utilization}%</span></div><div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${w.utilization}%` }} /></div></div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs"><div><span className="text-slate-400 block text-[10px]">Total Cap</span><span className="font-bold">{w.totalCap}</span></div><div><span className="text-slate-400 block text-[10px]">Occupied</span><span className="font-bold">{w.occupiedCap}</span></div></div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {tab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Donut Ring Chart */}
          <div className="bg-white p-5 rounded-xl border space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Inventory distribution</h3>
            <div className="flex flex-col items-center py-2">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {CATEGORIES.map((c) => (
                    <circle key={c.name} cx="50" cy="50" r="38" fill="transparent" stroke={c.color} strokeWidth={hoverCat?.name === c.name ? "18" : "15"} strokeDasharray={c.strokeDash} strokeDashoffset={c.offset} className="animate-donut cursor-pointer transition-all" onMouseEnter={() => setHoverCat(c)} onMouseLeave={() => setHoverCat(null)} />
                  ))}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center bg-white/90 px-3 py-1.5 rounded-lg border shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{donutInfo.name}</span>
                    <span className="text-base font-bold text-slate-900 block">{donutInfo.weight}</span>
                    <span className="text-xs font-semibold text-blue-600 block">{donutInfo.pct}% Share</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs font-medium text-slate-600">
                {CATEGORIES.map((c) => (
                  <div key={c.name} onMouseEnter={() => setHoverCat(c)} onMouseLeave={() => setHoverCat(null)} className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer ${hoverCat?.name === c.name ? "bg-slate-100 font-bold" : ""}`}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="bg-white p-5 rounded-xl border space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Generation vs consumption</h3>
            <div className="h-48 flex gap-3 pt-4">
              <div className="flex flex-col justify-between text-[10px] text-slate-400 py-1"><span>600</span><span>300</span><span>0</span></div>
              <div className="flex-1 flex items-end justify-between gap-2 border-b pb-1">
                {[{ m: "Feb", v: 310 }, { m: "Mar", v: 410 }, { m: "Apr", v: 390 }, { m: "May", v: 460 }, { m: "Jun", v: 510 }, { m: "Jul", v: 580 }].map((b) => (
                  <div key={b.m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-5 bg-blue-600 rounded-t transition-all group-hover:bg-blue-700 relative" style={{ height: `${(b.v / 600) * 100}%` }}>
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded whitespace-nowrap">{b.v} MT</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{b.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {modal === "adjust" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xs w-full p-4 space-y-3 border shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm">Stock Adjustment</h3>
            <form onSubmit={onAdjust} className="space-y-3 text-xs">
              <select value={adj.id} onChange={(e) => setAdj({ ...adj, id: e.target.value })} className="w-full p-2 border rounded-lg">{stock.map((s) => <option key={s.id} value={s.id}>{s.material}</option>)}</select>
              <div className="grid grid-cols-2 gap-2">
                <select value={adj.type} onChange={(e) => setAdj({ ...adj, type: e.target.value })} className="w-full p-2 border rounded-lg"><option value="Inward">Inward (+)</option><option value="Outward">Outward (-)</option></select>
                <input type="number" required placeholder="Qty" value={adj.qty} onChange={(e) => setAdj({ ...adj, qty: e.target.value })} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="px-3 py-1.5 text-slate-600">Cancel</button><button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {modal === "export" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xs w-full p-4 space-y-3 border shadow-xl text-center">
            <h3 className="font-bold text-slate-900 text-sm">Export Stock Report</h3>
            <div className="flex justify-center gap-2">{["PDF", "EXCEL", "CSV"].map((f) => <button key={f} onClick={() => { setModal(null); notify(`Exported ${f}!`); }} className="px-3 py-1.5 bg-slate-50 border rounded-lg text-xs font-medium">{f}</button>)}</div>
            <button onClick={() => setModal(null)} className="text-xs text-slate-400 block mx-auto">Close</button>
          </div>
        </div>
      )}

      {/* Item Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/30 flex justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-xs h-full p-5 space-y-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-2"><h3 className="font-bold text-slate-900 text-sm">{selected.material}</h3><button onClick={() => setSelected(null)} className="text-slate-400">✕</button></div>
            <div className="space-y-2 text-xs"><div className="flex justify-between py-1 border-b"><span>Category</span><span className="font-medium">{selected.category}</span></div><div className="flex justify-between py-1 border-b"><span>Quantity</span><span className="font-bold">{selected.quantity}</span></div><div className="flex justify-between py-1 border-b"><span>Warehouse</span><span className="font-medium">{selected.warehouse}</span></div><div className="flex justify-between py-1 border-b"><span>Condition</span><span className="font-medium">{selected.condition}</span></div></div>
            <button onClick={() => setSelected(null)} className="w-full py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryInventory;