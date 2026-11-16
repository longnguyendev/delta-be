'use strict';

/**
 * Keeps a Strapi webhook (Settings → Webhooks) that tells the Next.js frontend
 * (delta-renew) to drop its cached CMS data whenever content or media changes,
 * so edits show up on the site right away instead of after the frontend's cache
 * window (5 minutes).
 *
 * The webhook is created/updated from env on every start, so every environment
 * gets the same setup without clicking through the admin panel. The secret is
 * not stored on the webhook: `config/server.js` sends it as
 * `webhooks.defaultHeaders.Authorization`.
 *
 * Env:
 *   FRONTEND_REVALIDATE_URL  e.g. https://delta-enc.com.vn/api/revalidate
 *                            (comma-separated for several frontends)
 *   REVALIDATE_SECRET        same value as REVALIDATE_SECRET on the frontend
 */

const WEBHOOK_NAME = 'Frontend revalidate (delta-renew)';

/** Everything that can change what the public site shows. */
const EVENTS = [
  'entry.create',
  'entry.update',
  'entry.delete',
  'entry.publish',
  'entry.unpublish',
  'media.create',
  'media.update',
  'media.delete',
];

module.exports = async function ensureFrontendWebhook(strapi) {
  const urls = (process.env.FRONTEND_REVALIDATE_URL || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  if (urls.length === 0 || !process.env.REVALIDATE_SECRET) {
    strapi.log.info(
      '[webhook] FRONTEND_REVALIDATE_URL / REVALIDATE_SECRET not set — frontend revalidate webhook left unchanged.',
    );
    return;
  }

  const store = strapi.get('webhookStore');
  const runner = strapi.get('webhookRunner');

  // Only events this Strapi knows (media.* come from the upload plugin).
  const allowed = new Set(store.allowedEvents.values());
  const events = EVENTS.filter((event) => allowed.has(event));

  const existing = (await store.findWebhooks()).filter((webhook) =>
    webhook.name.startsWith(WEBHOOK_NAME),
  );

  for (const [index, url] of urls.entries()) {
    const name = urls.length > 1 ? `${WEBHOOK_NAME} #${index + 1}` : WEBHOOK_NAME;
    const data = { name, url, headers: {}, events, isEnabled: true };
    const current =
      existing.find((webhook) => webhook.url === url) ??
      existing.find((webhook) => webhook.name === name);

    if (!current) {
      runner.add(await store.createWebhook(data));
      strapi.log.info(`[webhook] created "${name}" → ${url}`);
      continue;
    }

    existing.splice(existing.indexOf(current), 1);

    const unchanged =
      current.url === url &&
      current.name === name &&
      current.isEnabled &&
      JSON.stringify(current.events) === JSON.stringify(events);

    if (!unchanged) {
      runner.update(await store.updateWebhook(current.id, data));
      strapi.log.info(`[webhook] updated "${name}" → ${url}`);
    }
  }

  // URLs removed from FRONTEND_REVALIDATE_URL.
  for (const stale of existing) {
    await store.deleteWebhook(stale.id);
    runner.remove(stale);
    strapi.log.info(`[webhook] removed "${stale.name}" → ${stale.url}`);
  }
};
