import { useMemo, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  MapPin,
  Package,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import StatusBadge from "../../components/common/StatusBadge";

// --- Mock data ---
// Replace with API calls once the quotation endpoints are ready.
// Totals derive from pricePerMt × listing weight, so they stay consistent.
const listing = {
  id: "LST-001",
  title: "MS Steel Scrap (HMS 1&2) — 45 MT",
  weightMt: 45,
  expectedPricePerMt: 36000,
  posted: "2026-07-28",
  expires: "2026-08-10",
};

const initialQuotes = [
  { id: "QTN-1", company: "National Scrap Corp", legal: "NSC Ltd.", pricePerMt: 38100, distanceKm: 130, rating: 4.9, deals: 203, payment: "7 Days", valid: "2026-08-12", status: "Rejected" },
  { id: "QTN-2", company: "Sanjay Metals Pvt. Ltd.", legal: "Sanjay Metals", pricePerMt: 37800, distanceKm: 45, rating: 4.8, deals: 124, payment: "30 Days LC", valid: "2026-08-08", status: "Pending" },
  { id: "QTN-3", company: "Ravi Kumar Scrap Agency", legal: "RK Scrap Agency", pricePerMt: 37200, distanceKm: 12, rating: 4.5, deals: 87, payment: "Advance", valid: "2026-08-10", status: "Pending" },
  { id: "QTN-4", company: "MH Industrial Recyclers", legal: "MH Recyclers", pricePerMt: 36900, distanceKm: 78, rating: 4.2, deals: 56, payment: "15 Days Bank", valid: "2026-08-07", status: "Accepted" },
  { id: "QTN-5", company: "Green Loop Recyclers", legal: "Green Loop", pricePerMt: 36500, distanceKm: 96, rating: 4.0, deals: 41, payment: "45 Days", valid: "2026-08-09", status: "Pending" },
];

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const SORTS = {
  "Highest Price": (a, b) => b.pricePerMt - a.pricePerMt,
  "Lowest Price": (a, b) => a.pricePerMt - b.pricePerMt,
  "Best Rating": (a, b) => b.rating - a.rating,
  Nearest: (a, b) => a.distanceKm - b.distanceKm,
};

const STATUS_VARIANTS = { Pending: "warning", Accepted: "success", Rejected: "danger" };

const inr = new Intl.NumberFormat("en-IN");
const money = (value) => `₹${inr.format(value)}`;

const totalFor = (quote) => quote.pricePerMt * listing.weightMt;
const baseValue = listing.expectedPricePerMt * listing.weightMt;

// --- Reusable building blocks ---

const Panel = ({ className = "", children }) => (
  <div className={`rounded-xl border shadow-sm bg-card border-border ${className}`}>
    {children}
  </div>
);

const StatTile = ({ value, label, valueClass = "text-card-foreground" }) => (
  <Panel className="p-4">
    <p className={`text-xl font-bold md:text-2xl ${valueClass}`}>{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
  </Panel>
);

const Meta = ({ icon: Icon, iconClass = "text-muted-foreground", children }) => (
  <span className="inline-flex items-center gap-1 whitespace-nowrap">
    <Icon className={`w-3.5 h-3.5 ${iconClass}`} />
    {children}
  </span>
);

const OutlineButton = ({ tone, icon: Icon, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
      tone === "success"
        ? "border-success/40 text-success hover:bg-success/10"
        : tone === "destructive"
          ? "border-destructive/40 text-destructive hover:bg-destructive/10"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {children}
  </button>
);

const QuoteCard = ({ quote, isTopOffer, expanded, onToggleDetails, onDecide }) => {
  const total = totalFor(quote);
  const delta = total - baseValue;
  const settled = quote.status !== "Pending";

  return (
    <Panel className={isTopOffer ? "border-primary" : ""}>
      {isTopOffer && (
        <p className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold uppercase tracking-wide border-b rounded-t-xl border-border bg-primary/10 text-primary md:px-6">
          <Sparkles className="w-3.5 h-3.5" />
          Top offer
        </p>
      )}

      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between md:p-6">
        {/* Bidder identity + meta */}
        <div className="flex gap-3 min-w-0">
          <div className="flex flex-shrink-0 items-center justify-center w-10 h-10 text-sm font-bold rounded-full bg-muted text-muted-foreground">
            {quote.company.charAt(0)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-card-foreground">{quote.company}</h3>
              <Meta icon={Building2}>
                <span className="text-xs text-muted-foreground">{quote.legal}</span>
              </Meta>
              <StatusBadge label={quote.status} variant={STATUS_VARIANTS[quote.status]} />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <Meta icon={MapPin}>{quote.distanceKm} km</Meta>
              <Meta icon={Star} iconClass="text-warning">
                {quote.rating} rating
              </Meta>
              <span>{quote.deals} deals done</span>
              <span>
                Payment: <span className="font-semibold text-card-foreground">{quote.payment}</span>
              </span>
              <span>Valid: {quote.valid}</span>
            </div>

            {expanded && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 mt-3 text-xs rounded-lg sm:grid-cols-4 bg-muted">
                {[
                  ["Quotation ID", quote.id],
                  ["Price per MT", money(quote.pricePerMt)],
                  ["Quantity", `${listing.weightMt} MT`],
                  ["Vs. expected", money(delta)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold text-card-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {/* Price + actions */}
        <div className="flex items-start justify-between gap-4 md:justify-end md:flex-shrink-0">
          <div className="text-left md:text-right">
            <p className="text-xl font-bold text-card-foreground md:text-2xl">
              {money(quote.pricePerMt)}
            </p>
            <p className="text-xs text-muted-foreground">per MT</p>
            <p className="mt-1 text-sm font-semibold text-card-foreground">{money(total)} total</p>
            <p className={`text-xs font-semibold ${delta >= 0 ? "text-success" : "text-destructive"}`}>
              {delta >= 0 ? "+" : "−"}
              {money(Math.abs(delta))} vs. base
            </p>
          </div>

          <div className="flex flex-col gap-2 w-28">
            {settled ? (
              <p
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${
                  quote.status === "Accepted" ? "text-success" : "text-destructive"
                }`}
              >
                {quote.status === "Accepted" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                {quote.status}
              </p>
            ) : (
              <>
                <OutlineButton tone="success" icon={Check} onClick={() => onDecide("Accepted")}>
                  Accept
                </OutlineButton>
                <OutlineButton tone="destructive" icon={X} onClick={() => onDecide("Rejected")}>
                  Reject
                </OutlineButton>
              </>
            )}

            <OutlineButton icon={ChevronDown} onClick={onToggleDetails}>
              Details
            </OutlineButton>
          </div>
        </div>
      </div>
    </Panel>
  );
};

const DealerQuotation = () => {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Highest Price");
  const [expandedId, setExpandedId] = useState(null);

  const topOfferId = useMemo(
    () => [...quotes].sort(SORTS["Highest Price"])[0]?.id,
    [quotes]
  );

  const visible = useMemo(
    () =>
      quotes
        .filter((quote) => filter === "All" || quote.status === filter)
        .sort(SORTS[sort]),
    [quotes, filter, sort]
  );

  const stats = [
    { value: quotes.length, label: "Total Quotations" },
    { value: quotes.filter((q) => q.status === "Pending").length, label: "Pending", valueClass: "text-warning" },
    { value: quotes.filter((q) => q.status === "Accepted").length, label: "Accepted", valueClass: "text-success" },
    { value: quotes.filter((q) => q.status === "Rejected").length, label: "Rejected", valueClass: "text-destructive" },
    { value: `${money(Math.max(...quotes.map((q) => q.pricePerMt)))}/MT`, label: "Best Offer" },
    { value: money(quotes.reduce((sum, q) => sum + totalFor(q), 0)), label: "Total Pipeline Value" },
  ];

  const decide = (id, status) =>
    setQuotes((current) =>
      current.map((quote) => (quote.id === id ? { ...quote, status } : quote))
    );

  return (
    <section>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
        <span>SmartScrap AI</span>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-foreground">Quotations</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground md:text-2xl">Quotations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and compare buyer quotations
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>

      {/* AI recommendation */}
      <div className="flex flex-col gap-3 p-4 mb-6 border rounded-xl sm:flex-row sm:items-start border-warning/30 bg-warning/10 md:p-6">
        <div className="flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-warning text-warning-foreground">
          <Sparkles className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-card-foreground">AI Recommendation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on price, rating, payment terms, and reliability —{" "}
            <span className="font-semibold text-card-foreground">National Scrap Corp</span> offers
            the best overall value at {money(38100)}/MT with 4.9 rating &amp; 203 completed deals.
          </p>
        </div>

        <span className="flex-shrink-0 text-xs font-semibold text-muted-foreground">AI Powered</span>
      </div>

      {/* Listing summary */}
      <Panel className="flex flex-col gap-4 p-4 mb-6 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="flex gap-3 min-w-0">
          <div className="flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-lg bg-muted text-muted-foreground">
            <Package className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-card-foreground">{listing.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Listing {listing.id} · Posted {listing.posted} · Expires {listing.expires}
            </p>
          </div>
        </div>

        <div className="flex gap-6 flex-shrink-0">
          <div>
            <p className="text-xs text-muted-foreground">Your Expected Price</p>
            <p className="text-base font-bold text-card-foreground">
              {money(listing.expectedPricePerMt)}/MT
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Quotations</p>
            <p className="text-base font-bold text-card-foreground">{quotes.length}</p>
          </div>
        </div>
      </Panel>

      {/* Filters + sort */}
      <Panel className="flex flex-col gap-3 p-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setFilter(name)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filter === name
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="quote-sort" className="text-sm text-muted-foreground">
            Sort by:
          </label>
          <select
            id="quote-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="px-3 py-2 text-sm rounded-lg border outline-none bg-surface-muted border-input text-foreground focus:ring-2 focus:ring-ring"
          >
            {Object.keys(SORTS).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {/* Quotations */}
      <div className="flex flex-col gap-4">
        {visible.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            isTopOffer={quote.id === topOfferId}
            expanded={expandedId === quote.id}
            onToggleDetails={() =>
              setExpandedId((current) => (current === quote.id ? null : quote.id))
            }
            onDecide={(status) => decide(quote.id, status)}
          />
        ))}

        {visible.length === 0 && (
          <Panel className="p-8 text-sm text-center text-muted-foreground">
            No {filter.toLowerCase()} quotations for this listing.
          </Panel>
        )}
      </div>
    </section>
  );
};

export default DealerQuotation;
