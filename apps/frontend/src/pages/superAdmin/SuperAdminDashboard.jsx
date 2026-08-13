import { useState } from "react";
import { 
  Users, 
  DollarSign, 
  Activity, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// --- Dummy Data ---
const statCards = [
  {
    title: "Total Revenue",
    value: "$124,500",
    change: "+14.5%",
    isPositive: true,
    icon: <DollarSign className="w-6 h-6 text-[#011C6B]" />
  },
  {
    title: "Active Users",
    value: "2,845",
    change: "+5.2%",
    isPositive: true,
    icon: <Users className="w-6 h-6 text-[#011C6B]" />
  },
  {
    title: "Live Auctions",
    value: "156",
    change: "-2.4%",
    isPositive: false,
    icon: <Activity className="w-6 h-6 text-[#011C6B]" />
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "+12",
    isPositive: false, // In this context, an increase in pending is 'bad' or needs attention
    icon: <AlertCircle className="w-6 h-6 text-[#011C6B]" />
  }
];

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 }
];

const userDistributionData = [
  { name: "Industry", value: 400 },
  { name: "Dealer", value: 300 },
  { name: "Buyer", value: 800 }
];

const pieColors = ["#011C6B", "#F59E0B", "#1E3A8A"]; // Using primary colors and a lighter blue shade

const recentActivity = [
  { id: 1, action: "New User Registered", user: "TechCorp Mfg", role: "Industry", time: "10 mins ago" },
  { id: 2, action: "Auction Completed", user: "ScrapKings", role: "Dealer", time: "25 mins ago" },
  { id: 3, action: "Withdrawal Request", user: "MetalWorks Inc", role: "Buyer", time: "1 hour ago" },
  { id: 4, action: "Support Ticket Opened", user: "Global Scrap", role: "Dealer", time: "3 hours ago" },
  { id: 5, action: "New Tender Posted", user: "AutoParts Ltd", role: "Industry", time: "5 hours ago" }
];

const SuperAdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("7D"); // Just a UI toggle for now

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, Super Admin. Here is what's happening today.</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          {["24H", "7D", "30D", "1Y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range 
                  ? "bg-[#011C6B] text-white" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {stat.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart (Revenue) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#011C6B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#011C6B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#011C6B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart (User Distribution) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">User Distribution</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {userDistributionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[index] }}></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <button className="text-sm font-semibold text-[#011C6B] hover:text-blue-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{activity.action}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{activity.user}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      activity.role === 'Industry' ? 'bg-blue-100 text-[#011C6B]' :
                      activity.role === 'Dealer' ? 'bg-amber-100 text-[#F59E0B]' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {activity.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
