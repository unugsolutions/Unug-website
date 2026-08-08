export default function ImagePreview({ items = [] }) {
  const valid = items.filter((item) => item.url)
  if (valid.length === 0) {
    return <p className="text-xs text-gray-400 text-center py-3">No images uploaded yet.</p>
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {valid.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-100 bg-[#F7F9FC] p-3 text-center">
          <div className="h-16 flex items-center justify-center">
            <img src={item.url} alt={item.label} className="max-h-16 max-w-full object-contain" />
          </div>
          <p className="mt-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
