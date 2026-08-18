import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";

const INITIAL_INDUSTRIES = [
  {
    id: "1",
    initials: "TA",
    companyName: "Tata Precision Forgings",
    code: "IND-1042",
    sector: "Automobile",
    location: "Pune, MH",
    tradedValue: 19400000,
    tradedValueDisplay: "₹1,94,00,000",
    status: "Approved",
    date: "28 Jul 2026",
    contactPerson: "Rajesh Sharma",
    email: "procurement@tataprecision.com",
    phone: "+91 98230 12345",
    gstNumber: "27AAACT2727Q1ZB",
  },
  {
    id: "2",
    initials: "BH",
    companyName: "Bharat Steel Works",
    code: "IND-1041",
    sector: "Steel Plant",
    location: "Jamshedpur, JH",
    tradedValue: 42800000,
    tradedValueDisplay: "₹4,28,00,000",
    status: "Approved",
    date: "27 Jul 2026",
    contactPerson: "Alok Mukherjee",
    email: "scrap.sales@bharatsteel.com",
    phone: "+91 94311 88900",
    gstNumber: "20AABCB4411K1Z2",
  },
  {
    id: "3",
    initials: "NE",
    companyName: "Nexa Electronics",
    code: "IND-1040",
    sector: "Electronics",
    location: "Bengaluru, KA",
    tradedValue: 8600000,
    tradedValueDisplay: "₹86,00,000",
    status: "Approved",
    date: "27 Jul 2026",
    contactPerson: "Priya Sundaram",
    email: "e-waste@nexaelectronics.io",
    phone: "+91 98450 67123",
    gstNumber: "29AAGCN9921D1ZZ",
  },
  {
    id: "4",
    initials: "SU",
    companyName: "Surat Polymers Ltd.",
    code: "IND-1039",
    sector: "Plastics",
    location: "Surat, GJ",
    tradedValue: 5400000,
    tradedValueDisplay: "₹54,00,000",
    status: "Pending",
    date: "26 Jul 2026",
    contactPerson: "Kishore Patel",
    email: "recycling@suratpolymers.in",
    phone: "+91 98251 44321",
    gstNumber: "24AACCS3322E1ZW",
  },
  {
    id: "5",
    initials: "TI",
    companyName: "Tiruppur Knitwear",
    code: "IND-1038",
    sector: "Textile",
    location: "Tiruppur, TN",
    tradedValue: 2100000,
    tradedValueDisplay: "₹21,00,000",
    status: "Rejected",
    date: "25 Jul 2026",
    contactPerson: "M. Saravanan",
    email: "waste@tiruppurknitwear.org",
    phone: "+91 94432 99881",
    gstNumber: "33AAACT1190L1ZO",
  },
  {
    id: "6",
    initials: "AS",
    companyName: "Ashok Auto Components",
    code: "IND-1037",
    sector: "Automobile",
    location: "Chennai, TN",
    tradedValue: 15200000,
    tradedValueDisplay: "₹1,52,00,000",
    status: "Approved",
    date: "24 Jul 2026",
    contactPerson: "V. Raghavan",
    email: "admin@ashokautocomp.com",
    phone: "+91 98840 55214",
    gstNumber: "33AABCA8844H1ZX",
  },
  {
    id: "7",
    initials: "MA",
    companyName: "Mahindra Heavy Engineering",
    code: "IND-1036",
    sector: "Manufacturing",
    location: "Nashik, MH",
    tradedValue: 31500000,
    tradedValueDisplay: "₹3,15,00,000",
    status: "Approved",
    date: "23 Jul 2026",
    contactPerson: "Sanjay Deshmukh",
    email: "disposal@mahindraheavy.com",
    phone: "+91 98220 77112",
    gstNumber: "27AAACM1234F1ZA",
  },
];

const SECTORS = [
  "All Sectors",
  "Automobile",
  "Steel Plant",
  "Electronics",
  "Plastics",
  "Textile",
  "Manufacturing",
];

