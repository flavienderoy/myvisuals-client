/**
 * Supervision côté navigateur — suivi des erreurs front (Sentry).
 *
 * Le back-end ne voit que ce qui l'atteint. Une exception React, un bundle qui
 * échoue à se charger ou une régression déclenchée par une mise à jour de
 * navigateur ne produisent *aucune* trace serveur : sans sonde front, ces
 * pannes ne sont connues que si un utilisateur prend la peine de les signaler.
 *
 * L'intégration est conditionnelle : sans `VITE_SENTRY_DSN`, ce module est un
 * no-op complet — aucune requête réseau en développement ni pendant les tests.
 *
 * @see docs/SUPERVISION.md
 */
import * as Sentry from '@sentry/react';

const DSN = (import.meta.env.VITE_SENTRY_DSN || '').replace(/["'\r\n]/g, '').trim();

let enabled = false;

export function initMonitoring() {
    if (!DSN) {
        if (import.meta.env.DEV) {
            console.info('[monitoring] VITE_SENTRY_DSN absent — suivi d’erreurs désactivé');
        }
        return;
    }

    Sentry.init({
        dsn: DSN,
        environment: import.meta.env.MODE,
        // Rattache chaque erreur à une version du journal (CHANGELOG.md).
        release: `myvisuals-client@${__APP_VERSION__}`,
        tracesSampleRate: 0.1,
        // Rejeu de session limité aux sessions en erreur : c'est ce qui permet
        // de reproduire une anomalie sans dépendre du récit de l'utilisateur.
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 1.0,
        sendDefaultPii: false,
        integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
        beforeSend(event) {
            // Les visuels des clients sont des données confidentielles :
            // on ne transmet jamais d'URL signée à un service tiers.
            if (event.request?.url) {
                event.request.url = event.request.url.split('?')[0];
            }
            return event;
        },
    });

    enabled = true;
}

/**
 * Remonte une exception capturée par un ErrorBoundary React.
 * @param {Error} error
 * @param {object} [context] - contexte de diagnostic (componentStack, route…)
 */
export function captureException(error, context = {}) {
    if (!enabled) return;
    Sentry.withScope((scope) => {
        scope.setExtras(context);
        Sentry.captureException(error);
    });
}

/**
 * Associe la session courante à un utilisateur (identifiant technique
 * uniquement — jamais d'e-mail ni de nom, pour rester minimal au sens RGPD).
 * Permet de mesurer combien d'utilisateurs distincts subissent une anomalie,
 * indicateur direct de sa sévérité.
 */
export function identifyUser(userId) {
    if (!enabled) return;
    Sentry.setUser(userId ? { id: userId } : null);
}

export const isMonitoringEnabled = () => enabled;
