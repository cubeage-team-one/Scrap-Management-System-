import prisma from '../../../core/lib/prisma.js';

export const createQuotation = async (data, userId, organisationId) => {
  // Validate that the listing exists and is active
  const listing = await prisma.listing.findUnique({
    where: { id: data.listingId }
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (listing.status !== 'PUBLISHED') {
    throw new Error('Can only submit quotations for PUBLISHED listings');
  }

  // Calculate total value
  const totalValue = Number(data.pricePerKg) * Number(data.quantityKg);

  return await prisma.quotation.create({
    data: {
      listingId: data.listingId,
      buyerId: organisationId,
      pricePerKg: data.pricePerKg,
      quantityKg: data.quantityKg,
      totalValue: totalValue,
      paymentTerms: data.paymentTerms,
      note: data.note,
      isSealed: data.isSealed || false,
      validUntil: data.validUntil,
      status: 'SUBMITTED',
      submittedByUserId: userId
    }
  });
};

export const getQuotations = async (filters, organisationId, role) => {
  const where = {};
  
  // If industry, get quotations received for their listings
  // If buyer/dealer, get quotations they submitted
  if (role === 'INDUSTRY') {
    where.listing = {
      scrapRecord: { ownerId: organisationId }
    };
  } else {
    where.buyerId = organisationId;
  }

  if (filters.listingId) {
    where.listingId = filters.listingId;
  }
  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.quotation.findMany({
    where,
    include: {
      listing: {
        include: { scrapRecord: true }
      },
      buyer: {
        select: { companyName: true, contactName: true, contactPhone: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getQuotationById = async (id, organisationId, role) => {
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      listing: {
        include: { scrapRecord: true }
      },
      buyer: {
        select: { companyName: true, contactName: true, contactPhone: true }
      }
    }
  });

  if (!quotation) {
    throw new Error('Quotation not found');
  }

  // Auth check: either they submitted it (buyer), or they own the listing (industry)
  const isOwner = quotation.buyerId === organisationId;
  const isListingOwner = quotation.listing.scrapRecord.ownerId === organisationId;

  if (!isOwner && !isListingOwner) {
    throw new Error('Unauthorized to view this quotation');
  }

  return quotation;
};

// Accept quotation (Industry action)
export const acceptQuotation = async (id, organisationId) => {
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: { listing: { include: { scrapRecord: true } } }
  });

  if (!quotation) throw new Error('Quotation not found');
  if (quotation.status !== 'SUBMITTED') throw new Error('Quotation is not in SUBMITTED state');
  
  if (quotation.listing.scrapRecord.ownerId !== organisationId) {
    throw new Error('Unauthorized to accept this quotation');
  }

  // Accept this quotation, you might want to reject others or move listing to OFFER_ACCEPTED
  // But for this requirement, we just update the status
  return await prisma.$transaction(async (tx) => {
    const updated = await tx.quotation.update({
      where: { id },
      data: { status: 'ACCEPTED' }
    });

    // Optionally update listing status to OFFER_ACCEPTED
    await tx.listing.update({
      where: { id: quotation.listingId },
      data: { status: 'OFFER_ACCEPTED' }
    });

    return updated;
  });
};

// Reject quotation (Industry action)
export const rejectQuotation = async (id, organisationId) => {
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: { listing: { include: { scrapRecord: true } } }
  });

  if (!quotation) throw new Error('Quotation not found');
  if (quotation.status !== 'SUBMITTED') throw new Error('Can only reject SUBMITTED quotations');
  
  if (quotation.listing.scrapRecord.ownerId !== organisationId) {
    throw new Error('Unauthorized to reject this quotation');
  }

  return await prisma.quotation.update({
    where: { id },
    data: { status: 'REJECTED' }
  });
};

// Withdraw quotation (Buyer action)
export const withdrawQuotation = async (id, organisationId) => {
  const quotation = await prisma.quotation.findUnique({
    where: { id }
  });

  if (!quotation) throw new Error('Quotation not found');
  if (quotation.status !== 'SUBMITTED') throw new Error('Can only withdraw SUBMITTED quotations');
  
  if (quotation.buyerId !== organisationId) {
    throw new Error('Unauthorized to withdraw this quotation');
  }

  return await prisma.quotation.update({
    where: { id },
    data: { status: 'WITHDRAWN' }
  });
};
