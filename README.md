## Requirements

- Node.js and npm installed
- Run `npm install` before starting
- Run `npm run dev` to start the app
- Run `json-server --watch db.json` to start the backend (if not started automatically)

### Open the app

Go to your browser and open:
http://localhost:5173


---

## Features & Functionality

### User Roles
- **Admin:** Can create, edit, and delete courses/events. Can see all users and all courses.
- **User:** Can register for events/courses. Can see their own profile and available courses.

### Main Pages
- **Login:** Enter username and password to access the dashboard.
- **Register:** Create a new user account.
- **Dashboard:** See your profile and all available courses/events.
- **Create Course (Admin only):** Add a new course/event.
- **Edit Course (Admin only):** Edit details of an existing course/event.

### Buttons & States

#### Login Page
- **Login:** Authenticates user. If credentials are wrong, shows error alert.

#### Register Page
- **Enviar:** Creates a new user. If fields are empty or passwords do not match, shows error alert.

#### Dashboard
- **Cerrar sesión:** Logs out and returns to login page.
- **Crear Curso (Admin only):** Opens the course creation form.
- **Edit (Admin only):** Opens the edit form for the selected course.
- **Delete (Admin only):** Deletes the selected course. Shows alert for success or error.
- **Inscribirse (User only):** Registers the user for the selected course. Button changes to "Inscrito" and is disabled if already registered.

#### Create/Edit Course
- **Crear Curso / Editar Curso:** Submits the form to create or update a course. Shows alert for success or error.
- **Cancelar:** Returns to dashboard without saving changes.

### States & Alerts
- **Successful login:** Redirects to dashboard.
- **Failed login:** Shows "usuario o contraseña son incorrectos" alert.
- **Successful registration:** Shows "usuario creado correctamente" alert and redirects to login.
- **Failed registration:** Shows error alert.
- **Successful course creation/edit:** Shows success alert and returns to dashboard.
- **Failed course creation/edit:** Shows error alert.
- **Successful event registration:** Shows "Inscripción exitosa" alert and disables button.
- **Failed event registration:** Shows error alert.
- **Successful course deletion:** Shows "evento eliminado correctamente" alert and updates dashboard.
- **Failed course deletion:** Shows error alert.

---

## How to Use

1. **Register** a new user or login as admin (default admin: user `david`, password `admin`).
2. **Admin** can create, edit, and delete courses/events from the dashboard.
3. **User** can see available courses and register for them. Registered courses are saved and shown as "Inscrito".
4. **Logout** anytime to return to login.

---

## Project Structure

- `index.js`: Main SPA logic and navigation
- `scripts/services.js`: API calls (CRUD)
- `db.json`: Backend data (users and courses)
- `assets/styles.css`: Styles for all UI
- `spa/`: HTML templates for each view

---

## Example Users

- **Admin:**
  - Username: `david`
  - Password: `admin`
- **User:**
  - Username: `riwitest`
  - Password: `1234`

---

## License
