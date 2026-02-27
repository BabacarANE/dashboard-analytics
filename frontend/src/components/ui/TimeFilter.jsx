/**
 * components/ui/TimeFilter.jsx
 */

const PERIODS = [
  { value: '1h',  label: '1H'  },
  { value: '24h', label: '24H' },
  { value: '7d',  label: '7J'  },
  { value: '30d', label: '30J' },
]

export default function TimeFilter({ period, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
      {PERIODS.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-all duration-200 ${
            period === p.value
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
