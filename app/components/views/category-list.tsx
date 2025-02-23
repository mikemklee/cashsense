import { Category } from "types/category";

export default function CategoryList({
  categories = [],
}: {
  categories: Category[];
}) {
  return (
    <>
      <div className="flex justify-between items-center pt-8 pb-2">
        <h1>Categories</h1>
      </div>
      <div className="flex">
        {categories.map((category) => (
          <CategoryTag key={category.id} category={category} />
        ))}
      </div>
    </>
  );
}

export function CategoryTag({ category }: { category: Category }) {
  const { name, color } = category;

  return (
    <div className="bg-card-foreground/3 border border-card-foreground/10 p-3 rounded-lg text-sm">
      <div className="flex items-center gap-x-2">
        <span
          className="w-1.5 h-4 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span>{name}</span>
      </div>
    </div>
  );
}
