import { useState, useEffect } from "react";
import {
  Factory,
  Store,
  Users,
  Package,
  Gavel,
  CheckCircle2,
  IndianRupee,
  Clock,
  ChevronRight,
  Filter,
  Download,
  ArrowUpDown,
  Loader2
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Bar,
  Line,
  Legend,
  LineChart,
  BarChart
} from "recharts";

import StateCards from "../../components/dashboard/StateCards";

// --- Mock API Service ---
// This simulates fetching data from your backend.
// Your backend team just needs to replace this function with an actual fetch/axios call.
const fetchDashboardData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sparklineDataPos = [
        { val: 10 }, { val: 12 }, { val: 15 }, { val: 14 }, { val: 18 }, { val: 22 }, { val: 25 }
      ];
      const sparklineDataNeg = [
        { val: 25 }, { val: 22 }, { val: 24 }, { val: 18 }, { val: 15 }, { val: 12 }, { val: 10 }
      ];

      resolve({
        statCards: [
          { title: "Total Industries", value: "486", change: "↗ +12", isPositive: true, sparkline: sparklineDataPos, color: "#3B82F6", type: "industries" },
          { title: "Total Dealers", value: "1,204", change: "↗ +38", isPositive: true, sparkline: sparklineDataPos, color: "#22C55E", type: "dealers" },
          { title: "Total Buyers", value: "932", change: "↗ +21", isPositive: true, sparkline: sparklineDataPos, color: "#3B82F6", type: "buyers" },
          { title: "Scrap Listed", value: "12,846 MT", change: "↗ +8.4%", isPositive: true, sparkline: sparklineDataPos, color: "#F59E0B", type: "scrap" },
          { title: "Active Auctions", value: "112", change: "↗ +6", isPositive: true, sparkline: sparklineDataPos, color: "#F87171", type: "auctions" },
          { title: "Completed Sales", value: "7,391", change: "↗ +4.1%", isPositive: true, sparkline: sparklineDataPos, color: "#22C55E", type: "sales" },
          { title: "Monthly Revenue", value: "₹8.12 Cr", change: "↗ +11.7%", isPositive: true, sparkline: sparklineDataPos, color: "#011C6B", type: "revenue" },
          { title: "Pending Approvals", value: "18", change: "↘ -4", isPositive: false, sparkline: sparklineDataNeg, color: "#F59E0B", type: "pending" }
        ],
        comboData: [
          { name: "Jan", revenue: 200, volume: 150 },
          { name: "Feb", revenue: 250, volume: 180 },
          { name: "Mar", revenue: 220, volume: 160 },
          { name: "Apr", revenue: 350, volume: 280 },
          { name: "May", revenue: 450, volume: 320 },
          { name: "Jun", revenue: 550, volume: 400 },
          { name: "Jul", revenue: 812, volume: 550 }
        ],
        regionData: [
          { name: "Maharashtra", value: 4500 },
          { name: "Gujarat", value: 3200 },
          { name: "Karnataka", value: 2800 },
          { name: "Tamil Nadu", value: 2100 },
          { name: "Delhi NCR", value: 1800 }
        ],
        inventoryData: [
          { name: "Ferrous", value: 45 },
          { name: "Non-Ferrous", value: 25 },
          { name: "Polymer", value: 15 },
          { name: "E-Waste", value: 10 },
          { name: "Others", value: 5 }
        ],
        latestCompanies: [
          { id: "C001", initials: "TA", name: "Tata Precision", role: "Industry", location: "Pune, MH", date: "28 Jul 2026", status: "Approved" },
          { id: "C002", initials: "SH", name: "Shaikh Metals", role: "Dealer", location: "Bhiwandi, MH", date: "28 Jul 2026", status: "Pending" },
          { id: "C003", initials: "NE", name: "Nexa Electronics", role: "Industry", location: "Bengaluru, KA", date: "27 Jul 2026", status: "Approved" },
          { id: "C004", initials: "VE", name: "Verma Recycling", role: "Buyer", location: "Kanpur, UP", date: "26 Jul 2026", status: "Approved" },
          { id: "C005", initials: "TI", name: "Tiruppur Knitwear", role: "Industry", location: "Tiruppur, TN", date: "25 Jul 2026", status: "Rejected" },
        ]
      });
    }, 1000); // Simulate 1 second network delay
  });
};

