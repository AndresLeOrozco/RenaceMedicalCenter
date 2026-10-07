/* ═══════════════════════════════════════════
   RENACE MEDICAL CENTER – script.js completo
   ═══════════════════════════════════════════ */

/* ── Año dinámico en el footer ── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ── Animaciones "reveal" al hacer scroll ── */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
revealElements.forEach((el) => revealObserver.observe(el));


/* ── Slider de equipo ── */
const slider        = document.querySelector('.team-slider-track');
const slides        = document.querySelectorAll('.team-card');
const dots          = document.querySelectorAll('.team-dot');
const prevBtn       = document.getElementById('team-prev');
const nextBtn       = document.getElementById('team-next');
const sliderViewport = document.querySelector('.team-slider-viewport');

let currentIndex  = 0;
const totalSlides = slides.length;
let sliderInterval = null;

let touchStartX = 0, touchEndX = 0;
let touchStartY = 0, touchEndY = 0;
const swipeThreshold = 50;

function goToSlide(index) {
  if (!slider || totalSlides === 0) return;
  currentIndex = (index + totalSlides) % totalSlides;
  slider.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
  dots.forEach((dot) => dot.classList.remove('active'));
  if (dots[currentIndex]) dots[currentIndex].classList.add('active');
}

function nextSlide()     { goToSlide(currentIndex + 1); }
function prevSlideFunc() { goToSlide(currentIndex - 1); }

if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartAutoSlide(); });
if (prevBtn) prevBtn.addEventListener('click', () => { prevSlideFunc(); restartAutoSlide(); });

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
    restartAutoSlide();
  });
});

function startAutoSlide()   { if (totalSlides > 1) sliderInterval = setInterval(nextSlide, 7000); }
function restartAutoSlide() { if (sliderInterval) clearInterval(sliderInterval); startAutoSlide(); }

