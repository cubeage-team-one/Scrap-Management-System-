import React, { useState, useMemo } from 'react';

// --- Helper SVG Icons ---
const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const RotateCcwIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CubeIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const ClockIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const GavelIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-7.5 7.5H4.5v-4.5l7.5-7.5zm0 0L17.25 7a1.5 1.5 0 012.122 0l1.128 1.128a1.5 1.5 0 010 2.122l-2.75 2.75" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CompareIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BookmarkIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Mock Data ---
const INITIAL_SCRAP_ITEMS = [
  {
    id: 1,
    title: 'Copper Scrap (Millberry)',
    code: 'SCR-10426',
    category: 'Non-Ferrous',
    status: 'Published',
    statusType: 'blue',
    quantity: '12.5 MT',
    condition: 'Clean',
    seller: 'Tata Precision Forgings',
    location: 'Pune - Unit 2',
    askingPrice: 742000,
    listedDate: '2026-07-28',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 2,
    title: 'Steel Turnings',
    code: 'SCR-10427',
    category: 'Ferrous',
    status: 'Live Auction',
    statusType: 'red',
    quantity: '48 MT',
    condition: 'Oily',
    seller: 'Bharat Steel Works',
    location: 'Jamshedpur - Yard A',
    askingPrice: 1284000,
    listedDate: '2026-07-27',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 3,
    title: 'Aluminium Extrusion 6063',
    code: 'SCR-10428',
    category: 'Non-Ferrous',
    status: 'Available',
    statusType: 'sky',
    quantity: '21.2 MT',
    condition: 'Clean',
    seller: 'Ashok Auto Components',
    location: 'Chennai - Plant 1',
    askingPrice: 396000,
    listedDate: '2026-07-27',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 4,
    title: 'Brass Honey Scrap',
    code: 'SCR-10425',
    category: 'Non-Ferrous',
    status: 'Pending',
    statusType: 'amber',
    quantity: '6.8 MT',
    condition: 'Mixed',
    seller: 'Gujarat Brass Industries',
    location: 'Rajkot - Store 3',
    askingPrice: 312000,
    listedDate: '2026-07-26',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 5,
    title: 'HDPE Plastic Regrind',
    code: 'SCR-10424',
    category: 'Polymer',
    status: 'Approved',
    statusType: 'emerald',
    quantity: '33 MT',
    condition: 'Baled',
    seller: 'Surat Polymers Ltd.',
    location: 'Surat - Warehouse B',
    askingPrice: 148500,
    listedDate: '2026-07-25',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 6,
    title: 'E-Waste PCB Assorted',
    code: 'SCR-10423',
    category: 'E-Waste',
    status: 'Sold',
    statusType: 'emerald-dark',
    quantity: '4.4 MT',
    condition: 'Sorted',
    seller: 'Nexa Electronics',
    location: 'Bengaluru - Hub',
    askingPrice: 528000,
    listedDate: '2026-07-24',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 7,
    title: 'CNC Machine Parts',
    code: 'SCR-10422',
    category: 'Machinery',
    status: 'Draft',
    statusType: 'zinc',
    quantity: '18 Units',
    condition: 'Used',
    seller: 'Tata Precision Forgings',
    location: 'Pune - Unit 2',
    askingPrice: 260000,
    listedDate: '2026-07-23',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 8,
    title: 'Cotton Textile Waste',
    code: 'SCR-10421',
    category: 'Textile',
    status: 'Published',
    statusType: 'blue',
    quantity: '26.7 MT',
    condition: 'Baled',
    seller: 'Tiruppur Knitwear',
    location: 'Tiruppur - Shed 4',
    askingPrice: 94000,
    listedDate: '2026-07-22',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 9,
    title: 'Kraft Paper Waste',
    code: 'SCR-10420',
    category: 'Paper',
    status: 'Auction Ended',
    statusType: 'gray',
    quantity: '52 MT',
    condition: 'Dry',
    seller: 'Central Packaging',
    location: 'Nagpur - Depot',
    askingPrice: 78000,
    listedDate: '2026-07-21',
    watchingCount: 6,
    auctionReady: true,
  },
  {
    id: 10,
    title: 'Rubber Tyre Scrap',
    code: 'SCR-10419',
    category: 'Rubber',
    status: 'Completed',
    statusType: 'emerald',
    quantity: '40 MT',
    condition: 'Shredded',
    seller: 'Punjab Tyres',
    location: 'Ludhiana - Yard',
    askingPrice: 112000,
    listedDate: '2026-07-20',
    watchingCount: 6,
    auctionReady: true,
  },
];

const CATEGORIES = [
  'Ferrous',
  'Non-Ferrous',
  'Polymer',
  'E-Waste',
  'Machinery',
  'Textile',
  'Paper',
  'Rubber',
];

const LOCATIONS = [
  'All India',
  'Maharashtra',
  'Gujarat',
  'Tamil Nadu',
  'Punjab',
  'Jharkhand',
  'Karnataka',
];

const formatCurrency = (val) => '₹' + Number(val).toLocaleString('en-IN');