const pieColors = ["#011C6B", "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];

const getIconForType = (type) => {
  switch (type) {
    case "industries": return { icon: <Factory className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" };
    case "dealers": return { icon: <Store className="w-5 h-5 text-green-500" />, bg: "bg-green-50" };
    case "buyers": return { icon: <Users className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" };
    case "scrap": return { icon: <Package className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50" };
    case "auctions": return { icon: <Gavel className="w-5 h-5 text-red-400" />, bg: "bg-red-50" };
    case "sales": return { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, bg: "bg-green-50" };
    case "revenue": return { icon: <IndianRupee className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" };
    case "pending": return { icon: <Clock className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50" };
    default: return { icon: <Factory className="w-5 h-5 text-gray-500" />, bg: "bg-gray-50" };
  }
};

const SuperAdminDashboard = () => {
  const [filterRegion, setFilterRegion] = useState("All Regions");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  // Dynamic Data Fetching
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filterRegion]); // Re-fetch if filter changes (simulated)

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <Loader2 className="w-12 h-12 text-[#011C6B] animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse text-center">Loading dynamic analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen font-sans animate-in fade-in duration-500">

      {/* Breadcrumb & Slicer Bar (Power BI Style) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">



        {/* Interactive Slicers */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-full lg:w-auto">
          <div className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:border-r border-gray-200 py-1 sm:py-0">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filters</span>
          </div>

          <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-[#011C6B] w-full sm:w-auto">
            <option>Last 7 Months</option>
            <option>Last 30 Days</option>
            <option>Year to Date</option>
          </select>

          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-[#011C6B] w-full sm:w-auto"
          >
            <option>All Regions</option>
            <option>Maharashtra</option>
            <option>Gujarat</option>
            <option>Karnataka</option>
          </select>

          <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-[#011C6B] w-full sm:w-auto">
            <option>All Materials</option>
            <option>Ferrous</option>
            <option>Non-Ferrous</option>
          </select>

          <button className="hidden sm:flex ml-auto p-2 sm:p-1.5 text-gray-500 hover:text-[#011C6B] hover:bg-blue-50 rounded-md transition-colors justify-center" title="Export Report">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Area */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Platform Analytics</h1>
        <p className="text-gray-500 text-sm">Network health, trade volume and approvals across all connected organisations.</p>
      </div>

      {/* KPI Cards with Sparklines */}

      <StateCards
        data={data.statCards}
        getIconForType={getIconForType}
      />

      {/* BI Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Combo Chart (Volume vs Revenue) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900">Trade Volume vs. Revenue</h2>
            <p className="text-xs text-gray-500 mt-1">Dual-axis correlation of MT traded vs Platform Revenue (Lakhs)</p>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.comboData} margin={{ top: 10, right: -10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} dy={10} />

                {/* Left Y Axis for Volume (Bar) */}
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} width={40} />
                {/* Right Y Axis for Revenue (Line) */}
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(value) => `₹${value}`} width={40} />

                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />

                <Bar yAxisId="left" dataKey="volume" name="Volume (MT)" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (₹ L)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution (Horizontal Bar) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 lg:col-span-1 flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900">Top Regions</h2>
            <p className="text-xs text-gray-500 mt-1">Trade volume (MT) by geographic state</p>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.regionData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }} width={70} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#011C6B" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#011C6B' : '#60A5FA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Inventory Distribution Donut Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 lg:col-span-1 flex flex-col">
          <div>
            <h2 className="text-base font-bold text-gray-900">Material Composition</h2>
            <p className="text-xs text-gray-500 mt-1 mb-4">Click to filter dashboard (Simulated)</p>
          </div>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.inventoryData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {data.inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-2 md:gap-3 mt-4 flex-wrap">
            {data.inventoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 cursor-pointer hover:underline text-[11px] md:text-xs text-gray-600 font-medium">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pieColors[index] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Data Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
            <div>
              <h2 className="text-base font-bold text-gray-900">Company Registry</h2>
              <p className="text-xs text-gray-500 mt-1">Live data grid with sorting</p>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search ID..."
                className="w-full sm:w-auto pl-3 pr-4 py-2 sm:py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#011C6B]"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1 w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="py-3 px-4 md:px-6 text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-50 group">
                    <div className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-700" /></div>
                  </th>
                  <th className="py-3 px-4 md:px-6 text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-50 group">
                    <div className="flex items-center gap-1">Company <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-700" /></div>
                  </th>
                  <th className="py-3 px-4 md:px-6 text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-50 group">
                    <div className="flex items-center gap-1">Role <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-700" /></div>
                  </th>
                  <th className="py-3 px-4 md:px-6 text-xs font-bold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {data.latestCompanies.map((company, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors cursor-default">
                    <td className="py-3 px-4 md:px-6 text-sm font-mono text-gray-500">{company.id}</td>
                    <td className="py-3 px-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center text-[#011C6B] font-bold text-xs">
                          {company.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{company.name}</p>
                          <p className="text-xs text-gray-500">{company.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 md:px-6 text-sm text-gray-600 font-medium whitespace-nowrap">{company.role}</td>
                    <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${company.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          company.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {company.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SuperAdminDashboard;
