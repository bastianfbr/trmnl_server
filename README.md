# 🖥️ BYOS Next — TRMNL Build Your Own Server

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/github/license/usetrmnl/byos_next)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/usetrmnl/byos_next/pulls)

> Un serveur Next.js open-source pour piloter des écrans e-ink [TRMNL](https://usetrmnl.com) — gestion de devices, playlists, rendu BMP à la demande, et recettes personnalisées.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusetrmnl%2Fbyos_next&env=AUTH_ENABLED&envDefaults=%7B%22AUTH_ENABLED%22%3A%22false%22%7D&envDescription=User%20authentication%20is%20disabled.&envLink=https%3A%2F%2Fgithub.com%2Fusetrmnl%2Fbyos_next%3Ftab%3Dreadme-ov-file&project-name=byos-next&repository-name=byos_next&demo-title=BYOS%20NextJS&demo-description=BYOS%20(Build%20Your%20Own%20Server)%20Next.js%2C%20TRMNL%20server%20with%20local%20recipe%20rendering%20and%20cloud%20proxy%20support.&demo-url=https%3A%2F%2Fbyos-next-demo.vercel.app&demo-image=https%3A%2F%2Fusetrmnl.com%2Fimages%2Fbrand%2Ficons%2Ficon--brand.svg&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%2C%22group%22%3A%22postgres%22%7D%5D)

---

## 📋 Sommaire

- [🖥️ BYOS Next — TRMNL Build Your Own Server](#️-byos-next--trmnl-build-your-own-server)
  - [📋 Sommaire](#-sommaire)
  - [💡 C'est quoi BYOS ?](#-cest-quoi-byos-)
  - [✨ Fonctionnalités](#-fonctionnalités)
  - [🌿 reTerminal E1001 — Le setup e-ink parfait](#-reterminal-e1001--le-setup-e-ink-parfait)
  - [🌦️ StarMeteo — La recette météo phare](#️-starmeteo--la-recette-météo-phare)
    - [💡 L'idée](#-lidée)
    - [⚙️ Fonctionnement](#️-fonctionnement)
    - [🗂️ Structure de la recette](#️-structure-de-la-recette)
    - [🌐 Source de données météo](#-source-de-données-météo)
  - [🚀 Quickstart](#-quickstart)
    - [Déployer sur Vercel](#déployer-sur-vercel)
    - [Lancer avec Docker Compose](#lancer-avec-docker-compose)
    - [Lancer en local](#lancer-en-local)
  - [🔧 Variables d'environnement](#-variables-denvironnement)
    - [Renderer Options](#renderer-options)
    - [Database Options](#database-options)
  - [📁 Structure du projet](#-structure-du-projet)
  - [🎞️ Playlists](#️-playlists)
  - [🧪 Recettes (Recipes)](#-recettes-recipes)
  - [📖 Documentation](#-documentation)
  - [📄 Licence](#-licence)

---

## 💡 C'est quoi BYOS ?

**BYOS** *(Build Your Own Server)* est une alternative open-source au cloud TRMNL. Il te permet d'héberger toi-même le serveur qui pilote tes écrans e-ink TRMNL, sans dépendre de l'infrastructure officielle.

Ce repo est une implémentation **Next.js 16 / React 19** du protocole BYOS. Il gère :

- 📡 L'enregistrement et le suivi de tes devices TRMNL (par MAC address & clé API)
- 🖼️ Le rendu à la demande en **BMP 1-bit** pour l'affichage e-ink
- 📅 La rotation automatique des écrans via un système de **playlists**
- 🧪 Une galerie de **recettes** pour prototyper et tester des écrans

---

## ✨ Fonctionnalités

| Feature | Description |
|---|---|
| 🖨️ **Rendu BMP** | Génération de bitmaps 1-bit via Takumi/Satori, avec cache et revalidation |
| 📱 **Gestion devices** | Enregistrement MAC/API key, statut, logs, refresh scheduling |
| 📅 **Playlists** | Rotation d'écrans par heure, jour de semaine, durée, assignée par device |
| 🧪 **Galerie recipes** | Prototypage d'écrans avec comparaison rendu direct vs BMP |
| 🐳 **Docker** | Docker Compose pour app + Postgres ; prêt pour le déploiement Vercel |
| 🔐 **Auth optionnelle** | Mode mono-utilisateur ou multi-utilisateurs avec Better Auth |
| 📦 **No-DB mode** | Preview des écrans sans base de données |

---

## 🌿 reTerminal E1001 — Le setup e-ink parfait

Le [**Seeed Studio reTerminal E1001**](https://www.seeedstudio.com/reTerminal-E1001-p-6534.html) est un écran ePaper monochrome **7.5 pouces** open-source, propulsé par un **ESP32-S3**, avec jusqu'à **3 mois d'autonomie** sur batterie.

Dans ce projet, il est utilisé comme **device TRMNL autonome** :

```
┌────────────────────────────────────────┐
│        reTerminal E1001                │
│  ┌─────────────────────────────────┐   │
│  │  Écran ePaper 7.5" monochrome   │   │
│  │  Rafraîchissement toutes        │   │
│  │  les X minutes selon playlist   │   │
│  └─────────────────────────────────┘   │
│  ESP32-S3 + WiFi + batterie 3 mois     │
└─────────────────┬──────────────────────┘
                  │ HTTP polling
                  ▼
┌────────────────────────────────────────┐
│       BYOS Next (ce serveur)           │
│  - Authentifie le device               │
│  - Calcule l'écran courant             │
│  - Renvoie le BMP 1-bit               │
└────────────────────────────────────────┘
```

**Pourquoi le reTerminal E1001 ?**
- 🔋 Jusqu'à **3 mois d'autonomie** sur batterie — parfait pour un affichage ambiant
- 📶 WiFi natif via ESP32-S3
- 🖥️ Écran **7.5" monochrome** haute qualité, sans rétroéclairage
- 🔧 Compatible nativement TRMNL, Home Assistant, Arduino, ESP-IDF
- 🎨 Idéal pour météo, agenda, tableaux de bord, affichage bureau

---

## 🌦️ StarMeteo — La recette météo phare

### 💡 L'idée

**StarMeteo** est une recette e-ink inspirée des stations météo **La Crosse Technology** des années 2000, notamment leurs affichages e-ink segmentés avec police LCD et icônes 1-bit.

L'objectif : recréer l'esthétique rétro d'une station météo physique — avec des chiffres segmentés, une sonde de température externe, et les prévisions sur 4 jours — directement sur l'écran TRMNL.

![StarMeteo preview](docs/screenshots/dashboard.png)

### ⚙️ Fonctionnement

StarMeteo affiche en temps réel :

| Zone | Contenu |
|---|---|
| 🌡️ **Haut gauche** | Température max du jour (police segmentée géante) |
| 🌡️ **Haut droite** | Température min du jour |
| ☀️ **Centre** | Icône météo du moment (soleil, nuage, pluie, neige, orage) |
| 🕐 **Milieu** | Heure locale (format 24h) |
| 📡 **Sonde ext.** | Température actuelle précise (1 décimale, style "sonde externe") |
| 📅 **Bas** | Prévisions J+1, J+2, J+3 avec icône + min/max |

Les données sont **mises en cache 15 minutes** côté serveur pour éviter les appels API répétés.

### 🗂️ Structure de la recette

```
app/(app)/recipes/screens/starmeteo/
├── getData.ts        # Fetching météo + géocodage + cache
└── starmeteo.tsx     # Composant React (rendu e-ink 1-bit)
```

**Paramètres acceptés :**

```ts
type StarMeteoParams = {
  location?: string;   // Nom de ville (ex: "Paris")
  latitude?: number;   // Coordonnées GPS directes
  longitude?: number;
};
```

Si aucun paramètre n'est fourni, **Paris** est utilisé par défaut.

**Rendu de la température :**
- Températures max/min : arrondies à l'entier (style affichage LCD)
- Température sonde : 1 décimale (ex: `17.3°`) pour imiter une vraie sonde externe

**Icônes météo (1-bit) :** `sun` · `sun-cloud` · `cloud` · `rain` · `snow` · `thunder`

### 🌐 Source de données météo

StarMeteo utilise **[Open-Meteo](https://open-meteo.com/)** — une API météo gratuite, open-source, sans clé API requise.

**Stratégie de fetch à double modèle :**

Pour maximiser la précision tout en couvrant 4 jours de prévisions, deux requêtes sont faites **en parallèle** :

```
┌─────────────────────────────────────────────────────┐
│  Promise.all([                                       │
│    fetch(Open-Meteo + models=meteofrance_arome_hd)  │  ← AROME HD (1.5km)
│    fetch(Open-Meteo)                                │  ← Modèle auto
│  ])                                                  │
└─────────────────────────────────────────────────────┘
         │                         │
         ▼                         ▼
  Aujourd'hui + Demain        JOUR 3 + JOUR 4
  (AROME HD si dispo,         (modèle auto,
   sinon fallback auto)        couverture 7j+)
```

| Modèle | Résolution | Couverture temporelle | Usage |
|---|---|---|---|
| `meteofrance_arome_france_hd` | **1.5 km** | ~51h (~2 jours) | Aujourd'hui + Demain |
| Auto Open-Meteo | ~10 km | 7 jours+ | JOUR 3 & JOUR 4 |

> **Pourquoi AROME HD ?** C'est le modèle le plus précis disponible pour la France, produit par Météo-France. Open-Meteo l'ingère et le rend disponible gratuitement via son API.

**Géocodage :** si une ville est passée en paramètre (ex: `"Lyon"`), Open-Meteo Geocoding API (`geocoding-api.open-meteo.com`) est utilisé pour résoudre les coordonnées GPS avant le fetch météo.

---

## 🚀 Quickstart

### Déployer sur Vercel

1. Clique le bouton Vercel ci-dessus
2. Lie un projet Supabase ou Neon quand c'est demandé
3. Déploie, ouvre l'app et initialise les tables
4. Pointe ton device TRMNL sur l'URL déployée
5. Sync les variables d'env en local avec `vercel link` et `vercel env pull`

### Lancer avec Docker Compose

1. Copie `.env.example` vers `.env` et remplis les valeurs :
   ```
   POSTGRES_PASSWORD=your_password
   BETTER_AUTH_SECRET=a_random_32_character_secret
   ```
   > Génère un secret avec `openssl rand -base64 32`

2. Lance le stack :
   ```bash
   docker-compose up -d
   # → http://localhost:3000
   ```

3. *(Optionnel)* Renderer navigateur pour une compatibilité pixel-perfect avec TRMNL Framework UI :
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.browser.yml up -d
   ```

### Lancer en local

```bash
git clone https://github.com/usetrmnl/byos_next
cd byos_next
pnpm install
pnpm dev
# → http://localhost:3000
```

Lint & format :
```bash
pnpm lint
```

---

## 🔧 Variables d'environnement

Crée `.env.local` (pour `pnpm dev`) ou `.env` (pour Docker Compose). Voir `.env.example` pour la liste complète.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chaîne de connexion Postgres |
| `POSTGRES_PASSWORD` | Utilisé par Docker Compose pour bootstrapper Postgres |
| `BETTER_AUTH_SECRET` | Requis si `AUTH_ENABLED=true`. Génère avec `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | URL publique du déploiement (défaut : `http://localhost:3000`) |
| `AUTH_ENABLED` | `false` pour désactiver l'auth (mode mono-utilisateur) |
| `ADMIN_EMAIL` | Email qui reçoit le rôle admin à la première inscription |
| `REACT_RENDERER` | `takumi` (défaut), `satori`, ou `browser` |
| `ENABLE_EXTERNAL_CATALOG` | Permet de charger le catalogue communautaire TRMNL |

### Renderer Options

| Renderer | Description |
|---|---|
| `takumi` | ⚡ Renderer Rust rapide, compatible Satori (défaut) |
| `satori` | Renderer Vercel Satori original |
| `browser` | 🖥️ Chrome headless via `puppeteer-core` — pixel-perfect avec TRMNL Framework UI. Nécessite `docker-compose.browser.yml` ou `BROWSER_URL` vers un endpoint Chrome DevTools |

### Database Options

- **Supabase / Neon** : lance les migrations dans `migrations/` dans l'ordre, ou utilise le bouton Initialize dans l'app.
  > ⚠️ La migration `0009_add_user_tenancy.sql` suppose un rôle superuser `postgres`. Sur les providers managés, édite `GRANT byos_app TO <your_role>` avant de la lancer (voir [#46](https://github.com/usetrmnl/byos_next/issues/46)).
- **Docker/Postgres** : définis `POSTGRES_PASSWORD` et `BETTER_AUTH_SECRET` dans `.env`, puis `docker-compose up -d`.
- **No-DB mode** : lance `pnpm dev` sans variables DB pour preview uniquement (gestion devices désactivée).

---

## 📁 Structure du projet

```
byos_next/
├── app/
│   └── (app)/
│       ├── recipes/
│       │   ├── screens/           # Recettes e-ink
│       │   │   ├── starmeteo/     # ⭐ Recipe StarMeteo
│       │   │   │   ├── getData.ts
│       │   │   │   └── starmeteo.tsx
│       │   │   └── ...
│       └── ...
├── components/                    # Composants UI partagés
├── lib/                           # Helpers rendering, cache, device logic
├── migrations/                    # Migrations SQL Postgres
├── public/                        # Assets statiques
├── scripts/                       # Scripts utilitaires
├── docs/                          # Documentation & screenshots
│   ├── api.md
│   └── recipes.md
└── docker-compose.yml
```

---

## 🎞️ Playlists

Le système de playlists permet de programmer la rotation automatique des écrans par device :

- ⏰ Règles par **heure** et **jour de la semaine**
- ⏱️ **Durée** d'affichage personnalisable par écran
- 📱 **Assignation** par device
- 🔄 Mode playlist activable/désactivable par device dans l'UI

---

## 🧪 Recettes (Recipes)

La galerie `/recipes` permet de parcourir et tester des écrans avant de les déployer sur un device physique.

**Créer une nouvelle recette :**

```bash
# 1. Créer un dossier
mkdir app/(app)/recipes/screens/ma-recette

# 2. Ajouter le composant (doit exporter `definition`) et la logique de fetch
touch app/(app)/recipes/screens/ma-recette/getData.ts
touch app/(app)/recipes/screens/ma-recette/ma-recette.tsx

# 3. Régénérer l'index (scan automatique du dossier screens/)
pnpm generate:recipes
```

Voir [`docs/recipes.md`](docs/recipes.md) pour la documentation complète.

---

## 📖 Documentation

| Document | Contenu |
|---|---|
| [`docs/api.md`](docs/api.md) | Référence des endpoints HTTP et payloads |
| [`docs/recipes.md`](docs/recipes.md) | Guide des recettes |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Guide de contribution |

---

## 📄 Licence

MIT — voir [`LICENSE`](LICENSE).

---

<div align="center">
  <sub>Made with ❤️ for the TRMNL community · Powered by Next.js, Open-Meteo & Météo-France</sub>
</div>
