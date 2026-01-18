'use client';

import { useState } from 'react';
import { updateSupplier, deleteSupplier } from '@/app/suppliers/actions';

type Supplier = {
  id: number;
  name: string;
  contactInfo: string | null;
  email: string | null;
  phone: string | null;
  _count: {
    ingredients: number;
  };
};

export function SupplierList({ suppliers }: { suppliers: Supplier[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function handleUpdate(id: number, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await updateSupplier(id, formData);

    if (result.error) {
      setError(result.error);
    } else {
      setEditingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    setError('');
    const result = await deleteSupplier(id);

    if (result.error) {
      setError(result.error);
    }
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new supplier.</p>
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
      
      {suppliers.map((supplier) => (
        <div key={supplier.id} className="bg-white shadow rounded-lg p-6">
          {editingId === supplier.id ? (
            <form onSubmit={(e) => handleUpdate(supplier.id, e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={supplier.name}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Info
                </label>
                <textarea
                  name="contactInfo"
                  defaultValue={supplier.contactInfo || ''}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={supplier.email || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={supplier.phone || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
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
            <div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                  {supplier.contactInfo && (
                    <p className="mt-1 text-sm text-gray-500">{supplier.contactInfo}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                    {supplier.email && (
                      <span className="flex items-center">
                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {supplier.email}
                      </span>
                    )}
                    {supplier.phone && (
                      <span className="flex items-center">
                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {supplier.phone}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {supplier._count.ingredients} ingredient{supplier._count.ingredients !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingId(supplier.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
