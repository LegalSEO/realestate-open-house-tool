interface StatsCardsProps {
  stats: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Sign-Ins',
      value: stats.total,
      icon: '👥',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Hot Leads',
      value: stats.hot,
      icon: '🔥',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    {
      label: 'Warm Leads',
      value: stats.warm,
      icon: '⚡',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Cold Leads',
      value: stats.cold,
      icon: '❄️',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bgColor} border ${card.borderColor} rounded-lg p-6 transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                {card.value}
              </p>
            </div>
            <span className="text-4xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
