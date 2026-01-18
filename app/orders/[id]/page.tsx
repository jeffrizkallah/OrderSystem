import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { OrderActions } from '@/components/OrderActions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getOrder(id: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            ingredient: {
              include: {
                supplier: true,
              },
            },
          },
        },
      },
    });
    return order;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(parseInt(id));

  if (!order) {
    notFound();
  }

  const groupedItems = order.orderItems.reduce((acc, item) => {
    const category = item.ingredient.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof order.orderItems>);

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Orders
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Order #{order.id}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Created on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <OrderActions orderId={order.id} currentStatus={order.status} />
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDateTime(order.orderDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      order.status === 'draft'
                        ? 'bg-gray-100 text-gray-800'
                        : order.status === 'submitted'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(order.totalAmount.toString())}
                </dd>
              </div>
              {order.notes && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">{category}</h3>
              </div>
              <div className="px-4 py-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingredient
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 text-sm text-gray-900">{item.ingredient.name}</td>
                        <td className="py-3 text-sm text-gray-500">{item.ingredient.supplier.name}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">
                          {item.quantity.toString()} {item.ingredient.unit}
                        </td>
                        <td className="py-3 text-sm text-gray-900 text-right">
                          {formatCurrency(item.unitPrice.toString())}
                        </td>
                        <td className="py-3 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.totalPrice.toString())}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
