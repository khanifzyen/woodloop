// Tailwind Configuration
const tailwindConfig = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#13ec5b",
                "background-light": "#f6f8f6",
                "background-dark": "#102216",
                "surface-dark": "#182d20",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "serif": ["Newsreader", "serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
