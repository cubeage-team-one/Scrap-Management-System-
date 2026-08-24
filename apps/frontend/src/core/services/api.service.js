import ApiInterceptor from "./interceptor.service";
import ServerUrl from "../constants/serverUrl.constant";

class ApiService {
  static axiosInstance = ApiInterceptor.init();

  // =========================================================
  // AUTH
  // =========================================================

  static login(data) {
    return this.axiosInstance.post(
      ServerUrl.API_LOGIN,
      data
    );
  }

  static signup(data) {
    return this.axiosInstance.post(
      ServerUrl.API_SIGNUP,
      data
    );
  }

  static logout() {
    return this.axiosInstance.post(
      ServerUrl.API_LOGOUT
    );
  }

  // Alias for backward compatibility
  static apiPost(url, data) {
    return this.post(url, data);
  }

  // =========================================================
  // SCRAP INVENTORY
  // =========================================================

  /**
   * Create Scrap
   * POST /api/scrap
   */
  static createScrap(data) {
    return this.axiosInstance.post(
      ServerUrl.API_CREATE_SCRAP,
      data
    );
  }

  /**
   * Get Scrap List
   * GET /api/scrap
   */
  static getScraps(params = {}) {
    return this.axiosInstance.get(
      ServerUrl.API_GET_SCRAPS,
      {
        params,
      }
    );
  }

  /**
   * Get Scrap By ID
   * GET /api/scrap/:id
   */
  static getScrapById(id) {
    return this.axiosInstance.get(
      ServerUrl.API_GET_SCRAP_BY_ID(id)
    );
  }

  /**
   * Update Scrap
   * PATCH /api/scrap/:id
   */
  static updateScrap(id, data) {
    return this.axiosInstance.patch(
      ServerUrl.API_UPDATE_SCRAP(id),
      data
    );
  }

  /**
   * Delete Scrap
   * DELETE /api/scrap/:id
   */
  static deleteScrap(id) {
    return this.axiosInstance.delete(
      ServerUrl.API_DELETE_SCRAP(id)
    );
  }

  // =========================================================
  // ADMIN MANAGEMENT
  // =========================================================

  /**
   * Get Industries List
   * GET /api/admin/industries
   */
  static getIndustries(params = {}) {
    return this.axiosInstance.get(
      ServerUrl.API_GET_INDUSTRIES,
      { params }
    );
  }

  /**
   * Get Industry By ID
   * GET /api/admin/industries/:id
   */
  static getIndustryById(id) {
    return this.axiosInstance.get(
      ServerUrl.API_GET_INDUSTRY_BY_ID(id)
    );
  }

  /**
   * Update Industry Status
   * PATCH /api/admin/industries/:id/status
   */
  static updateIndustryStatus(id, data) {
    return this.axiosInstance.patch(
      ServerUrl.API_UPDATE_INDUSTRY_STATUS(id),
      data
    );
  }

  /**
   * Get Dealers List
   * GET /api/admin/dealers
   */
  static getDealers(params = {}) {
    return this.axiosInstance.get(
      ServerUrl.API_GET_DEALERS,
      { params }
    );
  }

  /**
   * Update Dealer Status
   * PATCH /api/admin/dealers/:id/status
   */
  static updateDealerStatus(id, data) {
    return this.axiosInstance.patch(
      ServerUrl.API_UPDATE_DEALER_STATUS(id),
      data
    );
  }


  // =========================================================
  // CATEGORY
  // =========================================================

  static getCategories(params = {}) {
    return this.axiosInstance.get(
      ServerUrl.API_GET_CATEGORIES,
      {
        params,
      }
    );
  }

  static getCategoryById(id) {
    return this.axiosInstance.get(
      ServerUrl.API_GET_CATEGORY_BY_ID(id)
    );
  }

  // =========================================================
  // GENERIC METHODS
  // =========================================================

  static get(url, params = {}) {
    return this.axiosInstance.get(url, {
      params,
    });
  }

  static post(url, data) {
    return this.axiosInstance.post(
      url,
      data
    );
  }

  static put(url, data) {
    return this.axiosInstance.put(
      url,
      data
    );
  }

  static patch(url, data) {
    return this.axiosInstance.patch(
      url,
      data
    );
  }

  static delete(url) {
    return this.axiosInstance.delete(url);
  }
}

// Export convenience functions for backward compatibility
export const apiGet = (url, config = {}) => ApiService.get(url, config.params);
export const apiPost = (url, data) => ApiService.post(url, data);
export const apiPut = (url, data) => ApiService.put(url, data);
export const apiPatch = (url, data) => ApiService.patch(url, data);
export const apiDelete = (url) => ApiService.delete(url);

export default ApiService;