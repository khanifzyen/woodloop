// Tailwind Configuration
const tailwindConfig = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#13ec5b",
                "primary-dark": "#0ea841",
                "background-light": "#f6f8f6",
                "background-dark": "#102216",
                "surface-dark": "#1a2e22",
                "surface-highlight": "#243c2f",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "serif": ["Newsreader", "serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
            backgroundImage: {
                'wood-pattern': "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 20s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
};

// Apply Tailwind Config
if (window.tailwind) {
    window.tailwind.config = tailwindConfig;
}

// Mobile Frame Logic
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const body = document.body;

    if (!isMobile) {
        body.classList.add('desktop-view');

        // Wrap existing content in a frame container
        const wrapper = document.createElement('div');
        wrapper.id = 'mobile-frame-container';

        while (body.firstChild) {
            wrapper.appendChild(body.firstChild);
        }

        body.appendChild(wrapper);
    } else {
        // Ensure full height on mobile
        body.style.minHeight = '100vh';
        const wrapper = document.createElement('div');
        wrapper.id = 'mobile-frame-container';
        wrapper.className = 'w-full h-full';
        while (body.firstChild) {
            wrapper.appendChild(body.firstChild);
        }
        body.appendChild(wrapper);
    }
});

// Navigation Helpers (to be used by onboarding)
function navigateTo(url) {
    window.location.href = url;
}
