'use client';

import { useState } from 'react';
import { deleteTemplate } from '@/app/templates/actions';

type Template = {
  id: number;
  name: string;
  description: string | null;
  templateItems: {
    id: number;
    quantity: any;
    ingredient: {
      name: string;
      unit: string;
      category: string;
      supplier: {
        name: string;
      };
    };
  }[];
};

export function TemplateList({ templates }: { templates: Template[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this template?')) return;

    setError('');
    const result = await deleteTemplate(id);

    if (result.error) {
      setError(result.error);
    }
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
        <p className="mt-1 text-sm text-gray-500">
          Save frequently used orders as templates for quick ordering.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {templates.map((template) => {
        const isExpanded = expandedId === template.id;
        const groupedItems = template.templateItems.reduce((acc, item) => {
          if (!acc[item.ingredient.category]) {
            acc[item.ingredient.category] = [];
          }
          acc[item.ingredient.category].push(item);
          return acc;
        }, {} as Record<string, typeof template.templateItems>);

        return (
          <div key={template.id} className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  {template.description && (
                    <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {template.templateItems.length} item
                    {template.templateItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : template.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {isExpanded ? 'Hide' : 'View'}
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center text-sm py-1"
                            >
                              <div>
                                <span className="text-gray-900">{item.ingredient.name}</span>
                                <span className="text-gray-500 ml-2">
                                  ({item.ingredient.supplier.name})
                                </span>
                              </div>
                              <div className="text-gray-700">
                                {item.quantity.toString()} {item.ingredient.unit}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
