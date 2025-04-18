type Config = {
    API_URL: string;
    ENV: string;
}

const config: Config = {
    API_URL: import.meta.env.VITE_API_URL,
    ENV: "development",
}

export default config;