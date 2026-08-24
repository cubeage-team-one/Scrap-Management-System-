import prisma from "../../core/lib/prisma.js";

const emailSearchFilter = (search) => ({
  users: {
    some: {
      email: { contains: search, mode: "insensitive" },
    },
  },
});

class AdminService {
  // =========================================================
  // INDUSTRIES
  // =========================================================

  /**
   * Get all industries with pagination and filters
   */
  static async getIndustries({ status, search, page = 1, limit = 10 }) {
    try {
      const skip = (page - 1) * limit;

      // Build where clause
      const where = {
        businessType: "INDUSTRY",
      };

      if (status) {
        where.accountState = status;
      }

      if (search) {
        where.OR = [
          { companyName: { contains: search, mode: "insensitive" } },
          { gstNumber: { contains: search, mode: "insensitive" } },
          { contactName: { contains: search, mode: "insensitive" } },
          emailSearchFilter(search),
        ];
      }

      // Fetch data
      const [data, total] = await Promise.all([
        prisma.organisation.findMany({
          where,
          include: {
            users: {
              where: { role: "INDUSTRY" },
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
              take: 1,
            },
            approvedBy: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.organisation.count({ where }),
      ]);

      // Format response
      const formatted = data.map((org) => ({
        id: org.id,
        companyName: org.companyName,
        code: org.id.slice(0, 8).toUpperCase(), // Generate code from ID
        sector: org.businessCategory || "General",
        location: `${org.city}, ${org.state}`,
        gstNumber: org.gstNumber,
        contactPerson: org.contactName,
        contactEmail: org.users[0]?.email ?? null,
        contactPhone: org.contactPhone,
        tradedValue: 0, // To be calculated from transactions
        tradedValueDisplay: "₹0",
        status: org.accountState,
        date: org.createdAt.toLocaleDateString("en-IN"),
        createdAt: org.createdAt,
        address: org.address,
        approvedBy: org.approvedBy,
      }));

      return { data: formatted, total };
    } catch (error) {
      console.error("[AdminService.getIndustries]", error);
      throw error;
    }
  }

  /**
   * Get single industry by ID
   */
  static async getIndustryById(id) {
    try {
      const industry = await prisma.organisation.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      if (!industry || industry.businessType !== "INDUSTRY") {
        return null;
      }

      return {
        id: industry.id,
        companyName: industry.companyName,
        gstNumber: industry.gstNumber,
        contactName: industry.contactName,
        contactEmail: industry.users[0]?.email ?? null,
        contactPhone: industry.contactPhone,
        address: industry.address,
        city: industry.city,
        state: industry.state,
        pincode: industry.pincode,
        status: industry.accountState,
        rejectReason: industry.rejectReason,
        approvedAt: industry.approvedAt,
        users: industry.users,
        approvedBy: industry.approvedBy,
        createdAt: industry.createdAt,
      };
    } catch (error) {
      console.error("[AdminService.getIndustryById]", error);
      throw error;
    }
  }

  /**
   * Update industry status (approve/reject)
   */
  static async updateIndustryStatus(
    organisationId,
    accountState,
    rejectReason = null,
    approvedByUserId = null
  ) {
    try {
      const updated = await prisma.organisation.update({
        where: { id: organisationId },
        data: {
          accountState,
          rejectReason: accountState === "REJECTED" ? rejectReason : null,
          approvedByUserId: accountState === "ACTIVE" ? approvedByUserId : null,
          approvedAt:
            accountState === "ACTIVE" ? new Date() : null,
        },
        include: {
          users: true,
          approvedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // Activate associated users if organisation is approved
      if (accountState === "ACTIVE") {
        await prisma.user.updateMany({
          where: { organisationId },
          data: { isActive: true },
        });
      }

      return {
        id: updated.id,
        companyName: updated.companyName,
        status: updated.accountState,
        rejectReason: updated.rejectReason,
        approvedAt: updated.approvedAt,
      };
    } catch (error) {
      console.error("[AdminService.updateIndustryStatus]", error);
      throw error;
    }
  }

  // =========================================================
  // DEALERS
  // =========================================================

  /**
   * Get all dealers with pagination and filters
   */
  static async getDealers({ status, search, page = 1, limit = 10 }) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        businessType: "DEALER",
      };

      if (status) {
        where.accountState = status;
      }

      if (search) {
        where.OR = [
          { companyName: { contains: search, mode: "insensitive" } },
          { gstNumber: { contains: search, mode: "insensitive" } },
          { contactName: { contains: search, mode: "insensitive" } },
          emailSearchFilter(search),
        ];
      }

      const [data, total] = await Promise.all([
        prisma.organisation.findMany({
          where,
          include: {
            users: {
              where: { role: "DEALER" },
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
              take: 1,
            },
            approvedBy: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.organisation.count({ where }),
      ]);

      const formatted = data.map((org) => ({
        id: org.id,
        code: org.id.slice(0, 8).toUpperCase(),
        name: org.companyName,
        specialisation: org.businessCategory || "General",
        location: `${org.city}, ${org.state}`,
        gstNumber: org.gstNumber,
        contactPerson: org.contactName,
        contactEmail: org.users[0]?.email ?? null,
        contactPhone: org.contactPhone,
        purchaseValue: 0,
        purchaseValueDisplay: "₹0",
        status: org.accountState,
        date: org.createdAt.toLocaleDateString("en-IN"),
        createdAt: org.createdAt,
      }));

      return { data: formatted, total };
    } catch (error) {
      console.error("[AdminService.getDealers]", error);
      throw error;
    }
  }

  /**
   * Update dealer status
   */
  static async updateDealerStatus(
    organisationId,
    accountState,
    rejectReason = null,
    approvedByUserId = null
  ) {
    try {
      const updated = await prisma.organisation.update({
        where: { id: organisationId },
        data: {
          accountState,
          rejectReason: accountState === "REJECTED" ? rejectReason : null,
          approvedByUserId: accountState === "ACTIVE" ? approvedByUserId : null,
          approvedAt:
            accountState === "ACTIVE" ? new Date() : null,
        },
        include: {
          users: true,
          approvedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // Activate associated users if organisation is approved
      if (accountState === "ACTIVE") {
        await prisma.user.updateMany({
          where: { organisationId },
          data: { isActive: true },
        });
      }

      return {
        id: updated.id,
        companyName: updated.companyName,
        status: updated.accountState,
        rejectReason: updated.rejectReason,
        approvedAt: updated.approvedAt,
      };
    } catch (error) {
      console.error("[AdminService.updateDealerStatus]", error);
      throw error;
    }
  }

  // =========================================================
  // BUYERS
  // =========================================================

  /**
   * Get all buyers with pagination and filters
   */
  static async getBuyers({ status, search, page = 1, limit = 10 }) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        businessType: "BUYER",
      };

      if (status) {
        where.accountState = status;
      }

      if (search) {
        where.OR = [
          { companyName: { contains: search, mode: "insensitive" } },
          { gstNumber: { contains: search, mode: "insensitive" } },
          { contactName: { contains: search, mode: "insensitive" } },
          emailSearchFilter(search),
        ];
      }

      const [data, total] = await Promise.all([
        prisma.organisation.findMany({
          where,
          include: {
            users: {
              where: { role: "BUYER" },
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
              take: 1,
            },
            approvedBy: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.organisation.count({ where }),
      ]);

      const formatted = data.map((org) => ({
        id: org.id,
        code: org.id.slice(0, 8).toUpperCase(),
        name: org.companyName,
        type: org.businessCategory || "General",
        location: `${org.city}, ${org.state}`,
        gstNumber: org.gstNumber,
        contactPerson: org.contactName,
        contactEmail: org.users[0]?.email ?? null,
        contactPhone: org.contactPhone,
        spend: 0,
        spendDisplay: "₹0",
        status: org.accountState,
        date: org.createdAt.toLocaleDateString("en-IN"),
        createdAt: org.createdAt,
      }));

      return { data: formatted, total };
    } catch (error) {
      console.error("[AdminService.getBuyers]", error);
      throw error;
    }
  }

  /**
   * Update buyer status
   */
  static async updateBuyerStatus(
    organisationId,
    accountState,
    rejectReason = null,
    approvedByUserId = null
  ) {
    try {
      const updated = await prisma.organisation.update({
        where: { id: organisationId },
        data: {
          accountState,
          rejectReason: accountState === "REJECTED" ? rejectReason : null,
          approvedByUserId: accountState === "ACTIVE" ? approvedByUserId : null,
          approvedAt:
            accountState === "ACTIVE" ? new Date() : null,
        },
        include: {
          users: true,
          approvedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // Activate associated users if organisation is approved
      if (accountState === "ACTIVE") {
        await prisma.user.updateMany({
          where: { organisationId },
          data: { isActive: true },
        });
      }

      return {
        id: updated.id,
        companyName: updated.companyName,
        status: updated.accountState,
        rejectReason: updated.rejectReason,
        approvedAt: updated.approvedAt,
      };
    } catch (error) {
      console.error("[AdminService.updateBuyerStatus]", error);
      throw error;
    }
  }
}

export default AdminService;