if (sliderViewport) {
  sliderViewport.addEventListener('touchstart', (e) => {
    if (!e.changedTouches?.length) return;
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  sliderViewport.addEventListener('touchend', (e) => {
    if (!e.changedTouches?.length) return;
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    const dX = touchEndX - touchStartX;
    const dY = touchEndY - touchStartY;
    if (Math.abs(dX) > Math.abs(dY) && Math.abs(dX) > swipeThreshold) {
      dX < 0 ? nextSlide() : prevSlideFunc();
      restartAutoSlide();
    }
  }, { passive: true });
}

if (totalSlides > 0) goToSlide(0);
if (totalSlides > 1) startAutoSlide();


/* ══════════════════════════════════════════════════════
   FORMULARIO DE CALIFICACIÓN + WHATSAPP
   ══════════════════════════════════════════════════════ */
(function () {
  const CAL_WA = '50660573797';

  function calGetWarning() {
    let warning = document.getElementById('cal-warning');
    if (!warning) {
      const toggleGroup = document.getElementById('cal-toggle-group');
      if (!toggleGroup) return null;
      warning = document.createElement('p');
      warning.id = 'cal-warning';
      warning.className = 'cal-warning';
      warning.textContent = 'Por favor completa tu nombre y un correo válido antes de continuar.';
      toggleGroup.insertAdjacentElement('afterend', warning);
    }
    return warning;
  }

  window.calSelect = function (choice) {
    const nombreInput = document.getElementById('cal-nombre');
    const correoInput = document.getElementById('cal-correo');
    const btnSi        = document.getElementById('cal-btn-si');
    const btnNo        = document.getElementById('cal-btn-no');
    const resultSi      = document.getElementById('cal-result-si');
    const resultNo      = document.getElementById('cal-result-no');
    if (!nombreInput || !correoInput || !btnSi || !btnNo || !resultSi || !resultNo) return;

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    const warning = calGetWarning();

    if (!nombre || !correoValido) {
      if (warning) warning.classList.add('cal-warning-visible');
      if (!nombre) nombreInput.focus(); else correoInput.focus();
      return;
    }
    if (warning) warning.classList.remove('cal-warning-visible');

    btnSi.classList.remove('cal-active-si');
    btnNo.classList.remove('cal-active-no');
    resultSi.classList.remove('cal-result-visible');
    resultNo.classList.remove('cal-result-visible');

    if (choice === 'si') {
      btnSi.classList.add('cal-active-si');
      resultSi.classList.add('cal-result-visible');

      const msg = encodeURIComponent(
        'Hola, soy ' + nombre + ' (' + correo + '). Estoy list@ para dar el siguiente paso e invertir en un cambio real para mi salud. Me gustaría agendar mi valoración inicial en Renace Medical Center.'
      );
      const waLink = document.getElementById('cal-wa-link');
      if (waLink) waLink.href = 'https://wa.me/' + CAL_WA + '?text=' + msg;

      resultSi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      btnNo.classList.add('cal-active-no');
      resultNo.classList.add('cal-result-visible');
      resultNo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
})();
/* FIN FORMULARIO DE CALIFICACIÓN */


/* ══════════════════════════════════════════════════
   EVENTO TEMPORAL – Countdown + fade-up
   ══════════════════════════════════════════════════ */
(function () {
  const eventDate = new Date('2026-06-13T08:00:00-06:00');
  function padTwo(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const diff = eventDate - new Date();
    if (diff <= 0) {
      ['ev-dias','ev-horas','ev-minutos','ev-segundos'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const elems = { 'ev-dias': d, 'ev-horas': h, 'ev-minutos': m, 'ev-segundos': s };
    Object.entries(elems).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = padTwo(val);
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const fadeEls = document.querySelectorAll('#evento-jornada .evento-fade-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════════════════
   QUIZ POP-UP (temporal)
   ══════════════════════════════════════════════════════ */
(function () {

  /* Config */
  const QP_WA = '50660573797';

  const QP_DIMS       = ['Médica','Nutricional','Psicológica','Física','Sueño','Ambiental'];
  const QP_DIM_ICONS  = ['🫀','🥗','🧠','🏃','😴','🌿'];
  const QP_DIM_COLORS = ['#4a90c4','#d47b9a','#7b6fc4','#4a90c4','#2e9b6e','#d47b9a'];

  const QP_QUESTIONS = [
    // MÉDICA
    { d:0, q:'¿Te han diagnosticado alguna de estas condiciones?',
      opts:['Ninguna','Presión alta o colesterol elevado','Prediabetes o resistencia a la insulina','Diabetes tipo 2 o hipotiroidismo'],
      scores:[0,1,2,3] },
    { d:0, q:'¿Cuántos kilos de más tienes aproximadamente respecto a tu peso ideal?',
      opts:['Menos de 5 kg','Entre 5 y 15 kg','Entre 15 y 30 kg','Más de 30 kg'],
      scores:[0,1,2,3] },
    // NUTRICIONAL
    { d:1, q:'¿Con qué frecuencia consumes ultraprocesados, comida rápida o bebidas azucaradas?',
      opts:['Casi nunca','1–2 veces por semana','3–5 veces por semana','Todos los días'],
      scores:[0,1,2,3] },
    { d:1, q:'¿Cómo describes tu relación con la comida?',
      opts:['Como cuando tengo hambre y paro al estar satisfecha/o','A veces como por ansiedad o aburrimiento','Frecuentemente como de más sin darme cuenta','Siento que no tengo control sobre lo que como'],
      scores:[0,1,2,3] },
    // PSICOLÓGICA
    { d:2, q:'¿Con qué frecuencia el estrés afecta tus hábitos de alimentación o movimiento?',
      opts:['Casi nunca','A veces, 1–2 veces al mes','Varias veces a la semana','Casi siempre — el estrés controla mis hábitos'],
      scores:[0,1,2,3] },
    { d:2, q:'¿Cuántos intentos has hecho antes para bajar de peso?',
      opts:['Ninguno o uno','2–3 intentos','4–6 intentos','Perdí la cuenta — ninguno funcionó a largo plazo'],
      scores:[0,1,2,3] },
    // FÍSICA
    { d:3, q:'¿Cuántos minutos de actividad física moderada haces por semana?',
      opts:['Más de 150 minutos','Entre 60 y 150 minutos','Menos de 60 minutos','Prácticamente ninguno'],
      scores:[0,1,2,3] },
    { d:3, q:'¿Tienes dolor crónico o condiciones físicas que limiten tu movimiento?',
      opts:['No, me muevo sin limitaciones','Leve — no me impide hacer ejercicio','Moderado — limita varios tipos de actividad','Severo — me impide hacer actividad física regular'],
      scores:[0,1,2,3] },
    // SUEÑO
    { d:4, q:'¿Cuántas horas de sueño continuo tienes en promedio cada noche?',
      opts:['7–9 horas','6–7 horas','5–6 horas','Menos de 5 horas o sueño muy interrumpido'],
      scores:[0,1,2,3] },
    { d:4, q:'¿Con qué frecuencia te despiertas sin sentirte descansada/o?',
      opts:['Raramente','Ocasionalmente, 1–2 veces por semana','Frecuentemente, 3–4 veces por semana','Casi todos los días'],
      scores:[0,1,2,3] },
    // AMBIENTAL
    { d:5, q:'¿Cómo describes el entorno social en el que vives respecto a la alimentación?',
      opts:['Mi familia y amigos tienen hábitos saludables','Mixto — algunos apoyan, otros no','La mayoría tiene hábitos poco saludables','Me presionan a comer mal o ridiculizan mis intentos'],
      scores:[0,1,2,3] },
    { d:5, q:'¿Qué tan fácil es para ti acceder a comida saludable en tu día a día?',
      opts:['Muy fácil — como bien en casa y en el trabajo','Regular — me cuesta cuando salgo o tengo poco tiempo','Difícil — la comida rápida es la opción más conveniente','Muy difícil — casi no tengo acceso ni tiempo para cocinar sano'],
      scores:[0,1,2,3] },
  ];

  let qpCur = 0;
  let qpAns = new Array(QP_QUESTIONS.length).fill(null);

  /* ── Open / Close ── */
  window.qpOpen = function () {
    const ov = document.getElementById('quiz-popup-overlay');
    ov.classList.add('qp-visible');
    document.body.style.overflow = 'hidden';
    const triggerBtn = document.getElementById('quiz-trigger-btn');
    if (triggerBtn) triggerBtn.classList.add('qp-hidden');
  };

  window.qpClose = function () {
    const ov = document.getElementById('quiz-popup-overlay');
    ov.classList.remove('qp-visible');
    document.body.style.overflow = '';
    const triggerBtn = document.getElementById('quiz-trigger-btn');
    if (triggerBtn) triggerBtn.classList.remove('qp-hidden');
    setTimeout(qpReset, 400);
  };

  /* Cierra al click fuera del modal */
  const overlay = document.getElementById('quiz-popup-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) qpClose();
    });
  }

  /* Cierra con Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') qpClose();
  });

  /* ── Reset completo ── */
  function qpReset() {
    qpCur = 0;
    qpAns = new Array(QP_QUESTIONS.length).fill(null);
    const hook    = document.getElementById('qp-hook');
    const quiz    = document.getElementById('qp-quiz-shell');
    const results = document.getElementById('qp-results-shell');
    if (hook)    hook.style.display    = 'block';
    if (quiz)    quiz.style.display    = 'none';
    if (results) { results.style.display = 'none'; results.innerHTML = ''; }
    const modal = document.getElementById('quiz-popup-modal');
    if (modal) modal.scrollTop = 0;
  }

  /* ── Iniciar quiz ── */
  window.qpStartQuiz = function () {
    const hook = document.getElementById('qp-hook');
    const quiz = document.getElementById('qp-quiz-shell');
    if (hook) hook.style.display = 'none';
    if (quiz) quiz.style.display = 'block';
    qpRenderQ();
  };

  /* ── Render pregunta ── */
  function qpRenderQ() {
    const q     = QP_QUESTIONS[qpCur];
    const total = QP_QUESTIONS.length;
    const pct   = Math.round((qpCur / total) * 100);

    const fill  = document.getElementById('qp-prog-fill');
    const pctEl = document.getElementById('qp-prog-pct');
    const label = document.getElementById('qp-prog-label');
    if (fill)  fill.style.width      = pct + '%';
    if (pctEl) pctEl.textContent     = pct + '%';

    const seen = new Set();
    for (let i = 0; i <= qpCur; i++) seen.add(QP_QUESTIONS[i].d);
    if (label) label.textContent = 'Dimensión ' + seen.size + ' de 6';

    const pillText = document.getElementById('qp-dim-pill-text');
    if (pillText) pillText.textContent = QP_DIM_ICONS[q.d] + ' ' + QP_DIMS[q.d];

    const qText = document.getElementById('qp-q-text');
    if (qText) qText.textContent = q.q;

    const opts = document.getElementById('qp-opts');
    if (opts) {
      opts.innerHTML = '';
      q.opts.forEach(function (txt, i) {
        const btn = document.createElement('button');
        btn.className = 'qp-option' + (qpAns[qpCur] === i ? ' qp-selected' : '');
        btn.innerHTML = '<span class="qp-opt-radio"></span><span>' + txt + '</span>';
        btn.onclick = function () { qpPick(i); };
        opts.appendChild(btn);
      });
    }

    const backBtn = document.getElementById('qp-btn-back');
    if (backBtn) backBtn.style.visibility = qpCur === 0 ? 'hidden' : 'visible';

    const nextBtnEl = document.getElementById('qp-btn-next');
    const nextLabel = document.getElementById('qp-btn-next-label');
    if (nextBtnEl) nextBtnEl.disabled = qpAns[qpCur] === null;
    if (nextLabel) nextLabel.textContent = qpCur === total - 1 ? 'Ver mis resultados' : 'Siguiente';

    const card = document.getElementById('qp-q-card');
    if (card) { card.style.animation = 'none'; void card.offsetHeight; card.style.animation = 'qp-fadeUp 0.3s ease both'; }

    const modal = document.getElementById('quiz-popup-modal');
    if (modal) modal.scrollTop = 0;
  }

  function qpPick(i) {
    qpAns[qpCur] = i;
    document.querySelectorAll('#qp-opts .qp-option').forEach(function (el, idx) {
      el.classList.toggle('qp-selected', idx === i);
    });
    const nextBtnEl = document.getElementById('qp-btn-next');
    if (nextBtnEl) nextBtnEl.disabled = false;
  }

  window.qpNextQ = function () {
    if (qpAns[qpCur] === null) return;
    if (qpCur < QP_QUESTIONS.length - 1) { qpCur++; qpRenderQ(); }
    else qpShowResults();
  };

  window.qpPrevQ = function () {
    if (qpCur > 0) { qpCur--; qpRenderQ(); }
  };

  /* ── Scores ── */
  function qpDimScores() {
    const s = [0,0,0,0,0,0], c = [0,0,0,0,0,0];
    QP_QUESTIONS.forEach(function (q, i) {
      if (qpAns[i] !== null) { s[q.d] += q.scores[qpAns[i]]; c[q.d]++; }
    });
    return s.map(function (v, i) { return c[i] ? Math.round((v / (c[i] * 3)) * 100) : 0; });
  }

  function qpTotalScore() {
    let t = 0;
    QP_QUESTIONS.forEach(function (q, i) { if (qpAns[i] !== null) t += q.scores[qpAns[i]]; });
    return Math.round((t / (QP_QUESTIONS.length * 3)) * 100);
  }

  function qpRiskInfo(score) {
    if (score >= 60) return { cls:'qp-risk-high',   label:'Riesgo alto',          color:'#e07070', interp:'Tu perfil muestra múltiples factores activos. Un diagnóstico clínico integral es el primer paso para entender qué está pasando en tu cuerpo.' };
    if (score >= 35) return { cls:'qp-risk-medium', label:'Riesgo moderado',       color:'#e8a020', interp:'Hay áreas importantes que atender. Con el abordaje correcto, los cambios pueden ser significativos y sostenibles.' };
    return              { cls:'qp-risk-low',    label:'Riesgo bajo-moderado', color:'#2db87a', interp:'Tienes buenas bases. Aun así, hay dimensiones que optimizar para lograr resultados sostenibles a largo plazo.' };
  }

  function qpWorstDims(ds) {
    return ds.map(function (v, i) { return { v: v, i: i }; })
             .sort(function (a, b) { return b.v - a.v; })
             .slice(0, 2)
             .map(function (x) { return QP_DIMS[x.i]; });
  }

  /* ── Mostrar resultados ── */
  function qpShowResults() {
    const quiz = document.getElementById('qp-quiz-shell');
    if (quiz) quiz.style.display = 'none';

    const scr = document.getElementById('qp-results-shell');
    if (!scr) return;
    scr.style.display = 'block';

    const score = qpTotalScore();
    const ds    = qpDimScores();
    const risk  = qpRiskInfo(score);
    const worst = qpWorstDims(ds);

    const R = 31, CX = 40, CY = 40;
    const circ  = +(2 * Math.PI * R).toFixed(2);
    const offset = +(circ * (1 - score / 100)).toFixed(2);

    scr.innerHTML = `
      <div class="qp-results-hero">
        <div class="qp-results-eyebrow">Tu evaluación Renace</div>
        <div class="qp-results-title">Puntaje de riesgo metabólico</div>
        <div class="qp-score-row">
          <svg class="qp-score-ring" viewBox="0 0 80 80" fill="none">
            <circle cx="${CX}" cy="${CY}" r="${R}" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>
            <circle cx="${CX}" cy="${CY}" r="${R}" stroke="${risk.color}" stroke-width="8"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
              stroke-linecap="round" transform="rotate(-90 ${CX} ${CY})"/>
          </svg>
          <div>
            <div class="qp-score-lbl">Índice de riesgo</div>
            <div class="qp-score-num">${score}<span class="qp-score-denom">/100</span></div>
            <div class="qp-risk-pill ${risk.cls}">${risk.label}</div>
            <div class="qp-score-interp">${risk.interp}</div>
          </div>
        </div>
      </div>

      <div class="qp-dim-card">
        <div class="qp-dim-card-title">Detalle por dimensión</div>
        ${QP_DIMS.map(function(n,i){ return `
          <div class="qp-dbar-row">
            <div class="qp-dbar-name">${QP_DIM_ICONS[i]} ${n}</div>
            <div class="qp-dbar-track"><div class="qp-dbar-fill" style="width:${ds[i]}%;background:${QP_DIM_COLORS[i]};"></div></div>
            <div class="qp-dbar-pct" style="color:${QP_DIM_COLORS[i]};">${ds[i]}%</div>
          </div>`; }).join('')}
      </div>

      <div class="qp-insight-card">
        <strong>Lo que nos dice tu perfil</strong>
        Las dimensiones con mayor atención requerida son <strong>${worst[0]}</strong> y <strong>${worst[1]}</strong>. Tu cuerpo no está fallando — está respondiendo a algo. Entender qué es el primer paso real.
      </div>

      <div class="qp-cta-card">
        <div class="qp-cta-title">Conoce tu diagnóstico real</div>
        <div class="qp-cta-desc">Este quiz da una orientación general. El diagnóstico Renace profundiza en cada dimensión con evaluación clínica, nutricional, psicológica y de movimiento — y termina con un plan 100% personalizado.</div>
        <div class="qp-team-note">
          <span style="font-size:16px">🌱</span>
          <span>Nuestro equipo interdisciplinario (medicina, nutrición, psicología y movimiento terapéutico) te atiende en Heredia sin estigma y con evidencia.</span>
        </div>
        <div class="qp-form-field">
          <label class="qp-form-label" for="qp-inp-name">Tu nombre</label>
          <input class="qp-form-input" id="qp-inp-name" type="text" placeholder="María Rodríguez" autocomplete="given-name">
        </div>
        <div class="qp-form-field">
          <label class="qp-form-label" for="qp-inp-phone">WhatsApp <span style="font-weight:400;color:#8a96a4">(opcional)</span></label>
          <input class="qp-form-input" id="qp-inp-phone" type="tel" placeholder="+506 8888 8888" autocomplete="tel">
        </div>
        <button class="qp-btn-wa" onclick="qpSendWA(${score})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.84L0 24l6.322-1.496A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.372l-.36-.214-3.727.882.938-3.619-.235-.373A9.818 9.818 0 0112 2.182c5.427 0 9.818 4.391 9.818 9.818 0 5.428-4.391 9.818-9.818 9.818z"/>
          </svg>
          Agendar mi evaluación en Renace
        </button>
        <p class="qp-cta-fine">Te respondemos en menos de 2 horas en horario de atención · Sin costo ni compromiso</p>
      </div>

      <div style="text-align:center;padding:.5rem 0 .25rem;">
        <button onclick="qpClose()" style="background:none;border:none;color:#8a96a4;font-family:'Nunito',sans-serif;font-size:12.5px;cursor:pointer;text-decoration:underline;">Cerrar evaluación</button>
      </div>
    `;

    const modal = document.getElementById('quiz-popup-modal');
    if (modal) modal.scrollTop = 0;
  }

  /* ── Enviar WhatsApp ── */
  window.qpSendWA = function (score) {
    const nameEl  = document.getElementById('qp-inp-name');
    const phoneEl = document.getElementById('qp-inp-phone');
    const name    = (nameEl  ? nameEl.value.trim()  : '') || 'un paciente';
    const phone   = phoneEl  ? phoneEl.value.trim() : '';
    const risk    = qpRiskInfo(score);
    const ds      = qpDimScores();
    const lines   = QP_DIMS.map(function (n, i) { return '  ' + QP_DIM_ICONS[i] + ' ' + n + ': ' + ds[i] + '%'; }).join('\n');

    const msg = encodeURIComponent(
      'Hola, completé el quiz de riesgo metabólico de Renace Medical Center.\n\n' +
      '*Nombre:* ' + name + (phone ? '\n*Teléfono:* ' + phone : '') + '\n' +
      '*Puntaje de riesgo:* ' + score + '/100 — ' + risk.label + '\n\n' +
      '*Resultado por dimensión:*\n' + lines + '\n\n' +
      'Me gustaría conocer más sobre el diagnóstico completo. ¿Cuándo tienen disponibilidad?'
    );

    window.open('https://wa.me/' + QP_WA + '?text=' + msg, '_blank');
  };

  /* ── Auto-open una sola vez por sesión (4 segundos) ── */
  (function () {
    const STORAGE_KEY = 'qp_shown_v1';
    try {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        setTimeout(function () {
          const ov = document.getElementById('quiz-popup-overlay');
          if (ov && !ov.classList.contains('qp-visible')) {
            qpOpen();
            sessionStorage.setItem(STORAGE_KEY, '1');
          }
        }, 4000);
      }
    } catch (e) { /* sessionStorage no disponible en algunos contextos */ }
  })();

})();
/* FIN QUIZ POP-UP */