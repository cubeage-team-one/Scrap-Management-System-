import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Gavel,
  Users,
  TrendingUp,
  Trophy,
  Search,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  X
} from "lucide-react";
import LiveBidsModal from "../../components/industry/LiveBidsModal";

// Initial Live Auctions Data
const initialAuctions = [
  {
    id: "AUC-2291",
    title: "Steel Turnings",
    quantity: "48 MT",
    category: "Ferrous Metal",
    currentHighestBid: "₹12,84,000",
    currentHighestBidNum: 1284000,
    startingPrice: "₹11,50,000",
    bidIncrement: "₹5,000",
    totalBidders: 14,
    seller: "Bharat Steel Works",
    endsIn: "01:42:18",
    progressPct: 65,
    status: "Live Auction",
    closingSoon: true
  },
  {
    id: "AUC-2290",
    title: "Copper Scrap (Millberry)",
    quantity: "12.5 MT",
    category: "Non-Ferrous Metal",
    currentHighestBid: "₹7,61,500",
    currentHighestBidNum: 761500,
    startingPrice: "₹6,90,000",
    bidIncrement: "₹2,500",
    totalBidders: 22,
    seller: "Tata Precision Forgings",
    endsIn: "00:18:04",
    progressPct: 88,
    status: "Live Auction",
    closingSoon: true
  },
  {
    id: "AUC-2289",
    title: "Aluminium Extrusion 6063",
    quantity: "21.2 MT",
    category: "Non-Ferrous Metal",
    currentHighestBid: "₹4,02,000",
    currentHighestBidNum: 402000,
    startingPrice: "₹3,60,000",
    bidIncrement: "₹2,000",
    totalBidders: 9,
    seller: "Ashok Auto Components",
    endsIn: "04:06:55",
    progressPct: 40,
    status: "Live Auction",
    closingSoon: false
  },
  {
    id: "AUC-2287",
    title: "HDPE Plastic Regrind",
    quantity: "33 MT",
    category: "Plastic & Rubber",
    currentHighestBid: "₹5,80,000",
    currentHighestBidNum: 580000,
    startingPrice: "₹5,10,000",
    bidIncrement: "₹3,000",
    totalBidders: 11,
    seller: "Supreme Plastics Ltd",
    endsIn: "02:15:30",
    progressPct: 55,
    status: "Live Auction",
    closingSoon: false
  },
  {
    id: "AUC-2285",
    title: "Brass Borings & Turnings",
    quantity: "15.0 MT",
    category: "Non-Ferrous Metal",
    currentHighestBid: "₹9,45,000",
    currentHighestBidNum: 945000,
    startingPrice: "₹8,80,000",
    bidIncrement: "₹5,000",
    totalBidders: 18,
    seller: "Kirloskar Metals",
    endsIn: "05:22:10",
    progressPct: 30,
    status: "Live Auction",
    closingSoon: false
  },
  {
    id: "AUC-2284",
    title: "Heavy Machinery Cast Iron",
    quantity: "52.0 MT",
    category: "Ferrous Metal",
    currentHighestBid: "₹18,20,000",
    currentHighestBidNum: 1820000,
    startingPrice: "₹16,50,000",
    bidIncrement: "₹10,000",
    totalBidders: 25,
    seller: "L&T Industrial Tools",
    endsIn: "00:45:00",
    progressPct: 75,
    status: "Live Auction",
    closingSoon: true
  }
];

const completedAuctions = [
  {
    id: "AUC-2280",
    title: "Stainless Steel 304 Scrap",
    quantity: "28 MT",
    winningBid: "₹16,40,000",
    reservePrice: "₹14,50,000",
    winner: "Metro Recyclers Pvt Ltd",
    totalBidders: 16,
    completedDate: "Aug 19, 2026",
    status: "Completed"
  },
  {
    id: "AUC-2278",
    title: "Corrugated Cardboard Bales",
    quantity: "60 MT",
    winningBid: "₹3,90,000",
    reservePrice: "₹3,20,000",
    winner: "GreenPaper Solutions",
    totalBidders: 12,
    completedDate: "Aug 18, 2026",
    status: "Completed"
  },
  {
    id: "AUC-2275",
    title: "Insulated Copper Wire",
    quantity: "8.5 MT",
    winningBid: "₹24,10,000",
    reservePrice: "₹21,00,000",
    winner: "Sanjay Metals Pvt. Ltd.",
    totalBidders: 21,
    completedDate: "Aug 17, 2026",
    status: "Completed"
  }
];

