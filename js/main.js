/* ===== EFECTO DE ESCRITURA EN EL HERO ===== */
const typingElement = document.querySelector(".hero__typing");
const words = ["Software", "Interfaces", "Sitios web", "Aplicaciones web"];

let wordIndex = 0;                     // qué palabra estamos mostrando
let charIndex = words[0].length;       // cuántas letras se ven ahora
let isDeleting = true;                 // empezamos borrando "Software"

function type() {
    const currentWord = words[wordIndex];

    // Quitar o agregar una letra
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingElement.textContent = currentWord.slice(0, charIndex);

    // Velocidad: borrar es más rápido que escribir
    let delay = isDeleting ? 60 : 120;

    // Terminó de escribir la palabra: pausa y empieza a borrar
    if (!isDeleting && charIndex === currentWord.length) {
        delay = 1800;
        isDeleting = true;
    }
    // Terminó de borrar: pasa a la siguiente palabra
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
    }

    setTimeout(type, delay);
}

// Respetar a quienes prefieren menos animaciones
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typingElement && !reduceMotion) {
    setTimeout(type, 1800);   // espera un poco antes de empezar
}

/* ===== MODO CLARO / OSCURO ===== */
const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;   // la etiqueta <html>

function updateLabel(theme) {
    const label = theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    themeToggle.setAttribute("aria-label", label);
}

// Al cargar, ajustar la etiqueta según el tema actual
updateLabel(root.getAttribute("data-theme"));

themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);   // recordar la elección
    updateLabel(next);
});

/* ===== PESTAÑAS DE HABILIDADES ===== */
const tabs = document.querySelectorAll(".skills__tab");
const panels = document.querySelectorAll(".skills__panel");

function activateTab(tab) {
    // 1. Desactivar todas las pestañas y ocultar todos los paneles
    tabs.forEach((t) => {
        t.setAttribute("aria-selected", "false");
        t.setAttribute("tabindex", "-1");
    });
    panels.forEach((panel) => {
        panel.hidden = true;
    });

    // 2. Activar la pestaña elegida y mostrar su panel
    tab.setAttribute("aria-selected", "true");
    tab.removeAttribute("tabindex");
    const panelId = tab.getAttribute("aria-controls");
    document.getElementById(panelId).hidden = false;
}

tabs.forEach((tab, index) => {
    // Con clic
    tab.addEventListener("click", () => activateTab(tab));

    // Con las flechas del teclado
    tab.addEventListener("keydown", (e) => {
        let newIndex;
        if (e.key === "ArrowRight") {
            newIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft") {
            newIndex = (index - 1 + tabs.length) % tabs.length;
        } else {
            return;   // cualquier otra tecla: no hacer nada
        }
        tabs[newIndex].focus();
        activateTab(tabs[newIndex]);
    });
});

/* ===== PROYECTOS: DATOS ===== */
const projects = [
    {
        title: "Huellitas Felices",
        description: "Sitio web de adopción de mascotas: muestra perritos y gatitos en un carrusel, permite publicar mascotas para dar en adopción e incluye inicio de sesión de usuarios.",
        image: "img/huellitas.jpg",
        tech: ["HTML", "CSS", "JavaScript", "DOM"],
        categories: ["frontend"],
        repo: "https://github.com/macareno26/HuellitasFelicesDinanismo",
        demo: "https://macareno26.github.io/HuellitasFelicesDinanismo/index.html"
    },
    {
        title: "Análisis de ventas: Corporación Favorita",
        description: "Pipeline de datos sobre más de 3 millones de ventas de supermercados de Ecuador: carga, limpieza y consolidación con Polars, orquestado con Apache Airflow, guardado en PostgreSQL y visualizado en un dashboard. Proyecto en equipo.",
        image: "img/favorita.jpg",
        tech: ["Python", "Polars", "Apache Airflow", "PostgreSQL", "Power BI"],
        categories: ["database"],
        repo: "https://github.com/Amy-Mishell06/ProyectoFavorita",
    },
    {
        title: "Sistema de Licencias Vehiculares",
        description: "Aplicación de escritorio para gestionar trámites de licencias: tres roles de usuario, validación de requisitos, registro de exámenes, emisión de licencias y reportes en PDF y CSV.",
        image: "img/licencias.jpg",
        tech: ["Java", "POO", "Swing", "[Base de datos]"],
        categories: ["backend"],
        repo: "https://github.com/Amy-Mishell06/PROYECTO_POO",
    },
    {
        title: "Este portafolio",
        description: "Sitio personal con modo claro/oscuro, pestañas accesibles, formulario validado y proyectos generados con JavaScript.",
        image: "img/portafolio.jpg",
        tech: ["HTML", "CSS", "JavaScript"],
        categories: ["frontend"],
        repo: "",
        demo: ""
    }
];

/* ===== PROYECTOS: MOSTRAR Y FILTRAR ===== */
const projectsGrid = document.getElementById("projectsGrid");
const projectsEmpty = document.getElementById("projectsEmpty");
const filterButtons = document.querySelectorAll(".filter-btn");

