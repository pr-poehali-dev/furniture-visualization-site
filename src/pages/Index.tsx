import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PROJECTS = [
  {
    id: 1,
    title: "Кухня «Белый мрамор»",
    category: "Кухня",
    year: "2024",
    area: "18 м²",
    img: "https://cdn.poehali.dev/projects/e0192c38-3a94-4952-a022-9ddaf87a8a3b/bucket/120125b7-89e4-41e3-9af3-95b6eafeb1c1.jpg",
    description: "Угловая кухня с фасадами из белого глянца, мраморным фартуком и деревянными шкафами-колоннами.",
  },
  {
    id: 2,
    title: "Кухня «Студия»",
    category: "Кухня",
    year: "2024",
    area: "22 м²",
    img: "https://cdn.poehali.dev/projects/e0192c38-3a94-4952-a022-9ddaf87a8a3b/bucket/b3abf37b-88b9-4b76-9345-f9d6b0bbdf6b.jpg",
    description: "Открытые стеллажи из дуба, встроенная техника Gaggenau и фурнитура Blum с мягким закрыванием.",
  },
  {
    id: 3,
    title: "Детали фурнитуры",
    category: "Детали",
    year: "2024",
    area: "—",
    img: "https://cdn.poehali.dev/projects/e0192c38-3a94-4952-a022-9ddaf87a8a3b/bucket/55ad85bc-0e2d-4732-830d-c45ecc8880ac.jpg",
    description: "Система ящиков Blum LEGRABOX с функцией мягкого закрывания и LED-подсветкой.",
  },
  {
    id: 4,
    title: "Рабочая зона",
    category: "Кухня",
    year: "2024",
    area: "12 м²",
    img: "https://cdn.poehali.dev/projects/e0192c38-3a94-4952-a022-9ddaf87a8a3b/bucket/c3a775f2-1da9-468c-a6ea-a3a1bfcea760.jpg",
    description: "Выдвижные ящики с деревянными вставками и стеклянная витрина с подсветкой.",
  },
  {
    id: 5,
    title: "Кухня «Минимализм»",
    category: "Кухня",
    year: "2023",
    area: "16 м²",
    img: "https://cdn.poehali.dev/projects/e0192c38-3a94-4952-a022-9ddaf87a8a3b/bucket/ce96149a-1aaf-4a9e-87ee-5e2e6fc67439.jpg",
    description: "Белые рифлёные фасады, мраморная столешница и интегрированная варочная панель.",
  },
];

const SERVICES = [
  { icon: "Monitor", title: "3D-визуализация", desc: "Фотореалистичные рендеры интерьеров для презентации клиентам и производству" },
  { icon: "Layers", title: "Проектная документация", desc: "Чертежи, развёртки, спецификации — всё необходимое для запуска в производство" },
  { icon: "Palette", title: "Подбор материалов", desc: "Визуализация в разных отделках, фактурах и цветовых решениях" },
  { icon: "Clock", title: "Быстрые сроки", desc: "Первый вариант визуализации за 3–5 рабочих дней после согласования ТЗ" },
];

const STATS = [
  { value: "340+", label: "Реализованных проектов" },
  { value: "8 лет", label: "Опыт в визуализации" },
  { value: "99%", label: "Довольных клиентов" },
  { value: "3–5 дн", label: "Срок выполнения" },
];

function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useIntersection();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const SEND_EMAIL_URL = "https://functions.poehali.dev/31c03de8-764a-40c5-bd27-ac5881cf94c1";

