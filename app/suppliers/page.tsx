import { prisma } from '@/lib/prisma';
import { SupplierList } from '@/components/SupplierList';
import { AddSupplierForm } from '@/components/AddSupplierForm';

export const dynamic = 'force-dynamic';

async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { ingredients: true }
        }
      }
    });
    return suppliers;
  } catch (error) {
    console.error('Failed to fetch suppliers:', error);
    return [];
  }
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your ingredient suppliers and their contact information.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AddSupplierForm />
      </div>

      <div className="mt-8">
        <SupplierList suppliers={suppliers} />
      </div>
    </div>
  );
}
