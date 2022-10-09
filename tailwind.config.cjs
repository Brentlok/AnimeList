module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
    options: {
        safelist: {
            greedy: ['/safe$/'],
        },
    },
};
