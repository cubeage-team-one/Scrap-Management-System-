// Server-side pattern template for the Super Admin "Industries" management
// table. Status values match the backend's Organisation.accountState enum
// (PENDING / ACTIVE / REJECTED / SUSPENDED) so this lines up with the real
// API shape once wired in.

import StatusBadge from "../../components/common/StatusBadge";
import {
  getTableData,
  updateTableData,
  deleteTableData,
} from "../../services/table/table.service";

const ADMIN_INDUSTRIES_ENDPOINT = "/admin/industries";

export const getIndustries = (params) => getTableData(ADMIN_INDUSTRIES_ENDPOINT, params);
export const updateIndustry = (id, payload) =>
  updateTableData(ADMIN_INDUSTRIES_ENDPOINT, id, payload);
export const deleteIndustry = (id) => deleteTableData(ADMIN_INDUSTRIES_ENDPOINT, id);

const STATUS_VARIANTS = {
  PENDING: { variant: "warning" },
  ACTIVE: { variant: "success" },
  REJECTED: { variant: "danger" },
  SUSPENDED: { variant: "neutral" },
};

export const adminColumns = [
  { accessorKey: "companyName", header: "INDUSTRY" },
  { accessorKey: "contactName", header: "CONTACT PERSON" },
  { accessorKey: "email", header: "EMAIL" },
  { accessorKey: "gstNumber", header: "GST NUMBER" },
  { accessorKey: "city", header: "CITY" },
  {
    accessorKey: "createdAt",
    header: "REGISTERED",
    filterVariant: "date-range",
  },
  {
    accessorKey: "accountState",
    header: "STATUS",
    filterVariant: "multi-select",
    filterSelectOptions: Object.keys(STATUS_VARIANTS),
    Cell: ({ cell }) => {
      const status = cell.getValue();
      return <StatusBadge label={status} {...(STATUS_VARIANTS[status] || {})} />;
    },
  },
];

export const adminTableConfig = {
  title: "Industries",
  columns: adminColumns,
  fetchData: getIndustries,
  updateData: updateIndustry,
  deleteData: deleteIndustry,
  mobileHiddenColumns: ["contactName", "gstNumber", "city", "createdAt"],
};