// --- Reusable Status Badge ---
const StatusBadge = ({ status, statusType }) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-rose-50 text-rose-600 border-rose-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'emerald-dark': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    zinc: 'bg-slate-100 text-slate-500 border-slate-200/80',
    gray: 'bg-slate-100 text-slate-500 border-slate-200/80',
  };

  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border whitespace-nowrap ${styles[statusType] || styles.gray}`}>
      {statusType === 'red' && (
        <span className="inline-block w-1.5 h-1.5 mr-1 rounded-full bg-rose-500 animate-pulse" />
      )}
      {status}
    </span>
  );
};

// --- Reusable Scrap Card ---
const ScrapCard = React.memo(({ item, onQuotationClick, onToggleCompare, isCompared }) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
    <div className="h-44 bg-slate-50/80 border-b border-slate-100 flex items-center justify-center relative">
      <div className="p-4 bg-white rounded-2xl shadow-2xs border border-slate-100/90 text-slate-400 group-hover:scale-105 transition-transform duration-200">
        <CubeIcon className="w-9 h-9 stroke-[1.25]" />
      </div>

      <label className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-medium hover:bg-slate-50 transition-colors">
        <input
          type="checkbox"
          checked={isCompared}
          onChange={() => onToggleCompare(item.id)}
          className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300 cursor-pointer"
        />
        <span>Compare</span>
      </label>
    </div>

    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-blue-600 text-sm leading-snug line-clamp-1 group-hover:underline">
            {item.title}
          </h3>
          <StatusBadge status={item.status} statusType={item.statusType} />
        </div>

        <p className="text-[12px] text-slate-500 font-normal mt-0.5">
          {item.code} · <span className="text-slate-700 font-medium">{item.category}</span>
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 pt-2.5 border-t border-slate-100 text-[12px]">
          <div>
            <span className="text-slate-400 text-[11px] block font-normal">Quantity</span>
            <span className="font-bold text-slate-900">{item.quantity}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block font-normal">Condition</span>
            <span className="font-bold text-slate-900">{item.condition}</span>
          </div>
        </div>

        <div className="mt-2.5 text-[12px]">
          <span className="text-slate-400 text-[11px] block font-normal">Seller · Location</span>
          <p className="font-medium text-slate-800 truncate" title={`${item.seller} · ${item.location}`}>
            {item.seller} · {item.location}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <div className="min-w-0 flex-1">
            <span className="text-slate-400 text-[11px] block font-normal leading-tight">Asking price</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug truncate block">
              {formatCurrency(item.askingPrice)}
            </span>
          </div>

          <button
            onClick={() => onQuotationClick(item)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-2xs hover:shadow whitespace-nowrap shrink-0 cursor-pointer"
          >
            Submit quotation
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-y-1 text-[11px] text-slate-400 pt-2.5 mt-2 border-t border-slate-100/70">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3 text-slate-400" />
            Listed {item.listedDate}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon className="w-3 h-3 text-slate-400" />
            {item.watchingCount} watching
          </span>
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <GavelIcon className="w-3 h-3 text-slate-400" />
            {item.auctionReady ? 'Auction ready' : 'Standard'}
          </span>
        </div>
      </div>
    </div>
  </div>
));

// --- Modal for Submitting Quotation ---
const SubmitQuotationModal = ({ item, onClose, onSubmitSuccess }) => {
  const [offerPrice, setOfferPrice] = useState(item ? item.askingPrice : '');
  const [quantityRequired, setQuantityRequired] = useState(item ? item.quantity : '');
  const [noteToSeller, setNoteToSeller] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(`Quotation of ${formatCurrency(offerPrice)} submitted for ${item.title}!`);
      onClose();
    }, 400);
  };

  const sellerShortName = item.seller || 'Seller';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-100 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <XIcon className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900">Submit quotation</h2>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {item.title} - {item.quantity} - {sellerShortName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Your offer (₹)</label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
              min="1"
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="742000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Quantity required</label>
            <input
              type="text"
              value={quantityRequired}
              onChange={(e) => setQuantityRequired(e.target.value)}
              required
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="12.5 MT"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Note to seller</label>
            <textarea
              rows={3}
              value={noteToSeller}
              onChange={(e) => setNoteToSeller(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Payment terms, lifting schedule, transport arrangement..."
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl shadow-xs transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Send quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Modal for Item Comparison ---
const CompareModal = ({ comparedItems, onClose, onRemoveCompare }) => {
  if (!comparedItems || comparedItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Compare Listings ({comparedItems.length})
            </h2>
            <p className="text-xs text-slate-500">Side-by-side spec comparison</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 bg-slate-50 font-semibold text-slate-600 w-32">Attribute</th>

                {comparedItems.map((item) => (
                  <th
                    key={item.id}
                    className="p-3 font-semibold text-slate-900 border-l border-slate-100 min-w-[180px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-[140px]">{item.title}</span>
                      <button
                        onClick={() => onRemoveCompare(item.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Code</td>
                {comparedItems.map((item) => (
                  <td key={item.id} className="p-3 border-l border-slate-100 text-slate-800 font-mono">
                    {item.code}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Asking Price</td>
                {comparedItems.map((item) => (
                  <td key={item.id} className="p-3 border-l border-slate-100 font-bold text-slate-900">
                    {formatCurrency(item.askingPrice)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Category</td>
                {comparedItems.map((item) => (
                  <td key={item.id} className="p-3 border-l border-slate-100 text-slate-700">
                    {item.category}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Quantity</td>
                {comparedItems.map((item) => (
                  <td key={item.id} className="p-3 border-l border-slate-100 text-slate-700">
                    {item.quantity}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Condition</td>
                {comparedItems.map((item) => (
                  <td key={item.id} className="p-3 border-l border-slate-100 text-slate-700">
                    {item.condition}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-500 bg-slate-50/50">Seller</td>
                {comparedItems.map((item) => (
                  <td key={item.id} className="p-3 border-l border-slate-100 text-slate-700">
                    {item.seller} · {item.location}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main Industry Marketplace Page Component ---
const IndustryMarketplace = () => {
  const [items] = useState(INITIAL_SCRAP_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(1500000);
  const [selectedLocation, setSelectedLocation] = useState('All India');
  const [comparedIds, setComparedIds] = useState([1, 2]);
  const [selectedQuotationItem, setSelectedQuotationItem] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleCompare = (id) => {
    setComparedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange(1500000);
    setSelectedLocation('All India');
  };

  const showToast = (msg) => {
    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = searchQuery.toLowerCase().trim();

      const matchSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.seller.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchCategory =
        !selectedCategory || item.category === selectedCategory;

      const matchPrice = item.askingPrice <= priceRange;

      const matchLocation =
        selectedLocation === 'All India' ||
        item.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        (
          selectedLocation === 'Maharashtra' &&
          ['Pune', 'Nagpur'].some(city =>
            item.location.toLowerCase().includes(city.toLowerCase())
          )
        );

      return matchSearch && matchCategory && matchPrice && matchLocation;
    });
  }, [items, searchQuery, selectedCategory, priceRange, selectedLocation]);

  const comparedItemsList = useMemo(
    () => items.filter((item) => comparedIds.includes(item.id)),
    [items, comparedIds]
  );

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans p-3 sm:p-5 lg:p-7 relative">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-800 max-w-md w-[92%] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium text-slate-100">{toastMessage}</span>

          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto pl-2 text-slate-400 hover:text-white"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <nav className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <span>SmartScrap AI</span>
            <span>&rsaquo;</span>
            <span>Marketplace</span>
            <span>&rsaquo;</span>
            <span className="text-slate-600">Browse Scrap</span>
          </nav>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Marketplace
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            1,842 MT of verified scrap from 486 industries, updated in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs"
          >
            <FilterIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <CompareIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Compare ({comparedIds.length})</span>
          </button>

          <button
            onClick={() => showToast("Loaded saved search preset: 'Non-Ferrous & Ferrous Scrap'")}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <BookmarkIcon className="w-3.5 h-3.5 text-white/90" />
            <span>Saved searches</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside
          className={`w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-6 ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FilterIcon className="w-4 h-4 text-slate-500" />
              Advanced filters
            </h3>

            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Search
            </label>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Material or plant"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Category
            </label>

            <div className="space-y-1.5 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 py-0.5">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="rounded-full text-blue-600 focus:ring-blue-500 border-slate-300 h-3.5 w-3.5 cursor-pointer"
                />
                <span className={selectedCategory === '' ? 'font-semibold text-slate-900' : ''}>
                  All Categories
                </span>
              </label>

              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer hover:text-slate-900 py-0.5"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="rounded-full text-blue-600 focus:ring-blue-500 border-slate-300 h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className={selectedCategory === cat ? 'font-semibold text-slate-900' : ''}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Price per MT (₹)
            </label>

            <input
              type="range"
              min="25000"
              max="1500000"
              step="25000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
              ₹25,000 – {formatCurrency(priceRange)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Location
            </label>

            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-all"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-medium rounded-xl border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcwIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset filters</span>
          </button>
        </aside>

        <main className="flex-1 min-w-0">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
              <CubeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">
                No matching scrap listings found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search terms or resetting filters.
              </p>

              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-xl shadow-2xs hover:bg-blue-700 transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <ScrapCard
                  key={item.id}
                  item={item}
                  onQuotationClick={setSelectedQuotationItem}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedIds.includes(item.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedQuotationItem && (
        <SubmitQuotationModal
          item={selectedQuotationItem}
          onClose={() => setSelectedQuotationItem(null)}
          onSubmitSuccess={showToast}
        />
      )}

      {isCompareModalOpen && (
        <CompareModal
          comparedItems={comparedItemsList}
          onClose={() => setIsCompareModalOpen(false)}
          onRemoveCompare={handleToggleCompare}
        />
      )}
    </div>
  );
};

export default IndustryMarketplace;