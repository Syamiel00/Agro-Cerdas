import { useState } from "react";
import { Home, BarChart2, Settings } from "lucide-react"; // install: npm i lucide-react
import clsx from "clsx";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={clsx(
        "h-screen bg-gray-800 text-gray-100 flex flex-col transition-all duration-300",
        open ? "w-64" : "w-20"
      )}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className={clsx("text-xl font-bold", !open && "hidden")}>
          🌱
        </h1>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-white"
        >
          {open ? "<" : ">"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700"
        >
          <Home className="w-5 h-5" />
          {open && <span>Dashboard</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700"
        >
          <BarChart2 className="w-5 h-5" />
          {open && <span>Analytics</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700"
        >
          <Settings className="w-5 h-5" />
          {open && <span>Settings</span>}
        </a>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        {open && "© 2025 Agro Cerdas"}
      </div>
    </div>
  );
}
