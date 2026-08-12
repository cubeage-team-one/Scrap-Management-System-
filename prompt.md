# SmartScrap AI - Senior Requirements & Design Prompts

## 1. Project Overview & Core Intent
**SmartScrap AI** is an enterprise-grade web-based Industrial Scrap Management & Recycling Platform designed to digitize the complete scrap lifecycle for manufacturing industries, scrap dealers, and buyers. It replaces paper registers, spreadsheets, and manual negotiations with a centralized digital system streamlining inventory management, marketplace transactions, quotations, live auctions, sealed tenders, sales tracking, and reporting.

---

## 2. Platform Architecture & User Roles
The platform supports **4 distinct user roles** with Role-Based Access Control (RBAC):
1. **Industry (Scrap Generator)**: Records inventory, publishes scrap listings, receives quotations, conducts auctions/tenders, tracks sales.
2. **Dealer (Aggregator / Trader)**: Dual-role dashboard to buy industrial scrap (auctions/marketplace) and resell processed materials.
3. **Buyer (Scrap Recycler / Manufacturer)**: Browses verified listings, submits quotations/bids, tracks purchases.
4. **Super Admin (Platform Administrator)**: Account approvals, category management, commission settings, platform analytics.

---

## 3. UI/UX & Design System Specifications

### Aesthetic Persona
- **Inspiration**: SAP Business One, Oracle NetSuite, Microsoft Dynamics 365, Zoho Inventory, Odoo ERP, Alibaba B2B, IndiaMART.
- **Tone**: Enterprise, Modern, Industrial, Minimal, Clean, Premium, AI-ready, Data-driven.
- **Layout**: 1440px desktop width, 12-column grid, 8px spacing system, 12px rounded corners, soft shadows, clean white cards, light gray background (`#F8FAFC`).

### Color Palette Evolution & Final Design Token Overrides
> [!IMPORTANT]
> **COLOR PALETTE OVERRIDE HISTORY**:
> - *Phase 1 Prompt*: Brown palette (`#593E2E`, `#8C5B3E`, `#BF9B7A`, `#F2E6D8`).
> - *Phase 2 Override*: **DISCARD ALL BROWN ACCENTS & `#BF9B7A`**.
> - *Final Palette*: **Deep Industrial Blue (`#011C6B`)** for all public landing pages, login pages, and sidebar navigation across all 4 user roles.

#### Final Color Tokens:
- **Primary / Header / Sidebar**: `#011C6B` (Deep Industrial Blue)
- **Primary Hover / Active**: `#1E40AF` / `#2563EB`
- **Secondary Success / Green**: `#16A34A` / `#22C55E`
- **Warning Amber**: `#F59E0B`
- **Danger Red**: `#DC2626`
- **Background**: `#F8FAFC`
- **Card Fill**: `#FFFFFF`
- **Border**: `#E5E7EB`
- **Primary Text**: `#111827`
- **Secondary Text**: `#6B7280`
- **Industrial Accent**: Steel Gray (`#475569`)

---

## 4. Module & Screen Inventory (40+ Screens)
- **Shared Authentication**: Role-based Signup, Login (`#011C6B` theme), Verification Pending, Password Reset.
- **Landing / Public Home**: Enterprise B2B homepage with Hero, Features, How It Works, Material Categories, Metrics Banner, FAQ Accordion, Footer.
- **Executive Dashboard**: KPIs, Inventory trend, Revenue charts, Quick actions, Activity timeline.
- **Inventory Module**: Table view, filters, Add Scrap form, Scrap Details gallery, Stock deduction history.
- **B2B Marketplace**: Grid/Table view of materials (Steel, Copper, Aluminium, E-waste, Plastics, Machine Parts), filters, Listing Details.
- **Quotation Module**: Comparison table, buyer ratings, payment terms, AI recommendation placeholder.
- **Live Auction Module**: Bidding timer, current highest bid, reserve price status, live bid graph.
- **Tender Module**: Sealed tender dashboard, reveal screen, comparison table, winner selection.
- **Sales & Purchase Module**: Completed/Pending sales, handover documents, commission tracking, buyer/seller history.
- **Dealer Dashboard**: Dual buying/selling navigation, stock in hand, profit graph.
- **Reports Module**: Export CSV, line/bar/pie/area charts for sales, inventory, and revenue.
- **Super Admin Module**: Pending business approvals, user management, category settings, platform analytics.

---

## 5. Raw Prompts Archive (For Reference)

### Prompt 1: Initial Enterprise ERP SRS
> "Design a complete enterprise SaaS web application called SmartScrap AI... Focus on dashboards, tables, analytics, workflows, inventory and marketplace. 1440px desktop width, 12 column grid, 8px spacing system, 12px rounded corners, soft shadows..."

### Prompt 2: Brown Theme & Feature Additions (Superseded)
> "use this color palatee- #593E2E, #8C5B3E, #BF9B7A, #F2E6D8, make side bar of dark brown color and text to white, also details in my scrap and quotations page, sales page, purchase history, create export page, (dealer, buyer, admin, industry) these are 4 user's make a role based login and sign up properly"

### Prompt 3: Blue Color Scheme Shift (Active Directive)
> "make a professional landing page as well - #011C6B use this color and discard previous ones"

### Prompt 4: Login Page & Component Sweep
> "make login page in blue i provided remove #BF9B7A color from whole project"

### Prompt 5: Final Sidebar Color Alignment
> "after logging in the side bar of all users is brown discard it and replace it with blue"
