'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createOrder(
  status: string,
  notes: string,
  items: { ingredientId: number; quantity: number; unitPrice: number; totalPrice: number }[]
) {
  if (items.length === 0) {
    return { error: 'Order must have at least one item' };
  }

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  try {
    const order = await prisma.order.create({
      data: {
        status,
        notes: notes || null,
        totalAmount,
        orderItems: {
          create: items.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    revalidatePath('/orders');
    revalidatePath('/');
    redirect(`/orders/${order.id}`);
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      // This is a Next.js redirect, re-throw it to let Next.js handle it
      throw error;
    }
    // This is an actual error, log and return it
    console.error('Failed to create order:', error);
    return { error: 'Failed to create order' };
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { error: 'Failed to update order status' };
  }
}

export async function deleteOrder(orderId: number) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });

    revalidatePath('/orders');
    revalidatePath('/');
    redirect('/orders');
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      // This is a Next.js redirect, re-throw it to let Next.js handle it
      throw error;
    }
    // This is an actual error, log and return it
    console.error('Failed to delete order:', error);
    return { error: 'Failed to delete order' };
  }
}
