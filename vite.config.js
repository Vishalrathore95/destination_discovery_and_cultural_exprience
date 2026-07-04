import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Inject process.env for compatibility with create-react-app style files
  const processEnv = {};
  Object.keys(env).forEach((key) => {
    if (key.startsWith('REACT_APP_')) {
      processEnv[key] = env[key];
    }
  });

  return {
    plugins: [react()],
    root: '.',
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      'process.env': processEnv
    },
    resolve: {
      alias: {
        // Use CJS build to avoid ESM/Rollup icon resolution bug with special chars in path
        'lucide-react': 'lucide-react/dist/cjs/lucide-react.js',
      }
    },
    server: {
      port: 3000,
      open: true
    }
  };
});
