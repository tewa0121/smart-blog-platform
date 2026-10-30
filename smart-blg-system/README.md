# Smart Blog System

A full-stack, role-based blog platform built as a university project.
Users write posts, editors review and publish them, and readers comment.

Repository: https://github.com/tewa0121/smart-blog-platform

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js, JWT, bcryptjs, multer |
| Database | MySQL (MAMP, port 8889) |

All database tables are created automatically by `server/config/db.js`. You do not need to create anything in phpMyAdmin.

## Features

- Registration, login and logout (JWT authentication)
- Five roles: Admin, Editor, Author, Contributor, Subscriber
- A separate dashboard and menu for each role
- Post workflow: Draft, Pending, Approved or Rejected, Published
- Create, edit and delete posts, with image upload
- Categories, search and pagination
- Comments, with an Admin switch to allow or block new comments
- Notifications (new post to review, approved, rejected, published, new comment)
- Admin reports (users, posts, categories, top posts)
- AI assistance: grammar check, summary, keywords, title and category suggestions

## Roles and Permissions

| Action | Admin | Editor | Author | Contributor | Subscriber |
|---|:-:|:-:|:-:|:-:|:-:|
| Read posts | Yes | Yes | Yes | Yes | Yes |
| Write posts | Yes | Yes | Yes | Yes | No |
| Publish directly | Yes | Yes | Yes | No | No |
| Edit others' posts | Yes | Yes | No | No | No |
| Approve, reject, publish | Yes | Yes | No | No | No |
| Manage users and roles | Yes | No | No | No | No |
| System settings | Yes | No | No | No | No |

## Project Structure

```
smart-blg-system/
├── client/   React + Tailwind frontend
│   └── src/ (api, components, context, hooks, layouts, pages, routes, utils)
└── server/   Node + Express backend
    ├── config/db.js      Creates the database, tables and seed data
    ├── controllers/
    ├── middleware/       auth (JWT), role (RBAC), upload, error
    ├── routes/
    └── uploads/          Uploaded images
```

## Requirements

- Node.js 18 or newer
- MAMP (MySQL running on port **8889**, user `root`, password `root`)

## Installation and Running

1. Start **MAMP** and click **Start Servers**.

2. Backend:

```bash
cd server
npm install
```

Create `server/.env` (copy from `.env.example`):

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=smart_blog_system
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
ADMIN_NAME=System Admin
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@smartblog.com
ADMIN_PASSWORD=Admin@123
```

```bash
npm run dev
```

Expected output:

```
Database "smart_blog_system" and all tables are ready
Server running on http://localhost:5000
```

3. Frontend (in a second terminal):

```bash
cd client
npm install
npm run dev
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

4. Open **http://localhost:5173**

## Default Admin Account

| Username | Password |
|---|---|
| admin | Admin@123 |

Change this password after the first login. Create Editor, Author and Contributor accounts from **Dashboard > Manage Users**. Public registration always creates a Subscriber.

## Database Tables

`roles`, `users`, `categories`, `posts`, `comments`, `notifications`, `settings`

Relationships:

- One Role has many Users
- One User has many Posts, Comments and Notifications
- One Category has many Posts
- One Post has many Comments

## API Summary

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Users (Admin) | `GET/POST /api/users`, `PUT /api/users/:id/role`, `PUT /api/users/:id/block`, `DELETE /api/users/:id` |
| Profile | `PUT /api/users/profile`, `PUT /api/users/password` |
| Posts | `GET /api/posts`, `GET /api/posts/mine`, `GET /api/posts/manage/all`, `GET/PUT/DELETE /api/posts/:id`, `POST /api/posts`, `PATCH /api/posts/:id/review` |
| Comments | `GET/POST /api/comments/post/:postId`, `GET /api/comments/mine`, `DELETE /api/comments/:id` |
| Categories | `GET/POST /api/categories`, `PUT/DELETE /api/categories/:id` |
| Notifications | `GET /api/notifications`, `GET /unread-count`, `PUT /read-all`, `PUT /:id/read` |
| Settings | `GET /api/settings`, `PUT /api/settings` (Admin) |
| Reports | `GET /api/reports` (Admin) |
| AI | `POST /api/ai/grammar`, `POST /api/ai/suggest` |

## Workflow

1. A Contributor or Author writes a post and clicks **Submit for Review**.
2. The Editor receives a notification and opens the **Review Queue**.
3. The Editor edits, approves, rejects (with a reason) or publishes the post.
4. The author is notified of the result.
5. Published posts appear on the home page, and readers can comment.

## Troubleshooting

| Problem | Solution |
|---|---|
| `ECONNREFUSED` or `Access denied` | Start MAMP and check the port and password in `server/.env` |
| `Invalid package config` | `package.json` is empty or invalid JSON; fix it and run `npm install` |
| Network Error on login | The backend is not running |
| Blank page | Press F12 and read the Console error |

## Author

Tewachew Melaku, Injibara University