function createCard(project) {
    // Si hay imagen, la mostramos; si no, un bloque con la inicial
    const image = project.image
        ? `<img class="project-card__img" src="${project.image}" alt="Captura de ${project.title}" loading="lazy">`
        : `<div class="project-card__img project-card__img--empty" aria-hidden="true">${project.title.charAt(0)}</div>`;

    const techList = project.tech.map((t) => `<li>${t}</li>`).join("");

    const repoLink = project.repo
        ? `<a href="${project.repo}" target="_blank" rel="noopener">Código</a>`
        : "";
    const demoLink = project.demo
        ? `<a href="${project.demo}" target="_blank" rel="noopener">Demo</a>`
        : "";

    return `
    <article class="project-card">
      ${image}
      <div class="project-card__body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul class="project-card__tech">${techList}</ul>
        <div class="project-card__links">${repoLink}${demoLink}</div>
      </div>
    </article>
  `;
}

function renderProjects(filter) {
    const visible = filter === "todos"
        ? projects
        : projects.filter((p) => p.categories.includes(filter));

    projectsGrid.innerHTML = visible.map(createCard).join("");
    projectsEmpty.hidden = visible.length > 0;
    projectsGrid.scrollLeft = 0;   // al cambiar de filtro, volver al inicio
    updateButtons();
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Mismo patrón de las pestañas: desactivar todos, activar uno
        filterButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
        button.setAttribute("aria-pressed", "true");

        renderProjects(button.dataset.filter);
    });
});

/* ===== CARRUSEL DE PROYECTOS ===== */
const prevBtn = document.querySelector(".carousel__btn--prev");
const nextBtn = document.querySelector(".carousel__btn--next");

function updateButtons() {
    const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
    prevBtn.disabled = projectsGrid.scrollLeft <= 5;
    nextBtn.disabled = projectsGrid.scrollLeft >= maxScroll - 5;
}

prevBtn.addEventListener("click", () => {
    projectsGrid.scrollBy({ left: -projectsGrid.clientWidth, behavior: "smooth" });
});

nextBtn.addEventListener("click", () => {
    projectsGrid.scrollBy({ left: projectsGrid.clientWidth, behavior: "smooth" });
});

projectsGrid.addEventListener("scroll", updateButtons);
window.addEventListener("resize", updateButtons);

// Mostrar todos los proyectos al cargar la página
renderProjects("todos");

/* ===== COPIAR CORREO ===== */
const copyBtn = document.querySelector(".copy-btn");

if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(copyBtn.dataset.copy);
            copyBtn.textContent = "¡Copiado!";
        } catch (error) {
            copyBtn.textContent = "No se pudo copiar";
        }
        setTimeout(() => {
            copyBtn.textContent = "Copiar";
        }, 2000);
    });
}

/* ===== VALIDACIÓN DEL FORMULARIO ===== */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const formInputs = form.querySelectorAll("input, textarea");

// Una regla por campo: devuelve el mensaje de error, o "" si está bien
const validators = {
    name: (value) =>
        value.trim().length >= 2 ? "" : "Escribe tu nombre (mínimo 2 letras).",
    email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
            ? ""
            : "Escribe un correo válido, por ejemplo nombre@correo.com.",
    message: (value) =>
        value.trim().length >= 10 ? "" : "Tu mensaje debe tener al menos 10 caracteres."
};

function validateField(input) {
    const errorMessage = validators[input.id](input.value);
    document.getElementById(`${input.id}-error`).textContent = errorMessage;
    input.setAttribute("aria-invalid", errorMessage ? "true" : "false");
    return errorMessage === "";
}

formInputs.forEach((input) => {
    // Validar al salir del campo
    input.addEventListener("blur", () => validateField(input));

    // Si ya tenía error, revalidar mientras escribe (el error desaparece al corregirlo)
    input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") {
            validateField(input);
        }
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let allValid = true;
    formInputs.forEach((input) => {
        if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
        formStatus.textContent = "";
        form.querySelector('[aria-invalid="true"]').focus();
        return;
    }

    formStatus.textContent = "¡Formulario válido! En el siguiente paso lo conectamos para que envíe de verdad.";
    form.reset();
});

/* ===== GATITO: PIENSA Y LUEGO PROGRAMA ===== */
const catScene = document.getElementById("catScene");
const thoughtWord = document.getElementById("thoughtWord");
const catWords = ["¿café?", "JavaScript", "¿un bug?", "atún", "Python", "SQL", "¿siesta?", "CSS", "Power BI", "¿y si...?"];
let lastWord = "";

function showWord(word) {
  thoughtWord.textContent = word;
  thoughtWord.classList.remove("pop");
  void thoughtWord.offsetWidth;          // reinicia la animación
  thoughtWord.classList.add("pop");
}

function randomWord() {
  let word;
  do {
    word = catWords[Math.floor(Math.random() * catWords.length)];
  } while (word === lastWord);           // evita repetir la misma dos veces
  lastWord = word;
  return word;
}

function think(wordsLeft) {
  catScene.classList.add("is-thinking");
  catScene.classList.remove("is-coding");

  if (wordsLeft === 0) {
    showWord("¡Ya sé!");
    setTimeout(code, 1200);
    return;
  }
  showWord(randomWord());
  setTimeout(() => think(wordsLeft - 1), 1000);
}

function code() {
  catScene.classList.remove("is-thinking");
  catScene.classList.add("is-coding");
  setTimeout(() => think(4), 4000);      // programa 4 segundos y vuelve a pensar
}

if (catScene) {
  if (reduceMotion) {
    catScene.classList.add("is-thinking");
    showWord("¡Ya sé!");
  } else {
    think(4);
  }
}