import { useState } from "react";

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];

  // empty slots before month starts
  for (let i = 0; i < firstDay; i++) days.push(null);

  // actual days
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const changeMonth = (dir: number) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="w-64 bg-white rounded-2xl shadow-xl border border-[#005d52]/10 p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1 rounded-lg hover:bg-[#005d52]/10"
        >
          ‹
        </button>

        <p className="text-sm font-semibold text-gray-800">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>

        <button
          onClick={() => changeMonth(1)}
          className="p-1 rounded-lg hover:bg-[#005d52]/10"
        >
          ›
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-[10px] text-gray-400 font-bold mb-2 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map((day, i) =>
          day ? (
            <button
              key={i}
              onClick={() => setSelected(new Date(year, month, day))}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition
                ${
                  selected &&
                  day === selected.getDate() &&
                  month === selected.getMonth()
                    ? "bg-[#005d52] text-white"
                    : ""
                }
                ${
                  isToday(day)
                    ? "border border-[#005d52] text-[#005d52] hover:text-[#005d52] font-bold"
                    : "text-gray-700 hover:text-[#005d52]"
                }
                hover:bg-[#005d52]/10
              `}
            >
              {day}
            </button>
          ) : (
            <div key={i}></div>
          )
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;