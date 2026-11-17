import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, Eye, MousePointerClick, Newspaper, Users } from 'lucide-react';
import api from '../services/api';

const number = (value) => Number(value || 0).toLocaleString();

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/analytics')
      .then((response) => setData(response.data.data || response.data))
      .catch(() => setError('Analytics data could not be loaded.'));
  }, []);

  const dailyViews = data?.daily_views || [];
  const maxViews = useMemo(() => Math.max(...dailyViews.map((item) => Number(item.views || 0)), 1), [dailyViews]);
  const stats = data?.stats || {};
  const cards = [
    ['Page views', stats.page_views, Eye],
    ['Unique sessions', stats.unique_sessions, Users],
    ['CTA clicks', stats.cta_clicks, MousePointerClick],
    ['Blog reads', stats.blog_reads, Newspaper],
  ];

  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="eyebrow">AMS-style intelligence</span>
          <h1>Website Analytics</h1>
          <p>Understand the pages, actions and content that move visitors toward a booking.</p>
        </div>
        <span className="admin-date">Last 30 days</span>
      </div>

      {error && <div className="admin-banner admin-banner-error">{error}</div>}

      <div className="admin-stat-grid">
        {cards.map(([label, value, Icon]) => (
          <div className="admin-stat" key={label}>
            <span><Icon size={18} /></span>
            <small>{label}</small>
            <strong>{number(value)}</strong>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid analytics-dashboard-grid">
        <div className="admin-panel">
          <div className="panel-head">
            <div><h3>Traffic trend</h3><p>Daily page views recorded by Crescent's first-party tracker.</p></div>
            <BarChart3 size={20} />
          </div>
          <div className="analytics-bars" aria-label="Daily page views chart">
            {dailyViews.length ? dailyViews.map((item) => (
              <div className="analytics-bar-item" key={item.day} title={`${item.day}: ${item.views} views`}>
                <div className="analytics-bar" style={{ height: `${Math.max((Number(item.views) / maxViews) * 100, 5)}%` }} />
                <small>{String(item.day).slice(5)}</small>
              </div>
            )) : <p className="muted">Traffic data will appear after visitors browse the website.</p>}
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-head">
            <div><h3>Top pages</h3><p>Most visited routes.</p></div>
            <Activity size={20} />
          </div>
          <div className="analytics-list">
            {(data?.top_pages || []).map((item) => (
              <div key={item.page_path}><strong>{item.page_path || '/'}</strong><span>{number(item.views)} views</span></div>
            ))}
            {!data?.top_pages?.length && <p className="muted">No page data yet.</p>}
          </div>
        </div>
      </div>

      <div className="admin-panel analytics-actions-panel">
        <div className="panel-head">
          <div><h3>Top actions</h3><p>Links and buttons visitors are using most often.</p></div>
          <MousePointerClick size={20} />
        </div>
        <div className="analytics-action-grid">
          {(data?.top_actions || []).map((item) => (
            <div className="analytics-action-card" key={item.target_label}>
              <strong>{item.target_label || 'Unnamed action'}</strong>
              <span>{number(item.clicks)} clicks</span>
            </div>
          ))}
          {!data?.top_actions?.length && <p className="muted">No interaction data yet.</p>}
        </div>
      </div>
    </>
  );
}
