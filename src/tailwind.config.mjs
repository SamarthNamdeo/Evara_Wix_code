/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
                xl: ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.03em', fontWeight: '400' }],
                '2xl': ['1.5rem', { lineHeight: '1.6', letterSpacing: '0.03em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.6', letterSpacing: '0.035em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0.04em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '0.05em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '0.05em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "bitter",
                paragraph: "madefor-display"
            },
            colors: {
                footerbackground: '#2E1B17',
                linkcolor: '#5B3A29',
                buttonborder: '#5B3A29',
                foreground: '#5B3A29',
                destructive: '#DF3131',
                destructiveforeground: '#FFFFFF',
                background: '#F0EDE6',
                secondary: '#D9E0B0',
                'secondary-foreground': '#5B3A29',
                'primary-foreground': '#F0EDE6',
                primary: '#5B3A29'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
