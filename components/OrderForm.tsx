'use client';

import { useState } from 'react';
import { createOrder } from '@/app/orders/actions';
import { formatCurrency } from '@/lib/utils';

type Ingredient = {
  id: number;
  name: string;
  unit: string;
  defaultPrice: any;
  category: string;
  supplier: {
    name: string;
  };
};

type Template = {
  id: number;
  name: string;
  description: string | null;
  templateItems: {
    ingredientId: number;
    quantity: any;
  }[];
};

type OrderItem = {
  ingredientId: number;
  quantity: string;
  unitPrice: string;
};

export function OrderForm({
  ingredients,
  templates,
}: {
  ingredients: Ingredient[];
  templates: Template[];
}) {
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem>>({});
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) {
      acc[ing.category] = [];
    }
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  function handleQuantityChange(ingredientId: number, ingredient: Ingredient, quantity: string) {
    if (quantity === '' || parseFloat(quantity) === 0) {
      const newItems = { ...orderItems };
      delete newItems[ingredientId];
      setOrderItems(newItems);
    } else {
      setOrderItems({
        ...orderItems,
        [ingredientId]: {
          ingredientId,
          quantity,
          unitPrice: ingredient.defaultPrice.toString(),
        },
      });
    }
  }

  function handlePriceChange(ingredientId: number, price: string) {
    if (orderItems[ingredientId]) {
      setOrderItems({
        ...orderItems,
        [ingredientId]: {
          ...orderItems[ingredientId],
          unitPrice: price,
        },
      });
    }
  }

  function loadTemplate(template: Template) {
    const newItems: Record<number, OrderItem> = {};
    template.templateItems.forEach((item) => {
      const ingredient = ingredients.find((ing) => ing.id === item.ingredientId);
      if (ingredient) {
        newItems[item.ingredientId] = {
          ingredientId: item.ingredientId,
          quantity: item.quantity.toString(),
          unitPrice: ingredient.defaultPrice.toString(),
        };
      }
    });
    setOrderItems(newItems);
  }

  function calculateTotal() {
    return Object.values(orderItems).reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + quantity * price;
    }, 0);
  }

  async function handleSubmit(status: 'draft' | 'submitted') {
    setError('');
    setIsSubmitting(true);

    const items = Object.values(orderItems).map((item) => ({
      ingredientId: item.ingredientId,
      quantity: parseFloat(item.quantity),
      unitPrice: parseFloat(item.unitPrice),
      totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
    }));

    const result = await createOrder(status, notes, items);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  }

  const itemCount = Object.keys(orderItems).length;
  const totalAmount = calculateTotal();

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {templates.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Load from Template</h3>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => loadTemplate(template)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          <div className="text-sm text-gray-500">
            {itemCount} item{itemCount !== 1 ? 's' : ''} • Total: {formatCurrency(totalAmount)}
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedIngredients).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-700 mb-3">{category}</h4>
              <div className="space-y-2">
                {items.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-3 hover:bg-gray-50 rounded-md"
                  >
                    <div className="sm:col-span-4">
                      <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
                      <div className="text-xs text-gray-500">{ingredient.supplier.name}</div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="sr-only">Quantity</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          placeholder="0"
                          value={orderItems[ingredient.id]?.quantity || ''}
                          onChange={(e) =>
                            handleQuantityChange(ingredient.id, ingredient, e.target.value)
                          }
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        />
                        <span className="ml-2 text-sm text-gray-500">{ingredient.unit}</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="sr-only">Price</label>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-1">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={orderItems[ingredient.id]?.unitPrice || ingredient.defaultPrice.toString()}
                          onChange={(e) => handlePriceChange(ingredient.id, e.target.value)}
                          disabled={!orderItems[ingredient.id]}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3 text-right">
                      {orderItems[ingredient.id] && (
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            parseFloat(orderItems[ingredient.id].quantity) *
                              parseFloat(orderItems[ingredient.id].unitPrice)
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Any special instructions or notes for this order..."
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-gray-500">Total Items: {itemCount}</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={itemCount === 0 || isSubmitting}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit('submitted')}
              disabled={itemCount === 0 || isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
