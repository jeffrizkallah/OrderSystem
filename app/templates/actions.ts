'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTemplate(
  name: string,
  description: string,
  items: { ingredientId: number; quantity: number }[]
) {
  if (!name) {
    return { error: 'Template name is required' };
  }

  if (items.length === 0) {
    return { error: 'Template must have at least one item' };
  }

  try {
    await prisma.orderTemplate.create({
      data: {
        name,
        description: description || null,
        templateItems: {
          create: items.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
          })),
        },
      },
    });

    revalidatePath('/templates');
    revalidatePath('/orders/new');
    redirect('/templates');
  } catch (error) {
    console.error('Failed to create template:', error);
    return { error: 'Failed to create template' };
  }
}

export async function deleteTemplate(id: number) {
  try {
    await prisma.orderTemplate.delete({
      where: { id },
    });

    revalidatePath('/templates');
    revalidatePath('/orders/new');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete template:', error);
    return { error: 'Failed to delete template' };
  }
}
