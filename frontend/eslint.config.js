import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'
export default tseslint.config({ignores:['node_modules/**','build/**','src/pages/phoneVerification/components/PhoneEntry.jsx']},...tseslint.configs.recommended,{files:['src/**/*.{ts,tsx}'],plugins:{'react-hooks':hooks},rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}],'@typescript-eslint/no-explicit-any':'error','react-hooks/rules-of-hooks':'error'}})
