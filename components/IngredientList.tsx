'use client';

import { useState } from 'react';
import { updateIngredient, deleteIngredient } from '@/app/ingredients/actions';
import { formatCurrency } from '@/lib/utils';

type Ingredient = {
  id: number;
  name: string;
  unit: string;
  defaultPrice: any;
  category: string;
  supplierId: number;
  supplier: {
    name: string;
  };
};

type Supplier = {
  id: number;
  name: string;
};

export function IngredientList({
  ingredients,
  suppliers,
  categories,
}: {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  categories: string[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  async function handleUpdate(id: number, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await updateIngredient(id, formData);

    if (result.error) {
      setError(result.error);
    } else {
      setEditingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;

    setError('');
    const result = await deleteIngredient(id);

    if (result.error) {
      setError(result.error);
    }
  }

  const filteredIngredients =
    filterCategory === 'all'
      ? ingredients
      : ingredients.filter((ing) => ing.category === filterCategory);

  const groupedIngredients = filteredIngredients.reduce((acc, ing) => {
    if (!acc[ing.category]) {
      acc[ing.category] = [];
    }
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  if (ingredients.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No ingredients</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new ingredient.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          id="filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(groupedIngredients).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
          <div className="space-y-3">
            {items.map((ingredient) => (
              <div key={ingredient.id} className="bg-white shadow rounded-lg p-4">
                {editingId === ingredient.id ? (
                  <form onSubmit={(e) => handleUpdate(ingredient.id, e)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ingredient Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={ingredient.name}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Unit *
                        </label>
                        <input
                          type="text"
                          name="unit"
                          defaultValue={ingredient.unit}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Default Price ($) *
                        </label>
                        <input
                          type="number"
                          name="defaultPrice"
                          defaultValue={ingredient.defaultPrice.toString()}
                          required
                          step="0.01"
                          min="0"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Category *
                        </label>
                        <select
                          name="category"
                          defaultValue={ingredient.category}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Supplier *
                      </label>
                      <select
                        name="supplierId"
                        defaultValue={ingredient.supplierId}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                      >
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900">{ingredient.name}</h4>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>{formatCurrency(ingredient.defaultPrice.toString())} per {ingredient.unit}</span>
                        <span>•</span>
                        <span>{ingredient.supplier.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingId(ingredient.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
