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

const bazarData = [
    {
        nombre: "Miguel T.",
        depto: "403-T1",
        producto: "Camisetas Deportivas",
        descripcion: "Camisetas dry-fit de alta calidad, varias tallas.",
        precio: "S/ 45.00",
        ícono: "👕",
        categoria: "clothing"
    },
    {
        nombre: "Lucia V.",
        depto: "304-T1",
        producto: "Artículos de Belleza",
        descripcion: "Maquillaje dermatológico y cuidado facial.",
        precio: "S/ 25.00",
        ícono: "💄",
        categoria: "beauty"
    },
    {
        nombre: "Carmen M.",
        depto: "901-T2",
        producto: "Marcianos de Fruta",
        descripcion: "Maracuyá, Fresa, Lúcuma. 100% fruta natural.",
        precio: "S/ 2.50",
        ícono: "🍓",
        categoria: "food"
    },
    {
        nombre: "Roberto C.",
        depto: "102-T2",
        producto: "Postres Caseros",
        descripcion: "Keke de naranja y tartaletas de fresa por porción.",
        precio: "S/ 12.00",
        ícono: "🍰",
        categoria: "food"
    },
    {
        nombre: "Elena S.",
        depto: "505-T1",
        producto: "Plantas Decorativas",
        descripcion: "Suculentas y macetas pintadas a mano.",
        precio: "S/ 18.00",
        ícono: "🌱",
        categoria: "garden"
    },
    {
        nombre: "Javier G.",
        depto: "208-T2",
        producto: "Snacks y Frutos Secos",
        descripcion: "Mix de nueces y almendras tostadas.",
        precio: "S/ 8.50",
        ícono: "🥜",
        categoria: "food"
    },
    {
        nombre: "Martha L.",
        depto: "603-T1",
        producto: "Manicura y Estética",
        descripcion: "Servicio a domicilio previo agendamiento.",
        precio: "S/ 30.00",
        ícono: "💅",
        categoria: "beauty"
    },
    {
        nombre: "Carlos B.",
        depto: "704-T2",
        producto: "Clases de Matemáticas",
        descripcion: "Nivel primaria y secundaria. Metodología fácil.",
        precio: "S/ 25.00 / h",
        ícono: "📚",
        categoria: "services"
    },
    {
        nombre: "Silvia R.",
        depto: "802-T1",
        producto: "Ropa Deportiva",
        descripcion: "Leggings y tops para yoga y entrenamiento.",
        precio: "S/ 55.00",
        ícono: "👟",
        categoria: "clothing"
    },
    {
        nombre: "David F.",
        depto: "501-T2",
        producto: "Paseador de Perros",
        descripcion: "Rutas seguras y fotos de tu mascota en tiempo real.",
        precio: "S/ 15.00 / h",
        ícono: "🐕",
        categoria: "services"
    }
];

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
            gatekeeper: document.getElementById('modalGatekeeper'),
            voting: document.getElementById('modalVoting'),
            bazar: document.getElementById('modalBazar'),
            proveedores: document.getElementById('modalProveedores'),
            transparency: document.getElementById('modalTransparency'),
            account: document.getElementById('modalAccount')
        },
        buttons: {
            openLogin: document.getElementById('openModal'),
            closeAccess: document.getElementById('closeModal'),
            closeGatekeeper: document.getElementById('closeGatekeeper'),
            closeVoting: document.getElementById('closeVoting'),
            closeBazar: document.getElementById('closeBazar'),
            closeProveedores: document.getElementById('closeProveedores'),
            closeTransparency: document.getElementById('closeTransparency'),
            closeAccount: document.getElementById('closeAccount'),
            unlock: document.getElementById('unlockGatekeeper'),
            logout: document.getElementById('logoutBtn'),
            btnOpenVoting: document.getElementById('btnOpenVoting')
        },
        ui: {
            welcomeTitle: document.getElementById('welcomeTitle'),
            loggedInfo: document.getElementById('loggedUserInfo'),
            userGreeting: document.getElementById('userGreeting'),
            errorMsg: document.getElementById('accessErrorMsg'),
            codeInput: document.getElementById('residentCodeInput'),
            serviceCards: document.querySelectorAll('.service-card'),
            bazarGrid: document.getElementById('bazarGrid'),
            bazarSearch: document.getElementById('bazarSearchInput')
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
 */
function applyUserPermissions(data, isNewLogin = false) {
    if (!data) return;

    const userType = data.tipo?.toLowerCase();
    const isConserje = userType === 'conserje';
    const isAdmin = userType === 'administración' || userType === 'adm';
    const isSuper = userType === 'super';

    // Saludo Personalizado
    let welcomeText = isAdmin ? '¡Bienvenido, Administrador Esmeralda!' : `¡Hola, ${data.nombre} (Dpto ${data.depto})!`;
    if (isConserje) welcomeText = `Hola, ${data.nombre} - Conserje`;
    if (isSuper) welcomeText = `Hola, ${data.nombre} - Desarrollador`;

    if (elements.ui.welcomeTitle) {
        elements.ui.welcomeTitle.innerHTML = `<span>${welcomeText}</span>`;
    }

    if (elements.ui.userGreeting) {
        elements.ui.userGreeting.textContent = isConserje ? `Hola, ${data.nombre} - Conserje` :
            isSuper ? `Hola, ${data.nombre} - Desarrollador` :
                `Hola, ${data.nombre} - Dpto ${data.depto}`;
    }

    // Botón Mi Cuenta (Funcional ahora)
    if (elements.buttons.openLogin) {
        elements.buttons.openLogin.textContent = isConserje ? 'Panel Conserje' : 'Mi Cuenta';
        elements.buttons.openLogin.classList.remove('secondary-btn');
        elements.buttons.openLogin.classList.add('account-btn');

        elements.buttons.openLogin.onclick = (e) => {
            e.preventDefault();
            if (elements.modals.account) {
                elements.modals.account.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }

    if (elements.ui.loggedInfo) elements.ui.loggedInfo.style.display = 'flex';

    elements.ui.serviceCards.forEach((card, index) => {
        const serviceType = card.getAttribute('data-service');
        let isAllowed = true;
        let isHidden = false;
        let isConserjeOnlyRestriction = false;

        // --- Lógica de Roles ---

        if (isSuper) {
            // Super tiene acceso total
            isAllowed = true;
            isHidden = false;
        } else if (isConserje) {
            // Conserje solo ve Intercom, Bazar y Proveedores
            const allowedForConserje = ['intercom', 'bazar', 'proveedores'];
            if (!allowedForConserje.includes(serviceType)) {
                isHidden = true;
            }
        } else if (userType === 'propietario' || userType === 'inquilino') {
            // Residentes no usan el Intercom
            if (serviceType === 'intercom') {
                isConserjeOnlyRestriction = true;
                isAllowed = false;
            }
            // Inquilinos no votan
            if (userType === 'inquilino' && serviceType === 'votacion') {
                isAllowed = false;
            }
        }

        // Aplicar Visibilidad
        if (isHidden) {
            card.classList.add('hidden-role');
            return;
        } else {
            card.classList.remove('hidden-role');
        }

        // Aplicar Restricción "Solo Conserje"
        if (isConserjeOnlyRestriction) {
            card.classList.add('conserje-only');
            card.classList.remove('blocked');
            const overlay = card.querySelector('.lock-overlay');
            if (overlay) overlay.style.display = 'none';
            card.onclick = null;
            return;
        } else {
            card.classList.remove('conserje-only');
        }

        // --- Manejo de Desbloqueo y Clics ---
        if (isAllowed) {
            card.classList.remove('blocked');

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
                if (serviceType === 'votacion') {
                    openVotingModule();
                } else if (serviceType === 'bazar') {
                    openBazarModule();
                } else if (serviceType === 'proveedores') {
                    openProveedoresModule();
                } else if (serviceType === 'transparencia') {
                    openTransparencyModule();
                } else if (serviceType === 'intercom' && (isConserje || isSuper || isAdmin)) {
                    window.open('https://intercomweb2026.streamlit.app/', '_blank');
                } else {
                    // Otros servicios (si los hubiera)
                    showSuttleMessage('Módulo en mantenimiento preventivo.');
                }
            };
        } else {
            card.classList.add('blocked');
            card.onclick = () => {
                const msg = (serviceType === 'votacion')
                    ? 'Esta sección es exclusiva para Propietarios acreditados'
                    : 'Acceso restringido para su perfil';
                showSuttleMessage(msg);
            };
        }
    });

    if (elements.buttons.btnOpenVoting) {
        elements.buttons.btnOpenVoting.onclick = () => {
            if (userType === 'propietario' || isAdmin || isSuper) {
                openVotingModule();
            } else {
                showSuttleMessage('Esta sección es exclusiva para Propietarios acreditados');
            }
        };
    }
}

/**
 * Bazar / Marketplace Logic (Fixed Data)
 */
function openBazarModule() {
    if (elements.modals.access) elements.modals.access.classList.remove('active');
    if (elements.modals.bazar) {
        elements.modals.bazar.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderBazarCards(bazarData);
    }
}

function renderBazarCards(dataList) {
    if (!elements.ui.bazarGrid) return;

    if (dataList.length === 0) {
        elements.ui.bazarGrid.innerHTML = '<div class="loading-bazar">No se encontraron emprendimientos con ese criterio.</div>';
        return;
    }

    elements.ui.bazarGrid.innerHTML = dataList.map(item => `
        <div class="bazar-card category-${item.categoria} animate-up">
            <div class="bazar-card-image">${item.ícono}</div>
            <div class="bazar-card-body">
                <span class="bazar-user-tag">${item.nombre} - ${item.depto}</span>
                <h3 class="bazar-product-title">${item.producto}</h3>
                <p class="bazar-description">${item.descripcion}</p>
                <div class="bazar-product-price">${item.precio}</div>
                <a href="https://wa.me/51900000000?text=Hola%20${item.nombre},%20vi%20tu%20anuncio%20de%20${item.producto}%20en%20el%20Bazar%20Esmeralda" target="_blank" class="btn-whatsapp-bazar">
                    Contactar por WhatsApp
                </a>
            </div>
        </div>
    `).join('');
}

function filterBazar() {
    const query = elements.ui.bazarSearch.value.toLowerCase();
    const filtered = bazarData.filter(item =>
        item.producto.toLowerCase().includes(query) ||
        item.descripcion.toLowerCase().includes(query) ||
        item.nombre.toLowerCase().includes(query) ||
        item.depto.toLowerCase().includes(query)
    );
    renderBazarCards(filtered);
}

/**
 * Abre el módulo de proveedores
 */
function openProveedoresModule() {
    if (elements.modals.access) elements.modals.access.classList.remove('active');
    if (elements.modals.proveedores) {
        elements.modals.proveedores.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Abre el módulo de transparencia y configura acordeones
 */
function openTransparencyModule() {
    if (elements.modals.access) elements.modals.access.classList.remove('active');
    if (elements.modals.transparency) {
        elements.modals.transparency.classList.add('active');
        document.body.style.overflow = 'hidden';
        initAccordions();
    }
}

/**
 * Lógica de Acordeones
 */
function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        // Evitar múltiples bindings
        header.onclick = (e) => {
            e.stopPropagation();
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Opcional: Cerrar otros del mismo nivel
            const siblings = item.parentElement.querySelectorAll(':scope > .accordion-item');
            siblings.forEach(sib => sib.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        };
    });
}

/**
 * Abre el módulo de votaciones
 */
function openVotingModule() {
    if (elements.modals.access) elements.modals.access.classList.remove('active');
    if (elements.modals.voting) {
        elements.modals.voting.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Muestra un mensaje sutil
 */
function showSuttleMessage(msg) {
    const toast = document.createElement('div');
    toast.className = 'suttle-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/**
 * Validación con Supabase
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
        // Excepción Global para Super Usuario (Token Bypass)
        if (inputToken === '00000000') {
            const superData = {
                nombre: "Admin Dev",
                depto: "Labs",
                tipo: "super",
                token: "00000000"
            };
            localStorage.setItem('vecino_logueado', JSON.stringify(superData));
            applyUserPermissions(superData, true);
            closeGatekeeperLogic();
            return;
        }

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
            localStorage.setItem('vecino_logueado', JSON.stringify(data));
            applyUserPermissions(data, true);
            closeGatekeeperLogic();
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

function closeGatekeeperLogic() {
    if (elements.modals.gatekeeper) {
        elements.modals.gatekeeper.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    if (elements.ui.codeInput) elements.ui.codeInput.value = '';
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

    if (buttons.openLogin && modals.gatekeeper) {
        buttons.openLogin.onclick = () => {
            if (!localStorage.getItem('vecino_logueado')) {
                modals.gatekeeper.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }

    const closeMapping = [
        { btn: buttons.closeAccess, modal: modals.access },
        { btn: buttons.closeGatekeeper, modal: modals.gatekeeper },
        { btn: buttons.closeVoting, modal: modals.voting },
        { btn: buttons.closeBazar, modal: modals.bazar },
        { btn: buttons.closeProveedores, modal: modals.proveedores },
        { btn: buttons.closeTransparency, modal: modals.transparency },
        { btn: buttons.closeAccount, modal: modals.account }
    ];

    closeMapping.forEach(item => {
        if (item.btn && item.modal) {
            item.btn.onclick = () => {
                item.modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            };
        }
    });

    if (buttons.logout) buttons.logout.onclick = (e) => { e.preventDefault(); logout(); };

    if (buttons.unlock) buttons.unlock.onclick = (e) => { e.preventDefault(); handleAccessValidation(); };
    if (ui.codeInput) {
        ui.codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAccessValidation();
        });
    }

    if (ui.bazarSearch) {
        ui.bazarSearch.addEventListener('input', filterBazar);
    }

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.service-card.blocked');
        if (card && modals.gatekeeper) {
            const sessionData = localStorage.getItem('vecino_logueado');
            if (!sessionData) {
                modals.gatekeeper.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

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
