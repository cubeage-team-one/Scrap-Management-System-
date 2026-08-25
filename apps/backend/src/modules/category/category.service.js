import prisma from '../../core/lib/prisma.js';

export const getCategories = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
};

export const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id }
  });
};
