import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

const CarStatsChart = () => {
  const [thisdata, setThisData] = useState<any[]>([]);
  const [lastdata, setLastData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response2 = await axios.get<any[]>(
        "http://localhost:8080/api/rentals/sales/lastWeek"
      );
      const response = await axios.get<any[]>(
        "http://localhost:8080/api/rentals/sales/thisWeek"
      );
      setThisData(response.data);
      setLastData(response2.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Gün adlarını ve fiyatları içeren bir obje oluşturma
  const processData = (data: any[]) => {
    const result: any = {};
    data.forEach(item => {
      const day = new Date(item.startDate).toLocaleDateString("tr-TR", { weekday: "short" });
      result[day] = item.totalPrice;
    });
    return result;
  };

  // Tüm günleri içeren bir dizi oluşturma
  const allDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // Her bir haftanın verilerini işleme
  const thisWeekProcessedData = processData(thisdata);
  const lastWeekProcessedData = processData(lastdata);

  // Eksik günleri tamamlayarak grafik için uygun bir veri seti oluşturma
  const chartData = allDays.map(day => ({
    name: day,
    week: thisWeekProcessedData[day] || 0,
    prevWeek: lastWeekProcessedData[day] || 0,
  }));

  return (
    <ResponsiveContainer width="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#ddd" />

        <CartesianGrid strokeDasharray="0" stroke="#b7ffe913" />
        <Tooltip wrapperClassName="tooltip__style" cursor={false} />
        <Area
          type="monotone"
          dataKey="week"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="prevWeek"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CarStatsChart;
