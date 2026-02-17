<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zscCPOBqzpFfMTBnK8b-bucqCYe6RxZe

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
Para sacar tu proyecto React/Vite de GitHub a APK, los pasos son:


/ ***** PASAR A APK para mañana ******  /
1. Clonar y generar el build web
En tu PC:

Clona el repo y entra:

bash
git clone TU_REPO_URL
cd TU_REPO
Instala dependencias y genera dist:

bash
npm install
npm run build
Esto crea la carpeta dist con tu app estática.
​

2. Añadir Capacitor al proyecto
Instala Capacitor:

bash
npm install @capacitor/core @capacitor/cli --save
Inicializa Capacitor:

bash
npx cap init scanner-clientes com.tuempresa.scannerclientes
Nombre app: por ejemplo Scanner Clientes JG.

App ID: com.tuempresa.scannerclientes.
​

Configura capacitor.config.(ts|json) para usar dist:

Si es capacitor.config.ts:

ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuempresa.scannerclientes',
  appName: 'Scanner Clientes JG',
  webDir: 'dist',
  bundledWebRuntime: false,
};

export default config;
3. Añadir plataforma Android
Añade Android:

bash
npx cap add android
Copia el build web dentro del proyecto nativo:

bash
npm run build
npx cap copy
Abre en Android Studio:

bash
npx cap open android
Ahí ya puedes lanzar en emulador/móvil y generar el APK desde Build > Generate Signed Bundle / APK.
​

Si me dices qué SO usas (Windows/Linux/macOS), te detallo el paso de instalar Android Studio y dónde hacer clic para sacar el APK.
