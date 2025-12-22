// api/index.js
export default async function handler(req, res) {
  const { default: app } = await import("../backend/src/app.js"); // dynamic import ES Module
  app(req, res); // Express xử lý request
}
