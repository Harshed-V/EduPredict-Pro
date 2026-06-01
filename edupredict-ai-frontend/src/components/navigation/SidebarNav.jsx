import { NavLink } from 'react-router-dom';

export default function SidebarNav({ items, footer }) {
  return (
    <aside className="h-screen w-72 hidden md:flex flex-col border-r border-white/20 bg-surface-container-low/80 backdrop-blur-2xl shadow-xl z-50 sticky top-0">
      <div className="flex flex-col gap-2 p-4 h-full">
        <div className="px-4 py-8 mb-4">
          {footer?.brand ?? (
            <>
              <h1 className="font-headline-md text-headline-md font-black text-primary leading-tight">
                EduPredict Pro
              </h1>
              <p className="text-on-surface-variant text-sm">AI Analytics Engine</p>
            </>
          )}
        </div>
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                  isActive
                    ? item.activeClassName
                    : item.inactiveClassName
                ].join(' ')
              }
            >
              <span className={`material-symbols-outlined ${item.fill ? 'material-fill' : ''}`}>
                {item.icon}
              </span>
              <span className="font-body-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {footer ? (
          <div className="mt-auto p-4 border-t border-outline-variant/30 flex items-center gap-3">
            {footer.content}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
