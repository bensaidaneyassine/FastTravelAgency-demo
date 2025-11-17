# Laravel Admin Panel

Türkçe kurulum için <a href="https://github.com/hsdmr/laravel-admin/blob/main/README-tr.md">burayı</a> tıklayın.

## Requirements

To run the project, you must install <a href="https://getcomposer.org/">Composer</a> on your computer and meet the following conditions.

- Laravel >= 8.x
- PHP >= 7.4

## Download with zip file

- Download the zip file of the project to your computer with the green code button.
- Extract the file from the zip.

## Download with git


If git is not installed on your computer, install the appropriate one for your operating system from this <a href="https://git-scm.com/downloads">link</a>

- Open the terminal screen and paste the code below and run it.

  ```
  git clone https://github.com/hsdmr/laravel-admin.git
  ```
## Installation

- Rename the file named .env.example in the project file to .env .
- Save your database information in the appropriate place in the .env file.
- Enter the project file from the terminal and paste the following codes respectively.

  ```
  composer install
  php artisan key:generate
  php artisan storage:link
  php artisan migrate:fresh
  php artisan db:seed
  php artisan optimize
  php artisan serve
  ```

- You can access the project from 'localhost:8000' .

## Reminders

If folder permission errors occur while deploying the project to the server, you can try the following codes.

  ```
  chmod -R o+w storage
  chmod 755 -R laravel-admin
  ```

## Client Authentication (JWT)

The public SPA now authenticates clients using stateless JWT tokens to avoid interfering with the admin (session) login.

Flow:
1. POST /api/auth/register or /api/auth/login returns: `{ message, user, token, token_type: "bearer" }`
2. The SPA stores `token` in `localStorage` as `clientToken`.
3. Subsequent requests include header: `Authorization: Bearer <token>`.
4. GET /api/auth/me returns 200 with user JSON or 204 if not authenticated.
5. POST /api/auth/logout invalidates the token (client just deletes it locally regardless of response).

Security Notes:
- Admin panel continues using the web session guard.
- Tokens are short-lived per default JWT TTL (configure in `config/jwt.php`).
- Rotate tokens periodically or on privilege changes.

Optional Hardening Implemented / Available:
- Throttle login attempts (see `routes/api.php` or add `->middleware('throttle:login')`).
- Role separation: clients cannot access any admin routes (middleware enforced).


