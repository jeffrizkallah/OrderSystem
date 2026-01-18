'use client';

import { useState } from 'react';
import { updateOrderStatus, deleteOrder } from '@/app/orders/actions';

export function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true);
    await updateOrderStatus(orderId, newStatus);
    setIsUpdating(false);
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      await deleteOrder(orderId);
    }
  }

  return (
    <div className="flex gap-2">
      {currentStatus === 'draft' && (
        <button
          onClick={() => handleStatusChange('submitted')}
          disabled={isUpdating}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Order
        </button>
      )}
      {currentStatus === 'submitted' && (
        <button
          onClick={() => handleStatusChange('received')}
          disabled={isUpdating}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Mark as Received
        </button>
      )}
      {currentStatus === 'received' && (
        <button
          onClick={() => handleStatusChange('submitted')}
          disabled={isUpdating}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Mark as Submitted
        </button>
      )}
      <button
        onClick={handleDelete}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}
