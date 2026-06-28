export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
      <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-crisis-red rounded-full animate-spin mb-4" />
      <p className="text-small">Cargando...</p>
    </div>
  )
}
