# InspectorIA

- `frontend/` — React + Vite + Tailwind (prototipo del zip, ahora conectado a la API)
- `backend/` — Spring Boot 3 (Java 17), arquitectura en capas, PostgreSQL + Flyway
- `docker-compose.yml` — PostgreSQL local

## Correr (un solo comando)

```bash
docker compose up --build
```

Abre http://localhost:8080 — la web y la API salen del mismo servicio.

### Modo desarrollo (recarga en caliente)

```bash
docker compose up -d db
cd backend && mvn spring-boot:run          # API en :8080
cd frontend && npm install && npm run dev  # web en :5173 (proxy /api -> :8080)
```

## API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/classify` | foto → tipo, severidad, confianza (sin guardar) |
| POST | `/api/reports` | foto + lat/lng/address/comment → crea reporte |
| GET | `/api/reports?type=&severity=&q=&ids=` | lista con filtros (`q` busca en dirección/barrio, `ids` = "1,2,3") |
| POST | `/api/auth/login` | correo + contraseña → JWT |
| GET | `/api/inst/stats` | conteos del panel (requiere `Authorization: Bearer <jwt>`) |
| GET | `/api/reports/{id}` · `/photo` · `/pdf` | detalle, foto, PDF |

El modelo de visión es una simulación (`ai/SimulatedDamageClassifier`) detrás de la interfaz `DamageClassifier`;
para usar el modelo real se crea otra implementación y se quita `@Component` de la simulada.

## Acceso institucional (demo)

Usuario inicial: `admin@inspectoria.co` / `inspectoria2026` (se cambia con las variables `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
Con `inspectoria.seed-demo: true` se crean 8 reportes de ejemplo si la base está vacía. En producción: `seed-demo: false` y `JWT_SECRET` propio.

## Notas

- "Mis reportes" guarda los IDs en el navegador (no hay cuentas ciudadanas en el MVP).
- El mapa usa Leaflet + teselas de OpenStreetMap (uso ligero/demo; para producción usar un proveedor de teselas con plan propio).
