## Project Starter

A ready-to-run Express 5 + Sequelize + Bull + Swagger stack that takes care of the boring infrastructure so you can start building features faster.

### At a glance
- ✅ **Authentication ready** – JWT strategy, passport session handling, reset/change password flows (`src/controllers/authController.js`, `model/user.js`).  
- ✅ **Background work prewired** – Queue manager + processor, cron runner (`cron/index.js`), Redis + Bull setup.  
- ✅ **Notifications** – FCM + push notification services/resources all hooked in; `notificationService` already enqueues work.  
- ✅ **Docs & validation** – Swagger UI at `/api/documentation` (non-production), Joi validation, centralized error handler.  
- ✅ **Media/static** – Static `public` folder and `media` path ready; `serverCheckList` ensures required folders exist.  
- ✅ **Seeder & migrations** – Sequelize sync with `{ alter: true }` plus seeders run automatically after the server boots.

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick setup](#quick-setup)
3. [Environment variables](#environment-variables)
4. [Installing & starting](#installing--starting)
5. [Key directories](#key-directories)
6. [Built-in capabilities](#built-in-capabilities)
7. [Recommended workflow](#recommended-workflow)
8. [Scripts](#scripts)
9. [Next steps](#next-steps)

### Prerequisites
- Node.js (>=18)  
- MySQL compatible database  
- Redis (for Bull queues)  
- Optional: SSL certificates if `IS_SECURE=true`

### Quick setup
```bash
git clone <repo>
cd node-project-starter
npm install
```

### Environment variables
Create a `.env` file with the values required by `serverCheckList.js`. Missing or extra keys will abort the boot. These are the critical ones:

| Variable | Notes |
| --- | --- |
| `APP_NAME` | Friendly name shown in logs and Swagger |
| `ENV` | e.g., `local`, `development`, `staging`, `production` (controls cron activation and docs) |
| `HOST`, `PORT` | Where Express listens. Default port is `4001`. |
| `IS_SECURE` | `"true"` for HTTPS mode; requires `SSL_CERT_BASE_PATH`. |
| `SSL_CERT_BASE_PATH` | Directory containing `privkey.pem`, `cert.pem`, `fullchain.pem`. |
| `IS_PROXY` | When `true`, base URLs resolve to `https://HOST`. |
| `STATIC_OTP_ENV` | Comma-separated envs that allow static OTP during development. |
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Sequelize/MySQL connection. |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION` | Nodemailer config. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | Optional Twilio values used by helpers. |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | JWT config used across passport/JWT helpers. |
| Optional: `BASE_URL` | Useful for sending links in emails or docs. |

`serverCheckList.js` also ensures `public/admin/repositoryImage`, `public/admin/repositoryPersonaImage`, and `public/accountImage` are available with write permissions.

### Installing & starting
- Install: `npm install`
- Run development server: `npm start` (uses `nodemon app.js --exec babel-node`)
- Production-ready start: `npm run start:dev` (PM2 + Babel), then `npm run dev:reload` after updates

The entrypoint runs `serverCheckList()`, socks the swagger router (unless `ENV=production`), initializes passport/JWT, syncs Sequelize models with `{ alter: true }`, seeds via `src/seeder`, and only launches cron jobs when `ENV !== "local"`.

### Key directories
- `src/controllers` – Request handlers wired from `routes/*`.  
- `src/services` – Business logic / model orchestration.  
- `src/config` – Constants, database config, JWT strategy, mailer, swagger init.  
- `src/middleware` – Authentication, Joi validation, error handling.  
- `src/helpers` – Auth helpers, file storage, mail helpers, custom responses.  
- `model/` – Sequelize models + associations exposed through `model/index.js`.  
- `queue/` – `queueManager` and processors (`queue/processors`) that wrap Bull.  
- `cron/` – Scheduled jobs triggered only outside `local`.  
- `views/` & `public/` – EJS templates for emails/errors and public assets.

### Built-in capabilities
- **Auth** – Register/login, refresh token, reset/change password, JWT strategy, passport middleware.  
- **Notifications** – Resources (`src/resources/notificationResource.js`) and services to log FCM tokens + send pushes + queue send attempts.  
- **Queue + Processor** – `queueManager` enqueues jobs; `activityReminderProcessor.js` is a working processor example.  
- **Cron** – `cron/index.js` is wired to run scheduled tasks when not in `local`.  
- **Swagger** – Swagger YAML is loaded with context-aware servers from `apiBaseUrl()` and served on `/api/documentation`.  
- **Error handling** – Centralized `errorHandler`, Joi validation, and passport JWT guard ready to catch failures.

### Recommended workflow
1. Seed or migrate your database (models sync on boot with `{ alter: true }`).  
2. Extend `routes` + `controllers` to expose your endpoints.  
3. Push heavy/async work through `queueManager.enqueue(...)` and add processors to `queue/processors`.  
4. Add cron jobs via `cron/index.js` for scheduled cleanup, reminders, etc.  
5. Update `swagger.yaml` to reflect API changes and rely on Swagger UI for API exploration.

### Scripts
- `npm start` – 🎯 Dev with nodemon + Babel.  
- `npm run start:dev` – 🚀 PM2-managed production-like process with Babel.  
- `npm run dev:reload` – 🔁 Reloads the PM2 instance after code changes.

### Next steps
- ✅ Run `npm install`  
- ✅ Create `.env` with the required vars (copy from `.env.example` if available)  
- ✅ Start the app (`npm start`) and verify Swagger at `/api/documentation`  
- ⚙️ Customize `routes`, `services`, `queue/processors`, and cron tasks to suit your domain.

Need help wiring up Redis, MySQL, or providing a `.env.example`? Just ask.

