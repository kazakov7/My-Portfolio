import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Activity,
  UserCheck,
  Globe2,
  FolderGit2,
  Share2,
  FileDown,
  RefreshCw,
  LogOut,
  Search,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function Admin({ onNavigateHome }) {
  const [adminKey, setAdminKey] = useState(
    () => (typeof window !== "undefined" ? localStorage.getItem("kevin_admin_key") || "" : "")
  );
  const [inputKey, setInputKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawVisits, setRawVisits] = useState([]);
  const [expandedVid, setExpandedVid] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterReferrer, setFilterReferrer] = useState("all");

  // 1. Add <meta name="robots" content="noindex, nofollow"> to prevent indexing
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
      created = true;
    }
    const prevContent = meta.content;
    meta.content = "noindex, nofollow";

    return () => {
      if (created) {
        meta.remove();
      } else {
        meta.content = prevContent;
      }
    };
  }, []);

  // 2. Auto-login if admin key is already saved in localStorage
  useEffect(() => {
    if (adminKey) {
      fetchData(adminKey);
    }
  }, []);

  const fetchData = async (key) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/visits", {
        headers: { "x-admin-key": key },
      });

      if (res.status === 401) {
        setError("Invalid Admin Key. Access denied.");
        setIsAuthenticated(false);
        localStorage.removeItem("kevin_admin_key");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setRawVisits(data.visits || []);
      setIsAuthenticated(true);
      setAdminKey(key);
      localStorage.setItem("kevin_admin_key", key);

      // Exclude admin's own device from future tracking
      localStorage.setItem("noTrack", "1");
    } catch (err) {
      setError(err.message || "Failed to load visits data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError("Please enter your admin key.");
      return;
    }
    fetchData(inputKey.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("kevin_admin_key");
    setAdminKey("");
    setInputKey("");
    setIsAuthenticated(false);
    setRawVisits([]);
  };

  // Group events by visitor ID (vid)
  const groupedVisitors = useMemo(() => {
    const groups = {};

    rawVisits.forEach((visit) => {
      const vid = visit.vid || "unknown";
      if (!groups[vid]) {
        groups[vid] = {
          vid,
          shortId: vid.slice(0, 8),
          events: [],
          pageviews: 0,
          clicks: 0,
          leaves: 0,
          totalSeconds: 0,
          maxScroll: 0,
          country: visit.country || null,
          city: visit.city || null,
          device: visit.device || "desktop",
          os: visit.os || "Unknown",
          browser: visit.browser || "Unknown",
          screen: visit.screen || "-",
          lang: visit.lang || "-",
          referrer: visit.referrer || null,
          utm: visit.utm || null,
          firstVisit: visit.created_at,
          lastVisit: visit.created_at,
        };
      }

      const g = groups[vid];
      g.events.push(visit);

      if (visit.type === "pageview") g.pageviews += 1;
      if (visit.type === "click") g.clicks += 1;
      if (visit.type === "leave") g.leaves += 1;

      if (visit.seconds && visit.seconds > 0) {
        g.totalSeconds += visit.seconds;
      }
      if (visit.scroll && visit.scroll > g.maxScroll) {
        g.maxScroll = visit.scroll;
      }

      if (visit.country && !g.country) g.country = visit.country;
      if (visit.city && !g.city) g.city = visit.city;
      if (visit.referrer && !g.referrer) g.referrer = visit.referrer;
      if (visit.utm && !g.utm) g.utm = visit.utm;

      if (new Date(visit.created_at) < new Date(g.firstVisit)) {
        g.firstVisit = visit.created_at;
      }
      if (new Date(visit.created_at) > new Date(g.lastVisit)) {
        g.lastVisit = visit.created_at;
      }
    });

    return Object.values(groups).map((g) => {
      // Returning if more than 1 pageview or sessions spread over 10+ minutes
      const timeDiffMs = new Date(g.lastVisit) - new Date(g.firstVisit);
      const isReturning = g.pageviews > 1 || timeDiffMs > 10 * 60 * 1000;
      return {
        ...g,
        isReturning,
      };
    });
  }, [rawVisits]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalVisitors = groupedVisitors.length;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    let todayVisitors = 0;
    let returningCount = 0;
    const countryCounts = {};
    const projectClickCounts = {};
    const referrerCounts = {};
    let cvClicks = 0;

    groupedVisitors.forEach((v) => {
      if (new Date(v.lastVisit).getTime() >= todayStart) {
        todayVisitors += 1;
      }
      if (v.isReturning) {
        returningCount += 1;
      }
      if (v.country) {
        countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
      }
      if (v.referrer && v.referrer !== "") {
        try {
          const host = new URL(v.referrer).hostname;
          referrerCounts[host] = (referrerCounts[host] || 0) + 1;
        } catch {
          referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
        }
      }
    });

    rawVisits.forEach((v) => {
      if (v.type === "click" && v.target) {
        const targetLower = v.target.toLowerCase();
        if (targetLower.includes("cv") || targetLower.includes("resume")) {
          cvClicks += 1;
        } else {
          projectClickCounts[v.target] = (projectClickCounts[v.target] || 0) + 1;
        }
      }
    });

    const topCountry =
      Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
    const topProject =
      Object.entries(projectClickCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
    const topReferrer =
      Object.entries(referrerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Direct / None";

    return {
      totalVisitors,
      todayVisitors,
      returningCount,
      topCountry,
      topProject,
      topReferrer,
      cvClicks,
    };
  }, [groupedVisitors, rawVisits]);

  // Unique lists for filter dropdowns
  const availableCountries = useMemo(() => {
    const s = new Set();
    groupedVisitors.forEach((v) => {
      if (v.country) s.add(v.country);
    });
    return Array.from(s).sort();
  }, [groupedVisitors]);

  const availableReferrers = useMemo(() => {
    const s = new Set();
    groupedVisitors.forEach((v) => {
      if (v.referrer) {
        try {
          s.add(new URL(v.referrer).hostname);
        } catch {
          s.add(v.referrer);
        }
      }
    });
    return Array.from(s).sort();
  }, [groupedVisitors]);

  // Filtered Visitors
  const filteredVisitors = useMemo(() => {
    return groupedVisitors.filter((v) => {
      // Search by ID
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match = v.vid.toLowerCase().includes(q) || v.shortId.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Country filter
      if (filterCountry !== "all" && v.country !== filterCountry) {
        return false;
      }

      // Device filter
      if (filterDevice !== "all" && v.device.toLowerCase() !== filterDevice.toLowerCase()) {
        return false;
      }

      // Referrer filter
      if (filterReferrer !== "all") {
        if (!v.referrer) return false;
        try {
          const host = new URL(v.referrer).hostname;
          if (host !== filterReferrer) return false;
        } catch {
          if (v.referrer !== filterReferrer) return false;
        }
      }

      // Date range filter
      if (filterDateRange !== "all") {
        const visitTime = new Date(v.lastVisit).getTime();
        const now = Date.now();
        if (filterDateRange === "today") {
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          if (visitTime < startOfToday.getTime()) return false;
        } else if (filterDateRange === "7d") {
          if (now - visitTime > 7 * 24 * 3600 * 1000) return false;
        } else if (filterDateRange === "30d") {
          if (now - visitTime > 30 * 24 * 3600 * 1000) return false;
        }
      }

      return true;
    });
  }, [groupedVisitors, searchQuery, filterCountry, filterDevice, filterDateRange, filterReferrer]);

  // Format seconds into nice string (e.g. "2m 14s")
  const formatTime = (secs) => {
    if (!secs || secs <= 0) return "0s";
    if (secs < 60) return `${secs}s`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Device icon helper
  const getDeviceIcon = (device) => {
    const d = (device || "").toLowerCase();
    if (d === "mobile") return <Smartphone size={14} className="icon-device" />;
    if (d === "tablet") return <Tablet size={14} className="icon-device" />;
    return <Laptop size={14} className="icon-device" />;
  };

  // 3. Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <span className="admin-badge">Admin Access</span>
            <h1>Portfolio Analytics</h1>
            <p>Enter your secret key to view private visitor analytics</p>
          </div>

          <form onSubmit={handleLogin} className="admin-form">
            <div className="form-group">
              <label htmlFor="adminKey">Admin Secret Key</label>
              <input
                id="adminKey"
                type="password"
                placeholder="Enter ADMIN_KEY..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="login-error">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="admin-login-footer">
            <button
              type="button"
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else window.location.href = "/";
              }}
              className="back-home-btn"
            >
              <ArrowLeft size={14} /> Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Render Admin Dashboard
  return (
    <div className="admin-dashboard-container">
      {/* Top Header Bar */}
      <header className="admin-topbar">
        <div className="topbar-left">
          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else window.location.href = "/";
            }}
            className="topbar-back-btn"
            title="Return to site"
          >
            <ArrowLeft size={15} />
            <span>Site</span>
          </button>
          <div className="brand-title">
            <h2>Kevin Analytics</h2>
            <span className="notrack-pill" title="Your visits are excluded from statistics">
              <CheckCircle2 size={12} /> noTrack: active
            </span>
          </div>
        </div>

        <div className="topbar-right">
          <button
            onClick={() => fetchData(adminKey)}
            disabled={loading}
            className="action-pill-btn"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="action-pill-btn danger"
            title="Log Out"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="admin-main-content">
        {/* Metric Summary Cards */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="card-top">
              <span className="card-label">Total Visitors</span>
              <Users size={18} className="metric-icon" />
            </div>
            <div className="card-value">{metrics.totalVisitors}</div>
            <span className="card-sub">Unique device IDs</span>
          </div>

          <div className="metric-card">
            <div className="card-top">
              <span className="card-label">Today's Visitors</span>
              <Activity size={18} className="metric-icon active" />
            </div>
            <div className="card-value">{metrics.todayVisitors}</div>
            <span className="card-sub">Active since midnight</span>
          </div>

          <div className="metric-card">
            <div className="card-top">
              <span className="card-label">Returning Visitors</span>
              <UserCheck size={18} className="metric-icon" />
            </div>
            <div className="card-value">{metrics.returningCount}</div>
            <span className="card-sub">Multiple visits recorded</span>
          </div>

          <div className="metric-card">
            <div className="card-top">
              <span className="card-label">Top Country</span>
              <Globe2 size={18} className="metric-icon" />
            </div>
            <div className="card-value text-ellipsis">{metrics.topCountry}</div>
            <span className="card-sub">Leading location</span>
          </div>

          <div className="metric-card">
            <div className="card-top">
              <span className="card-label">Top Project</span>
              <FolderGit2 size={18} className="metric-icon" />
            </div>
            <div className="card-value text-ellipsis" title={metrics.topProject}>
              {metrics.topProject}
            </div>
            <span className="card-sub">Most clicked item</span>
          </div>

          <div className="metric-card">
            <div className="card-top">
              <span className="card-label">Top Referrer</span>
              <Share2 size={18} className="metric-icon" />
            </div>
            <div className="card-value text-ellipsis" title={metrics.topReferrer}>
              {metrics.topReferrer}
            </div>
            <span className="card-sub">Traffic source</span>
          </div>

          <div className="metric-card highlight-card">
            <div className="card-top">
              <span className="card-label">CV Download Clicks</span>
              <FileDown size={18} className="metric-icon highlight" />
            </div>
            <div className="card-value">{metrics.cvClicks}</div>
            <span className="card-sub">Resume interest</span>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="filter-bar">
          <div className="search-input-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by Visitor ID (vid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-dropdowns">
            {/* Country Filter */}
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="styled-select"
            >
              <option value="all">All Countries ({availableCountries.length})</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Device Filter */}
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="styled-select"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="styled-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Referrer Filter */}
            <select
              value={filterReferrer}
              onChange={(e) => setFilterReferrer(e.target.value)}
              className="styled-select"
            >
              <option value="all">All Referrers</option>
              {availableReferrers.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Visitors Table Grouped by Device (vid) */}
        <section className="table-wrapper">
          <div className="table-header-info">
            <h3>
              Visitors Grouped by Device ({filteredVisitors.length})
            </h3>
            <span className="hint-text">Click any row to expand full event timeline</span>
          </div>

          {filteredVisitors.length === 0 ? (
            <div className="empty-state">
              <Users size={32} />
              <p>No visitors matched your criteria or no visits recorded yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th>Visitor ID</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Device & OS</th>
                    <th>Browser</th>
                    <th>Views</th>
                    <th>Time</th>
                    <th>Max Scroll</th>
                    <th>Screen / Lang</th>
                    <th>Referrer / UTM</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitors.map((v) => {
                    const isExpanded = expandedVid === v.vid;
                    return (
                      <tbody key={v.vid} className="visitor-row-group">
                        <tr
                          onClick={() => setExpandedVid(isExpanded ? null : v.vid)}
                          className={`main-row ${isExpanded ? "expanded" : ""}`}
                        >
                          <td className="expand-cell">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </td>
                          <td className="vid-cell" title={v.vid}>
                            <code>{v.shortId}</code>
                          </td>
                          <td>
                            <span className={`status-pill ${v.isReturning ? "returning" : "new"}`}>
                              {v.isReturning ? "Returning" : "New"}
                            </span>
                          </td>
                          <td>
                            <span className="location-text">
                              {v.country || "-"}
                              {v.city ? `, ${v.city}` : ""}
                            </span>
                          </td>
                          <td>
                            <div className="device-tag">
                              {getDeviceIcon(v.device)}
                              <span>{v.os}</span>
                            </div>
                          </td>
                          <td className="browser-cell">{v.browser}</td>
                          <td>
                            <span className="count-badge">{v.pageviews}</span>
                          </td>
                          <td>
                            <span className="time-badge">
                              <Clock size={12} /> {formatTime(v.totalSeconds)}
                            </span>
                          </td>
                          <td>
                            <div className="scroll-meter">
                              <div
                                className="scroll-fill"
                                style={{ width: `${v.maxScroll}%` }}
                              />
                              <span>{v.maxScroll}%</span>
                            </div>
                          </td>
                          <td>
                            <small className="screen-tag">
                              {v.screen} / {v.lang}
                            </small>
                          </td>
                          <td className="referrer-cell">
                            {v.referrer ? (
                              <span className="referrer-link" title={v.referrer}>
                                {v.referrer.replace(/^https?:\/\//, "")}
                              </span>
                            ) : v.utm ? (
                              <span className="utm-badge" title={v.utm}>
                                UTM: {v.utm}
                              </span>
                            ) : (
                              <span className="dimmed">Direct</span>
                            )}
                          </td>
                          <td className="date-cell">{formatDate(v.lastVisit)}</td>
                        </tr>

                        {/* Expanded Event Timeline */}
                        {isExpanded && (
                          <tr className="expanded-details-row">
                            <td colSpan={12}>
                              <div className="event-timeline-container">
                                <h4>
                                  Event History for <code>{v.vid}</code> ({v.events.length} events)
                                </h4>
                                <div className="events-list">
                                  {v.events.map((evt, idx) => (
                                    <div key={evt.id || idx} className="event-item">
                                      <span className="event-time">
                                        {formatDate(evt.created_at)}
                                      </span>
                                      <span className={`event-type-pill ${evt.type}`}>
                                        {evt.type}
                                      </span>
                                      <span className="event-path" title={evt.path}>
                                        {evt.path || "/"}
                                      </span>
                                      {evt.target && (
                                        <span className="event-target">
                                          target: <strong>{evt.target}</strong>
                                        </span>
                                      )}
                                      {evt.seconds != null && evt.seconds > 0 && (
                                        <span className="event-meta">
                                          ⏱ {evt.seconds}s
                                        </span>
                                      )}
                                      {evt.scroll != null && evt.scroll > 0 && (
                                        <span className="event-meta">
                                          📜 {evt.scroll}%
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
