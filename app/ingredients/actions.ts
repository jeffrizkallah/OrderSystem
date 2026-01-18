'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createIngredient(formData: FormData) {
  const name = formData.get('name') as string;
  const unit = formData.get('unit') as string;
  const defaultPrice = formData.get('defaultPrice') as string;
  const category = formData.get('category') as string;
  const supplierId = formData.get('supplierId') as string;

  if (!name || !unit || !defaultPrice || !category || !supplierId) {
    return { error: 'All fields are required' };
  }

  try {
    await prisma.ingredient.create({
      data: {
        name,
        unit,
        defaultPrice: parseFloat(defaultPrice),
        category,
        supplierId: parseInt(supplierId),
      },
    });

    revalidatePath('/ingredients');
    return { success: true };
  } catch (error) {
    console.error('Failed to create ingredient:', error);
    return { error: 'Failed to create ingredient' };
  }
}

export async function updateIngredient(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const unit = formData.get('unit') as string;
  const defaultPrice = formData.get('defaultPrice') as string;
  const category = formData.get('category') as string;
  const supplierId = formData.get('supplierId') as string;

  if (!name || !unit || !defaultPrice || !category || !supplierId) {
    return { error: 'All fields are required' };
  }

  try {
    await prisma.ingredient.update({
      where: { id },
      data: {
        name,
        unit,
        defaultPrice: parseFloat(defaultPrice),
        category,
        supplierId: parseInt(supplierId),
      },
    });

    revalidatePath('/ingredients');
    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Failed to update ingredient:', error);
    return { error: 'Failed to update ingredient' };
  }
}

export async function deleteIngredient(id: number) {
  try {
    await prisma.ingredient.delete({
      where: { id },
    });

    revalidatePath('/ingredients');
    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete ingredient:', error);
    return { error: 'Failed to delete ingredient' };
  }
}
