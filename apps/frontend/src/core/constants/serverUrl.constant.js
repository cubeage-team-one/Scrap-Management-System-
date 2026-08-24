class ServerUrl {
  // =========================================================
  // BASE URL
  // =========================================================

  static BASE_URL =
    import.meta.env.VITE_BASE_URL ||
    (import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
      : "");

  static API_BASE_URL =
    import.meta.env.VITE_API_URL || "";

  // =========================================================
  // AUTH
  // =========================================================

  static API_MODULE_AUTH = "auth";

  static API_LOGIN =
    `${ServerUrl.API_MODULE_AUTH}/login`;

  static API_SIGNUP =
    `${ServerUrl.API_MODULE_AUTH}/register`;

  static API_LOGOUT =
    `${ServerUrl.API_MODULE_AUTH}/logout`;

  static API_REQUEST_OTP =
    `${ServerUrl.API_MODULE_AUTH}/request-otp`;

  static API_VERIFY_OTP =
    `${ServerUrl.API_MODULE_AUTH}/verify-otp`;

  static API_PROFILE =
    `${ServerUrl.API_MODULE_AUTH}/profile`;

  // =========================================================
  // USER
  // =========================================================

  static API_MODULE_USER = "user";

  static API_USER_PROFILE =
    `${ServerUrl.API_MODULE_USER}/profile`;

  // =========================================================
  // SCRAP INVENTORY
  // =========================================================

  static API_MODULE_SCRAP = "scrap";

  // POST /api/scrap
  static API_CREATE_SCRAP =
    `${ServerUrl.API_MODULE_SCRAP}`;

  // GET /api/scrap
  static API_GET_SCRAPS =
    `${ServerUrl.API_MODULE_SCRAP}`;

  // GET /api/scrap/:id
  static API_GET_SCRAP_BY_ID = (id) =>
    `${ServerUrl.API_MODULE_SCRAP}/${id}`;

  // PATCH /api/scrap/:id
  static API_UPDATE_SCRAP = (id) =>
    `${ServerUrl.API_MODULE_SCRAP}/${id}`;

  // DELETE /api/scrap/:id
  static API_DELETE_SCRAP = (id) =>
    `${ServerUrl.API_MODULE_SCRAP}/${id}`;

  // =========================================================
  // CATEGORY
  // =========================================================

  static API_MODULE_CATEGORY = "category";

  static API_GET_CATEGORIES =
    `${ServerUrl.API_MODULE_CATEGORY}`;

  static API_GET_CATEGORY_BY_ID = (id) =>
    `${ServerUrl.API_MODULE_CATEGORY}/${id}`;

  // =========================================================
  // LISTING
  // =========================================================

  static API_MODULE_LISTING = "listing";

  static API_GET_LISTINGS =
    `${ServerUrl.API_MODULE_LISTING}`;

  static API_GET_LISTING_BY_ID = (id) =>
    `${ServerUrl.API_MODULE_LISTING}/${id}`;

  static API_CREATE_LISTING =
    `${ServerUrl.API_MODULE_LISTING}`;

  static API_UPDATE_LISTING = (id) =>
    `${ServerUrl.API_MODULE_LISTING}/${id}`;

  static API_DELETE_LISTING = (id) =>
    `${ServerUrl.API_MODULE_LISTING}/${id}`;

  // =========================================================
  // QUOTATION
  // =========================================================

  static API_MODULE_QUOTATION = "quotation";

  static API_GET_QUOTATIONS =
    `${ServerUrl.API_MODULE_QUOTATION}`;

  static API_GET_QUOTATION_BY_ID = (id) =>
    `${ServerUrl.API_MODULE_QUOTATION}/${id}`;

  static API_CREATE_QUOTATION =
    `${ServerUrl.API_MODULE_QUOTATION}`;

  // =========================================================
  // AUCTION
  // =========================================================

  static API_MODULE_AUCTION = "auction";

  static API_GET_AUCTIONS =
    `${ServerUrl.API_MODULE_AUCTION}`;

  static API_GET_AUCTION_BY_ID = (id) =>
    `${ServerUrl.API_MODULE_AUCTION}/${id}`;

  // =========================================================
  // TENDER
  // =========================================================

  static API_MODULE_TENDER = "tender";

  static API_GET_TENDERS =
    `${ServerUrl.API_MODULE_TENDER}`;

  static API_GET_TENDER_BY_ID = (id) =>
    `${ServerUrl.API_MODULE_TENDER}/${id}`;

  // =========================================================
  // ADMIN
  // =========================================================

  static API_MODULE_ADMIN = "admin";

  static API_ADMIN_USERS =
    `${ServerUrl.API_MODULE_ADMIN}/users`;

  static API_ADMIN_DASHBOARD =
    `${ServerUrl.API_MODULE_ADMIN}/dashboard`;

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  static API_MODULE_NOTIFICATION = "notifications";

  static API_GET_NOTIFICATIONS =
    `${ServerUrl.API_MODULE_NOTIFICATION}`;

  static API_MARK_NOTIFICATION_READ = (id) =>
    `${ServerUrl.API_MODULE_NOTIFICATION}/${id}/read`;

  // =========================================================
  // ADMIN
  // =========================================================

  static API_MODULE_ADMIN_MGMT = "admin";

  // Industries
  static API_GET_INDUSTRIES =
    `${ServerUrl.API_MODULE_ADMIN_MGMT}/industries`;

  static API_GET_INDUSTRY_BY_ID = (id) =>
    `${ServerUrl.API_MODULE_ADMIN_MGMT}/industries/${id}`;

  static API_UPDATE_INDUSTRY_STATUS = (id) =>
    `${ServerUrl.API_MODULE_ADMIN_MGMT}/industries/${id}/status`;

  // Dealers
  static API_GET_DEALERS =
    `${ServerUrl.API_MODULE_ADMIN_MGMT}/dealers`;

  static API_UPDATE_DEALER_STATUS = (id) =>
    `${ServerUrl.API_MODULE_ADMIN_MGMT}/dealers/${id}/status`;

  // Buyers
  static API_GET_BUYERS =
    `${ServerUrl.API_MODULE_ADMIN_MGMT}/buyers`;

  static API_UPDATE_BUYER_STATUS = (id) =>
    `${ServerUrl.API_MODULE_ADMIN_MGMT}/buyers/${id}/status`;
}

export default ServerUrl;