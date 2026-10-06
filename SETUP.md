# Set Up eTicketing on a New Windows Computer

This guide sets up the project for local development. The project has a Laravel API in `backend` and a React + TypeScript frontend in `frontend`. The API is intended to connect to the existing SQL Server database used by the legacy system; this project does not provide or recreate that database.

## Before you start

You will need:

- Access to [this GitHub repository](https://github.com/cbdelacruz/eticket-V2)
- [Git for Windows](https://git-scm.com/download/win)
- [PHP 8.2 or later for Windows](https://windows.php.net/download/) and [Composer 2](https://getcomposer.org/download/)
- [Node.js LTS](https://nodejs.org/en/download) (includes npm)
- The [Microsoft ODBC Driver for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server) and the PHP [`sqlsrv` and `pdo_sqlsrv` extensions](https://learn.microsoft.com/en-us/sql/connect/php/system-requirements-for-the-php-sql-driver?view=sql-server-ver17), if you need to connect to SQL Server
- Authorized connection details for a SQL Server database and its existing tables

Use an approved development or test database. Read the security warning below before configuring a database connection.

## 1. Install the required tools

Install Git for Windows, PHP, Composer, and Node.js LTS using your organization's approved software sources. During PHP setup, install a build of PHP compatible with the Microsoft SQL Server extensions and your PHP version. Follow Microsoft's and the PHP driver's installation instructions for the ODBC driver, `sqlsrv`, and `pdo_sqlsrv`.

Open a **new PowerShell window** after installation and check that the tools are on `PATH`:

```powershell
git --version
php --version
composer --version
node --version
npm --version
```

If SQL Server connectivity is required, check that both PHP extensions are enabled:

```powershell
php -m | Select-String 'sqlsrv|pdo_sqlsrv'
```

The output should include both `sqlsrv` and `pdo_sqlsrv`. If either is missing, enable/install the extension that matches the PHP version and architecture in use, then restart the terminal.

## 2. Clone the project

In PowerShell, choose a folder for your projects, then clone the repository:

```powershell
Set-Location "$HOME\Documents"
git clone https://github.com/cbdelacruz/eticket-V2.git
Set-Location .\eticket-V2
```

If GitHub prompts you to sign in, authenticate using your organization's approved GitHub method.

## 3. Install backend dependencies

```powershell
Set-Location .\backend
composer install
Copy-Item .env.example .env
php artisan key:generate
```

`composer install` installs the exact PHP dependency versions recorded in `composer.lock`. The `.env` file is local configuration and should never be committed or shared.

## 4. Configure the backend

Open `backend\.env` in a text editor. Set the app and database values for your local environment. For example:

```dotenv
APP_NAME="eTicket System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlsrv
DB_HOST=your-authorized-sql-server
DB_PORT=1433
DB_DATABASE=your-development-database
DB_USERNAME=your-authorized-username
DB_PASSWORD=your-password

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Replace the example database values with connection details supplied by your database administrator. Do not put real passwords in source files, screenshots, or messages. The file `.env` is ignored by Git.

The local `file` session/cache settings and `sync` queue avoid requiring extra Laravel database tables just to start this project. Do not run Laravel migrations against the legacy SQL Server database: the legacy application owns its schema, and this project is supposed to reuse it.

If you later change `.env` after Laravel has cached configuration, clear that cache:

```powershell
php artisan config:clear
```

## 5. Install frontend dependencies

Open a second PowerShell window, navigate to the project folder, and install the locked npm dependencies:

```powershell
Set-Location "$HOME\Documents\eticket-V2\frontend"
npm ci
```

The frontend defaults to the API at `http://localhost:8000/api`. To use the loopback address consistently with the commands below, create a local frontend override:

```powershell
"VITE_API_BASE_URL=http://127.0.0.1:8000/api" | Set-Content -Encoding ascii .env.local
```

`.env.local` is local machine configuration and should not be committed.

## 6. Start the API and frontend

In the first PowerShell window, start the Laravel API:

```powershell
Set-Location "$HOME\Documents\eticket-V2\backend"
php artisan serve --host=127.0.0.1 --port=8000
```

In the second PowerShell window, start the frontend:

```powershell
Set-Location "$HOME\Documents\eticket-V2\frontend"
npm run dev -- --host 127.0.0.1
```

Keep both windows open while using the app. Open <http://127.0.0.1:5173> in a browser on the same computer. Stop either server with **Ctrl+C** in its PowerShell window.

## 7. Verify the setup

- The frontend should load at <http://127.0.0.1:5173>.
- If the API cannot connect to SQL Server, check the backend terminal, `.env` host/database/credentials, network access, ODBC driver, and PHP extensions.
- If the browser reports a connection or CORS error, make sure the backend is running on port `8000` and that `frontend\.env.local` points to `http://127.0.0.1:8000/api`; restart the Vite server after changing the frontend environment file.
- To confirm the frontend compiles, stop its development server with **Ctrl+C** and run:

  ```powershell
  npm run build
  ```

## Important security and functionality notes

- **Do not connect this version to a production or sensitive database.** The current unauthenticated `GET /api/health` route runs `SELECT * from NGAS_USERS` and returns the query results. The frontend calls this route when it loads. Use only an isolated development/test database with non-sensitive data until this endpoint is changed to return a non-sensitive health status and protected as appropriate.
- Keep both development servers bound to `127.0.0.1`. Do not expose them to a network or the public internet.
- The login form and ticket/dashboard content are currently frontend demo behavior/data; the form does not authenticate against the database. Do not enter real user passwords.
- Do not run `php artisan migrate` against the legacy database or create replacement tables for it.

## Common commands later

From the project root:

```powershell
git pull
```

After pulling changes, install dependencies if either lock file changed:

```powershell
Set-Location .\backend
composer install
Set-Location ..\frontend
npm ci
```
