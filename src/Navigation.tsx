import { Hop as Home, Leaf, X } from "lucide-react";
import clsx from "clsx";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <div
      className={clsx(
        "h-screen flex flex-col transition-all duration-300 fixed inset-y-0 z-50",
        isOpen
          ? "w-72 translate-x-0"
          : "w-72 -translate-x-full md:translate-x-0 md:w-72"
      )}
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderRight: "1px solid rgba(16, 185, 129, 0.2)",
        boxShadow: "4px 0 24px rgba(16, 185, 129, 0.1)",
      }}
    >
      {/* Mobile header with close button */}
      <div className="flex items-center justify-between p-6 md:hidden">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
            }}
          >
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-slate-800"
              style={{ letterSpacing: "-0.02em" }}
            >
              AgroCerdas
            </h1>
            <p
              className="text-xs text-slate-500 uppercase"
              style={{ letterSpacing: "0.05em" }}
            >
              IoT Dashboard
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-xl transition-all duration-300 hover:scale-105"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#059669",
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop header (always visible) */}
      <div className="hidden md:flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
            }}
          >
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-slate-800"
              style={{ letterSpacing: "-0.02em" }}
            >
              AgroCerdas
            </h1>
            <p
              className="text-xs text-slate-500 uppercase"
              style={{ letterSpacing: "0.05em" }}
            >
              IoT Dashboard
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md"
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.15) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#059669",
          }}
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold">Dashboard</span>
        </a>
        {/*
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group hover:bg-white/50 shadow-sm hover:shadow-md"
          style={{
            color: "#475569",
            border: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        >
          <BarChart2 className="w-5 h-5 transition-colors group-hover:text-emerald-600" />
          <span className="font-medium">Blank</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group hover:bg-white/50 shadow-sm hover:shadow-md"
          style={{
            color: "#475569",
            border: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        >
          <Settings className="w-5 h-5 transition-colors group-hover:text-emerald-600" />
          <span className="font-medium">Blank</span>
        </a>
      */}
      </nav>

      <div
        className="p-6 hidden md:block"
        style={{
          borderTop: "1px solid rgba(16, 185, 129, 0.2)",
        }}
      >
        <p className="text-xs text-slate-400 text-center">© 2025 AgroCerdas</p>
      </div>
    </div>
  );
}
