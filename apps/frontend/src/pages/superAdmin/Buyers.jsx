import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  X,
  Check,
  CheckCircle,
  Trash2,
} from "lucide-react";

const INITIAL_BUYERS = [
  { id: "BUY-3312", name: "Verma Recycling Pvt. Ltd.", initials: "VE", type: "Recycler", location: "Kanpur, UP", spend: 4860000, status: "Approved", date: "28 Jul 2026" },
  { id: "BUY-3311", name: "EcoSteel Remelters", initials: "EC", type: "Steel Plant", location: "Raipur, CG", spend: 7220000, status: "Approved", date: "26 Jul 2026" },
  { id: "BUY-3310", name: "Polymer Reclaim India", initials: "PO", type: "Plastics", location: "Vapi, GJ", spend: 1560000, status: "Pending", date: "25 Jul 2026" },
  { id: "BUY-3309", name: "Southern Copper Refiners", initials: "SO", type: "Refinery", location: "Coimbatore, TN", spend: 9340000, status: "Approved", date: "23 Jul 2026" },
  { id: "BUY-3308", name: "Urban Paper Mills", initials: "UR", type: "Paper", location: "Ludhiana, PB", spend: 640000, status: "Completed", date: "21 Jul 2026" },
];

const STATUSES = ["All statuses", "Approved", "Pending", "Completed"];
const TYPES = ["All types", "Recycler", "Steel Plant", "Plastics", "Refinery", "Paper"];

const money = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

