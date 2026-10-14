/*
 * ════════════════════════════════════════════════
 *  adri.js_ — data/posts.js
 *  Base de datos de posts del blog
 *
 *  Para añadir un nuevo post:
 *  1. Crea el archivo HTML en blog/posts/nombre-del-post.html
 *  2. Añade una entrada al array POSTS aquí abajo
 *  3. ¡Listo! Aparecerá automáticamente en el blog
 * ════════════════════════════════════════════════
 */

const POSTS = [
  {
    id: 'metrics',           // ID único (debe coincidir con el nombre del archivo HTML: blog/posts/metrics.html)
    title: 'Software Metrics: el GPS de tu equipo',
    excerpt: '¿Cómo sabes si tu equipo está mejorando? Las DORA metrics son la brújula que distingue equipos que creen que van bien de los que realmente van bien.',
    date: 'Jun 2026',
    dateSort: '2026-06',     // para ordenar cronológicamente
    category: 'engineering', // engineering | stem | proyectos | comunidad
    readTime: '6 min',
    published: true,
  },
  {
    id: 'sistemas-no-se-caen',
    title: 'Sistemas que no se caen',
    excerpt: 'Cómo piensan los ingenieros senior ante arquitecturas distribuidas y por qué CAP theorem importa más de lo que te dijeron.',
    date: 'Pronto',
    dateSort: '2026-12',
    category: 'engineering',
    readTime: null,          // null = "Próximamente"
    published: false,
  },
  {
    id: 'algoritmo-no-es-magia',
    title: 'El algoritmo no es magia',
    excerpt: 'Desmitificando la IA para personas sin formación técnica. Spoiler: es estadística, no ciencia ficción.',
    date: 'Pronto',
    dateSort: '2026-12',
    category: 'stem',
    readTime: null,
    published: false,
  },
  {
    id: 'como-empece-en-tech',
    title: 'Cómo empecé en tech sin saber nada',
    excerpt: 'Mi historia real, los recursos que usé, los errores que cometí y lo que haría diferente hoy.',
    date: 'Pronto',
    dateSort: '2026-12',
    category: 'comunidad',
    readTime: null,
    published: false,
  },
  {
    id: 'buildeando-en-publico-semana-1',
    title: 'Buildeando en público: semana 1',
    excerpt: 'Qué estoy construyendo, por qué lo hago público y todo lo aprendido en la primera semana.',
    date: 'Pronto',
    dateSort: '2026-12',
    category: 'proyectos',
    readTime: null,
    published: false,
  },
];

/*
 * ── Renderiza los posts en el DOM ──
 * Esta función lee el array POSTS y genera el HTML automáticamente.
 * No toques esto a menos que quieras cambiar el layout de los posts.
 */
function renderPosts() {
  const container = document.getElementById('pl');
  if (!container) return;

  container.innerHTML = POSTS.map(post => {
    const isPending = !post.published;
    const pendingStyle = isPending ? 'opacity:.55;cursor:default' : '';
    const clickAttr = post.published ? `onclick="openPost('${post.id}')"` : '';

    return `
    <div class="post rv" data-cat="${post.category}" style="${pendingStyle}" ${clickAttr}>
      <div class="post-date">${post.date.replace(' ', '<br/>')}</div>
      <div>
        ${isPending ? '<span class="coming">Próximamente</span>' : `<div class="post-cat">${categoryLabel(post.category)}</div>`}
        <div class="post-title">${post.title}</div>
        <div class="post-exc">${post.excerpt}</div>
      </div>
      <div class="post-read">${post.readTime ? post.readTime + ' →' : '—'}</div>
    </div>`;
  }).join('');

  // Re-aplicar scroll reveal a los nuevos elementos
  container.querySelectorAll('.rv').forEach(el => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.classList.add('v');
    }, { threshold: .1 }).observe(el);
  });
}

function categoryLabel(cat) {
  const labels = {
    engineering: 'Engineering',
    stem: 'STEM',
    proyectos: 'Proyectos',
    comunidad: 'Comunidad',
  };
  return labels[cat] || cat;
}

/*
 * Navega al post individual (blog/posts/id.html)
 * Si el post está inline en index.html como modal, puedes cambiar
 * esta función para abrir el modal en su lugar.
 */
function openPost(id) {
  // Opción A: página independiente (recomendado para SEO y mantenibilidad)
  window.location.href = `blog/posts/${id}.html`;

  // Opción B: modal inline (descomenta si prefieres mantener los posts en index.html)
  // openM(id);
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', renderPosts);
