# Journal de version — Visuals.co Client (`myvisuals-client`)

Toutes les évolutions notables de l'application front sont consignées ici.

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).
Versionnage : [Semantic Versioning](https://semver.org/lang/fr/).

> Le backend est versionné séparément
> ([`myvisuals-back`](https://github.com/flavienderoy/myvisuals-back/blob/main/CHANGELOG.md)) :
> chaînes de déploiement distinctes (Vercel / Cloud Run), publications
> indépendantes. Les versions à déployer conjointement sont signalées.

---

## [Non publié]

_Rien pour le moment._

---

## [1.8.0] — 2026-08-14

### Ajouté

- **Suivi d'erreurs applicatives** (Sentry), activé par la seule présence de
  `VITE_SENTRY_DSN`. Capture les exceptions React remontées par
  l'`ErrorBoundary`, avec rejeu de session limité aux sessions en erreur.
  Sans DSN : no-op complet, aucune requête réseau.
- **Référence d'incident `INC-…`** affichée par l'écran d'erreur, copiable en
  un clic. Sert de clé de corrélation entre le signalement de l'utilisateur et
  l'événement enregistré côté supervision — pendant de l'en-tête
  `X-Request-Id` de l'API.
- Version applicative injectée au build (`__APP_VERSION__`), utilisée comme
  *release* Sentry : chaque erreur est rattachable à une entrée de ce journal.

### Sécurité

- **19 vulnérabilités de dépendances corrigées** (1 *critical*, 14 *high*,
  3 *moderate*, 1 *low*). Toutes résolues par des montées de version
  compatibles. Résultat : `npm audit` → 0 vulnérabilité.
- **`npm audit --audit-level=high` bloquant** dans la chaîne d'intégration
  continue, et bloquant avant le déploiement Vercel.
- **Dependabot** (`.github/dependabot.yml`) — suivi hebdomadaire des
  dépendances npm et mensuel des actions GitHub. React et React DOM sont
  explicitement exclus des montées majeures automatiques : elles imposent une
  campagne de test complète.
- **Contrôle du journal de version** (`scripts/check-changelog.cjs`) —
  interdit toute divergence entre `package.json` et ce fichier.

### Corrigé

- **Message d'erreur mensonger** — l'écran d'erreur affichait « Nos équipes ont
  été notifiées » alors qu'aucun mécanisme de notification n'existait. Le
  message est désormais conditionné à l'activation réelle de la sonde ; à
  défaut, il invite à communiquer la référence d'incident au support.
- L'`ErrorBoundary` utilisait `process.env.NODE_ENV`, non idiomatique côté
  Vite ; remplacé par `import.meta.env.DEV`.

### Modifié

- Trois tests supplémentaires sur l'`ErrorBoundary` (référence d'incident,
  exactitude du message, réinitialisation) — 75 tests au total.

---

## [1.7.1] — 2026-07-24

### Corrigé

- Ajustements d'affichage sur petits écrans et composant `Loader` manquant
  (`d15a6ec`).

---

## [1.7.0] — 2026-07-23

### Ajouté

- Parcours de mot de passe oublié et de réinitialisation (`9671145`).
- Retour visuel en temps réel sur la robustesse du mot de passe (`93ca8df`).

### Corrigé

- **[ANO-2026-003](https://github.com/flavienderoy/myvisuals-back/blob/main/docs/anomalies/ANO-2026-003.md)
  — Inscription Studio créant un compte Client** (S2, signalée par le support
  client). Volet front : charge utile d'inscription explicite (`7798ec2`),
  résolution du rôle fiabilisée (`93ca8df`), connexion automatique après
  inscription afin qu'une session antérieure ne prenne pas le pas sur la
  nouvelle (`e347c50`).

  > ⚠️ À déployer conjointement avec l'API `1.5.1`.

- Sélecteurs et attentes des tests d'interface alignés sur les composants
  `Modal` et `UserProfileMenu` (`8645c66`).

---

## [1.6.0] — 2026-07-21

### Ajouté

- Affectation à la création et glisser-déposer vers les dossiers (`b95dc70`).

### Corrigé

- Assainissement des variables d'environnement Vercel : guillemets et retours à
  la ligne parasites, valeurs de repli valides pour l'URL Supabase, la clé
  anonyme et l'URL de l'API (`09217b1`, `0b758f8`, `c58eb6a`, `de3be85`).
- Navigation au clic sur une carte de projet (`ec31b49`).
- Réécriture SPA Vercel — les routes profondes renvoyaient un 404 au
  rechargement (`c4e93f6`).

---

## [1.5.0] — 2026-07-20

### Ajouté

- Tableau Kanban et calendrier par projet (`ce3097f`).
- Dossiers intelligents : enregistrement et application de préréglages de
  filtres (`7cbef1e`).
- Navigateur de dossiers dans la vue production (`a39a5bb`).
- Interface multi-conversations : canaux, groupes, messages directs
  (`0139464`), non-lus en direct (`900f71c`).
- Fil d'activité et journal d'audit alimentés par les activités réelles
  (`660d444`).
- Micro-interactions globales et anneau de focus accessible (`df30275`).

### Corrigé

- **[ANO-2026-002](https://github.com/flavienderoy/myvisuals-back/blob/main/docs/anomalies/ANO-2026-002.md)
  — Saturation du limiteur de débit** (S3). Volet front : réessai automatique
  des réponses `429` avec temporisation exponentielle (1 s / 2 s / 4 s, trois
  tentatives au plus) et dédoublonnage des appels concurrents à `loadCoreData`
  (`418a42f`).

---

## [1.4.0] — 2026-07-18

### Ajouté

- Panoramique et zoom dans la visionneuse pour une annotation précise
  (`597f621`).
- Comparateur avant/après entre versions d'un visuel (`0d7c01a`).
- Popover d'épingle et page de tickets — résolution et réouverture (`e30a317`).
- Centre de notifications, mentions et préférences (`72d75f8`, `47851ac`).
- Interface de gestion d'équipe côté studio (`dfb7af8`).
- Contrôle d'accès : un compte client ne peut jamais charger une route studio
  (`04f7d81`).
- Modale de partage et page de galerie publique (`66c6a8f`).
- Éditeur de tags dans la visionneuse et filtre par tag dans la galerie
  (`4fd7d65`).

### Corrigé

- Clic-pour-annoter rétabli après l'introduction du panoramique/zoom
  (`11623a5`).
- Le comparateur oppose bien l'original à la dernière version, et non un
  doublon (`96e0c55`).
- Seules les épingles de la version courante sont affichées (`5f7e4ec`).

---

## [1.3.0] — 2026-07-17

### Ajouté

- Visionneuse plein écran en remplacement de la fenêtre modale (`6e26f81`).
- Tableau de bord client orienté action : file « À valider » en tête
  (`c605647`).
- Gestion du profil et propagation de l'avatar (`1c3a7f0`).
- Fils de réponses aux annotations dans la visionneuse (`de03964`).
- Messagerie : avatars, bulles groupées, animation d'entrée (`cde2a66`).
- Cartes de projet aux couleurs de la marque, navigation cohérente
  (`7d2c44a`, `b990731`).

### Modifié

- Désencombrement de l'espace studio : compteurs réels, projet à deux onglets,
  purge du code mort (`6d0d47c`).

---

## [1.2.0] — 2026-07-15

### Ajouté

- Téléchargements autorisés réels côté studio et côté portail client
  (`bca3fc1`).
- Sélection de client fiabilisée à la création d'un projet (`083532a`).

### Corrigé

- La déconnexion redirige vers `/login` — la route `/signin` n'existe pas
  (`6662d4a`).
- Chargement des visuels de chaque projet au démarrage (`5cd3f0d`).

---

## [1.1.0] — 2026-07-14

### Ajouté

- Parcours d'invitation client par e-mail et projets liés réels (`dce92e4`).
- Tests de bout en bout multi-navigateurs (Playwright) (`82be8fb`).

### Modifié

- Point d'entrée d'authentification unifié, suppression de l'authentification
  client dupliquée (`308b04d`).
- Accès au téléchargement conditionné à la validation (`bdae947`).

### Supprimé

- Module de facturation — hors périmètre fonctionnel (`1f3907b`).

---

## [1.0.0] — 2026-07-08

### Ajouté

- Première version de l'application React 19 + Vite 7.
- Sélecteur de rôle Studio / Client à l'inscription, SIRET, redirection
  dynamique (`3e9f7d9`).
- Design system Tailwind 4, animations Framer Motion, export PDF (jsPDF).
- Attributs ARIA et tests unitaires (Vitest + Testing Library).
- Chaîne CI/CD GitHub Actions avec déploiement Vercel (`bf889c3`).

---

[Non publié]: https://github.com/flavienderoy/myvisuals-client/compare/v1.8.0...HEAD
[1.8.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.7.1...v1.8.0
[1.7.1]: https://github.com/flavienderoy/myvisuals-client/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/flavienderoy/myvisuals-client/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/flavienderoy/myvisuals-client/releases/tag/v1.0.0
