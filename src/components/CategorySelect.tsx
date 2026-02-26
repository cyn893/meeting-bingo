import type { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-lg w-full">
        <button
          onClick={onBack}
          className="mb-6 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Choose Your Category
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Pick a buzzword pack for your meeting
        </p>
        <div className="grid gap-4">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md text-left transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
