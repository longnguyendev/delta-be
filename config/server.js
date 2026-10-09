module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
    defaultHeaders: {
      "Auth-Token": env("WEBHOOK_TOKEN"),
    },
  },
  url: env("NEXT_PUBLIC_API", "http://localhost:1337"),
});
