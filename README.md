# TrainLife

Web app for managing train travel: buy tickets, follow your trips, save favourite routes and get notified when a train is delayed or cancelled, with alternative trips offered automatically.

Built as a team project for the *Human-Computer Interaction* (IPO) course in Computer Engineering at Universidad Francisco de Vitoria (2025).

**Stack:** Python · Django 5.2 · SQLite · HTML/CSS/JavaScript · Bootstrap · Docker

## Features

- **Ticket purchase**: search available trips by origin and destination and buy a seat.
- **My trips**: upcoming and past trips with status (scheduled, confirmed, delayed, cancelled) and trip details.
- **Disruptions and alternatives**: when a trip is delayed or cancelled, the app lists alternative trains and lets the user switch in one click.
- **Routes**: search routes, save favourites, see incidents affecting them.
- **Notifications**: per-user notifications for trips, routes and service notices, with read/unread state.
- **Account**: sign up, log in, password recovery and password change.
- **Accessibility**: colour-blind modes (protanopia, deuteranopia, tritanopia) and a high-contrast mode, saved per user and applied across the whole app.

## Run it

With Docker:

```bash
docker compose up --build
```

Then open http://localhost:8000. On start the container applies the migrations and loads demo data (this resets the demo data on every start).

Without Docker:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata demo
python manage.py runserver
```

**Demo account:** `demo@trainlife.app` / `demo1234`

## Project structure

```
proyecto/            Django project settings and root URLs
trainLife/
  models.py          Usuario, Viaje, Ruta, Trayecto, Notificacion, Aviso
  views.py           Page views and JSON endpoints (/api/...)
  templates/         Server-rendered pages
  static/            CSS and JavaScript per page
  fixtures/demo.json Demo data
docs/                Feature notes, endpoints and data model (Spanish)
```

## My contributions

Team of three (GitHub: diego-vazquez-morales, soff1809, BORJA). My part:

- **Ticket purchase flow**: turned the "add ticket" page into a full purchase flow with trip search (views, JSON endpoints, templates, JS).
- **Alternatives for disrupted trips**: listing alternative trains for delayed or cancelled trips and applying the switch.
- **Notifications and settings** pages.
- **Password change**.
- **Docker setup** fixes and general bug fixing across views, URLs and models.

## Note

This is a course project meant to run locally: `DEBUG` is on and authentication is simplified (custom user model, no hashed passwords). Not intended for production.
