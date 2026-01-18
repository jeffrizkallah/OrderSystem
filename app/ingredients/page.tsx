import { prisma } from '@/lib/prisma';
import { IngredientList } from '@/components/IngredientList';
import { AddIngredientForm } from '@/components/AddIngredientForm';

export const dynamic = 'force-dynamic';

async function getIngredients() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
      include: {
        supplier: true,
      },
    });
    return ingredients;
  } catch (error) {
    console.error('Failed to fetch ingredients:', error);
    return [];
  }
}

async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
    return suppliers;
  } catch (error) {
    console.error('Failed to fetch suppliers:', error);
    return [];
  }
}

export default async function IngredientsPage() {
  const [ingredients, suppliers] = await Promise.all([
    getIngredients(),
    getSuppliers(),
  ]);

  const categories = ['Produce', 'Meat', 'Dairy', 'Dry Goods', 'Seafood', 'Beverages', 'Other'];

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Ingredients</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your restaurant ingredients, prices, and suppliers.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AddIngredientForm suppliers={suppliers} categories={categories} />
      </div>

      <div className="mt-8">
        <IngredientList
          ingredients={ingredients}
          suppliers={suppliers}
          categories={categories}
        />
      </div>
    </div>
  );
}
