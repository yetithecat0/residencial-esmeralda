/**
 * Portal Residencial Esmeralda - Main JS
 * Developer: Full Stack Developer - Supabase & UI Refinement
 */

// 1. Configuración de Cliente Supabase
const SUPABASE_URL = "https://vflhnomgfpjthiffpeke.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbGhub21nZnBqdGhpZmZwZWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTQyNTEsImV4cCI6MjA4NzA5MDI1MX0.oofZFScNH5kh4KGkDa48ugdH82p4z_glbX_yJi2T9mw";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Elementos del DOM (Globales)
let elements = {};

function initDOMElements() {
    elements = {
        date: document.querySelector('.date'),
        carousel: {
            track: document.querySelector('.carousel-track'),
            slides: Array.from(document.querySelectorAll('.carousel-slide')),
            nextBtn: document.getElementById('nextBtn'),
            prevBtn: document.getElementById('prevBtn'),
            dots: Array.from(document.querySelectorAll('.dot')),
            container: document.getElementById('carousel')
        },
        modals: {
            access: document.getElementById('modalAccess'),
            gatekeeper: document.getElementById('modalGatekeeper')
        },
        buttons: {
            openLogin: document.getElementById('openModal'),
            closeAccess: document.getElementById('closeModal'),
            closeGatekeeper: document.getElementById('closeGatekeeper'),
            unlock: document.getElementById('unlockGatekeeper'),
            logout: document.getElementById('logoutBtn')
        },
        ui: {
            welcomeTitle: document.getElementById('welcomeTitle'),
            loggedInfo: document.getElementById('loggedUserInfo'),
            userGreeting: document.getElementById('userGreeting'),
            errorMsg: document.getElementById('accessErrorMsg'),
            codeInput: document.getElementById('residentCodeInput'),
            serviceCards: document.querySelectorAll('.service-card')
        }
    };
}

/**
 * Función para actualizar la fecha en el Top Bar
 */
function updateDynamicDate() {
    if (elements.date) {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        let formattedDate = now.toLocaleDateString('es-ES', options);
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        elements.date.textContent = formattedDate;
    }
}

/**
 * Lógica del Carrusel
 */
function initCommunityCarousel() {
    const { track, slides, nextBtn, prevBtn, dots, container } = elements.carousel;
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    let autoPlayTimer;

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
    }

    if (nextBtn) nextBtn.onclick = () => { nextSlide(); startAutoPlay(); };
    if (prevBtn) prevBtn.onclick = () => { currentIndex = (currentIndex - 1 + slideCount) % slideCount; updateCarousel(); startAutoPlay(); };

    dots.forEach((dot, index) => {
        dot.onclick = () => { currentIndex = index; updateCarousel(); startAutoPlay(); };
    });

    startAutoPlay();
}

/**
 * Aplica los permisos y actualiza la UI
 * @param {Object} data - Datos del vecino desde Supabase (tabla directorio_final)
 * @param {Boolean} isNewLogin - Si activa animaciones
 */
