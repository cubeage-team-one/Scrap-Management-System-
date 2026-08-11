import prisma from "../../core/lib/prisma.js";
import bcrypt from "bcrypt";
import { signToken } from "../../core/utils/jwt.js";

const allowedRoles = ["INDUSTRY", "DEALER", "BUYER"];

/**
 * ==========================
 * Register
 * ==========================
 */
export const register = async (body) => {
  const {
    role,
    companyName,
    gstNumber,
    contactName,
    phone,
    email,
    password,
    address,
    city,
    state,
    pincode,
  } = body;

  // Validate Role
  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  // Check Email
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Check GST (Optional)
  if (gstNumber) {
    const existingGST = await prisma.organisation.findUnique({
      where: {
        gstNumber,
      },
    });

    if (existingGST) {
      throw new Error("GST Number already exists");
    }
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Transaction
  const result = await prisma.$transaction(async (tx) => {
    const organisation = await tx.organisation.create({
      data: {
        companyName,
        businessType: role,
        gstNumber: gstNumber || null,
        address,
        city,
        state,
        pincode,
        contactName,
        contactPhone: phone,
      },
    });

    const user = await tx.user.create({
      data: {
        organisationId: organisation.id,
        contactName,
        email,
        phoneNumber: phone,
        password: hashedPassword,
        role,
      },
    });

    return {
      id: user.id,
      organisationId: organisation.id,
      contactName: user.contactName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      organisationStatus: organisation.accountState,
    };
  });

  return result;
};

/**
 * ==========================
 * Login
 * ==========================
 */
export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      organisation: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  if (user.organisation.accountState === "PENDING") {
    throw new Error(
      "Your account is waiting for admin approval."
    );
  }

  if (user.organisation.accountState === "REJECTED") {
    throw new Error(
      "Your account has been rejected."
    );
  }

  if (user.organisation.accountState === "SUSPENDED") {
    throw new Error(
      "Your account has been suspended."
    );
  }

  const token = signToken({
    id: user.id,
    organisationId: user.organisationId,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      organisationId: user.organisationId,
      contactName: user.contactName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: user.isActive,
      organisation: {
        id: user.organisation.id,
        companyName: user.organisation.companyName,
        businessType: user.organisation.businessType,
        accountState: user.organisation.accountState,
      },
    },
  };
};