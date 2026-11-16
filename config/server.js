module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    // Sent with every webhook, so the secret isn't stored in the webhook
    // itself (see src/frontend-webhook.js). `populateRelations` was removed in
    // Strapi 5.
    defaultHeaders: env("REVALIDATE_SECRET")
      ? { Authorization: `Bearer ${env("REVALIDATE_SECRET")}` }
      : {},
  },
  url: env("NEXT_PUBLIC_API", "http://localhost:1337"),
});
