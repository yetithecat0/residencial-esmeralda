/**
 * Portal Residencial Esmeralda - Main JS
 * Developer: Full Stack JS - Implementation of Role-Based Access (Smart Keys)
 */

/**
 * Función para actualizar la fecha en el Top Bar de forma dinámica
 */
function updateDynamicDate() {
    const dateElement = document.querySelector('.date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        let formattedDate = now.toLocaleDateString('es-ES', options);
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        dateElement.textContent = formattedDate;
    }
}

/**
 * Lógica del Carrusel (Mural Informativo)
 */
function initCommunityCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dots = Array.from(document.querySelectorAll('.dot'));
    const carouselContainer = document.getElementById('carousel');

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

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            startAutoPlay();
        });
    });

    startAutoPlay();
}

/**
 * Gestión de Sesión y Permisos (Smart Keys)
 */
const ACCESS_CONFIG = {
    roles: {
        'P': {
            label: 'Propietario',
            allowed: ['votacion', 'marketplace', 'proveedores', 'intercom', 'transparencia'],
            regex: /^P\d+\-(\d+)\-DNI/i
        },
        'I': {
            label: 'Inquilino',
            allowed: ['marketplace', 'proveedores', 'intercom'], // Mantiene bloqueado Votaciones y Transparencia
            regex: /^I\d+\-(\d+)\-DNI/i
        },
        'ADM': {
            label: 'Administración',
            allowed: ['transparencia', 'proveedores'], // Acceso a reportes y gestión
            regex: /^ADM\-ESM\-DNI/i
        }
    }
};

function applyUserPermissions(userData) {
    if (!userData) return;

    // 1. Actualizar bienvenida
    const welcomeTitle = document.getElementById('welcomeTitle');
    if (welcomeTitle) {
        const welcomeText = userData.role === 'ADM'
            ? '¡Bienvenido, Administrador Esmeralda!'
            : `¡Bienvenido, vecino del ${userData.dpto}!`;
        welcomeTitle.innerHTML = `<span>${welcomeText}</span>`;
    }

    // 2. Gestionar tarjetas de servicios
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const serviceType = card.getAttribute('data-service');
        const roleConfig = ACCESS_CONFIG.roles[userData.role];

        if (roleConfig && roleConfig.allowed.includes(serviceType)) {
            // Desbloquear tarjeta
            card.classList.remove('blocked');
            const lockOverlay = card.querySelector('.lock-overlay');
            if (lockOverlay) lockOverlay.style.display = 'none';

            // Hacerla funcional (ejemplo: abrir modal de acceso si es necesario o redirigir)
            card.onclick = (e) => {
                // Si ya está desbloqueado, abrir el modal de aplicaciones
                document.getElementById('openModal').click();
            };
        } else {
            // Asegurar que esté bloqueado si no tiene permiso
            card.classList.add('blocked');
        }
    });

    // 3. Cambiar botón de ingreso en header
    const openModalBtn = document.getElementById('openModal');
    if (openModalBtn) {
        openModalBtn.textContent = 'Mi Cuenta';
        openModalBtn.style.background = 'var(--color-primary)';
        openModalBtn.style.color = '#fff';
    }
}

function handleAccessValidation() {
    const input = document.getElementById('residentCodeInput');
    const errorMsg = document.getElementById('accessErrorMsg');
    const code = input.value.trim().toUpperCase();

    if (!code) {
        showAccessError('Por favor, ingresa tu código.');
        return;
    }

    let detectedRole = null;
    let dpto = null;

    // Validar contra Regex de roles
    for (const [key, config] of Object.entries(ACCESS_CONFIG.roles)) {
        const match = code.match(config.regex);
        if (match) {
            detectedRole = key;
            dpto = match[1] || 'ADMIN';
            break;
        }
    }

    if (detectedRole) {
        const userData = {
            role: detectedRole,
            dpto: dpto,
            code: code,
            timestamp: new Date().getTime()
        };

        // Guardar sesión
        localStorage.setItem('esmeralda_session', JSON.stringify(userData));

        // Aplicar cambios visuales
        applyUserPermissions(userData);

        // Cerrar modal
        const modalGatekeeper = document.getElementById('modalGatekeeper');
        if (modalGatekeeper) {
            modalGatekeeper.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Limpiar input y error
        input.value = '';
        if (errorMsg) errorMsg.style.display = 'none';

        // Feedback sutil
        console.log(`Acceso concedido como ${ACCESS_CONFIG.roles[detectedRole].label}`);
    } else {
        showAccessError('Código no reconocido. Verifica tus datos o contacta a Administración.');
    }
}

function showAccessError(msg) {
    const errorMsg = document.getElementById('accessErrorMsg');
    if (errorMsg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';

        // Animación de sacudida opcional (feedback UX)
        const input = document.getElementById('residentCodeInput');
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 400);
    }
}

function checkExistingSession() {
    const session = localStorage.getItem('esmeralda_session');
    if (session) {
        try {
            const userData = JSON.parse(session);
            // Opcional: Validar expiración (ej: después de 24h)
            applyUserPermissions(userData);
        } catch (e) {
            localStorage.removeItem('esmeralda_session');
        }
    }
}

/**
 * Gestión de Modales
 */
function initModals() {
    // Modal Access Residentes
    const modalAccess = document.getElementById('modalAccess');
    const openAccessBtn = document.getElementById('openModal');
    const closeAccessBtn = document.getElementById('closeModal');

    if (modalAccess && openAccessBtn && closeAccessBtn) {
        openAccessBtn.onclick = () => {
            modalAccess.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        closeAccessBtn.onclick = () => {
            modalAccess.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        modalAccess.onclick = (e) => {
            if (e.target === modalAccess) closeAccessBtn.onclick();
        };
    }

    // Modal Gatekeeper
    const modalGatekeeper = document.getElementById('modalGatekeeper');
    const closeGatekeeperBtn = document.getElementById('closeGatekeeper');
    const blockedCards = document.querySelectorAll('.service-card.blocked');
    const unlockBtn = document.getElementById('unlockGatekeeper');

    if (modalGatekeeper && closeGatekeeperBtn) {
        // Solo las tarjetas que siguen bloqueadas abren el modal
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.service-card.blocked');
            if (card) {
                modalGatekeeper.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        closeGatekeeperBtn.onclick = () => {
            modalGatekeeper.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        modalGatekeeper.onclick = (e) => {
            if (e.target === modalGatekeeper) closeGatekeeperBtn.onclick();
        };
    }

    if (unlockBtn) {
        unlockBtn.onclick = (e) => {
            e.preventDefault();
            handleAccessValidation();
        };
    }

    // Soporte para Enter en el input
    const input = document.getElementById('residentCodeInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAccessValidation();
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateDynamicDate();
    initCommunityCarousel();
    initModals();
    checkExistingSession();
});

// Fallback para fecha
window.addEventListener('load', updateDynamicDate);