function applyUserPermissions(data, isNewLogin = false) {
    if (!data) return;

    // 1. Ajuste de la Interfaz de Usuario (Header)
    const welcomeText = (data.tipo === 'Administración' || data.tipo === 'ADM')
        ? '¡Bienvenido, Administrador Esmeralda!'
        : `¡Hola, ${data.nombre} (Dpto ${data.depto})!`;

    // Saludo en el Hero
    if (elements.ui.welcomeTitle) {
        elements.ui.welcomeTitle.innerHTML = `<span>${welcomeText}</span>`;
    }

    // Saludo en el Header (Debajo del botón)
    if (elements.ui.userGreeting) {
        elements.ui.userGreeting.textContent = `Hola, ${data.nombre} - Dpto ${data.depto}`;
    }

    // Botón "Mi Cuenta"
    if (elements.buttons.openLogin) {
        elements.buttons.openLogin.textContent = 'Mi Cuenta';
        elements.buttons.openLogin.classList.remove('secondary-btn');
        elements.buttons.openLogin.classList.add('account-btn'); // Opcional para styling extra

        // Cambiar comportamiento para abrir modal de apps directamente
        elements.buttons.openLogin.onclick = () => {
            if (elements.modals.access) {
                elements.modals.access.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }

    if (elements.ui.loggedInfo) elements.ui.loggedInfo.style.display = 'flex';

    // 2. Lógica de Roles (directorio_final)
    elements.ui.serviceCards.forEach((card, index) => {
        const serviceType = card.getAttribute('data-service');
        let isAllowed = true;

        // Si tipo === 'Propietario', desbloquea todo; Si es 'Inquilino', bloquea 'Votaciones'.
        if (data.tipo?.toLowerCase() === 'inquilino' && serviceType === 'votacion') {
            isAllowed = false;
        }

        if (isAllowed) {
            card.classList.remove('blocked');

            // Animación y limpieza de candados con transición suave
            if (isNewLogin) {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('reveal-card');
                const overlay = card.querySelector('.lock-overlay');
                if (overlay) {
                    overlay.classList.add('fade-out');
                    setTimeout(() => overlay.style.display = 'none', 500);
                }
            } else {
                const overlay = card.querySelector('.lock-overlay');
                if (overlay) overlay.style.display = 'none';
            }

            card.onclick = () => {
                if (elements.modals.access) {
                    elements.modals.access.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            };
        } else {
            card.classList.add('blocked');
            card.onclick = null;
        }
    });
}

/**
 * Validación con Supabase (Real Token Logic - directorio_final)
 */
async function handleAccessValidation() {
    const inputToken = elements.ui.codeInput.value.trim();
    if (!inputToken) {
        showAccessError('Por favor, ingresa tu código.');
        return;
    }

    const unlockBtn = elements.buttons.unlock;
    if (unlockBtn) {
        unlockBtn.disabled = true;
        unlockBtn.textContent = 'Verificando...';
    }

    try {
        // Consulta asíncrona a Supabase: directorio_final
        const { data, error } = await supabaseClient
            .from('directorio_final')
            .select('*')
            .eq('token', inputToken)
            .single();

        if (error) {
            console.warn('Login attempt failed:', error.message);
            showAccessError('Token incorrecto. Contacta a administración.');
            return;
        }

        if (data) {
            // Persistencia: guarda la sesión en localStorage
            localStorage.setItem('vecino_logueado', JSON.stringify(data));

            applyUserPermissions(data, true);

            // Cierra el modal automáticamente
            if (elements.modals.gatekeeper) {
                elements.modals.gatekeeper.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            elements.ui.codeInput.value = '';
        }
    } catch (err) {
        console.error('Supabase Error:', err);
        showAccessError('Error de red. Intenta más tarde.');
    } finally {
        if (unlockBtn) {
            unlockBtn.disabled = false;
            unlockBtn.textContent = 'Desbloquear Portal';
        }
    }
}

function showAccessError(msg) {
    const { errorMsg, codeInput } = elements.ui;
    if (errorMsg && codeInput) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        codeInput.classList.add('error-shake');
        setTimeout(() => codeInput.classList.remove('error-shake'), 400);
    }
}

function logout() {
    localStorage.removeItem('vecino_logueado');
    location.reload();
}

function checkExistingSession() {
    const session = localStorage.getItem('vecino_logueado');
    if (session) {
        try {
            const data = JSON.parse(session);
            applyUserPermissions(data, false);
        } catch (e) {
            logout();
        }
    }
}

/**
 * Inicialización de Eventos y Modales
 */
function setupEventListeners() {
    const { modals, buttons, ui } = elements;

    // El botón inicial abre el Gatekeeper si no está logueado
    if (buttons.openLogin && modals.gatekeeper) {
        buttons.openLogin.onclick = () => {
            if (!localStorage.getItem('vecino_logueado')) {
                modals.gatekeeper.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }

    // Cerrar Modales
    if (buttons.closeAccess && modals.access) {
        buttons.closeAccess.onclick = () => {
            modals.access.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
    }
    if (buttons.closeGatekeeper && modals.gatekeeper) {
        buttons.closeGatekeeper.onclick = () => {
            modals.gatekeeper.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
    }

    // Logout
    if (buttons.logout) buttons.logout.onclick = (e) => { e.preventDefault(); logout(); };

    // Formulario de Acceso
    if (buttons.unlock) buttons.unlock.onclick = (e) => { e.preventDefault(); handleAccessValidation(); };
    if (ui.codeInput) {
        ui.codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAccessValidation();
        });
    }

    // Interceptor para tarjetas bloqueadas
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.service-card.blocked');
        if (card && modals.gatekeeper) {
            modals.gatekeeper.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Cerrar modal al hacer clic fuera del contenedor
    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            };
        }
    });
}

// Inicialización Total
document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    updateDynamicDate();
    initCommunityCarousel();
    setupEventListeners();
    checkExistingSession();
});

window.addEventListener('load', updateDynamicDate);
