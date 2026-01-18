import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const [
      totalOrders,
      totalIngredients,
      totalSuppliers,
      monthlyOrders,
      weeklyOrders,
      recentOrders,
      topIngredients,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.ingredient.count(),
      prisma.supplier.count(),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { orderDate: 'desc' },
        include: {
          orderItems: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ['ingredientId'],
        _sum: { quantity: true, totalPrice: true },
        _count: true,
        orderBy: { _count: { ingredientId: 'desc' } },
        take: 5,
      }),
    ]);

    const monthlySpending = monthlyOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );
    const weeklySpending = weeklyOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    const topIngredientsWithNames = await Promise.all(
      topIngredients.map(async (item) => {
        const ingredient = await prisma.ingredient.findUnique({
          where: { id: item.ingredientId },
          select: { name: true, unit: true },
        });
        return {
          ...item,
          name: ingredient?.name || 'Unknown',
          unit: ingredient?.unit || '',
        };
      })
    );

    return {
      totalOrders,
      totalIngredients,
      totalSuppliers,
      monthlySpending,
      weeklySpending,
      recentOrders,
      topIngredients: topIngredientsWithNames,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return {
      totalOrders: 0,
      totalIngredients: 0,
      totalSuppliers: 0,
      monthlySpending: 0,
      weeklySpending: 0,
      recentOrders: [],
      topIngredients: [],
    };
  }
}

export default async function Home() {
  const data = await getDashboardData();

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{data.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/orders" className="font-medium text-blue-600 hover:text-blue-500">View all</a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ingredients</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{data.totalIngredients}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/ingredients" className="font-medium text-blue-600 hover:text-blue-500">Manage</a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Suppliers</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{data.totalSuppliers}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/suppliers" className="font-medium text-blue-600 hover:text-blue-500">Manage</a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">This Week</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{formatCurrency(data.weeklySpending)}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-500">
              This month: {formatCurrency(data.monthlySpending)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/orders/new"
              className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Order
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Templates
            </Link>
            <Link
              href="/ingredients"
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Ingredients
            </Link>
          </div>
        </div>

        {data.topIngredients.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Most Ordered Ingredients</h3>
            <div className="space-y-3">
              {data.topIngredients.map((item) => (
                <div key={item.ingredientId} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      Ordered {item._count} times
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      {item._sum.quantity?.toString() || '0'} {item.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(item._sum.totalPrice?.toString() || '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.recentOrders.length > 0 && (
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(order.orderDate)} • {order.orderItems.length} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount.toString())}
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          order.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : order.status === 'submitted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <Link href="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all orders →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
