import { prisma } from '@/lib/prisma';
import { OrderForm } from '@/components/OrderForm';

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

async function getTemplates() {
  try {
    const templates = await prisma.orderTemplate.findMany({
      orderBy: { name: 'asc' },
      include: {
        templateItems: {
          include: {
            ingredient: true,
          },
        },
      },
    });
    return templates;
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return [];
  }
}

export default async function NewOrderPage() {
  const [ingredients, templates] = await Promise.all([
    getIngredients(),
    getTemplates(),
  ]);

  if (ingredients.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Order</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No ingredients available</h3>
          <p className="text-sm text-yellow-700 mb-4">
            Please add ingredients before creating an order.
          </p>
          <a
            href="/ingredients"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
          >
            Go to Ingredients
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Order</h1>
      <OrderForm ingredients={ingredients} templates={templates} />
    </div>
  );
}
