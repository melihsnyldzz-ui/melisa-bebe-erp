import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function AppLayout({ activeModule, onModuleChange, children }) {
  return (
    <div className="app-shell">
      <Sidebar activeModule={activeModule} onModuleChange={onModuleChange} />
      <main className="main-area">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
