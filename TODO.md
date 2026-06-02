# TODO

- [ ] Fix backend `server.js` so it is an Express app entrypoint (has `app = express()`, mounts routes, listens on `PORT`).
- [ ] Move current router code into a routes file (e.g., `routes/wasteRoutes.js`) if needed.
- [ ] Ensure `backend/package.json` `start` points to the correct entrypoint.
- [ ] Run `npm run dev` (or `npm start`) inside `backend` and verify `/api/auth/*` and `/api/waste/*` endpoints.

