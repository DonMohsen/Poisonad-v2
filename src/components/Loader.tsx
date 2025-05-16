// components/spinner.tsx
export default function Loader() {
  return (
    <div className="relative flex h-6 w-6 items-center justify-center">
      <div className="h-full w-full animate-spin rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-600 dark:border-t-transparent" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
