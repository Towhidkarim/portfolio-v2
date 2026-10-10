# Copy and content data

Exact strings used in the approved design. Items in `[brackets]` are placeholders that come from the database (projects) or from live services. Items marked **owner to confirm** are not final.

## Global

- Site title: `TowhidKarim | Portfolio` (unchanged)
- Meta description: `Portfolio` today. **Owner to confirm** a better sentence; suggestion: `Towhid Karim, full-stack engineer. React, Next.js, TypeScript and AI-native workflows.`
- Canonical host: set once the custom domain exists (`02` and R-17).
- Google site verification meta (keep): `Tw-2CbT7VPlr65XdSv95FvPmSVgTPbm7mVIBGxUYn3Y`
- OG image: `/opengraph-image.png` (`app/opengraph-image.png` today) with alt text from `opengraph-image.alt.txt`.
- Resume links (from `lib/constants.ts`):
  - preview `https://drive.google.com/file/d/1V4gZ9QlCVPAIJSlIguyUdw0F9NiC78nw/view`
  - download `https://drive.google.com/uc?export=download&id=1V4gZ9QlCVPAIJSlIguyUdw0F9NiC78nw` (file name `Towhid_karim_resume.pdf`)

## Navbar

Logo: `<Towhid/Karim>`. Links: Home, Skills, Projects, About me, Contact. Right: GitHub icon button (`https://github.com/Towhidkarim/`), theme toggle, primary button `Contact me` (links to `#contact`).

## Hero

- Status pill: `Software Engineer at Chorcha` | `Rajshahi` + live time `HH:MM` (Asia/Dhaka, computed in the browser after mount; server renders `--:--`)
- `Hello there! I'm`
- H1: `Towhid Karim`
- Role line (typewriter, two phrases): `A Full-Stack Engineer`, then `Crafting Scalable Apps with React & Next.js`
- Paragraph: `I'm a full-stack engineer passionate about building high performant applications and solving problems with elegant solutions.` (the typo "solutoins" in the old site is fixed)
- Buttons: `Preview Resume` (primary, eye icon), `Download Resume` (secondary, download icon)
- Illustration: `public/images/hero.svg`, alt text empty (decorative)
- Floating chips: React, Tailwind CSS, Next.js, TypeScript icons

## Proof strip (four cells)

| Value | Label | Detail |
| --- | --- | --- |
| `Chorcha` (live dot) | Software Engineer | Full-stack and mobile, since December 2025 |
| `3-5x` | Shipping velocity | with AI-native workflows in Cursor |
| `75+` | Employees served | by an in-house attendance system I built |
| `3.99` | CGPA of 4.00 | BSc in CSE, Varendra University |

## Stack marquee (order)

React, Next.js, TypeScript, Tailwind CSS, TanStack Query, TanStack Start, Zustand, Node.js, Bun, Hono, Cloudflare Workers, Redis, Drizzle ORM, Prisma, PostgreSQL, Docker, Cloudflare, Claude, Codex, Cursor, Vercel AI SDK, Python. (Redis and Turso are still skills on the site even though the new stack replaces them in production.)

## Skills section

Eyebrow `01 · The stack`, H2 `Skills`, sub `The tools I reach for, grouped by where they sit in a product.`

| Card | Count label | Items (icon file in `public/icons`) |
| --- | --- | --- |
| Front End | 08 | React (`React.svg`), Next.js (`nextjs-icon.svg`), React Native (`reactnative.svg`), TypeScript (`TypeScript.svg`), Tailwind CSS (`Tailwind CSS.svg`), TanStack Query (`tanstack.png`), Zustand (`zustand.jpg`), shadcn/ui (`shadcn.png`) |
| Back End | 06 | Node.js (`Node.js.svg`), Bun (`Bun.svg`), Express (`express.png`), Hono (`hono.svg`), Cloudflare Workers (`cloudflareworkers.svg`), Redis (`redis.webp`) |
| Database & ORMs | 05 | Drizzle ORM (`drizzle.png`), Prisma (`prisma.png`), PostgreSQL (`postgresql.png`), MongoDB (`mongo.webp`), Turso (`turso.png`) |
| AI (dark card) | 05 | Vercel AI SDK (`vercel.svg`), Python (`Python.svg`), LLM workflows (lucide `Brain`), RAG (lucide `Library`), Agentic loops (lucide `Bot`) |
| Tools & DevOps | 06 | Git (`git.svg`), GitHub (`github.png`), GitHub Actions (`githubactions.svg`), Docker (`docker.png`), Cloudflare (`cloudflare.svg`), Cursor (`cursor.png`) |

AI card sub: `Models in the loop, from first prompt to reviewed code.` Loop pills: Prompt, Plan, Build, Review.

