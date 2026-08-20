import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Download,
  Copy,
  Trash2,
  ChevronDown,
  CheckCircle
} from "lucide-react";

import MaterialTable from "../../components/common/MaterialTable";
import { myScrapTableConfig } from "../../configs/tables/myScrapTable.config";
import MyScrapAddModal from "../../components/industry/MyScrapAddModal";
import MyScrapEditModal from "../../components/industry/MyScrapEditModal";
import MyScrapViewModal from "../../components/industry/MyScrapViewModal";

const INITIAL_SCRAP_DATA = [
  {
    id: "INV-001",
    material: "MS Steel Scrap (Heavy Melting)",
    category: "Steel",
    weightKg: "24,500 kg",
    weightRawKg: 24500,
    qtyUnit: "24.5 MT",
    qtyRawMT: 24.5,
    condition: "Grade A",
    location: "Warehouse A - Bay 3",
    expPriceMT: "₹38,500",
    expPriceRaw: 38500,
    totalValue: 943250,
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 10, 2026"
  },
  {
    id: "INV-002",
    material: "Copper Wire Scrap",
    category: "Copper",
    weightKg: "3,200 kg",
    weightRawKg: 3200,
    qtyUnit: "3.2 MT",
    qtyRawMT: 3.2,
    condition: "Grade B",
    location: "Warehouse B - Bay 1",
    expPriceMT: "₹5,20,000",
    expPriceRaw: 520000,
    totalValue: 1664000,
    status: "Partially Listed",
    imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 11, 2026"
  },
  {
    id: "INV-003",
    material: "Aluminium Extrusion Scrap",
    category: "Aluminium",
    weightKg: "8,750 kg",
    weightRawKg: 8750,
    qtyUnit: "8.75 MT",
    qtyRawMT: 8.75,
    condition: "Grade A",
    location: "Warehouse A - Bay 7",
    expPriceMT: "₹1,85,000",
    expPriceRaw: 185000,
    totalValue: 1618750,
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 12, 2026"
  },
  {
    id: "INV-004",
    material: "HDPE Plastic Regrind",
    category: "Plastic",
    weightKg: "5,600 kg",
    weightRawKg: 5600,
    qtyUnit: "5.6 MT",
    qtyRawMT: 5.6,
    condition: "Grade B",
    location: "Warehouse C - Bay 2",
    expPriceMT: "₹62,000",
    expPriceRaw: 62000,
    totalValue: 347200,
    status: "Fully Listed",
    imageUrl: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 12, 2026"
  },
  {
    id: "INV-005",
    material: "E-Waste Mixed PCB",
    category: "Electronic Waste",
    weightKg: "1,200 kg",
    weightRawKg: 1200,
    qtyUnit: "1.2 MT",
    qtyRawMT: 1.2,
    condition: "Grade C",
    location: "Secure Storage - S1",
    expPriceMT: "₹95,000",
    expPriceRaw: 95000,
    totalValue: 114000,
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 13, 2026"
  },
  {
    id: "INV-006",
    material: "Cast Iron Borings",
    category: "Steel",
    weightKg: "18,000 kg",
    weightRawKg: 18000,
    qtyUnit: "18 MT",
    qtyRawMT: 18,
    condition: "Grade B",
    location: "Warehouse D - Bay 4",
    expPriceMT: "₹22,000",
    expPriceRaw: 22000,
    totalValue: 396000,
    status: "Sold",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 09, 2026"
  },
  {
    id: "INV-007",
    material: "Brass Turning Scrap",
    category: "Copper",
    weightKg: "2,100 kg",
    weightRawKg: 2100,
    qtyUnit: "2.1 MT",
    qtyRawMT: 2.1,
    condition: "Grade A",
    location: "Warehouse B - Bay 3",
    expPriceMT: "₹3,80,000",
    expPriceRaw: 380000,
    totalValue: 798000,
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 14, 2026"
  },
  {
    id: "INV-008",
    material: "Rubber Conveyor Belt Scrap",
    category: "Rubber",
    weightKg: "4,200 kg",
    weightRawKg: 4200,
    qtyUnit: "4.2 MT",
    qtyRawMT: 4.2,
    condition: "Grade C",
    location: "Warehouse C - Bay 5",
    expPriceMT: "₹28,000",
    expPriceRaw: 28000,
    totalValue: 117600,
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=150&auto=format&fit=crop&q=80",
    dateAdded: "Aug 14, 2026"
  }
];

