import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  X,
  Building2,
  Edit2,
  Check,
} from "lucide-react";

import MaterialTable from "../../components/common/MaterialTable";
import { adminTableConfig } from "../../configs/tables/adminTable.config";
import ApiService from "../../core/services/api.service";
import Loader from "../../components/common/Loader";

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
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Modal States
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  // Fetch industries data from API
  useEffect(() => {
    fetchIndustries();
  }, [page, selectedStatus, searchQuery]);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      setError(null);

      const statusParam = selectedStatus !== "All statuses" 
        ? selectedStatus.toUpperCase() === "APPROVED" ? "ACTIVE" 
        : selectedStatus.toUpperCase() === "PENDING" ? "PENDING"
        : selectedStatus.toUpperCase() === "REJECTED" ? "REJECTED"
        : null
        : null;

      const response = await ApiService.get("/admin/industries", {
        status: statusParam,
        search: searchQuery || undefined,
        page,
        limit: 10,
      });

      if (response.data?.success) {
        // Map backend response to frontend format
        const mappedIndustries = response.data.data.map((org) => {
          const words = org.companyName.trim().split(" ");
          const initials =
            words.length > 1
              ? (words[0][0] + words[1][0]).toUpperCase()
              : words[0].slice(0, 2).toUpperCase();

          return {
            id: org.id,
            initials,
            companyName: org.companyName,
            code: org.code,
            sector: org.sector,
            location: org.location,
            tradedValue: org.tradedValue || 0,
            tradedValueDisplay: org.tradedValueDisplay || "₹0",
            status: org.status === "ACTIVE" ? "Approved" : org.status === "PENDING" ? "Pending" : "Rejected",
            date: new Date(org.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            contactPerson: org.contactPerson,
            email: org.contactEmail,
            phone: org.contactPhone,
            gstNumber: org.gstNumber,
            createdAt: org.createdAt,
            address: org.address,
          };
        });

        setIndustries(mappedIndustries);
        setTotalRecords(response.data.total);
      }
    } catch (err) {
      console.error("Failed to fetch industries:", err);
      setError(err.response?.data?.message || "Failed to fetch industries");
      // Fallback to initial data if API fails
      setIndustries(INITIAL_INDUSTRIES);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
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

    return result;
  }, [industries, searchQuery, selectedStatus, selectedSector]);

  // Row selection state, adapted between MaterialTable's { [id]: true } shape
  // (used by Material React Table's built-in checkbox column) and the plain
  // `selectedRows` array that CSV export scoping uses.
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedRows.map((id) => [id, true])),
    [selectedRows]
  );

  const handleRowSelectionChange = (updaterOrValue) => {
    const nextSelection =
      typeof updaterOrValue === "function" ? updaterOrValue(rowSelection) : updaterOrValue;
    setSelectedRows(Object.keys(nextSelection).filter((id) => nextSelection[id]));
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
  const handleAddIndustry = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.location) return;

    try {
      // Call API to create industry (would need an onboard endpoint)
      // For now, just add to local state and show success
      const words = formData.companyName.trim().split(" ");
      const initials =
        words.length > 1
          ? (words[0][0] + words[1][0]).toUpperCase()
          : words[0].slice(0, 2).toUpperCase();

      const rawVal = parseFloat(formData.tradedValue) || 0;
      const formattedVal = "₹" + rawVal.toLocaleString("en-IN");

      const newIndustry = {
        id: String(Date.now()),
        initials,
        companyName: formData.companyName,
        code: "IND-" + (1043 + industries.length),
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
    } catch (err) {
      console.error("Failed to add industry:", err);
      setError("Failed to onboard industry");
    }
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

  // MaterialTable shows its own confirmation dialog before calling this, so
  // no separate confirm step is needed here.
  const handleDeleteIndustry = (industry) => {
    setIndustries((prev) => prev.filter((item) => item.id !== industry.id));
    setSelectedRows((prev) => prev.filter((id) => id !== industry.id));
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

        {/* ================= SEARCH & FILTER BAR ================= */}
        <div className="bg-card rounded-xl border border-border shadow-2xs p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* ================= INDUSTRIES TABLE ================= */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
            <p className="font-semibold">Error loading industries</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              type="button"
              onClick={fetchIndustries}
              className="mt-3 px-4 py-2 text-sm font-semibold bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <MaterialTable
            config={adminTableConfig}
            data={filteredIndustries}
            getRowId={(row) => row.id}
            onView={(industry) => {
              setActiveIndustry(industry);
              setIsViewModalOpen(true);
            }}
            onEdit={(industry) => {
              setActiveIndustry(industry);
              setFormData({
                companyName: industry.companyName,
                sector: industry.sector,
                location: industry.location,
                tradedValue: industry.tradedValue,
                status: industry.status,
                contactPerson: industry.contactPerson || "",
                email: industry.email || "",
                phone: industry.phone || "",
                gstNumber: industry.gstNumber || "",
              });
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteIndustry}
            enableRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={handleRowSelectionChange}
          />
        )}
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

    </div>
  );
}
