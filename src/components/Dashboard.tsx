// src/components/Dashboard.tsx
// React import removed as it's not used in this component

const Dashboard = () => {
  const stats = [
    { label: 'Total Matches', value: 15 },
    { label: 'Total Teams', value: 6 },
    { label: 'Goals Scored', value: 38 },
    { label: 'Top Scorer', value: 'Player X (10 goals)' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <div className="text-sm text-gray-500 mb-2">{item.label}</div>
            <div className="text-xl font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
