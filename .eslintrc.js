module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module",
        "project": "tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "max-len": 0,
        "no-console": 0,
        "comma-dangle": 0,
        "quote-props": 0,
        "no-string-throw": 0,
    }
};
