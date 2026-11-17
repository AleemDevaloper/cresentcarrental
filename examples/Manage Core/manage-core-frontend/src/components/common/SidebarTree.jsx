import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const SidebarTree = ({
  items = [],
  level = 1,
  isSidebarOpen,
  activeTab,
  canViewTab,
  expandedMap = {},
  toggleExpand = () => {},
  onItemSelect = () => {},
  onGroupClick = null,
  onHoverGroup = null,
  onHoverLeaf = null,
  theme,
}) => {
  const hoverTimerRef = React.useRef(null);
  const scheduleHover = (callback, delay) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      hoverTimerRef.current = null;
      callback();
    }, delay);
  };
  const cancelHover = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  if (!items || !items.length) return null;

  return (
    <div className="nav flex-column w-100 nav-pills">
      {items.map((tab) => {
        if (!canViewTab(tab)) return null;
        const hasChildren = Array.isArray(tab.subTabs) && tab.subTabs.length > 0 && tab.subTabs.some(canViewTab);
        const isOpen = !!expandedMap[tab.id];
        const isActive = activeTab === tab.id || (hasChildren && tab.subTabs.some(s => s.id === activeTab || (s.subTabs && s.subTabs.some(ss => ss.id === activeTab))));

        const indentPerLevel = 5; // small 5px indent per level to keep start flush
        const paddingLeftPx = (level - 1) * indentPerLevel;

        return (
          <div key={tab.id} className="w-100 sidebar-tree-item">
            <button
              className={`nav-link w-100 text-start mb-1 transition ${isActive ? 'active' : ''} ${!isSidebarOpen ? 'px-0 justify-content-center' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) {
                  // Prefer group-level handler (for front flyover) if provided
                  if (onGroupClick) {
                                  try {
                                    const handled = onGroupClick(tab, e);
                                    if (handled) return; // handler took care (opened flyover or toggled)
                                  } catch { /* ignore and fallback */ }
                  }
                  toggleExpand(tab.id);
                  return;
                }

                // leaf item
                onItemSelect(tab);
              }}
              onMouseEnter={(e) => {
                if (hasChildren) {
                  if (onHoverGroup) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    scheduleHover(() => onHoverGroup(tab, rect), 90);
                  }
                } else if (onHoverLeaf) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  scheduleHover(() => onHoverLeaf(tab, rect), 60);
                }
              }}
              onMouseLeave={() => cancelHover()}
              title={!isSidebarOpen ? tab.label : ''}
            >
              <div className={`d-flex align-items-center ${!isSidebarOpen ? 'justify-content-center' : 'justify-content-start gx-0 colllapsedcenter'}`}>
                <span className={`side-icon-wrapper ${isSidebarOpen ? 'me-2' : ''}`} style={{ fontSize: 'var(--sidebar-font-size)', marginLeft: !isSidebarOpen ? 0 : `${paddingLeftPx}px` }}>{tab.icon}</span>
                {isSidebarOpen && <div className="navlable fw-medium" style={{ fontSize: 'var(--sidebar-font-size)' }}>{tab.label}</div>}
                {isSidebarOpen && hasChildren && (
                  <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} className="small ms-auto ms-c" style={{ fontSize: '10px', transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease' }} />
                )}
              </div>
            </button>

            {/* Children */}
            {hasChildren && (
              <div className={`nav-sub-container ${isOpen ? 'open' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
                <div className={`nav-sub-content ${!isSidebarOpen ? 'ps-0' : ''}`}>
                  <SidebarTree
                                  items={tab.subTabs}
                                  level={level + 1}
                                  isSidebarOpen={isSidebarOpen}
                                  activeTab={activeTab}
                                  canViewTab={canViewTab}
                                  expandedMap={expandedMap}
                                  toggleExpand={toggleExpand}
                                  onItemSelect={onItemSelect}
                                  onGroupClick={onGroupClick}
                                  onHoverGroup={onHoverGroup}
                                  onHoverLeaf={onHoverLeaf}
                                  theme={theme}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarTree;