Core principles (label `Core principles I deliver`): AI-Native Velocity (Sparkles), Type-Safe Reliability (ShieldCheck), Scalable Systems Design (Layers), Real-World Impact (Target).

Data lives in `src/content/skills.ts` (typed), not in JSX.

## Projects section

Eyebrow `02 · Selected work`, H2 `My Projects`, sub `What I have built and shipped. Every card opens a full write-up.` (**owner to confirm**).

Card content comes from the `project` table: `projectName`, `summary`, `tags` (pills), `imgUrl`, `demoLink`, `sourceLink`, `description` (detail page). Buttons: `View Details` (primary, always visible), `Live demo`, GitHub icon button (label `Source code`). Featured = highest `displayIndex`. Section footer button: `View all projects`.

Placeholders in the design: `[Project name]`, `[One line on what it does and who it is for.]`, `[project-url]`.

Open-source activity card: title `Open-source activity`, line `[N] contributions in the last year, live from GitHub`, button `Towhidkarim` (GitHub profile). Data source for the heatmap: **owner to confirm** (GitHub GraphQL contributions with a token, or a public contributions API); cached at the edge, refreshed on a schedule. The heatmap in the design is illustrative.

States: loading skeleton (3 cards), empty `No projects yet.`, error `Projects could not be loaded. Try again.` with a Retry button.

## Education section

Eyebrow `03 · Academics`, H2 `Education`, sub `My academic journey and achievements.`

1. **BSc in Computer Science & Engineering**, Varendra University, 2022 - 2026, badge `Top of the class`, `3.99` `/ 4.00 CGPA`, progress 99.75 %, line `Graduated with honors`, pills Data Structures, OOP, Databases, Software Eng., Machine Learning, `+3 more`. Full coursework (modal or detail): Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Software Engineering, Computer Networks, Web Development, Machine Learning, Operating Systems.
2. **Next Level Web Development, Level 2**, Programming Hero, Batch 5, badge `Top performer`, `100%` `on all assignments`, progress 100 %, line `Top performer in Batch 5`, pills TypeScript, Next.js, Node.js, PostgreSQL, Docker, `+4 more` (full: TypeScript, Next.js, Node.js, Express, PostgreSQL, Prisma, MongoDB, Redux, Docker). Certificate link: `https://web.programming-hero.com/verification?validationNumber=PHL2B5L2B5-00611098`.

## About section

Eyebrow `04 · The person`, H2 `About Me`, sub `A little about who is behind the code.`

- Paragraph 1: `I'm a passionate web developer with a knack for transforming innovative ideas into functional and visually captivating digital experiences. My coding journey started with a fascination for how logic could bring pixels to life.`
- Paragraph 2: `With a solid foundation in React, Next.js, and Tailwind, I create responsive user interfaces and seamless user experiences, blending aesthetics with functionality. As an avid problem solver, I thrive on tackling new challenges head-on. When not coding, I explore the latest design trends or brainstorm my next project over a cup of coffee.`
- Dropped from the old site: `Welcome to my portfolio, where I showcase my dedication and passion for web development.`
- Facts grid: Name `Towhid Karim`; Status `Software Engineer at Chorcha`; Education `BSc in CSE`; Focus `Full-stack, AI-native` (**owner to confirm**; replaces `Experience: Adept`).
- Photo: `public/images/dp.jpg` (720x960), alt `Portrait of Towhid Karim`, overlay chip `Rajshahi, Bangladesh`.
- Buttons: `Github` (`https://github.com/Towhidkarim/`), `Facebook` (`https://fb.me/towhid.karim.1`).

## Contact band (always dark)

Eyebrow `05 · Contact`, H2 `Get in Touch`, sub `Have a role or a project in mind? Send a message and I will get back to you.` (**owner to confirm**; old copy: `Send me a message, give me feedbacks or whatever you may like`).

Rows: `towhidkarim123@gmail.com` (with copy button, label `Copy email address`), `Rajshahi, Bangladesh`, `+880 1744-161517`. Social buttons: GitHub, Facebook.

Form: Name (`Your name`), Email (`you@company.com`), Message (`How can I help?`), submit `Send message`. Toasts: success `Message sent` / description `Thanks, I will reply soon.`; error `Could not send` / description from the server. (Old typo `Succes!` is gone.)

## Footer

`© 2026 Towhid Karim` | `BSc in CSE • CGPA 3.99 • Class of 2026` | `Back to top`.

> Updated 2026-10-11 (owner): not open to work, now Software Engineer at Chorcha (since December 2025); proof strip replaced; TanStack Start added to Front End; Claude and Codex added to Tools & DevOps before Cursor.
