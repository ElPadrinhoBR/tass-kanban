<div align="center">

<img src="banner.png" alt="TASS Kanban — Simulador Ágil con Agentes Autónomos de IA" width="100%"/>

<br/>

[![English](https://img.shields.io/badge/🇺🇸-English-blue?style=flat-square)](./README.md)
[![Português](https://img.shields.io/badge/🇧🇷-Português-green?style=flat-square)](./README-PT.md)
[![Español](https://img.shields.io/badge/🇪🇸-Español-red?style=flat-square)](./README-ES.md)

<br/>

[![Demo en Vivo](https://img.shields.io/badge/🎮_Demo_en_Vivo-Jugar_Ahora-emerald?style=for-the-badge)](https://elpadrinhobr.github.io/tass-kanban/)
[![GitHub Stars](https://img.shields.io/github/stars/ElPadrinhoBR/tass-kanban?style=for-the-badge&logo=github&color=gold)](https://github.com/ElPadrinhoBR/tass-kanban/stargazers)
[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-blue?style=for-the-badge)](./LICENSE)

<br/>

[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS_3-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![i18n](https://img.shields.io/badge/i18n-PT_EN_ES-orange?style=flat-square)](./src/i18n)

</div>

---

## ⚡ Descripción General

**TASS Kanban** es un **simulador de vuelo interactivo para equipos ágiles, Scrum Masters y Tech Leaders** — impulsado por cuatro agentes autónomos de IA que piensan, debaten, se bloquean mutuamente y toman decisiones reales de ingeniería de software en tiempo real.

> *Deja de leer teoría. Empieza a tomar decisiones.*

En lugar de un tutorial pasivo, TASS te pone al mando de un Sprint completo. Tu squad tiene mente propia — abren PRs, debaten opciones de arquitectura, reportan bugs críticos y crean dilemas éticos que solo tú puedes resolver. Cada decisión que tomas otorga XP y da forma a tu **carrera como Scrum Master**.

**🎮 [Acceder al Demo en Vivo — Sin Instalación](https://elpadrinhobr.github.io/tass-kanban/)**

---

## 🤖 Los Cuatro Agentes Autónomos

Cada agente ejecuta un **motor de comportamiento independiente** con personalidad, memoria y heurísticas profesionales. Interactúan entre sí y reaccionan a tus decisiones:

| Agente | Rol | Comportamientos y Disparadores |
|:---:|:---|:---|
| 👩‍💼 **Ana Oliveira** | Product Owner | Prioriza el backlog, negocia el alcance, cuestiona las estimaciones de velocidad |
| 👨‍💻 **Carlos Silva** | Full-Stack Dev | Abre PRs, introduce deuda técnica, provoca debates de arquitectura |
| 👨‍🏫 **Marcos Souza** | Tech Lead | Impone calidad de código, bloquea merges, propone Spikes técnicos |
| 🧪 **Júlia Lima** | QA Engineer | Reporta bugs críticos, cuestiona criterios de aceptación, bloquea releases |

---

## 🏗️ Arquitectura y Motor de Simulación

```mermaid
graph TD
    subgraph Agentes["🤖 Squad de Agentes Autónomos"]
        PO["👩‍💼 Ana — Product Owner"]
        DEV["👨‍💻 Carlos — Full-Stack Dev"]
        TL["👨‍🏫 Marcos — Tech Lead"]
        QA["🧪 Júlia — QA Engineer"]
    end

    subgraph Engine["⚙️ Motor de Simulación (GeminiBrain)"]
        TICK["Tick Loop (1x / 2x / 5x / 10x)"]
        DILEMMA["Generador Heurístico de Dilemas"]
        MEMORY["Registro Auditable (SimulationMemory)"]
        EFFECTS["Procesador de BoardEffects"]
    end

    subgraph Player["🎯 Tú — Scrum Master"]
        BOARD["Tablero Kanban (Límites WIP)"]
        CHAT["Chat Corporativo (Teams / Slack)"]
        CAREER["Árbol de Carrera y XP"]
    end

    PO -->|"Crea y refina historias"| BOARD
    DEV -->|"Toma cards, abre PRs"| BOARD
    DEV <-->|"Genera debates técnicos"| TL
    QA -->|"Reporta bugs, bloquea releases"| DEV
    DILEMMA -->|"Dispara alerta en el Chat"| CHAT
    CHAT -->|"Tu decisión se aplica"| CAREER
    CAREER -->|"Afecta moral y velocidad"| TICK
    EFFECTS -->|"Mueve / crea / divide cards"| BOARD
    MEMORY -->|"Almacena eventos cronológicamente"| MEMORY
```

---

## ✨ Funcionalidades

| Categoría | Capacidad |
|:---|:---|
| 🎮 **Gameplay** | Simulación de Sprint con velocidad configurable (1x, 2x, 5x, 10x) |
| 🤖 **IA Autónoma** | 4 agentes con personalidades independientes y lógica de comportamiento |
| 💬 **Chat Corporativo** | Interfaz estilo Slack / Teams con 4 canales dedicados |
| ⚡ **Motor de Dilemas** | Desafíos de decisión del Scrum Master en tiempo real con recompensa XP |
| 🏆 **Progresión de Carrera** | Escalera gamificada de 10 niveles del Aprendiz al Agile Coach |
| 🎨 **Temas Visuales** | 5 temas corporativos profesionales (Trello Blue, Jira, Linear, Nordic, Midnight Pro) |
| 🌐 **Multilingüe** | Soporte completo para Portugués 🇧🇷, Inglés 🇺🇸 y Español 🇪🇸 |
| 📋 **Tablero Kanban** | Drag-and-drop con límites WIP, story points y categorías |
| 📊 **Métricas Ágiles** | Monitoreo en tiempo real de velocidad, moral y riesgo del sprint |
| 🔍 **Glosario Ágil** | Más de 60 términos con tooltips interactivos sensibles al contexto |
| 📝 **Registro de Auditoría** | Historial de decisiones descargable para uso en retrospectivas |
| 🌙 **Modo Daily Scrum** | Simulación de reloj en tiempo real con evento Daily a las 18h |

---

## 🎮 Dinámica de Juego

| Situación | Qué Ocurre |
|:---|:---|
| Carlos abre un PR con deuda técnica | Marcos bloquea el merge; decides aceptarlo o exigir una refactorización |
| El backlog se desborda (límite WIP violado) | Ana exige recortes de prioridad; tu elección impacta la velocidad |
| Júlia reporta un bug de severidad 1 | Sprint en riesgo; eliges entre un hotfix inmediato o posponer |
| La moral del equipo cae por debajo del 60% | Pausa de café o retrospectiva: tu liderazgo restaura el espíritu del equipo |
| Conflicto de arquitectura (Redis vs. Postgres) | Standstill de 3h; medias con un Spike Timebox o un comando directo |

Cada decisión se categoriza como:
- 🟦 **Liderazgo de Servicio** — colaborativo, alta recompensa XP
- 🟨 **Trade-off Pragmático** — equilibrado, XP medio
- 🟥 **Anti-Patrón** — autoritario o evasivo, penalización XP

---

## 🚀 Guía de Instalación

### Requisitos
- Node.js ≥ 18
- npm ≥ 9

### Ejecutar Localmente
```bash
# 1. Clonar
git clone https://github.com/ElPadrinhoBR/tass-kanban.git
cd tass-kanban

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La app se abrirá en **http://localhost:5173**

### Build de Producción
```bash
npm run build
npm run preview
```

### Desplegar en GitHub Pages
```bash
npm run deploy
```

---

## 🤝 Cómo Contribuir

¡Las contribuciones son bienvenidas! Lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de empezar.

```bash
# Fork → clonar → crear rama de funcionalidad
git checkout -b feat/mi-funcionalidad
# Commit siguiendo Conventional Commits
git commit -m "feat: agregar mi funcionalidad"
# Abrir Pull Request
```

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** — ver [LICENSE](./LICENSE) para más detalles.

---

## 👤 Autor

Desarrollado con pasión por **Roberto (El Padrinho)** — Estudiante de Gestión de Tecnologías de la Información (TI), entusiasta de metodologías ágiles (Scrum / Kanban) y futuro líder técnico.

- GitHub: [@ElPadrinhoBR](https://github.com/ElPadrinhoBR)
- Proyecto: [TASS Kanban](https://github.com/ElPadrinhoBR/tass-kanban)

---

<div align="center">

**Hecho con ❤️ para la comunidad Ágil global**

⭐ ¡Si TASS te ayudó a formar mejores Scrum Masters, por favor dale una estrella!

[![GitHub Stars](https://img.shields.io/github/stars/ElPadrinhoBR/tass-kanban?style=social)](https://github.com/ElPadrinhoBR/tass-kanban/stargazers)

</div>
