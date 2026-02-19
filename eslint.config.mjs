import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        ignores: ["**/*.config.mjs", "next.config.mjs", ".next/**", "node_modules/**"],
        languageOptions: {
            globals: {
                console: "readonly",
                process: "readonly",
                module: "readonly",
                require: "readonly",
                window: "readonly",
                document: "readonly",
                fetch: "readonly",
                localStorage: "readonly",
                FormData: "readonly",
                Request: "readonly",
                Response: "readonly",
                FileReader: "readonly",
            }
        }
    }
];
