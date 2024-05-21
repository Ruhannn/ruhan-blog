export default function CategoryList({ categories }: { categories: string[] }) {
  return (
    <div className="flex space-x-2">
      {categories.map((category) => (
        <span
          key={category}
          className="px-4 py-2 text-sm rounded-full bg-customGray-base dark:bg-customGray-light"
        >
          {category}
        </span>
      ))}
    </div>
  );
}
