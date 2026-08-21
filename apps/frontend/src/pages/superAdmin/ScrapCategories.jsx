import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
} from "lucide-react";

const initialCategories = [
  {
    id: "CAT-01",
    code: "FE",
    name: "Ferrous",
    materials: "Steel, Iron, Turnings",
    stock: "412 MT",
    unit: "live",
    value: "—",
    status: "Approved",
    date: "Active",
  },
  {
    id: "CAT-02",
    code: "NO",
    name: "Non-Ferrous",
    materials: "Copper, Aluminium, Brass",
    stock: "268 MT",
    unit: "live",
    value: "—",
    status: "Approved",
    date: "Active",
  },
  {
    id: "CAT-03",
    code: "PO",
    name: "Polymer",
    materials: "HDPE, PP, PVC",
    stock: "154 MT",
    unit: "live",
    value: "—",
    status: "Approved",
    date: "Active",
  },
  {
    id: "CAT-04",
    code: "E-",
    name: "E-Waste",
    materials: "PCB, Cables, Components",
    stock: "86 MT",
    unit: "live",
    value: "—",
    status: "Approved",
    date: "Active",
  },
  {
    id: "CAT-05",
    code: "TE",
    name: "Textile",
    materials: "Cotton, Yarn Waste",
    stock: "54 MT",
    unit: "live",
    value: "—",
    status: "Pending",
    date: "Review",
  },
  {
    id: "CAT-06",
    code: "RU",
    name: "Rubber",
    materials: "Tyres, Moulded Rubber",
    stock: "68 MT",
    unit: "live",
    value: "—",
    status: "Approved",
    date: "Active",
  },
];

