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
            proveedores: document.getElementById('modalProveedores')
        },
        buttons: {
            openLogin: document.getElementById('openModal'),
            closeAccess: document.getElementById('closeModal'),
            closeGatekeeper: document.getElementById('closeGatekeeper'),
            closeVoting: document.getElementById('closeVoting'),
            closeBazar: document.getElementById('closeBazar'),
            closeProveedores: document.getElementById('closeProveedores'),
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

    const welcomeText = (data.tipo === 'Administración' || data.tipo === 'ADM')
        ? '¡Bienvenido, Administrador Esmeralda!'
        : `¡Hola, ${data.nombre} (Dpto ${data.depto})!`;

    if (elements.ui.welcomeTitle) {
        elements.ui.welcomeTitle.innerHTML = `<span>${welcomeText}</span>`;
    }

    if (elements.ui.userGreeting) {
        elements.ui.userGreeting.textContent = `Hola, ${data.nombre} - Dpto ${data.depto}`;
    }

    if (elements.buttons.openLogin) {
        elements.buttons.openLogin.textContent = 'Mi Cuenta';
        elements.buttons.openLogin.classList.remove('secondary-btn');
        elements.buttons.openLogin.classList.add('account-btn');

        elements.buttons.openLogin.onclick = () => {
            if (elements.modals.access) {
                elements.modals.access.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }

    if (elements.ui.loggedInfo) elements.ui.loggedInfo.style.display = 'flex';

    elements.ui.serviceCards.forEach((card, index) => {
        const serviceType = card.getAttribute('data-service');
        let isAllowed = true;

        if (data.tipo?.toLowerCase() === 'inquilino' && serviceType === 'votacion') {
            isAllowed = false;
        }

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
                } else {
                    if (elements.modals.access) {
                        elements.modals.access.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            };
        } else {
            card.classList.add('blocked');
            card.onclick = () => {
                if (serviceType === 'votacion') {
                    showSuttleMessage('Esta sección es exclusiva para Propietarios acreditados');
                }
            };
        }
    });

    if (elements.buttons.btnOpenVoting) {
        elements.buttons.btnOpenVoting.onclick = () => {
            if (data.tipo?.toLowerCase() === 'propietario' || data.tipo?.toLowerCase() === 'administración' || data.tipo?.toLowerCase() === 'adm') {
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
        { btn: buttons.closeProveedores, modal: modals.proveedores }
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