const MyScrap = () => {
  // Inventory state
  const [scrapList, setScrapList] = useState(INITIAL_SCRAP_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [topSearch, setTopSearch] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Notifications / Toast
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Metrics Calculation (dynamic from current list)
  const metrics = useMemo(() => {
    const totalItems = scrapList.length;
    const available = scrapList.filter(item => item.status === "Available").length;
    const listed = scrapList.filter(item => item.status === "Partially Listed" || item.status === "Fully Listed").length;
    const sold = scrapList.filter(item => item.status === "Sold").length;
    
    const totalWeightMT = scrapList.reduce((sum, item) => sum + (item.qtyRawMT || 0), 0);
    const totalValue = scrapList.reduce((sum, item) => sum + (item.totalValue || 0), 0);

    return {
      totalItems,
      available,
      listed,
      sold,
      totalWeight: `${totalWeightMT.toFixed(1)} MT`,
      estValue: `₹${totalValue.toLocaleString('en-IN')}`
    };
  }, [scrapList]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return scrapList.filter((item) => {
      const q = (searchQuery || topSearch).toLowerCase();
      const matchesSearch = 
        !q ||
        item.material.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      const matchesStatus = 
        statusFilter === "All Status" || 
        item.status === statusFilter;

      const matchesCategory = 
        categoryFilter === "All Categories" || 
        item.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [scrapList, searchQuery, topSearch, statusFilter, categoryFilter]);

  // Row selection state, adapted between MaterialTable's { [id]: true } shape
  // (used by Material React Table's built-in checkbox column) and the plain
  // `selectedIds` array that the rest of this page's bulk-action logic uses.
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true])),
    [selectedIds]
  );

  const handleRowSelectionChange = (updaterOrValue) => {
    const nextSelection =
      typeof updaterOrValue === "function" ? updaterOrValue(rowSelection) : updaterOrValue;
    setSelectedIds(Object.keys(nextSelection).filter((id) => nextSelection[id]));
  };

  // CRUD Operations
  const handleAddScrap = (newLot) => {
    setScrapList(prev => [newLot, ...prev]);
    showToast(`Successfully added ${newLot.material} (${newLot.id}) to inventory!`);
  };

  const handleUpdateScrap = (updatedLot) => {
    setScrapList(prev => prev.map(item => item.id === updatedLot.id ? updatedLot : item));
    showToast(`Updated details for ${updatedLot.id}`);
  };

  // MaterialTable shows its own confirmation dialog before calling this, so
  // no window.confirm is needed here.
  const handleDeleteScrap = (item) => {
    setScrapList(prev => prev.filter(i => i.id !== item.id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== item.id));
    showToast(`Deleted ${item.id} from inventory.`);
  };

  const handleDuplicateScrap = (item) => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const duplicated = {
      ...item,
      id: `INV-0${nextNum}`,
      material: `${item.material} (Copy)`,
      status: "Available",
      dateAdded: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setScrapList(prev => [duplicated, ...prev]);
    showToast(`Duplicated ${item.id} as new lot ${duplicated.id}`);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected items?`)) {
      setScrapList(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      showToast(`Deleted selected items.`);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const itemsToExport = selectedIds.length > 0
      ? scrapList.filter(item => selectedIds.includes(item.id))
      : filteredItems;

    if (itemsToExport.length === 0) {
      alert("No scrap items to export.");
      return;
    }

    const headers = ["Inventory ID", "Material Name", "Category", "Weight (kg)", "Qty (MT)", "Condition", "Location", "Exp Price (₹/MT)", "Total Value (₹)", "Status", "Date Logged"];
    const rows = itemsToExport.map(item => [
      `"${item.id}"`,
      `"${item.material.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.weightKg}"`,
      `"${item.qtyUnit}"`,
      `"${item.condition}"`,
      `"${item.location}"`,
      `"${item.expPriceMT}"`,
      `"${item.totalValue}"`,
      `"${item.status}"`,
      `"${item.dateAdded || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `My_Scrap_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${itemsToExport.length} scrap items to CSV file!`);
  };

  return (
    <div className="space-y-5 font-sans pb-10 text-slate-800">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      

      {/* ================= 6 STAT CARDS ROW ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Total Items */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-center">
          <div className="text-2xl font-bold text-slate-900">{metrics.totalItems}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Total Items</div>
        </div>

        {/* Card 2: Available */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-center">
          <div className="text-2xl font-bold text-emerald-600">{metrics.available}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Available</div>
        </div>

        {/* Card 3: Listed */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-center">
          <div className="text-2xl font-bold text-blue-600">{metrics.listed}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Listed</div>
        </div>

        {/* Card 4: Sold */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-center">
          <div className="text-2xl font-bold text-slate-700">{metrics.sold}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Sold</div>
        </div>

        {/* Card 5: Total Weight */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-center">
          <div className="text-2xl font-bold text-slate-900">{metrics.totalWeight}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Total Weight</div>
        </div>

        {/* Card 6: Est. Value */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-center">
          <div className="text-2xl font-bold text-slate-900">{metrics.estValue}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Est. Value</div>
        </div>

      </div>

      {/* ================= CONTROLS & FILTER ROW ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          
          {/* Search by name or ID */}
          <div className="relative flex-1 sm:max-w-xs min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#855836] shadow-2xs"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#855836] shadow-2xs cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Available">Available</option>
              <option value="Partially Listed">Partially Listed</option>
              <option value="Fully Listed">Fully Listed</option>
              <option value="Sold">Sold</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Categories Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#855836] shadow-2xs cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Steel">Steel</option>
              <option value="Copper">Copper</option>
              <option value="Aluminium">Aluminium</option>
              <option value="Plastic">Plastic</option>
              <option value="Electronic Waste">Electronic Waste</option>
              <option value="Rubber">Rubber</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {(searchQuery || statusFilter !== "All Status" || categoryFilter !== "All Categories" || topSearch) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setTopSearch("");
                setStatusFilter("All Status");
                setCategoryFilter("All Categories");
              }}
              className="text-xs font-semibold text-rose-600 hover:underline px-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}

        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2 rounded-xl bg-[#855836] hover:bg-[#72492c] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Scrap
          </button>
        </div>

      </div>

      {/* ================= BULK ACTIONS BAR (When items selected) ================= */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#855836]"></span>
            <span className="text-xs font-bold text-amber-900">
              {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-100/50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Selected
            </button>

            {selectedIds.length === 1 && (
              <button
                onClick={() => handleDuplicateScrap(scrapList.find(item => item.id === selectedIds[0]))}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-100/50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
            )}

            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ================= INVENTORY TABLE ================= */}
      <MaterialTable
        config={myScrapTableConfig}
        data={filteredItems}
        getRowId={(row) => row.id}
        onView={(item) => setViewingItem(item)}
        onEdit={(item) => setEditingItem(item)}
        onDelete={handleDeleteScrap}
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
      />

      {/* ================= MODALS ================= */}
      <MyScrapAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddScrap={handleAddScrap}
        nextId={`INV-00${scrapList.length + 1}`}
      />

      {!!editingItem && (
        <MyScrapEditModal
          key={editingItem?.id}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          scrapItem={editingItem}
          onUpdateScrap={handleUpdateScrap}
        />
      )}

      <MyScrapViewModal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        scrapItem={viewingItem}
        onEdit={(item) => setEditingItem(item)}
      />

    </div>
  );
};

export default MyScrap;