const ScrapCategories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    materials: "",
    stock: "",
    status: "Approved",
    date: "Active",
  });

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.code.toLowerCase().includes(query) ||
        category.materials.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All statuses" ||
        category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const allSelected =
    filteredCategories.length > 0 &&
    filteredCategories.every((category) => selectedRows.includes(category.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
      return;
    }

    setSelectedRows(filteredCategories.map((category) => category.id));
  };

  const toggleRow = (id) => {
    setSelectedRows((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleDelete = (id) => {
    setCategories((previous) =>
      previous.filter((category) => category.id !== id)
    );

    setSelectedRows((previous) => previous.filter((item) => item !== id));
    setOpenMenu(null);
  };

  const handleAddCategory = (event) => {
    event.preventDefault();

    const nextNumber = categories.length + 1;

    const category = {
      id: `CAT-${String(nextNumber).padStart(2, "0")}`,
      code: newCategory.name
        ? newCategory.name.slice(0, 2).toUpperCase()
        : "NA",
      name: newCategory.name || "New Category",
      materials: newCategory.materials || "—",
      stock: newCategory.stock || "0 MT",
      unit: "live",
      value: "—",
      status: newCategory.status,
      date: newCategory.date,
    };

    setCategories((previous) => [...previous, category]);

    setNewCategory({
      name: "",
      materials: "",
      stock: "",
      status: "Approved",
      date: "Active",
    });

    setShowAddModal(false);
  };

  const handleExport = () => {
    const headers = [
      "Category",
      "Code",
      "Materials",
      "Live Stock",
      "Value",
      "Status",
      "Date",
    ];

    const rows = filteredCategories.map((category) => [
      category.name,
      category.id,
      category.materials,
      `${category.stock} ${category.unit}`,
      category.value,
      category.status,
      category.date,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "scrap-categories.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full w-full bg-[#f8fafc] px-3 py-4 sm:px-5 lg:px-6 lg:py-5">
      {/* Breadcrumb */}
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span>SmartScrap AI</span>
        <span>›</span>
        <span>Operations</span>
        <span>›</span>
        <span className="font-medium text-slate-600">
          Scrap Categories
        </span>
      </div>

      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 sm:text-2xl">
            Scrap categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Master category taxonomy used across listings and auctions.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={() => setShowFilters((previous) => !previous)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition sm:flex-none ${
              showFilters
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:flex-none"
          >
            <Plus className="h-4 w-4" />
            Add category
          </button>
        </div>
      </div>

      {/* Optional Filter Panel */}
      {showFilters && (
        <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option>All statuses</option>
                <option>Approved</option>
                <option>Pending</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter("All statuses");
                  setSearchQuery("");
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Search / Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option>All statuses</option>
              <option>Approved</option>
              <option>Pending</option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-slate-200 bg-[#fbfcfd]">
              <tr className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  />
                </th>

                <th className="px-3 py-3">
                  Category ↕
                </th>

                <th className="px-3 py-3">
                  Materials ↕
                </th>

                <th className="px-3 py-3">
                  Live Stock
                </th>

                <th className="px-3 py-3">
                  — ↕
                </th>

                <th className="px-3 py-3">
                  Status
                </th>

                <th className="px-3 py-3">
                  Date ↕
                </th>

                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(category.id)}
                      onChange={() => toggleRow(category.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-500">
                        {category.code}
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {category.name}
                        </div>

                        <div className="text-xs text-slate-400">
                          {category.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-sm text-slate-700">
                    {category.materials}
                  </td>

                  <td className="px-3 py-3 text-sm text-slate-700">
                    <span className="font-medium">{category.stock}</span>{" "}
                    <span className="text-xs text-slate-500">
                      {category.unit}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-sm text-slate-500">
                    {category.value}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        category.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {category.status}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-sm text-slate-500">
                    {category.date}
                  </td>

                  <td className="relative px-3 py-3 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === category.id ? null : category.id
                        )
                      }
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenu === category.id && (
                      <div className="absolute right-3 top-10 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                        <button
                          onClick={() => setOpenMenu(null)}
                          className="block w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          View
                        </button>

                        <button
                          onClick={() => setOpenMenu(null)}
                          className="block w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
                          className="block w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-slate-200 md:hidden">
          {filteredCategories.map((category) => (
            <div key={category.id} className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(category.id)}
                  onChange={() => toggleRow(category.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
                />

                <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-500">
                      {category.code}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-800">
                        {category.name}
                      </h3>

                      <p className="text-xs text-slate-400">
                        {category.id}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === category.id ? null : category.id
                      )
                    }
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="ml-7 mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-xs text-slate-400">Materials</span>
                  <p className="text-slate-700">{category.materials}</p>
                </div>

                <div>
                  <span className="text-xs text-slate-400">Live stock</span>
                  <p className="text-slate-700">
                    {category.stock} {category.unit}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400">Status</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        category.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {category.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400">Date</span>
                  <p className="text-slate-700">{category.date}</p>
                </div>
              </div>

              {openMenu === category.id && (
                <div className="ml-7 mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setOpenMenu(null)}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => setOpenMenu(null)}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-slate-600">
              No scrap categories found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">
            Showing {filteredCategories.length}–{filteredCategories.length} of{" "}
            {filteredCategories.length}
          </span>

          <div className="flex items-center justify-end gap-1">
            <button
              disabled
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-300 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
              1
            </button>

            <button
              disabled
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-300 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Add category
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Create a new scrap category.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Category name
                </label>

                <input
                  required
                  value={newCategory.name}
                  onChange={(event) =>
                    setNewCategory((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Ferrous"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Materials
                </label>

                <input
                  value={newCategory.materials}
                  onChange={(event) =>
                    setNewCategory((previous) => ({
                      ...previous,
                      materials: event.target.value,
                    }))
                  }
                  placeholder="e.g. Steel, Iron, Turnings"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Live stock
                  </label>

                  <input
                    value={newCategory.stock}
                    onChange={(event) =>
                      setNewCategory((previous) => ({
                        ...previous,
                        stock: event.target.value,
                      }))
                    }
                    placeholder="e.g. 100 MT"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Status
                  </label>

                  <select
                    value={newCategory.status}
                    onChange={(event) =>
                      setNewCategory((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option>Approved</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Add category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapCategories;