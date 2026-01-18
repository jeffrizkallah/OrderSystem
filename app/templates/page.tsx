import { prisma } from '@/lib/prisma';
import { TemplateList } from '@/components/TemplateList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getTemplates() {
  try {
    const templates = await prisma.orderTemplate.findMany({
      orderBy: { name: 'asc' },
      include: {
        templateItems: {
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
    return templates;
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return [];
  }
}

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Order Templates</h1>
          <p className="mt-2 text-sm text-gray-700">
            Save frequently used orders as templates for quick ordering.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/templates/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Template
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <TemplateList templates={templates} />
      </div>
    </div>
  );
}