const IndustryAuctions = () => {
  const [activeTab, setActiveTab] = useState("Live auctions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLot, setSelectedLot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auctions, setAuctions] = useState(initialAuctions);

  // Filter auctions based on search query
  const filteredAuctions = auctions.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.seller.toLowerCase().includes(query) ||
      item.quantity.toLowerCase().includes(query)
    );
  });

  const handleOpenLiveAuction = (lot) => {
    const modalLotData = {
      id: lot.id,
      title: lot.title,
      topBid: lot.currentHighestBid,
      pricePerUnit: lot.startingPrice,
      ...lot
    };
    setSelectedLot(modalLotData);
    setIsModalOpen(true);
  };

  const handleAcceptBid = (bidder, amount) => {
    if (!selectedLot) return;
    setAuctions((prev) =>
      prev.map((item) =>
        item.id === selectedLot.id
          ? { ...item, currentHighestBid: amount, seller: bidder }
          : item
      )
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto bg-background min-h-screen font-sans text-foreground">

      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-normal mb-4">
        <Link to="/industry/dashboard" className="hover:text-foreground transition-colors">
          SmartScrap AI
        </Link>
        <ChevronRight size={14} className="text-muted-foreground/70" />
        <span className="text-foreground font-semibold">Auctions</span>
      </nav>

      {/* Page Title Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
          Auctions Console
        </h1>
        <p className="text-muted-foreground text-sm">
          Live bidding logs, current lot statuses, and auction performance overview.
        </p>
      </div>

      {/* KPI Stat Cards (Using SmartScrap UI Design Tokens) */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Live Auctions */}
        <div className="relative overflow-hidden p-4 md:p-5 bg-card text-card-foreground rounded-xl border border-border shadow-xs hover:shadow-md transition-shadow group">
          <div className="relative z-10 flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Live Auctions</h3>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/15 text-destructive">
              <Gavel className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xl font-bold text-foreground md:text-2xl">6</p>
              <p className="text-xs font-semibold text-warning">2 closing in 1 hr</p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Bidders */}
        <div className="relative overflow-hidden p-4 md:p-5 bg-card text-card-foreground rounded-xl border border-border shadow-xs hover:shadow-md transition-shadow group">
          <div className="relative z-10 flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Bidders</h3>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-info/15 text-info">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xl font-bold text-foreground md:text-2xl">72</p>
              <p className="text-xs font-semibold text-success">↗ +16</p>
            </div>
          </div>
        </div>

        {/* Card 3: Highest Bid Today */}
        <div className="relative overflow-hidden p-4 md:p-5 bg-card text-card-foreground rounded-xl border border-border shadow-xs hover:shadow-md transition-shadow group">
          <div className="relative z-10 flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Highest Bid Today</h3>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/15 text-success">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xl font-bold text-foreground md:text-2xl">₹12.84 L</p>
              <p className="text-xs font-semibold text-success">↗ +11.6%</p>
            </div>
          </div>
        </div>

        {/* Card 4: Lots Won */}
        <div className="relative overflow-hidden p-4 md:p-5 bg-card text-card-foreground rounded-xl border border-border shadow-xs hover:shadow-md transition-shadow group">
          <div className="relative z-10 flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Lots Won</h3>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/15 text-warning">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xl font-bold text-foreground md:text-2xl">27</p>
              <p className="text-xs font-semibold text-success">↗ +4</p>
            </div>
          </div>
        </div>

      </div>

      {/* Toolbar / Tabs & Search Box (Design Token Compliant) */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-4 bg-card p-3 md:p-4 rounded-xl shadow-xs border border-border mb-6">
        
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {["Live auctions", "Results", "Performance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-surface-muted text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-surface-muted border border-input text-foreground placeholder:text-muted-foreground text-xs md:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

      </div>

      {/* Tab 1: Live Auctions Grid View */}
      {activeTab === "Live auctions" && (
        <div className="space-y-4">
          {filteredAuctions.length === 0 ? (
            <div className="bg-card text-card-foreground rounded-xl p-12 text-center border border-border shadow-xs">
              <Gavel className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground">No auctions match your search</h3>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your keyword or search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAuctions.map((item) => (
                <div
                  key={item.id}
                  className="bg-card text-card-foreground rounded-3xl p-6 border border-border/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  {/* Card Top Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-snug">
                          {item.title}
                        </h3>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">
                          {item.id} · {item.quantity}
                        </div>
                      </div>

                      {/* Live Auction Badge */}
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border-0 flex items-center gap-1.5 shrink-0">
                        Live Auction
                      </span>
                    </div>

                    {/* Current Highest Bid Highlight Box */}
                    <div className="bg-primary/10 rounded-2xl p-4 my-4">
                      <div className="text-xs font-normal text-primary/80">
                        Current highest bid
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-primary tracking-tight mt-0.5">
                        {item.currentHighestBid}
                      </div>
                    </div>

                    {/* Item Details Grid (2 Columns) */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs py-1">
                      <div>
                        <span className="text-muted-foreground block font-medium mb-0.5">Starting price</span>
                        <span className="font-bold text-foreground text-sm">{item.startingPrice}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium mb-0.5">Bid increment</span>
                        <span className="font-bold text-foreground text-sm">{item.bidIncrement}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium mb-0.5">Total bidders</span>
                        <span className="font-bold text-foreground text-sm">{item.totalBidders}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium mb-0.5">Seller</span>
                        <span className="font-bold text-foreground text-sm truncate block" title={item.seller}>
                          {item.seller}
                        </span>
                      </div>
                    </div>

                    {/* Time Remaining & Progress Bar */}
                    <div className="mt-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-destructive mb-2">
                        <Clock className="w-3.5 h-3.5 text-destructive" />
                        <span>Ends in {item.endsIn}</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden border border-border/40">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => handleOpenLiveAuction(item)}
                      className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm rounded-2xl shadow-xs transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      Enter live auction
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Results View */}
      {activeTab === "Results" && (
        <div className="bg-card text-card-foreground rounded-xl border border-border p-4 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Completed Auction Results</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Historical log of concluded lots and winning bids.</p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-surface-muted px-3 py-1 rounded-lg border border-border">
              {completedAuctions.length} Concluded Lots
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-foreground">
              <thead className="bg-surface-muted text-muted-foreground font-bold uppercase tracking-wider text-[11px] border-y border-border">
                <tr>
                  <th className="py-3 px-4">Lot & Details</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Reserve Price</th>
                  <th className="py-3 px-4">Winning Bid</th>
                  <th className="py-3 px-4">Winner</th>
                  <th className="py-3 px-4">Date Concluded</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completedAuctions.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{item.title}</div>
                      <div className="text-[11px] text-muted-foreground">{item.id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{item.reservePrice}</td>
                    <td className="py-3.5 px-4 font-extrabold text-success">{item.winningBid}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{item.winner}</div>
                      <div className="text-[10px] text-muted-foreground">{item.totalBidders} bidders</div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{item.completedDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-success/15 text-success border border-success/30">
                        <CheckCircle2 size={12} />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Performance View */}
      {activeTab === "Performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card text-card-foreground p-4 md:p-6 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
                <span>Average Bid Surge</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">+14.2%</div>
              <div className="text-xs text-muted-foreground mt-1">Above reserve asking price</div>
            </div>

            <div className="bg-card text-card-foreground p-4 md:p-6 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
                <span>Bidder Participation</span>
                <Users className="w-4 h-4 text-info" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">16.5 Bidders</div>
              <div className="text-xs text-muted-foreground mt-1">Average per live auction lot</div>
            </div>

            <div className="bg-card text-card-foreground p-4 md:p-6 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
                <span>Auction Clearance Rate</span>
                <Award className="w-4 h-4 text-warning" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">96.8%</div>
              <div className="text-xs text-muted-foreground mt-1">Successfully closed & settled</div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 border border-border shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-1">Key Performance Breakdown</h2>
            <p className="text-xs text-muted-foreground mb-5">Quarterly metrics for scrap auctions clearance and volume.</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs md:text-sm font-semibold mb-1">
                  <span className="text-foreground">Ferrous Metal Recovery Rate</span>
                  <span className="text-primary font-bold">92%</span>
                </div>
                <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden border border-border/50">
                  <div className="bg-primary h-full rounded-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs md:text-sm font-semibold mb-1">
                  <span className="text-foreground">Non-Ferrous Premium Realization</span>
                  <span className="text-success font-bold">88%</span>
                </div>
                <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden border border-border/50">
                  <div className="bg-success h-full rounded-full w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs md:text-sm font-semibold mb-1">
                  <span className="text-foreground">Industrial Plastic Clearance Speed</span>
                  <span className="text-warning font-bold">78%</span>
                </div>
                <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden border border-border/50">
                  <div className="bg-warning h-full rounded-full w-[78%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Bids Detail & Action Modal */}
      <LiveBidsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lot={selectedLot}
        onAcceptBid={handleAcceptBid}
      />
    </div>
  );
};

export default IndustryAuctions;
