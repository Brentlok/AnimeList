function defineNextConfig(config) {
    return config;
}

export default defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'cdn.myanimelist.net',
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com',
            'db.hbieszczad.pl',
        ],
    },
});