const STATUS_LIST = ["All statuses", "Approved", "Pending", "Rejected"];

export default function Industries() {
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortField, setSortField] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal States
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    sector: "Automobile",
    location: "",
    tradedValue: "",
    status: "Approved",
    contactPerson: "",
    email: "",
    phone: "",
    gstNumber: "",
  });

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & Sort Logic
  const filteredIndustries = useMemo(() => {
    let result = [...industries];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.companyName.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.sector.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q) ||
          item.date.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (selectedStatus !== "All statuses") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    // Sector filter
    if (selectedSector !== "All Sectors") {
      result = result.filter((item) => item.sector === selectedSector);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField] ?? "";
      let bVal = b[sortField] ?? "";

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [industries, searchQuery, selectedStatus, selectedSector, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredIndustries.length / pageSize));
  const paginatedIndustries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIndustries.slice(start, start + pageSize);
  }, [filteredIndustries, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedIndustries.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedIndustries.map((item) => item.id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rId) => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Status Badge Renderer using SmartScrap UI Design Tokens
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-success/15 text-success border border-success/30">
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-warning/15 text-warning border border-warning/30">
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-destructive/15 text-destructive border border-destructive/30">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border">
            {status}
          </span>
        );
    }
  };

  // Export to CSV
  const handleExport = () => {
    const dataToExport =
      selectedRows.length > 0
        ? industries.filter((item) => selectedRows.includes(item.id))
        : filteredIndustries;

    const headers = [
      "ID",
      "Company Name",
      "Code",
      "Sector",
      "Location",
      "Traded Value",
      "Status",
      "Date",
      "Contact Person",
      "Email",
      "Phone",
      "GST Number",
    ];

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        [
          `"${row.id}"`,
          `"${row.companyName}"`,
          `"${row.code}"`,
          `"${row.sector}"`,
          `"${row.location}"`,
          `"${row.tradedValueDisplay}"`,
          `"${row.status}"`,
          `"${row.date}"`,
          `"${row.contactPerson || ""}"`,
          `"${row.email || ""}"`,
          `"${row.phone || ""}"`,
          `"${row.gstNumber || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Industries_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Form submission: Onboard / Add
  const handleAddIndustry = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.location) return;

    const words = formData.companyName.trim().split(" ");
    const initials =
      words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : words[0].slice(0, 2).toUpperCase();

    const rawVal = parseFloat(formData.tradedValue) || 0;
    const formattedVal = "₹" + rawVal.toLocaleString("en-IN");
    const nextCode = "IND-" + (1043 + industries.length);

    const newIndustry = {
      id: String(Date.now()),
      initials,
      companyName: formData.companyName,
      code: nextCode,
      sector: formData.sector,
      location: formData.location,
      tradedValue: rawVal,
      tradedValueDisplay: formattedVal,
      status: formData.status,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      gstNumber: formData.gstNumber,
    };

    setIndustries([newIndustry, ...industries]);
    setIsOnboardModalOpen(false);
    setFormData({
      companyName: "",
      sector: "Automobile",
      location: "",
      tradedValue: "",
      status: "Approved",
      contactPerson: "",
      email: "",
      phone: "",
      gstNumber: "",
    });
  };

  // Form submission: Edit
  const handleEditIndustry = (e) => {
    e.preventDefault();
    if (!activeIndustry) return;

    const rawVal = parseFloat(formData.tradedValue) || activeIndustry.tradedValue;
    const formattedVal =
      typeof formData.tradedValue === "string" && formData.tradedValue.startsWith("₹")
        ? formData.tradedValue
        : "₹" + rawVal.toLocaleString("en-IN");

    const updated = industries.map((item) => {
      if (item.id === activeIndustry.id) {
        return {
          ...item,
          companyName: formData.companyName,
          sector: formData.sector,
          location: formData.location,
          tradedValue: rawVal,
          tradedValueDisplay: formattedVal,
          status: formData.status,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          gstNumber: formData.gstNumber,
        };
      }
      return item;
    });

    setIndustries(updated);
    setIsEditModalOpen(false);
    setActiveIndustry(null);
  };

  // Delete Industry
  const handleDeleteIndustry = () => {
    if (!activeIndustry) return;
    setIndustries(industries.filter((item) => item.id !== activeIndustry.id));
    setSelectedRows(selectedRows.filter((id) => id !== activeIndustry.id));
    setIsDeleteModalOpen(false);
    setActiveIndustry(null);
  };

  // Status quick update
  const handleQuickStatusChange = (id, newStatus) => {
    setIndustries(
      industries.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setActiveMenuId(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= BREADCRUMBS ================= */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-normal">
          <Link to="/admin/dashboard" className="hover:text-foreground transition-colors">
            SmartScrap AI
          </Link>
          <ChevronRight size={14} className="text-muted-foreground/70" />
          <span className="text-foreground font-semibold">Industries</span>
        </nav>

        {/* ================= HEADER & ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Industries
            </h1>
            <p className="mt-1 text-sm text-muted-foreground font-normal">
              Registered manufacturing plants and their trade volume.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filters Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-foreground bg-card border border-border hover:border-border/80 rounded-lg hover:bg-muted transition-colors shadow-2xs cursor-pointer"
            >
              <span>Filters</span>
              {(selectedStatus !== "All statuses" || selectedSector !== "All Sectors") && (
                <span className="w-2 h-2 rounded-full bg-primary ml-2"></span>
              )}
            </button>

            {/* Onboard industry Button */}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  companyName: "",
                  sector: "Automobile",
                  location: "",
                  tradedValue: "",
                  status: "Approved",
                  contactPerson: "",
                  email: "",
                  phone: "",
                  gstNumber: "",
                });
                setIsOnboardModalOpen(true);
              }}
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Onboard industry</span>
            </button>
          </div>
        </div>

        {/* ================= MAIN TABLE CONTAINER ================= */}
        <div className="bg-card rounded-xl border border-border shadow-2xs overflow-hidden">
          {/* ================= TOP TOOLBAR ================= */}
          <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-2 text-sm bg-surface-muted border border-input rounded-lg placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Right side Toolbar actions */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {/* Status Dropdown Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer shadow-2xs"
                >
                  <Filter size={16} className="text-muted-foreground" />
                  <span>{selectedStatus}</span>
                  <ChevronDown size={15} className="text-muted-foreground ml-0.5" />
                </button>

                {statusDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setStatusDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-44 bg-card rounded-xl shadow-lg border border-border py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                      {STATUS_LIST.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(status);
                            setStatusDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                            selectedStatus === status
                              ? "text-primary bg-primary/10 font-semibold"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{status}</span>
                          {selectedStatus === status && <Check size={15} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer shadow-2xs"
                title="Export to CSV"
              >
                <Download size={16} className="text-muted-foreground" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* ================= DATA TABLE ================= */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-border text-xs font-bold text-foreground uppercase tracking-wider select-none bg-surface/50">
                  <th className="py-3.5 px-4 w-12 text-center">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className={`w-4.5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all cursor-pointer mx-auto ${
                        selectedRows.length === paginatedIndustries.length &&
                        paginatedIndustries.length > 0
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:border-primary bg-card"
                      }`}
                    >
                      {selectedRows.length === paginatedIndustries.length &&
                        paginatedIndustries.length > 0 && <Check size={12} strokeWidth={3} />}
                    </button>
                  </th>

                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() => handleSort("companyName")}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span>COMPANY</span>
                      <ArrowUpDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </th>

                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() => handleSort("sector")}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span>SECTOR</span>
                      <ArrowUpDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </th>

                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors uppercase font-bold text-foreground"
                    onClick={() => handleSort("location")}
                  >
                    <span>LOCATION</span>
                  </th>

                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() => handleSort("tradedValue")}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span>TRADED VALUE</span>
                      <ArrowUpDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </th>

                  <th className="py-3.5 px-4 uppercase select-none font-bold text-foreground">
                    <span>STATUS</span>
                  </th>

                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span>DATE</span>
                      <ArrowUpDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </th>

                  <th className="py-3.5 px-4 w-12 text-center select-none"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border text-sm bg-card">
                {paginatedIndustries.length > 0 ? (
                  paginatedIndustries.map((row) => {
                    const isSelected = selectedRows.includes(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`group transition-colors ${
                          isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleSelectRow(row.id)}
                            className={`w-4.5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all cursor-pointer mx-auto ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input hover:border-primary bg-card"
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </button>
                        </td>

                        {/* Company (Avatar + Name + Code) */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                              {row.initials}
                            </div>
                            <div>
                              <div
                                className="font-bold text-foreground leading-tight hover:text-primary cursor-pointer transition-colors"
                                onClick={() => {
                                  setActiveIndustry(row);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                {row.companyName}
                              </div>
                              <div className="text-xs text-muted-foreground font-normal mt-0.5">
                                {row.code}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Sector */}
                        <td className="py-4 px-4 text-foreground/90 font-normal">
                          {row.sector}
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 text-muted-foreground font-normal">
                          {row.location}
                        </td>

                        {/* Traded value */}
                        <td className="py-4 px-4 font-bold text-foreground">
                          {row.tradedValueDisplay}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {renderStatusBadge(row.status)}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-muted-foreground font-normal whitespace-nowrap">
                          {row.date}
                        </td>

                        {/* Action Menu (···) */}
                        <td className="py-4 px-4 text-center relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === row.id ? null : row.id)
                            }
                            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {activeMenuId === row.id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-4 top-12 w-48 bg-card rounded-xl shadow-xl border border-border py-1.5 z-30 text-left animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveIndustry(row);
                                    setIsViewModalOpen(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5"
                                >
                                  <Eye size={15} className="text-muted-foreground" />
                                  <span>View Details</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveIndustry(row);
                                    setFormData({
                                      companyName: row.companyName,
                                      sector: row.sector,
                                      location: row.location,
                                      tradedValue: row.tradedValue,
                                      status: row.status,
                                      contactPerson: row.contactPerson || "",
                                      email: row.email || "",
                                      phone: row.phone || "",
                                      gstNumber: row.gstNumber || "",
                                    });
                                    setIsEditModalOpen(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5"
                                >
                                  <Edit2 size={15} className="text-muted-foreground" />
                                  <span>Edit Industry</span>
                                </button>

                                <div className="my-1 border-t border-border" />

                                {row.status !== "Approved" && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(row.id, "Approved")}
                                    className="w-full px-4 py-2 text-xs font-medium text-success hover:bg-success/10 flex items-center gap-2.5"
                                  >
                                    <CheckCircle2 size={15} />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {row.status !== "Pending" && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(row.id, "Pending")}
                                    className="w-full px-4 py-2 text-xs font-medium text-warning hover:bg-warning/10 flex items-center gap-2.5"
                                  >
                                    <Clock size={15} />
                                    <span>Mark Pending</span>
                                  </button>
                                )}

                                {row.status !== "Rejected" && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(row.id, "Rejected")}
                                    className="w-full px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2.5"
                                  >
                                    <XCircle size={15} />
                                    <span>Reject</span>
                                  </button>
                                )}

                                <div className="my-1 border-t border-border" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveIndustry(row);
                                    setIsDeleteModalOpen(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2.5"
                                >
                                  <Trash2 size={15} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-base font-semibold text-foreground">No industries found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or filters to find what you are looking for.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION & FOOTER ================= */}
          <div className="p-4 sm:px-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground font-medium bg-surface/30">
            <div>
              Showing {filteredIndustries.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredIndustries.length)} of{" "}
              {filteredIndustries.length}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FILTER DRAWER / MODAL ================= */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs transition-opacity"
            onClick={() => setFilterDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-card h-full shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-right duration-200 border-l border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                <h3 className="font-bold text-lg text-foreground">Filter Industries</h3>
              </div>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1 overflow-y-auto">
              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_LIST.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-all ${
                        selectedStatus === status
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Sector / Industry Type
                </label>
                <div className="space-y-1.5">
                  {SECTORS.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => setSelectedSector(sector)}
                      className={`w-full px-3.5 py-2 text-xs font-medium rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedSector === sector
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{sector}</span>
                      {selectedSector === sector && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("All statuses");
                  setSelectedSector("All Sectors");
                  setSearchQuery("");
                  setFilterDrawerOpen(false);
                }}
                className="flex-1 px-4 py-2.5 border border-border text-secondary-foreground font-semibold rounded-xl text-sm hover:bg-secondary/80 transition-colors"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ONBOARD INDUSTRY MODAL ================= */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
            onClick={() => setIsOnboardModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Onboard New Industry</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddIndustry} className="py-4 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Company / Plant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Precision Forgings"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Sector *
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="Automobile">Automobile</option>
                    <option value="Steel Plant">Steel Plant</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Plastics">Plastics</option>
                    <option value="Textile">Textile</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Location (City, State) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune, MH"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Traded Value (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 19400000"
                    value={formData.tradedValue}
                    onChange={(e) => setFormData({ ...formData, tradedValue: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. procurement@plant.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98230 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 27AAACT2727Q1ZB"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground uppercase"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Onboard Industry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW INDUSTRY DETAILS MODAL ================= */}
      {isViewModalOpen && activeIndustry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
            onClick={() => setIsViewModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150 border border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-border">
                  {activeIndustry.initials}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">
                    {activeIndustry.companyName}
                  </h3>
                  <p className="text-xs text-muted-foreground">{activeIndustry.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    Sector
                  </span>
                  <span className="font-medium text-foreground">{activeIndustry.sector}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    Status
                  </span>
                  <div className="mt-0.5">{renderStatusBadge(activeIndustry.status)}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    Location
                  </span>
                  <span className="font-medium text-foreground">{activeIndustry.location}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    Traded Volume / Value
                  </span>
                  <span className="font-bold text-foreground text-base">
                    {activeIndustry.tradedValueDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    Registration Date
                  </span>
                  <span className="font-medium text-foreground">{activeIndustry.date}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    GST Number
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {activeIndustry.gstNumber || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    Contact Person
                  </span>
                  <span className="font-medium text-foreground">
                    {activeIndustry.contactPerson || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold block uppercase">
                    Email
                  </span>
                  <span className="font-medium text-foreground">
                    {activeIndustry.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-secondary-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT INDUSTRY MODAL ================= */}
      {isEditModalOpen && activeIndustry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Edit Industry</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditIndustry} className="py-4 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="Automobile">Automobile</option>
                    <option value="Steel Plant">Steel Plant</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Plastics">Plastics</option>
                    <option value="Textile">Textile</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Traded Value
                  </label>
                  <input
                    type="text"
                    value={formData.tradedValue}
                    onChange={(e) => setFormData({ ...formData, tradedValue: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-surface-muted border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && activeIndustry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
            onClick={() => setIsDeleteModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-card rounded-2xl shadow-2xl p-6 z-10 text-center animate-in zoom-in-95 duration-150 border border-border">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-bold text-foreground">Delete Industry?</h3>
            <p className="text-xs text-muted-foreground mt-2">
              Are you sure you want to remove{" "}
              <strong className="text-foreground">{activeIndustry.companyName}</strong>? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteIndustry}
                className="px-4 py-2 text-sm font-semibold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
