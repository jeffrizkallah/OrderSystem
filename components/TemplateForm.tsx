'use client';

import { useState } from 'react';
import { createTemplate } from '@/app/templates/actions';
import Link from 'next/link';

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

type TemplateItem = {
  ingredientId: number;
  quantity: string;
};

export function TemplateForm({ ingredients }: { ingredients: Ingredient[] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateItems, setTemplateItems] = useState<Record<number, TemplateItem>>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) {
      acc[ing.category] = [];
    }
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  function handleQuantityChange(ingredientId: number, quantity: string) {
    if (quantity === '' || parseFloat(quantity) === 0) {
      const newItems = { ...templateItems };
      delete newItems[ingredientId];
      setTemplateItems(newItems);
    } else {
      setTemplateItems({
        ...templateItems,
        [ingredientId]: {
          ingredientId,
          quantity,
        },
      });
    }
  }

  async function handleSubmit() {
    setError('');
    setIsSubmitting(true);

    if (!name.trim()) {
      setError('Template name is required');
      setIsSubmitting(false);
      return;
    }

    const items = Object.values(templateItems).map((item) => ({
      ingredientId: item.ingredientId,
      quantity: parseFloat(item.quantity),
    }));

    const result = await createTemplate(name, description, items);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  }

  const itemCount = Object.keys(templateItems).length;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Template Details</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Template Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="e.g., Monday Order, Weekend Specials"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="Brief description of this template"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Template Items</h3>
          <div className="text-sm text-gray-500">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
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
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center p-3 hover:bg-gray-50 rounded-md"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
                      <div className="text-xs text-gray-500">{ingredient.supplier.name}</div>
                    </div>
                    <div>
                      <label className="sr-only">Quantity</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          placeholder="0"
                          value={templateItems[ingredient.id]?.quantity || ''}
                          onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        />
                        <span className="ml-2 text-sm text-gray-500">{ingredient.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-end gap-3">
          <Link
            href="/templates"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
