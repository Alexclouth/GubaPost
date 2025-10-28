export default function DashboardCard({ title, value, icon, color }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
