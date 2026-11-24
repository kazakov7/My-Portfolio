import { useState, useEffect, useRef, lazy, Suspense } from "react";
import useDepthMotion from "./useDepthMotion";
import usePageMotion from "./usePageMotion";
import ProjectShowcase from "./ProjectShowcase";
import PrincipleSwiper from "./PrincipleSwiper";
import useTracker from "./useTracker";
import Admin from "./Admin";
const HeroOrbit = lazy(() => import("./HeroOrbit"));
import {
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Code2,
  Server,
  BrainCircuit,
  Cloud,
  PenTool,
  Wrench,
  GraduationCap,
  Mail,
  Phone,
  House,
  Copy,
  Check,
  Globe,
  Quote,
  ArrowUp,
  Layers,
  Pause,
  Play,
  Box,
} from "lucide-react";
import { projects, experience } from "./content";
import { words, serviceData, skillGroups, notes } from "./design-content";
const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "uz", name: "O‘zbekcha" },
];
const EMAIL = "kazakov28082003@gmail.com";
const ids = [
  "home",
  "about",
  "services",
  "experience",
  "skills",
  "works",
  "contact",
];
const iconMap = {
  code: Code2,
  server: Server,
  brain: BrainCircuit,
  cloud: Cloud,
  pen: PenTool,
  tools: Wrench,
};
function Brand({ name, size = 18 }) {
  if (name === "linkedin")
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.7a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "telegram")
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21.6 3.6 18.4 20c-.3 1.2-.9 1.5-1.9.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.3L5.9 13.7l-4.8-1.5c-1-.3-1-1 .2-1.5L20.1 3c.9-.3 1.7.2 1.5.6Z" />
      </svg>
    );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.5v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3.1 1.1a10.6 10.6 0 0 1 5.7 0c2.2-1.4 3.1-1.1 3.1-1.1.6 1.5.2 2.6.1 2.9.8.8 1.2 1.8 1.2 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v3.2c0 .3.2.6.8.5A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}
