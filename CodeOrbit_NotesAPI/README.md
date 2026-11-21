# Task 3 — Simple Notes REST API

Node.js + Express REST API using a JSON file, without a database.

## Requirements
Node.js 18+ and npm.

## Run
```bash
npm install
npm start
```
Open http://localhost:3000 for the API welcome response.

## Endpoints
| Method | URL | Purpose |
|---|---|---|
| GET | `/api/notes` | List notes |
| GET | `/api/notes/:id` | View one note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

## Test using Postman
Set method and URL to `POST http://localhost:3000/api/notes`, select **Body → raw → JSON**, then send:
```json
{"title":"Learn Express","content":"Build my first API"}
```
Copy the returned `id`. Test:
- `GET http://localhost:3000/api/notes`
- `GET http://localhost:3000/api/notes/PASTE_ID`
- `PUT http://localhost:3000/api/notes/PASTE_ID` with JSON body `{"title":"Updated","content":"Finished"}`
- `DELETE http://localhost:3000/api/notes/PASTE_ID`
- `GET http://localhost:3000/api/notes` to verify deletion.

A successful POST returns HTTP 201, successful DELETE returns HTTP 204, missing notes return 404, and invalid input returns 400. Data persists in `data/notes.json` across restarts. This is a learning project, not a production-ready API (no authentication, concurrency controls, or database).
