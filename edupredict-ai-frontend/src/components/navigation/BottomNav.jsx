import { NavLink } from 'react-router-dom';

export default function BottomNav({ items, className = '' }) {
  return (
    <nav className={className}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              'flex flex-col items-center justify-center',
              isActive ? item.activeClassName : item.inactiveClassName
            ].join(' ')
          }
        >
          <span className={`material-symbols-outlined ${item.fill ? 'material-fill' : ''}`}>
            {item.icon}
          </span>
          <span className={item.labelClassName || 'text-[10px] font-semibold mt-0.5'}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
