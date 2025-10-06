import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Droplets,
  Thermometer,
  Wind,
  Calendar,
  CircleAlert as AlertCircle,
} from "lucide-react";
import dayjs from "dayjs";
import Sidebar from "./Navigation";

type AnyRecord = Record<string, any>;

export default function SmartFarmDashboard() {
  const [moistureData, setMoistureData] = useState<AnyRecord[]>([]);
  const [dhtData, setDhtData] = useState<AnyRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Prefer Vite environment variable VITE_API_URL, fallback to local Flask dev server
  const endpoint = (import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:5001";

  async function fetchTable(table: string) {
    try {
      const res = await fetch(`${endpoint}/${table}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e: any) {
      const msg = e && e.message ? e.message : String(e);
      // include the attempted URL to help debugging (CORS / wrong port / network)
      setError(`${msg} — ${endpoint}/${table}`);
      console.error("Failed to fetch", endpoint, table, e);
      return [];
    }
  }

  async function fetchData() {
    setError(null);
    try {
      const [moisture, dht] = await Promise.all([
        fetchTable("moisture"),
        fetchTable("dht22"),
      ]);

      const sortedMoisture = [...moisture].sort(
        (a, b) => parseInt(a.id) - parseInt(b.id)
      );
      const sortedDht = [...dht].sort(
        (a, b) => parseInt(a.id) - parseInt(b.id)
      );

      const formattedMoisture = sortedMoisture.map((d) => ({
        name: d.created_at,
        value: Number(d.moisture),
      }));

      const formattedDht = sortedDht.map((d) => ({
        ...d,
        temperature: Number(d.temperature),
        humidity: Number(d.humidity),
        created_at: dayjs(d.created_at).isValid()
          ? dayjs(d.created_at, "YYYY-MM-DD HH:mm:ss").format(
              "YYYY-MM-DD HH:mm:ss"
            )
          : d.created_at,
      }));

      console.log("Moisture (formatted):", formattedMoisture);
      console.log("DHT22 (formatted):", formattedDht);

      setMoistureData(formattedMoisture.slice(-10));
      setDhtData(formattedDht.slice(-10));
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, []);

  const latestMoisture = moistureData[moistureData.length - 1];
  const latestDht = dhtData[dhtData.length - 1];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="fixed h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      <div className={`flex-1 p-6 md:p-8 overflow-y-auto ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold text-slate-800 mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Environmental Monitoring
            </h1>
            <p className="text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 status-indicator"></span>
              Live data • Auto-refresh every 10 seconds
            </p>
          </header>

          {error && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3 shadow-lg"
              style={{
                background: "rgba(254, 226, 226, 0.9)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Soil Moisture Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-5 h-5 text-emerald-600" />
                    <h2
                      className="text-sm font-semibold uppercase text-slate-500"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Soil Moisture
                    </h2>
                  </div>
                  {latestMoisture ? (
                    <>
                      <p className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
                        {latestMoisture.value}%
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{latestMoisture.name}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400">No data available</p>
                  )}
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    boxShadow: "0 8px 16px rgba(16, 185, 129, 0.25)",
                  }}
                >
                  <Droplets className="w-8 h-8 text-white" />
                </div>
              </div>

              <div
                className="pt-6 mt-6"
                style={{
                  borderTop: "1px solid rgba(16, 185, 129, 0.1)",
                }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={moistureData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={false}
                      axisLine={false}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      stroke="#CBD5E1"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      stroke="#CBD5E1"
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(16, 185, 129, 0.15)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div
                  className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <p
                    className="text-xs text-slate-500 uppercase mb-1"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    Average
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {moistureData.length > 0
                      ? (
                          moistureData.reduce((sum, d) => sum + d.value, 0) /
                          moistureData.length
                        ).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <p
                    className="text-xs text-slate-500 uppercase mb-1"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    Minimum
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {moistureData.length > 0
                      ? Math.min(...moistureData.map((d) => d.value)).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <p
                    className="text-xs text-slate-500 uppercase mb-1"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    Maximum
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {moistureData.length > 0
                      ? Math.max(...moistureData.map((d) => d.value)).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Temperature & Humidity Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer className="w-5 h-5 text-emerald-600" />
                    <h2
                      className="text-sm font-semibold uppercase text-slate-500"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Temperature & Humidity
                    </h2>
                  </div>
                  {latestDht ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 mb-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">
                            Temperature
                          </p>
                          <p className="text-4xl md:text-5xl font-bold text-slate-800">
                            {latestDht.temperature}°C
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">
                            Humidity
                          </p>
                          <p className="text-4xl md:text-5xl font-bold text-slate-800">
                            {latestDht.humidity}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{latestDht.created_at}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400">No data available</p>
                  )}
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #059669 0%, #10B981 100%)",
                    boxShadow: "0 8px 16px rgba(5, 150, 105, 0.25)",
                  }}
                >
                  <Wind className="w-8 h-8 text-white" />
                </div>
              </div>

              <div
                className="pt-6 mt-6"
                style={{
                  borderTop: "1px solid rgba(16, 185, 129, 0.1)",
                }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={dhtData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="created_at"
                      tick={false}
                      axisLine={false}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      stroke="#CBD5E1"
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#F59E0B"
                      tick={{ fontSize: 12, fill: "#F59E0B" }}
                      domain={['auto', 'auto']}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#3B82F6"
                      tick={{ fontSize: 12, fill: "#3B82F6" }}
                      domain={['auto', 'auto']}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(16, 185, 129, 0.15)",
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-4 h-4 text-amber-600" />
                      <p
                        className="text-xs text-slate-500 uppercase"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        Avg Temp
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-800">
                      {dhtData.length > 0
                        ? (
                            dhtData.reduce((sum, d) => sum + d.temperature, 0) /
                            dhtData.length
                          ).toFixed(1)
                        : "0"}
                      °C
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.1)",
                    }}
                  >
                    <p
                      className="text-xs text-slate-500 uppercase mb-1"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Range
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {dhtData.length > 0
                        ? `${Math.min(
                            ...dhtData.map((d) => d.temperature)
                          ).toFixed(1)}°C - ${Math.max(
                            ...dhtData.map((d) => d.temperature)
                          ).toFixed(1)}°C`
                        : "0°C - 0°C"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: "rgba(59, 130, 246, 0.05)",
                      border: "1px solid rgba(59, 130, 246, 0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <p
                        className="text-xs text-slate-500 uppercase"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        Avg Humidity
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-800">
                      {dhtData.length > 0
                        ? (
                            dhtData.reduce((sum, d) => sum + d.humidity, 0) /
                            dhtData.length
                          ).toFixed(1)
                        : "0"}
                      %
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: "rgba(59, 130, 246, 0.05)",
                      border: "1px solid rgba(59, 130, 246, 0.1)",
                    }}
                  >
                    <p
                      className="text-xs text-slate-500 uppercase mb-1"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Range
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {dhtData.length > 0
                        ? `${Math.min(
                            ...dhtData.map((d) => d.humidity)
                          ).toFixed(1)}% - ${Math.max(
                            ...dhtData.map((d) => d.humidity)
                          ).toFixed(1)}%`
                        : "0% - 0%"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="text-center py-6">
            <p className="text-sm text-slate-400">
              AgroCerdas IoT Monitoring Dashboard
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
