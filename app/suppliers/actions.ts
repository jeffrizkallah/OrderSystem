'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createSupplier(formData: FormData) {
  const name = formData.get('name') as string;
  const contactInfo = formData.get('contactInfo') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  if (!name) {
    return { error: 'Name is required' };
  }

  try {
    await prisma.supplier.create({
      data: {
        name,
        contactInfo: contactInfo || null,
        email: email || null,
        phone: phone || null,
      },
    });

    revalidatePath('/suppliers');
    return { success: true };
  } catch (error) {
    console.error('Failed to create supplier:', error);
    return { error: 'Failed to create supplier' };
  }
}

export async function updateSupplier(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const contactInfo = formData.get('contactInfo') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  if (!name) {
    return { error: 'Name is required' };
  }

  try {
    await prisma.supplier.update({
      where: { id },
      data: {
        name,
        contactInfo: contactInfo || null,
        email: email || null,
        phone: phone || null,
      },
    });

    revalidatePath('/suppliers');
    revalidatePath('/ingredients');
    return { success: true };
  } catch (error) {
    console.error('Failed to update supplier:', error);
    return { error: 'Failed to update supplier' };
  }
}

export async function deleteSupplier(id: number) {
  try {
    await prisma.supplier.delete({
      where: { id },
    });

    revalidatePath('/suppliers');
    revalidatePath('/ingredients');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete supplier:', error);
    return { error: 'Failed to delete supplier. Make sure no ingredients are assigned to this supplier.' };
  }
}
