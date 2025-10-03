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
import dayjs from "dayjs";

type AnyRecord = Record<string, any>;

export default function SmartFarmDashboard() {
  const [moistureData, setMoistureData] = useState<AnyRecord[]>([]);
  const [dhtData, setDhtData] = useState<AnyRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const endpoint = "http://localhost:5001";

  async function fetchTable(table: string) {
    try {
      const res = await fetch(`${endpoint}/${table}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e: any) {
      setError(e.message);
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

      const formattedMoisture = sortedMoisture.map(d => ({
        name: d.created_at,
        value: Number(d.moisture)
      }));

      const formattedDht = sortedDht.map(d => ({
        ...d,
        temperature: Number(d.temperature),
        humidity: Number(d.humidity),
        created_at: dayjs(d.created_at).isValid()
          ? dayjs(d.created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
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
    <div className="flex min-h-screen bg-gray-900 text-gray-100">

      <div className="flex min-h-screen bg-gray-900 text-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8">
          🌱 Agro Cerdas Dashboard
        </h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
            ⚠️ Error: {error}
          </div>
        )}

        {/* Grid for Moisture + DHT22 */}
        <div className="flex gap-6">
          {/* Moisture Card */}
          <div className="flex-1 bg-gray-800 rounded-xl shadow p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                {latestMoisture ? (
                  <>
                    <p className="text-3xl font-bold text-green-400">Latest Moisture</p>
                    <p className="text-3xl font-bold text-green-400">
                      💧 {latestMoisture.value}%
                    </p>
                    <p className="text-3xl font-bold text-green-400">
                      📅 {latestMoisture.name}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No data</p>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="h-56 mt-4">
              <ResponsiveContainer width={500} height={300}>
                <LineChart
                  data={moistureData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 10}} interval={0} angle={-45} textAnchor="end" />
                  <YAxis />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2ecc71"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DHT22 Card */}
          <div className="flex-1 bg-gray-800 rounded-xl shadow p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                {latestDht ? (
                  <>
                    <div className="flex-1 mr-4">
                      <p className="text-3xl font-bold text-green-400">Latest Temperature & Humidity</p>
                      <p className="text-2xl font-bold text-red-400">
                        🌡 {latestDht.temperature} °C | 💧 {latestDht.humidity} %
                      </p>
                    </div>
                    {/* <div className="flex-1">
                      <p className="text-3xl font-bold text-green-400">Latest  Humidity</p>
                      <p className="text-2xl font-bold text-red-400">
                        💧 {latestDht.humidity} %
                      </p>
                    </div> */}
                    <p className="text-sm text-gray-400">
                      📅 {latestDht.created_at}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No data</p>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="h-56 mt-4">
              <ResponsiveContainer width={500} height={300}>
                <LineChart
                  data={dhtData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <XAxis dataKey="created_at" tick={{ fontSize: 10}} interval={0} angle={-45} textAnchor="end" />
                  <YAxis />
                  <Legend layout="vertical" verticalAlign="middle" align="right"/>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#e74c3c"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3498db"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        <footer className="text-center text-gray-500 text-xs mt-8">
          Agro Cerdas IoT Dashboard • Auto-refresh every 10s
        </footer>
      </div>
    </div>
  );
}