export default function Index() {
  const [activeProject, setActiveProject] = useState<(typeof PROJECTS)[0] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Все");

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormStatus("sending");
    try {
      const res = await fetch(SEND_EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = ["Все", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const filtered = activeFilter === "Все" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div style={{ background: "var(--dark)", color: "var(--cream)", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 40px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease",
          background: scrolled ? "rgba(15,13,11,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201,169,110,0.1)" : "none",
        }}
      >
        <a href="#hero" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", letterSpacing: "0.15em", color: "var(--gold)", fontWeight: 300, lineHeight: 1.2 }}>
            Юлия Белова<br />
            <span style={{ fontSize: "11px", letterSpacing: "0.25em", opacity: 0.7, textTransform: "uppercase" }}>3D-визуализатор</span>
          </div>
        </a>

        <nav className="hidden md:flex" style={{ gap: "40px", alignItems: "center" }}>
          {[["#portfolio", "Проекты"], ["#about", "О нас"], ["#services", "Услуги"], ["#contact", "Контакты"]].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                color: "rgba(240,234,224,0.7)",
                textDecoration: "none",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'Golos Text', sans-serif",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,234,224,0.7)")}
            >
              {label}
            </a>
          ))}
        </nav>

        <button className="btn-gold hidden md:flex" style={{ padding: "10px 24px", fontSize: "11px" }}>
          <span>Обсудить проект</span>
        </button>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer" }}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90, background: "var(--dark-2)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px",
        }}>
          {[["#portfolio", "Проекты"], ["#about", "О нас"], ["#services", "Услуги"], ["#contact", "Контакты"]].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--cream)", textDecoration: "none", fontSize: "32px", fontWeight: 300, letterSpacing: "0.05em" }}
            >
              {label}
            </a>
          ))}
          <button className="btn-gold" style={{ marginTop: "16px" }}>
            <span>Обсудить проект</span>
          </button>
        </div>
      )}

      {/* HERO */}
      <section
        id="hero"
        style={{
          position: "relative",
          height: "100vh",
          minHeight: "600px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${PROJECTS[0].img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(15,13,11,0.3) 0%, rgba(15,13,11,0.15) 40%, rgba(15,13,11,0.85) 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 2, padding: "0 40px 80px", maxWidth: "900px" }}>
          <div
            style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "20px", opacity: 0, animation: "fadeUp 0.8s 0.2s forwards" }}
          >
            Визуализация мебели и интерьеров
          </div>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 7vw, 96px)", fontWeight: 300, lineHeight: 1.0, marginBottom: "28px", opacity: 0, animation: "fadeUp 0.9s 0.4s forwards" }}
          >
            Пространство,<br />
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>созданное для вас</em>
          </h1>
          <p
            style={{ fontFamily: "'Golos Text', sans-serif", fontSize: "16px", color: "rgba(240,234,224,0.7)", maxWidth: "480px", lineHeight: 1.7, marginBottom: "40px", opacity: 0, animation: "fadeUp 0.9s 0.6s forwards" }}
          >
            Делаю фотореалистичные 3D-визуализации для мебельных компаний и дизайнеров интерьеров. Быстро, точно, под производство.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.9s 0.8s forwards" }}>
            <a href="#portfolio" style={{ textDecoration: "none" }}>
              <button className="btn-gold-fill">
                Смотреть проекты
              </button>
            </a>
            <a href="#contact" style={{ textDecoration: "none" }}>
              <button className="btn-gold">
                <span>Получить консультацию</span>
              </button>
            </a>
          </div>
        </div>

        <div style={{
          position: "absolute", right: "40px", bottom: "80px", zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        }}>
          <div style={{ width: "1px", height: "60px", background: "linear-gradient(to bottom, var(--gold), transparent)", animation: "fadeIn 1s 1.2s both" }} />
          <span style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", writingMode: "vertical-rl", opacity: 0, animation: "fadeIn 1s 1.4s forwards" }}>Scroll</span>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div style={{ background: "var(--gold)", overflow: "hidden", padding: "14px 0" }}>
        <div className="animate-marquee" style={{ display: "flex", whiteSpace: "nowrap" }}>
          {Array(8).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--dark)", fontSize: "14px", letterSpacing: "0.3em", textTransform: "uppercase", padding: "0 40px" }}>
              3D-визуализация &nbsp;·&nbsp; Мебель &nbsp;·&nbsp; Интерьеры &nbsp;·&nbsp; Для мебельщиков и дизайнеров &nbsp;·&nbsp; Удалённая работа &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section style={{ padding: "80px 40px", background: "var(--dark-2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
          {STATS.map((s, i) => (
            <AnimSection key={i} delay={i * 100}>
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div className="text-shimmer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "52px", fontWeight: 300, marginBottom: "8px" }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.55)", fontSize: "13px", letterSpacing: "0.05em" }}>
                  {s.label}
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      <div className="gold-line" />

      {/* PORTFOLIO */}
      <section id="portfolio" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <AnimSection>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "60px", flexWrap: "wrap", gap: "24px" }}>
              <div>
                <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Наши работы
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 300, lineHeight: 1.1 }}>
                  Избранные проекты
                </h2>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    style={{
                      padding: "8px 20px",
                      background: activeFilter === cat ? "var(--gold)" : "transparent",
                      border: "1px solid",
                      borderColor: activeFilter === cat ? "var(--gold)" : "rgba(201,169,110,0.3)",
                      color: activeFilter === cat ? "var(--dark)" : "var(--gold)",
                      fontFamily: "'Golos Text', sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </AnimSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2px" }}>
            {filtered.map((project, i) => (
              <AnimSection key={project.id} delay={i * 80}>
                <div
                  className="img-zoom"
                  onClick={() => setActiveProject(project)}
                  style={{ position: "relative", aspectRatio: "4/3", cursor: "pointer", background: "var(--dark-3)" }}
                >
                  <img src={project.img} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div
                    style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(15,13,11,0.92) 0%, transparent 55%)",
                      opacity: 0, transition: "opacity 0.3s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px" }}>
                    <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>
                      {project.category} · {project.year}
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400, color: "var(--cream)" }}>
                      {project.title}
                    </div>
                  </div>
                  <div style={{
                    position: "absolute", top: "20px", right: "20px",
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "rgba(201,169,110,0.2)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid rgba(201,169,110,0.4)",
                    color: "var(--gold)",
                  }}>
                    <Icon name="Expand" size={16} />
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-line" />

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 40px", background: "var(--dark-2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <AnimSection>
            <div>
              <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>
                Обо мне
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 300, lineHeight: 1.15, marginBottom: "28px" }}>
                Визуализации,<br />
                <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>которые продают</em>
              </h2>
              <p style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.65)", lineHeight: 1.8, fontSize: "15px", marginBottom: "20px" }}>
                Меня зовут Юлия Александровна Белова — я дизайнер-визуализатор с опытом в мебельной сфере. Работаю удалённо напрямую с мебельными производствами и дизайнерами интерьеров.
              </p>
              <p style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.65)", lineHeight: 1.8, fontSize: "15px", marginBottom: "28px" }}>
                Понимаю специфику производства: учитываю материалы, фурнитуру, габариты. Результат — точная визуализация, которую можно сразу передавать в работу или показывать клиентам.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "32px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 20px", border: "1px solid rgba(201,169,110,0.3)" }}>
                  <Icon name="Box" size={15} />
                  <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: "13px", color: "rgba(240,234,224,0.6)" }}>
                    Программа: <span style={{ color: "var(--gold)", fontWeight: 500 }}>Pro 100</span>
                  </span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 20px", border: "1px solid rgba(201,169,110,0.3)" }}>
                  <Icon name="Image" size={15} />
                  <span style={{ fontFamily: "'Golos Text', sans-serif", fontSize: "13px", color: "rgba(240,234,224,0.6)" }}>
                    Формат файлов: <span style={{ color: "var(--gold)", fontWeight: 500 }}>JPG</span>
                  </span>
                </div>
              </div>
              <a href="#contact" style={{ textDecoration: "none" }}>
                <button className="btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span>Написать мне</span>
                  <Icon name="ArrowRight" size={14} />
                </button>
              </a>
            </div>
          </AnimSection>

          <AnimSection delay={200}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
              <div className="img-zoom" style={{ aspectRatio: "3/4", gridRow: "span 2" }}>
                <img src={PROJECTS[1].img} alt="О компании" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="img-zoom" style={{ aspectRatio: "1" }}>
                <img src={PROJECTS[2].img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="img-zoom" style={{ aspectRatio: "1" }}>
                <img src={PROJECTS[3].img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      <div className="gold-line" />

      {/* SERVICES */}
      <section id="services" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <AnimSection>
            <div style={{ marginBottom: "60px" }}>
              <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px" }}>
                Что я делаю
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 300 }}>
                Полный цикл работ
              </h2>
            </div>
          </AnimSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {SERVICES.map((s, i) => (
              <AnimSection key={i} delay={i * 100}>
                <div
                  style={{
                    padding: "48px 36px",
                    background: "var(--dark-2)",
                    borderTop: "2px solid transparent",
                    transition: "border-color 0.3s, background 0.3s",
                    cursor: "default",
                    height: "100%",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderTopColor = "var(--gold)";
                    (e.currentTarget as HTMLElement).style.background = "var(--dark-3)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderTopColor = "transparent";
                    (e.currentTarget as HTMLElement).style.background = "var(--dark-2)";
                  }}
                >
                  <div style={{
                    width: "48px", height: "48px",
                    border: "1px solid rgba(201,169,110,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "24px",
                    color: "var(--gold)",
                  }}>
                    <Icon name={s.icon} size={20} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400, marginBottom: "12px", color: "var(--cream)" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.55)", lineHeight: 1.7, fontSize: "14px" }}>
                    {s.desc}
                  </p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-line" />

      {/* CTA BANNER */}
      <section style={{
        padding: "120px 40px",
        background: `linear-gradient(rgba(15,13,11,0.8), rgba(15,13,11,0.8)), url(${PROJECTS[4].img}) center/cover no-repeat`,
        textAlign: "center",
      }}>
        <AnimSection>
          <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "20px" }}>
            Готовы начать?
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 76px)", fontWeight: 300, marginBottom: "24px", lineHeight: 1.1 }}>
            Ваш проект начинается<br />
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>с одного звонка</em>
          </h2>
          <p style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.65)", maxWidth: "520px", margin: "0 auto 48px", lineHeight: 1.8 }}>
            Оставьте заявку и я свяжусь с вами в течение 30 минут для обсуждения проекта. Первый рендер — бесплатно.
          </p>
          <a href="#contact" style={{ textDecoration: "none" }}>
            <button className="btn-gold-fill" style={{ padding: "18px 52px", fontSize: "13px" }}>
            Получить бесплатный рендер
            </button>
          </a>
        </AnimSection>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 40px", background: "var(--dark-2)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px" }}>
                Напишите мне
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 300 }}>
                Обсудим ваш проект
              </h2>
            </div>
          </AnimSection>

          <AnimSection delay={200}>
            {formStatus === "success" ? (
              <div style={{
                textAlign: "center", padding: "60px 40px",
                border: "1px solid rgba(201,169,110,0.3)",
                background: "rgba(201,169,110,0.05)",
                animation: "fadeUp 0.6s ease forwards",
              }}>
                <div style={{ color: "var(--gold)", marginBottom: "16px" }}>
                  <Icon name="CheckCircle" size={40} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, marginBottom: "12px" }}>
                  Заявка отправлена!
                </h3>
                <p style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.6)", fontSize: "15px", lineHeight: 1.7 }}>
                  Я свяжусь с вами в течение 30 минут.
                </p>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="btn-gold"
                  style={{ marginTop: "28px" }}
                >
                  <span>Отправить ещё одну заявку</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <input
                  type="text"
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  required
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)", padding: "16px 20px", color: "var(--cream)", fontSize: "14px", outline: "none", fontFamily: "'Golos Text', sans-serif", transition: "border-color 0.2s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)")}
                />
                <input
                  type="tel"
                  placeholder="Телефон *"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  required
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)", padding: "16px 20px", color: "var(--cream)", fontSize: "14px", outline: "none", fontFamily: "'Golos Text', sans-serif", transition: "border-color 0.2s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)")}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)", padding: "16px 20px", color: "var(--cream)", fontSize: "14px", outline: "none", fontFamily: "'Golos Text', sans-serif", transition: "border-color 0.2s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)")}
                />
                <textarea
                  placeholder="Расскажите о проекте (площадь, пожелания, стиль)"
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)", padding: "16px 20px", color: "var(--cream)", fontSize: "14px", outline: "none", resize: "none", fontFamily: "'Golos Text', sans-serif", transition: "border-color 0.2s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)")}
                />
                {formStatus === "error" && (
                  <div style={{ gridColumn: "1 / -1", color: "#e05555", fontFamily: "'Golos Text', sans-serif", fontSize: "13px", textAlign: "center" }}>
                    Не удалось отправить. Проверьте подключение и попробуйте снова.
                  </div>
                )}
                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", marginTop: "8px" }}>
                  <button
                    type="submit"
                    className="btn-gold-fill"
                    style={{ padding: "16px 60px", opacity: formStatus === "sending" ? 0.7 : 1, cursor: formStatus === "sending" ? "not-allowed" : "pointer" }}
                    disabled={formStatus === "sending"}
                  >
                    {formStatus === "sending" ? "Отправляем..." : "Отправить заявку"}
                  </button>
                </div>
              </form>
            )}
          </AnimSection>

          <AnimSection delay={300}>
            <div style={{ display: "flex", justifyContent: "center", gap: "60px", marginTop: "60px", flexWrap: "wrap" }}>
              {[
                { icon: "Phone", label: "+7 (992) 421-33-61" },
                { icon: "Mail", label: "juliebel@bk.ru" },
                { icon: "Globe", label: "Работаю удалённо по всей России" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "var(--gold)" }}>
                    <Icon name={c.icon} size={18} />
                  </div>
                  <span style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.65)", fontSize: "14px" }}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px", borderTop: "1px solid rgba(201,169,110,0.1)", background: "var(--dark)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", letterSpacing: "0.1em", color: "var(--gold)", fontWeight: 300 }}>
            Юлия Белова
          </div>
          <p style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.35)", fontSize: "12px" }}>
            © 2025 Юлия Александровна Белова. 3D-визуализатор мебели и интерьеров.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["ВКонтакте", "Instagram", "Telegram"].map((s) => (
              <a
                key={s} href="#"
                style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.4)", fontSize: "12px", textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,234,224,0.4)")}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {activeProject && (
        <div
          onClick={() => setActiveProject(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(15,13,11,0.96)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "40px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "1100px", width: "100%",
              display: "grid", gridTemplateColumns: "1fr 380px",
              background: "var(--dark-2)",
              animation: "scaleIn 0.3s ease",
              overflow: "hidden",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <img src={activeProject.img} alt={activeProject.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px" }}>
                  {activeProject.category} · {activeProject.year}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 300, marginBottom: "24px", lineHeight: 1.2, color: "var(--cream)" }}>
                  {activeProject.title}
                </h3>
                <div className="gold-line" style={{ marginBottom: "24px" }} />
                <p style={{ fontFamily: "'Golos Text', sans-serif", color: "rgba(240,234,224,0.65)", lineHeight: 1.8, fontSize: "14px", marginBottom: "24px" }}>
                  {activeProject.description}
                </p>
                {activeProject.area !== "—" && (
                  <div>
                    <div style={{ fontFamily: "'Golos Text', sans-serif", color: "var(--gold)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>Площадь</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, color: "var(--cream)" }}>{activeProject.area}</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "32px" }}>
                <button className="btn-gold-fill" style={{ justifyContent: "center" }}>
                  Хочу такой же проект
                </button>
                <button className="btn-gold" onClick={() => setActiveProject(null)} style={{ justifyContent: "center" }}>
                  <span>Закрыть</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveProject(null)}
            style={{
              position: "absolute", top: "24px", right: "24px",
              background: "none", border: "1px solid rgba(201,169,110,0.3)",
              color: "var(--gold)", cursor: "pointer", width: "44px", height: "44px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}