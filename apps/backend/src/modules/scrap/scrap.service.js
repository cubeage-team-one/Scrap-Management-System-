import prisma from '../../core/lib/prisma.js';

export const createScrap = async (data, userId, organisationId) => {
  // Automatically calculate available quantity for new records
  const availableQty = data.totalQuantityKg;
  
  return await prisma.scrapRecord.create({
    data: {
      ...data,
      ownerId: organisationId,
      createdByUserId: userId,
      availableQuantityKg: availableQty,
      status: 'AVAILABLE'
    }
  });
};

export const getScraps = async (organisationId) => {
  return await prisma.scrapRecord.findMany({
    where: { ownerId: organisationId },
    include: { category: true } // Include category details if available
  });
};

export const getScrapById = async (id, organisationId) => {
  return await prisma.scrapRecord.findFirst({
    where: { id, ownerId: organisationId },
    include: { category: true }
  });
};

export const updateScrap = async (id, data, organisationId) => {
  // Verify ownership before updating
  const existing = await getScrapById(id, organisationId);
  if (!existing) {
    throw new Error('Scrap record not found or unauthorized');
  }

  // Optional: recalculate available quantity if totalQuantityKg is modified
  const updateData = { ...data };
  if (data.totalQuantityKg !== undefined) {
    // Basic logic: available = new total - listed - sold
    const listed = Number(existing.listedQuantityKg || 0);
    const sold = Number(existing.soldQuantityKg || 0);
    updateData.availableQuantityKg = Number(data.totalQuantityKg) - listed - sold;
  }

  return await prisma.scrapRecord.update({
    where: { id },
    data: updateData
  });
};

export const deleteScrap = async (id, organisationId) => {
  // Verify ownership before deleting
  const existing = await getScrapById(id, organisationId);
  if (!existing) {
    throw new Error('Scrap record not found or unauthorized');
  }

  return await prisma.scrapRecord.delete({
    where: { id }
  });
};
