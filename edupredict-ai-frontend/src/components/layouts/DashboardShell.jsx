import SidebarNav from '../navigation/SidebarNav';
import BottomNav from '../navigation/BottomNav';

export default function DashboardShell({
  sidebarItems,
  mobileItems,
  footer,
  topBarLeft,
  topBarRight,
  children,
  mainClassName = 'flex-1 flex flex-col min-h-screen overflow-x-hidden pb-20 md:pb-0'
}) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <SidebarNav items={sidebarItems} footer={footer} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="w-full sticky top-0 z-40 h-16 bg-surface/70 backdrop-blur-xl border-b border-white/20 shadow-sm flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop shrink-0">
          {topBarLeft}
          {topBarRight}
        </header>
        <main className={mainClassName}>
          {children}
        </main>
      </div>
      <BottomNav
        items={mobileItems}
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 pb-safe bg-surface/80 backdrop-blur-lg border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden"
      />
    </div>
  );
}