function External({ href, children, ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
function Heading({ title, subtitle, dark = false, eyebrow }) {
  return (
    <div className={`section-heading motion-reveal ${dark ? "on-dark" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>
        {title[0]} <em>{title[1]}</em>
      </h2>
      <p>{subtitle}</p>
    </div>
  );
}
function SocialLinks() {
  return (
    <>
      <External href="https://github.com/kazakov7" aria-label="GitHub" data-track="github">
        <Brand name="github" />
      </External>
      <External href="https://linkedin.com" aria-label="LinkedIn" data-track="linkedin">
        <Brand name="linkedin" />
      </External>
      <External
        href="https://www.instagram.com/kevin.dev__"
        aria-label="Instagram"
        data-track="instagram"
      >
        <Brand name="instagram" />
      </External>
      <External href="https://t.me/Kevin_Keen" aria-label="Telegram" data-track="telegram">
        <Brand name="telegram" />
      </External>
    </>
  );
}
function ProjectDialog({ project: p, t, lang, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    const prior = document.activeElement;
    el.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      prior?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      className="project-dialog"
      ref={dialog}
      aria-labelledby="project-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className="dialog-inner">
        <button className="close-button" onClick={onClose} aria-label={t.close}>
          <X size={21} />
        </button>
        <div className={`dialog-image image-${p.color}`}>
          <img src={`/assets/${p.image}.webp`} alt={`${p.name} interface`} />
        </div>
        <div className="dialog-content">
          <span className="eyebrow">{p.type[lang]}</span>
          <h2 id="project-title">{p.name}</h2>
          <p className="dialog-subtitle">{p.subtitle[lang]}</p>
          <div className="dialog-links">
            {p.url && (
              <External href={p.url} className="button button-blue" data-track={`project_live_${p.name}`}>
                {t.live}
                <ArrowUpRight size={15} />
              </External>
            )}
            {p.repo && (
              <External href={p.repo} className="button button-outline" data-track={`project_repo_${p.name}`}>
                {t.source}
                <Brand name="github" size={15} />
              </External>
            )}
          </div>
          {[
            [t.idea, p.description[lang]],
            [t.challenge, p.challenge[lang]],
            [t.approach, p.solution[lang]],
          ].map(([title, txt]) => (
            <section className="dialog-section" key={title}>
              <h3>{title}</h3>
              <p>{txt}</p>
            </section>
          ))}
          <ul className="feature-list">
            {p.features[lang].map((s) => (
              <li key={s}>
                <Check size={15} />
                {s}
              </li>
            ))}
          </ul>
          <section className="dialog-section">
            <h3>{t.built}</h3>
            <div className="chips">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}
export default function App() {
  useTracker();

  const [currentRoute, setCurrentRoute] = useState(
    () => (typeof window !== "undefined" ? window.location.pathname : "/")
  );

  useEffect(() => {
    const handleLocationChange = () => setCurrentRoute(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  if (currentRoute === "/admin") {
    return (
      <Admin
        onNavigateHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentRoute("/");
        }}
      />
    );
  }

  const [lang, setLang] = useState(() => {
      try {
        const saved = localStorage.getItem("kevin-language");
        return languages.some((l) => l.code === saved) ? saved : "en";
      } catch {
        return "en";
      }
    }),
    [menu, setMenu] = useState(false),
    [skillFilter, setSkillFilter] = useState("all"),
    [expanded, setExpanded] = useState(null),
    [activeJob, setActiveJob] = useState(1),
    [projectView, setProjectView] = useState("showcase"),
    [selected, setSelected] = useState(null),
    [toast, setToast] = useState(""),
    [draft, setDraft] = useState(false);
  const [motion, setMotion] = useState(() => {
      try {
        return (
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
          localStorage.getItem("kevin-3d-motion") !== "off"
        );
      } catch {
        return false;
      }
    }),
    [webglReady, setWebglReady] = useState(false);
  const root = useRef(null);
  useDepthMotion(root, motion, `${skillFilter}:${projectView}`);
  usePageMotion(root, motion, `${skillFilter}:${projectView}`);
  useEffect(() => {
    try {
      localStorage.setItem("kevin-3d-motion", motion ? "on" : "off");
    } catch {}
  }, [motion]);
  const t = words[lang],
    timer = useRef(null);
  useEffect(() => {
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const target = id && document.getElementById(id);
    if (!target) return;
    const frame = requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: "instant", block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.metaTitle;
    for (const [selector, value] of [
      ['meta[name="description"]', t.metaDescription],
      ['meta[property="og:title"]', t.metaTitle],
      ['meta[property="og:description"]', t.metaOgDescription],
      ['meta[name="twitter:title"]', t.metaTitle],
      ['meta[name="twitter:description"]', t.metaOgDescription],
    ]) {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", value);
    }
    try {
      localStorage.setItem("kevin-language", lang);
    } catch {}
  }, [lang, t]);
  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") setMenu(false);
    }
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const previous = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = document.querySelector(".nav-drawer");
    panel?.querySelector("button")?.focus();
    function trap(e) {
      if (e.key !== "Tab") return;
      const nodes = [...panel.querySelectorAll("a[href],button")],
        first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", trap);
      previous?.focus({ preventScroll: true });
    };
  }, [menu]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setToast(t.copied);
    } catch {
      setToast(t.copyFailed);
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3000);
  }
  function sendDraft(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent((t.inquirySubject || "Portfolio inquiry from ") + " " + data.get("name"))}&body=${encodeURIComponent(body)}`;
    setDraft(true);
  }
  const jobs = [
    ...experience.slice().reverse(),
    {
      company: t.personal,
      date: "2026",
      role: { en: t.personalRole, ko: t.personalRole, uz: t.personalRole },
      text: { en: t.personalText, ko: t.personalText, uz: t.personalText },
      country: { en: "Seoul", ko: "서울", uz: t.seoulCity || "Seul" },
    },
  ];
  const gallery = ["aurora", "elif", "floralens", "emilia", "topik"].map((id) =>
    projects.find((p) => p.id === id),
  );
  const jobImage =
    activeJob === 0 ? "aurora" : activeJob === 1 ? "emilia" : "floralens";
  const degrees = [
    {
      title: t.school,
      sub: t.schoolDetail,
      badge: "2023–2025",
      detail: t.schoolDescription,
    },
    {
      title: t.korean,
      sub: t.koreanDetail,
      badge: "TOPIK 5",
      detail: t.koreanDescription,
    },
    {
      title: t.languages,
      sub: t.languageNames,
      badge: "03",
      detail: t.languagesDetail,
    },
  ];
  return (
    <div
      ref={root}
      className={`site-shell depth-enabled ${motion ? "motion-on" : "motion-off"}`}
    >
      <div className="reading-progress" aria-hidden="true">
        <span />
      </div>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <section id="home" className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <span className="floating-dot dot-one" />
        <span className="floating-dot dot-two" />
        <span className="floating-dot dot-three" />
        <span className="crescent crescent-one" />
        <span className="crescent crescent-two" />
        <span className="crescent crescent-three" />
        <aside className="social-rail">
          <button
            onClick={() => setMenu(!menu)}
            aria-label={menu ? t.closeMenu : t.menu}
            aria-expanded={menu}
          >
            <Menu size={20} />
          </button>
          <div className="rail-social">
            <SocialLinks />
          </div>
          <span className="rail-line" />
          <span className="rail-caption">{t.follow}</span>
        </aside>
        <header className="hero-header container">
          <a className="brand" href="#home">
            <span className="infinity-logo">∞</span> KEVIN
            <span className="brand-dot">.</span>
          </a>
          <div className="header-actions">
            <button
              className="motion-toggle"
              aria-pressed={motion}
              aria-label={motion ? t.pauseMotion : t.enableMotion}
              onClick={() => setMotion(!motion)}
            >
              {motion ? <Pause size={12} /> : <Play size={12} />}FX
            </button>
            <label className="language-toggle">
              <Globe size={14} aria-hidden="true" />
              <select
                className="language-select"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label={t.language}
                title={languages.find((l) => l.code === lang)?.name}
              >
                {languages.map((l) => (
                  <option
                    key={l.code}
                    value={l.code}
                    lang={l.code}
                    aria-label={l.name}
                  >
                    {l.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? t.closeMenu : t.menu}
              aria-expanded={menu}
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>
        <div className="hero-content container">
          <div className="hero-copy">
            <span className="script hello">{t.hello}</span>
            <h1>
              KEVIN <span>DEV</span>
            </h1>
            <div className="hero-role">{t.role}</div>
            <p>{t.hero1}</p>
            <p>{t.hero2}</p>
            <div className="hero-buttons">
              <a className="hire-link" href="#contact" data-track="contact_hire">
                <span>
                  <ChevronRight size={20} />
                </span>
                {t.hire}
              </a>
              <a
                className="button button-white"
                href="/Kevin-Resume.pdf"
                download
                data-track="cv_download"
              >
                {t.cv}
              </a>
            </div>
          </div>
          <div
            className={`hero-portrait ${webglReady ? "webgl-ready" : "css-3d-ready"}`}
          >
            <Suspense fallback={null}>
              <HeroOrbit motion={motion} onReady={() => setWebglReady(true)} />
            </Suspense>
            <div className="css-orbit orbit-a" />
            <div className="css-orbit orbit-b" />
            <span className="orbit-mote mote-a" />
            <span className="orbit-mote mote-b" />
            <span className="hero-3d-label">
              <Box size={11} />
              {t.interactive3d}
            </span>
            <div className="portrait-orbit" />
            <div className="portrait-satellite" />
            <div className="portrait-backdrop" />
            <img src="/assets/hero-portrait.webp" alt={t.portrait} />
          </div>
        </div>
        <div className="section-line line-left" />
      </section>
      {menu && (
        <div
          className="menu-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={t.navigation}
          onClick={() => setMenu(false)}
        >
          <nav
            className="nav-drawer"
            aria-label={t.mainNavigation}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-top">
              <a className="brand" href="#home" onClick={() => setMenu(false)}>
                <span className="infinity-logo">∞</span>KEVIN.
              </a>
              <button onClick={() => setMenu(false)} aria-label={t.closeMenu}>
                <X />
              </button>
            </div>
            {ids.map((id, i) => (
              <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>
                <span>0{i + 1}</span>
                {t.nav[i]}
                <ArrowUpRight size={17} />
              </a>
            ))}
            <div className="drawer-social">
              <SocialLinks />
            </div>
          </nav>
        </div>
      )}
      <main id="main">
        <section id="about" className="about-section crosshatch">
          <div className="container">
            <Heading title={t.about} subtitle={t.aboutSub} />
            <div className="about-layout motion-reveal">
              <div className="about-photo">
                <img
                  src="/assets/resume-portrait.webp"
                  loading="lazy"
                  alt={t.portrait}
                />
              </div>
              <div className="about-frame depth-card" data-depth="5">
                <div className="about-card">
                  <span className="card-tick" />
                  <p className="about-hello">
                    {t.hi}
                    <br />
                    {t.myName} <strong>KEVIN</strong>
                  </p>
                  <p className="about-description">{t.aboutText}</p>
                  <dl>
                    <div>
                      <dt>{t.phone}:</dt>
                      <dd>
                        <a href="tel:+821080977787">+82 10 8097 7787</a>
                      </dd>
                    </div>
                    <div>
                      <dt>{t.email}:</dt>
                      <dd>
                        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                      </dd>
                    </div>
                    <div>
                      <dt>{t.address}:</dt>
                      <dd>{t.contactLocation}</dd>
                    </div>
                    <div>
                      <dt>{t.visa}:</dt>
                      <dd>
                        D-10 · {t.jobSeeker}
                      </dd>
                    </div>
                    <div>
                      <dt>{t.status}:</dt>
                      <dd className="availability">
                        <span />
                        {t.available}
                      </dd>
                    </div>
                  </dl>
                  <span className="signature script">Kevin</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="services-section">
          <div className="container wide-container">
            <Heading
              title={t.services}
              subtitle={t.serviceSub}
              eyebrow={t.what}
            />
            <div className="service-grid motion-reveal">
              {serviceData.map((s, i) => {
                const Icon = iconMap[s.icon];
                return (
                  <a
                    href="#skills"
                    className={`service-card service-${i} depth-card`}
                    data-depth="9"
                    key={s.icon}
                  >
                    <div className="contour" />
                    <Icon size={39} strokeWidth={1.2} />
                    <h3>
                      {s.name[lang][0]}
                      <br />
                      {s.name[lang][1]}
                    </h3>
                    <p>{s.text[lang]}</p>
                    <ArrowUpRight className="service-arrow" size={17} />
                  </a>
                );
              })}
            </div>
            <p className="more-line">
              {t.serviceLink} <a href="#skills">{t.viewSkills}</a>
            </p>
          </div>
        </section>
        <section id="experience" className="experience-section dark-section">
          <div className="experience-background" />
          <div className="container">
            <Heading title={t.work} subtitle={t.workSub} dark />
            <div className="experience-layout motion-reveal">
              <div className="experience-list">
                {jobs.map((j, i) => (
                  <button
                    key={j.company}
                    className={`experience-item ${activeJob === i ? "selected" : ""}`}
                    onClick={() => setActiveJob(i)}
                    aria-pressed={activeJob === i}
                  >
                    <span className="job-number">{i + 1}</span>
                    <span className="job-body">
                      <span className="job-date">{j.date}</span>
                      <strong>{j.role[lang]}</strong>
                      <span className="job-company">
                        {j.company} · {j.country[lang]}
                      </span>
                      <span className="job-text">{j.text[lang]}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="experience-photo depth-card" data-depth="7">
                <img
                  src={`/assets/${jobImage}.webp`}
                  alt={`${projects.find((p) => p.image === jobImage)?.name} project interface`}
                  loading="lazy"
                />
                <div>
                  <span>{t.selectedProject}</span>
                  <strong>
                    {projects.find((p) => p.image === jobImage)?.name}
                  </strong>
                </div>
              </div>
            </div>
          </div>
          <div className="section-line line-right" />
        </section>
        <section id="skills" className="education-section">
          <div className="education-backdrop" />
          <div className="container">
            <Heading title={t.education} subtitle={t.educationSub} />
            <div className="education-layout motion-reveal">
              <div className="education-column">
                <h3 className="subheading">
                  <GraduationCap />
                  {t.educationLabel}
                </h3>
                <div className="education-cards">
                  {degrees.map((d, i) => (
                    <article
                      className={`education-card ${expanded === i ? "expanded" : ""}`}
                      key={d.title}
                    >
                      <button
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        aria-expanded={expanded === i}
                        aria-controls={`degree-${i}`}
                      >
                        <span className="education-plus">
                          {expanded === i ? (
                            <Minus size={15} />
                          ) : (
                            <Plus size={15} />
                          )}
                        </span>
                        <span>
                          <strong>{d.title}</strong>
                          <small>{d.sub}</small>
                        </span>
                        <span className="date-badge">{d.badge}</span>
                      </button>
                      <p id={`degree-${i}`} hidden={expanded !== i}>
                        {d.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="skills-column">
                <h3 className="subheading">
                  <GraduationCap />
                  {t.skillsLabel}
                </h3>
                <div className="core-skills">
                  {[
                    {
                      abbr: "JS",
                      title: "JavaScript / TypeScript",
                      sub: "React · Next.js",
                      type: "js",
                    },
                    {
                      abbr: "N",
                      title: "Node.js / NestJS",
                      sub: "GraphQL · MongoDB",
                      type: "node",
                    },
                    {
                      abbr: "Py",
                      title: "Python / AI",
                      sub: "PyTorch · Transformers",
                      type: "python",
                    },
                    {
                      abbr: "AWS",
                      title: "Cloud / DevOps",
                      sub: "Docker · NGINX",
                      type: "aws",
                    },
                  ].map((s) => (
                    <div key={s.type} className="core-skill">
                      <span className={`tech-icon ${s.type}`}>{s.abbr}</span>
                      <h4>{s.title}</h4>
                      <p>{s.sub}</p>
                      <div className="skill-rule" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="full-toolkit">
              <Heading title={t.toolkit} subtitle={t.toolkitSub} />
              <div className="skill-filters" role="group" aria-label={t.all}>
                <button
                  onClick={() => setSkillFilter("all")}
                  className={skillFilter === "all" ? "active" : ""}
                  aria-pressed={skillFilter === "all"}
                >
                  {t.all}
                </button>
                {skillGroups.map((g) => (
                  <button
                    key={g.id}
                    className={skillFilter === g.id ? "active" : ""}
                    aria-pressed={skillFilter === g.id}
                    onClick={() => setSkillFilter(g.id)}
                  >
                    {g.name[lang]}
                  </button>
                ))}
              </div>
              <div className="skill-catalog motion-reveal" aria-live="polite">
                {skillGroups
                  .filter((g) => skillFilter === "all" || g.id === skillFilter)
                  .map((g) => {
                    const Icon = iconMap[g.icon];
                    return (
                      <article
                        className={`skill-group group-${g.id} depth-card`}
                        data-depth="4"
                        key={g.id}
                      >
                        <h3>
                          <Icon size={22} />
                          {g.name[lang]}
                          <span>{g.items.length}</span>
                        </h3>
                        <div className="skill-chips">
                          {g.items.map((s) => (
                            <span key={s}>{s}</span>
                          ))}
                        </div>
                      </article>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="section-line line-left" />
        </section>
        <section id="works" className="works-section crosshatch">
          <div className="container">
            <Heading title={t.projects} subtitle={t.projectsSub} />
            <div className="projects-toolbar">
              <div
                className="project-view-tabs"
                role="group"
                aria-label={t.projectView}
              >
                <button
                  className={projectView === "showcase" ? "active" : ""}
                  aria-pressed={projectView === "showcase"}
                  onClick={() => setProjectView("showcase")}
                >
                  {t.showcase}
                </button>
                <button
                  className={projectView === "grid" ? "active" : ""}
                  aria-pressed={projectView === "grid"}
                  onClick={() => setProjectView("grid")}
                >
                  {t.allProjects}
                </button>
              </div>
              <span>
                {String(gallery.length).padStart(2, "0")} {t.selectedProjects}
              </span>
            </div>
            <div className="work-presentation motion-reveal">
              {projectView === "showcase" ? (
                <ProjectShowcase
                  projects={gallery}
                  lang={lang}
                  t={t}
                  motion={motion}
                  suspended={Boolean(selected || menu)}
                  onSelect={setSelected}
                />
              ) : (
                <div className="work-mosaic">
                  {gallery.map((p, i) => (
                    <button
                      className={`work-tile tile-${i} image-${p.color} depth-card`}
                      data-depth="10"
                      key={p.id}
                      onClick={() => setSelected(p)}
                      aria-label={`${t.projectDetails}: ${p.name}`}
                      data-track={`project_${p.name}`}
                    >
                      <img
                        src={`/assets/${p.image}.webp`}
                        alt={`${p.name} project screenshot`}
                        loading="lazy"
                      />
                      <span className="work-tile-caption">
                        <strong>{p.name}</strong>
                        <small>{p.type[lang]}</small>
                      </span>
                      <span className="work-tile-overlay">
                        <strong>{p.name}</strong>
                        <small>{p.subtitle[lang]}</small>
                        <span className="outline-arrow">
                          <ArrowDownRight size={23} />
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="more-line">
              {t.workMore}{" "}
              <External href="https://github.com/kazakov7" data-track="github">
                {t.githubMore}
              </External>
            </p>
          </div>
        </section>
        <section className="freelance-section">
          <div className="freelance-banner motion-reveal">
            <div className="contour" />
            <div className="freelance-copy">
              <span>{t.freelanceSmall}</span>
              <h2>{t.freelance}</h2>
              <p>{t.freelanceSub}</p>
              <a
                className="button button-white"
                href="/Kevin-Resume.pdf"
                download
                data-track="cv_download"
              >
                {t.cv}
              </a>
            </div>
            <img
              className="collaboration-illustration"
              src="/assets/collaboration.webp"
              alt="Two people discussing a project"
              loading="lazy"
            />
          </div>
        </section>
        <section className="principles-section dark-section">
          <div className="principles-background" />
          <div className="container">
            <Heading title={t.principles} subtitle={t.principleSub} dark />
            <PrincipleSwiper
              lang={lang}
              t={t}
              motion={motion}
              suspended={Boolean(selected || menu)}
            />
          </div>
          <div className="section-line line-right" />
        </section>
        <section className="notes-section crosshatch">
          <div className="container">
            <Heading title={t.notes} subtitle={t.notesSub} />
            <div className="notes-grid motion-reveal">
              {notes.map((n) => (
                <button
                  className="note-card depth-card"
                  data-depth="7"
                  key={n.project}
                  onClick={() =>
                    setSelected(projects.find((p) => p.id === n.project))
                  }
                  aria-label={`${t.read}: ${n.title[lang]}`}
                >
                  <img
                    src={`/assets/${n.image}.webp`}
                    alt={`${projects.find((p) => p.id === n.project).name} interface`}
                    loading="lazy"
                  />
                  <span className="note-copy">
                    <small>
                      <Layers size={12} />
                      {n.topic[lang]}
                    </small>
                    <strong>{n.title[lang]}</strong>
                    <span>{n.intro[lang]}</span>
                    <i />
                    <b>
                      {t.by}
                      <ArrowUpRight size={13} />
                    </b>
                  </span>
                </button>
              ))}
            </div>
            <p className="more-line">
              {t.noteMore}{" "}
              <a href="/Kevin-Portfolio.pdf" download>
                {t.portfolioMore}
              </a>
            </p>
            <div className="tool-brands motion-reveal">
              <h3>{t.tools}</h3>
              <div>
                <span>⚛ React</span>
                <span>NestJS</span>
                <span>MongoDB</span>
                <span className="aws-wordmark">aws</span>
                <span>PyTorch</span>
              </div>
            </div>
          </div>
        </section>
        <section className="social-section">
          <div className="container social-cards motion-reveal">
            {[
              {
                name: "GITHUB",
                icon: "github",
                href: "https://github.com/kazakov7",
                small: t.myPortfolio,
                action: t.check,
              },
              {
                name: "INSTAGRAM",
                icon: "instagram",
                href: "https://www.instagram.com/kevin.dev__",
                small: t.findMe,
                action: t.check,
              },
              {
                name: "TELEGRAM",
                icon: "telegram",
                href: "https://t.me/Kevin_Keen",
                small: t.contactMe,
                action: t.getInTouch,
              },
            ].map((s, i) => (
              <External
                className={`social-card social-card-${i} depth-card`}
                data-depth="8"
                key={s.name}
                href={s.href}
              >
                <Brand name={s.icon} size={36} />
                <small>{s.small}</small>
                <strong>{s.name}</strong>
                <span>
                  {s.action}
                  <ChevronRight size={12} />
                </span>
              </External>
            ))}
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="contact-background" />
          <div className="container">
            <div className="contact-heading">
              <h2>
                {t.contact[0]} <em>{t.contact[1]}</em>
              </h2>
              <p>{t.contactSub}</p>
            </div>
            <div className="contact-layout motion-reveal">
              <form className="contact-form" onSubmit={sendDraft}>
                <label htmlFor="message">{t.message}</label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  required
                  minLength="5"
                  maxLength="5000"
                />
                <div className="form-two">
                  <div>
                    <label htmlFor="name">{t.name}</label>
                    <input
                      name="name"
                      id="name"
                      required
                      maxLength="100"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email">{t.yourEmail}</label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      required
                      maxLength="254"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <button className="button button-white" type="submit" data-track="contact_submit">
                  {t.submit}
                  <ChevronRight size={14} />
                </button>
                <p className="form-hint" role="status">
                  {draft ? t.draftReady : t.draftHint}
                </p>
              </form>
              <div className="contact-details">
                <div className="contact-box">
                  <House size={37} strokeWidth={1.2} />
                  <div>
                    <strong>{t.seoul}</strong>
                    <span>{t.contactLocation}</span>
                  </div>
                </div>
                <a className="contact-box" href="tel:+821080977787" data-track="contact_phone">
                  <Phone size={35} strokeWidth={1.2} />
                  <div>
                    <strong>{t.phone}:</strong>
                    <span>+82 10 8097 7787</span>
                  </div>
                </a>
                <div className="contact-box">
                  <Mail size={36} strokeWidth={1.2} />
                  <div>
                    <strong>{t.email}:</strong>
                    <a href={`mailto:${EMAIL}`} data-track="contact_email">{EMAIL}</a>
                  </div>
                  <button
                    onClick={copyEmail}
                    aria-label={t.copy}
                    className="copy-email"
                    data-track="contact_copy_email"
                  >
                    <Copy size={15} />
                  </button>
                </div>
                <div className="contact-social">
                  <span>{t.follow}</span>
                  <SocialLinks />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <span>
            © {new Date().getFullYear()} Kevin. {t.footer}
            <small className="privacy-note">
              Anonymous statistics are collected to improve this site.
            </small>
          </span>
          <a href="#home" data-track="back_to_top">
            {t.back}
            <ArrowUp size={12} />
          </a>
        </div>
      </footer>
      {selected && (
        <ProjectDialog
          key={selected.id}
          project={selected}
          t={t}
          lang={lang}
          onClose={() => setSelected(null)}
        />
      )}
      <div className={`toast ${toast ? "show" : ""}`} role="status">
        {toast && (
          <>
            <Check size={16} />
            {toast}
          </>
        )}
      </div>
    </div>
  );
}