const Buyers = () => {
  const [buyers, setBuyers] = useState(INITIAL_BUYERS);
  const [search, setSearch] = useState("");

  // Top Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "All statuses",
    type: "All types",
    location: "All locations",
    min: "",
    max: "",
  });

  // Selection & Sort States
  const [selected, setSelected] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Modals & Dynamic Menu States
  const [actionMenu, setActionMenu] = useState(null);
  const [viewBuyer, setViewBuyer] = useState(null);
  const [editBuyer, setEditBuyer] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Form State for Invite Buyer (Now including Email ID)
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    type: "Recycler",
    location: "",
    spend: "",
    status: "Pending",
  });

  const menuRef = useRef(null);

  // Dynamic Location List
  const locationsList = useMemo(() => {
    return ["All locations", ...new Set(buyers.map((b) => b.location))];
  }, [buyers]);

  // Close floating action menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return buyers
      .filter((buyer) => {
        const matchesSearch =
          !query ||
          `${buyer.name} ${buyer.id} ${buyer.type} ${buyer.location}`
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          filters.status === "All statuses" || buyer.status === filters.status;

        const matchesType =
          filters.type === "All types" || buyer.type === filters.type;

        const matchesLocation =
          filters.location === "All locations" || buyer.location === filters.location;

        const matchesMin = !filters.min || buyer.spend >= Number(filters.min);
        const matchesMax = !filters.max || buyer.spend <= Number(filters.max);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType &&
          matchesLocation &&
          matchesMin &&
          matchesMax
        );
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [buyers, search, filters, sortField, sortAsc]);

  // Checkbox Selection Logic
  const visibleIds = filteredData.map((b) => b.id);
  const isAllSelected =
    filteredData.length > 0 && visibleIds.every((id) => selected.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected(selected.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelected(Array.from(new Set([...selected, ...visibleIds])));
    }
  };

  const toggleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Checkbox Action Bar Handlers
  const handleApproveSelected = () => {
    setBuyers((prev) =>
      prev.map((b) => (selected.includes(b.id) ? { ...b, status: "Approved" } : b))
    );
    setSelected([]);
  };

  const handleCompletedSelected = () => {
    setBuyers((prev) =>
      prev.map((b) => (selected.includes(b.id) ? { ...b, status: "Completed" } : b))
    );
    setSelected([]);
  };

  const handleDeleteSelected = () => {
    setBuyers((prev) => prev.filter((b) => !selected.includes(b.id)));
    setSelected([]);
  };

  const handleExportSelected = () => {
    alert(`Exporting ${selected.length} selected buyers...`);
  };

  // Smart Viewport Position for Row Action Menu
  const openActionMenu = (e, buyer) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 140;
    const menuHeight = 115;
    const gap = 6;

    const openUpward = window.innerHeight - rect.bottom < menuHeight;
    const top = openUpward ? rect.top - menuHeight - gap : rect.bottom + gap;
    const left = Math.min(
      rect.right - menuWidth,
      window.innerWidth - menuWidth - 10
    );

    setActionMenu({
      buyer,
      top: Math.max(8, top),
      left: Math.max(8, left),
    });
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({
      status: "All statuses",
      type: "All types",
      location: "All locations",
      min: "",
      max: "",
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editBuyer) return;
    setBuyers((prev) =>
      prev.map((b) => (b.id === editBuyer.id ? editBuyer : b))
    );
    setEditBuyer(null);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;

    const initials = inviteForm.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newBuyer = {
      id: `BUY-${Math.floor(1000 + Math.random() * 9000)}`,
      name: inviteForm.name,
      initials: initials || "BY",
      type: inviteForm.type,
      location: inviteForm.location || "Mumbai, MH",
      spend: Number(inviteForm.spend) || 0,
      status: inviteForm.status,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setBuyers([newBuyer, ...buyers]);
    setShowInviteModal(false);
    setInviteForm({ name: "", email: "", type: "Recycler", location: "", spend: "", status: "Pending" });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]";
      case "Pending":
        return "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]";
      case "Completed":
        return "bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 sm:p-5 lg:p-6 text-slate-800 font-sans">
      
      {/* BREADCRUMB */}
      <div className="flex items-center text-xs text-slate-400 gap-1.5 mb-2">
        <span>SmartScrap AI</span>
        <span>›</span>
        <span>Network</span>
        <span>›</span>
        <span className="text-slate-800 font-medium">Buyers</span>
      </div>

      {/* HEADER TITLE & TOP BUTTONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Buyers</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Recyclers and consumers purchasing scrap on the platform.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 sm:px-3.5 py-2 border rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm ${
              showFilters
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 px-3.5 sm:px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <span>+ Invite buyer</span>
          </button>
        </div>
      </div>

      {/* EXPANDABLE TOP FILTER PANEL */}
      {showFilters && (
        <div className="mb-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end transition-all">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs sm:text-sm bg-white outline-none focus:border-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs sm:text-sm bg-white outline-none focus:border-blue-500"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs sm:text-sm bg-white outline-none focus:border-blue-500"
            >
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Min Spend</label>
            <input
              type="number"
              placeholder="₹ Minimum"
              value={filters.min}
              onChange={(e) => setFilters({ ...filters, min: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Max Spend</label>
            <input
              type="number"
              placeholder="₹ Maximum"
              value={filters.max}
              onChange={(e) => setFilters({ ...filters, max: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <button
              onClick={clearFilters}
              className="h-9 px-3 text-xs sm:text-sm text-blue-600 hover:underline font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* FLOATING SELECTION ACTION BAR */}
      {selected.length > 0 && (
        <div className="mb-4 px-3 sm:px-4 py-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm transition-all">
          <div className="flex items-center space-x-2 pl-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
            <span className="text-xs sm:text-sm font-bold text-[#1E3A8A]">
              {selected.length} {selected.length === 1 ? "buyer" : "buyers"} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportSelected}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-[#BFDBFE] text-[#1D4ED8] rounded-full text-xs font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected</span>
            </button>

            <button
              onClick={handleApproveSelected}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full text-xs font-semibold transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>

            <button
              onClick={handleCompletedSelected}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-full text-xs font-semibold transition-colors shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Completed</span>
            </button>

            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-full text-xs font-semibold transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => setSelected([])}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* TABLE CONTAINER CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full sm:w-auto appearance-none pl-8 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <SlidersHorizontal className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={() => alert("Exporting buyer list...")}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 sm:p-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                  />
                </th>
                <th onClick={() => handleSort("name")} className="p-3.5 sm:p-4 cursor-pointer hover:text-slate-800">
                  <div className="flex items-center space-x-1">
                    <span>Buyer</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("type")} className="p-3.5 sm:p-4 cursor-pointer hover:text-slate-800">
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 sm:p-4">LOCATION</th>
                <th onClick={() => handleSort("spend")} className="p-3.5 sm:p-4 cursor-pointer hover:text-slate-800">
                  <div className="flex items-center space-x-1">
                    <span>Spend</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 sm:p-4">STATUS</th>
                <th onClick={() => handleSort("date")} className="p-3.5 sm:p-4 cursor-pointer hover:text-slate-800">
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 sm:p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((buyer) => {
                  const isSelected = selected.includes(buyer.id);
                  return (
                    <tr
                      key={buyer.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="p-3.5 sm:p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(buyer.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                            {buyer.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 leading-snug">
                              {buyer.name}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              {buyer.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4 text-slate-600 font-medium">{buyer.type}</td>
                      <td className="p-3.5 sm:p-4 text-slate-600">{buyer.location}</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-slate-900">{money(buyer.spend)}</td>

                      <td className="p-3.5 sm:p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadge(
                            buyer.status
                          )}`}
                        >
                          {buyer.status}
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4 text-slate-500 text-xs">{buyer.date}</td>

                      <td className="p-3.5 sm:p-4 text-right">
                        <button
                          onClick={(e) => openActionMenu(e, buyer)}
                          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 text-xs sm:text-sm">
                    No buyers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing 1–{filteredData.length} of {buyers.length}
          </div>

          <div className="flex items-center space-x-1">
            <button disabled className="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-md text-slate-300 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-[#2563EB] text-white rounded-md font-medium">
              1
            </button>
            <button disabled className="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-md text-slate-300 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION MENU (FIXED OVERLAY - NO CUTOFF) */}
      {actionMenu && (
        <div
          ref={menuRef}
          className="fixed z-[100] w-36 bg-white border border-slate-200 rounded-lg shadow-xl py-1 text-left"
          style={{
            top: actionMenu.top,
            left: actionMenu.left,
          }}
        >
          <button
            onClick={() => {
              setViewBuyer(actionMenu.buyer);
              setActionMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            View buyer
          </button>
          <button
            onClick={() => {
              setEditBuyer(actionMenu.buyer);
              setActionMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Edit buyer
          </button>
          <button
            onClick={() => {
              setBuyers((prev) => prev.filter((b) => b.id !== actionMenu.buyer.id));
              setSelected((prev) => prev.filter((id) => id !== actionMenu.buyer.id));
              setActionMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            Remove
          </button>
        </div>
      )}

      {/* VIEW BUYER INFO POPUP MODAL */}
      {viewBuyer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Buyer Details</h3>
              <button onClick={() => setViewBuyer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-xs text-slate-400">Buyer Name</p>
                <p className="font-semibold text-slate-800 mt-0.5">{viewBuyer.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Buyer ID</p>
                <p className="font-mono text-slate-800 mt-0.5">{viewBuyer.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Type</p>
                <p className="font-medium text-slate-800 mt-0.5">{viewBuyer.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="font-medium text-slate-800 mt-0.5">{viewBuyer.location}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Spend</p>
                <p className="font-semibold text-slate-900 mt-0.5">{money(viewBuyer.spend)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Date Joined</p>
                <p className="font-medium text-slate-800 mt-0.5">{viewBuyer.date}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadge(viewBuyer.status)}`}>
                  {viewBuyer.status}
                </span>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewBuyer(null)}
                className="px-4 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#1D4ED8]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BUYER POPUP MODAL */}
      {editBuyer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Edit Buyer</h3>
              <button onClick={() => setEditBuyer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Buyer Name</label>
                <input
                  type="text"
                  value={editBuyer.name}
                  onChange={(e) => setEditBuyer({ ...editBuyer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={editBuyer.type}
                  onChange={(e) => setEditBuyer({ ...editBuyer, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500 bg-white"
                >
                  {TYPES.slice(1).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editBuyer.location}
                  onChange={(e) => setEditBuyer({ ...editBuyer, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Spend (₹)</label>
                <input
                  type="number"
                  value={editBuyer.spend}
                  onChange={(e) => setEditBuyer({ ...editBuyer, spend: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editBuyer.status}
                  onChange={(e) => setEditBuyer({ ...editBuyer, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500 bg-white"
                >
                  {STATUSES.slice(1).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditBuyer(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVITE BUYER MODAL (WITH EMAIL ID) */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Invite New Buyer</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Recycling Ltd."
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Added Email ID Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="buyer@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={inviteForm.type}
                  onChange={(e) => setInviteForm({ ...inviteForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500 bg-white"
                >
                  {TYPES.slice(1).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad, GJ"
                  value={inviteForm.location}
                  onChange={(e) => setInviteForm({ ...inviteForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Spend (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={inviteForm.spend}
                  onChange={(e) => setInviteForm({ ...inviteForm, spend: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Buyers;