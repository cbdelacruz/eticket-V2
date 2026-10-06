# eTicketing System Modernization

This workspace contains a Laravel REST API and a React + TypeScript frontend designed to sit on top of the same SQL Server 2022 database and stored procedures currently used by the legacy vanilla PHP eTicketing system.

## Architecture

- Backend: Laravel API using SQL Server driver and direct execution of the legacy stored procedures.
- Frontend: React + TypeScript + Vite single-page app.
- Database: Use the existing SQL Server 2022 database. Do not re-create the schema; re-use the same tables and procedures.

## Key principle

The old PHP application still owns the database. The new API is a compatibility layer that talks to the same database and executes the same stored procedures instead of duplicating logic.

## Example database connection

Set the following environment values in the Laravel backend `.env` file:

```env
APP_NAME="eTicket System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlsrv
DB_HOST=your-sql-host
DB_PORT=1433
DB_DATABASE=your_database_name
DB_USERNAME=your_sql_user
DB_PASSWORD=your_sql_password
```

## Stored procedure pattern

The API layer should use the same procedure names from the legacy app, for example:

```php
$results = DB::connection('sqlsrv')->select(
    'EXEC dbo.usp_Ticket_GetAll @tenant_id = ?',
    [$tenantId]
);
```

Replace the sample procedure names with the exact names already used by your legacy ticketing app.

## Startup order

1. Install PHP, Composer, Node.js, and npm.
2. Install Laravel backend dependencies.
3. Install React frontend dependencies.
4. Start the backend and frontend.
5. Point both at the same SQL Server 2022 database and reuse the existing stored procedures.

## Notes

- This project intentionally keeps the database and procedure layer in the legacy system as the source of truth.
- The new API is a façade over the old logic, not a second copy of the business rules.
- If your stored procedures return custom result sets, mirror those result shapes in the response DTOs in the API and UI.
