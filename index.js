// Importa las funciones de servicios para interactuar con la API
import { getUsers, getCourses, post, update, deletes } from "./scripts/services";
// URLs base para usuarios y cursos
const urlUsers = "http://localhost:3000/usuarios";
const urlCourses = "http://localhost:3000/courses";

// Definición de rutas de la SPA
const routes = {
  "/login": "./spa/login.html",
  "/register": "./spa/register.html",
  "/dashboard": "./spa/dashboard.html",
  "/eventform": "./spa/eventform.html",
  "/editform": "./spa/editform.html",
};

// Verifica si el usuario está autenticado
function isAuth() {
  const result = localStorage.getItem("Auth") || null;
  const resultBool = result === "true";
  return resultBool;
}

// Navega entre rutas y gestiona redirecciones y carga de vistas
async function navigate(pathname) {
  // Rutas que requieren autenticación
  const protectedRoutes = ["/dashboard", "/eventform", "/editform"];
  // Redirige a not-found si no está autenticado y accede a ruta protegida
  if (!isAuth() && protectedRoutes.includes(pathname)) {
    pathname = "/not-found";
  }
  // Redirige a dashboard si está autenticado y accede a login o register
  if (isAuth() && (pathname === "/login" || pathname === "/register")) {
    pathname = "/dashboard";
  }
  const route = routes[pathname];
  if (!route) {
    // Si la ruta no existe, muestra mensaje de página no encontrada
    document.getElementById("content").innerHTML = "<h2>Página no encontrada</h2><p>La ruta solicitada no existe.</p>";
    history.pushState({}, "", pathname);
    return;
  }
  // Carga el HTML de la ruta
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  // Oculta la navbar si el usuario está logueado
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.style.display = isAuth() ? "none" : "";
  }

  // Inicializa la vista correspondiente
  if (pathname === "/login") 
    setupLoginForm();
  if (pathname === "/register") 
    createUser();
  if (pathname === "/dashboard") {
    renderCurses();
    setupUsers();
    getProfile();
    createCourse();
  }
  if (pathname === "/eventform") { 
    createCourse();
  }
  if (pathname === "/editform") 
    setupEditForm();
}

// Inicializa el formulario de edición de curso
async function setupEditForm() {
  const form = document.getElementById("course-edit");
  if (!form) return;
  // Botón cancelar para volver al dashboard
  const cancelBtn = document.getElementById("cancel-edit-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      navigate("/dashboard");
    });
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = localStorage.getItem("editCourseId");
    const name = document.getElementById("course-name").value;
    const description = document.getElementById("course-description").value;
    const dateOfEvent = document.getElementById("course-date").value;
    const capacity = document.getElementById("course-capacity").value;

    // Validación de campos
    if (!name || !description || !dateOfEvent || !capacity) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const updatedCourse = {
      name,
      description,
      dateOfEvent,
      capacity
    };

    try {
      await update(urlCourses, id, updatedCourse);
      alert("Curso editado correctamente");
      localStorage.removeItem("editCourseId");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al editar el curso:", error);
      alert("Error al editar el curso. Inténtalo de nuevo.");
    }
  });
}

// Maneja la navegación SPA al hacer clic en enlaces con data-link
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    navigate(path);
  }
});

// Muestra u oculta los botones de admin según el rol
function setupUsers() {
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";
  document.querySelectorAll(".admin-btn").forEach((button) => {
    button.style.display = isAdmin ? "" : "none";
  });
}

// login
// Inicializa el formulario de login y gestiona autenticación
function setupLoginForm() {
  const form = document.getElementById("login-spa");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("user").value;
    const pass = document.getElementById("password").value;
    const users = await getUsers();
    // Busca el usuario por nombre y contraseña
    const foundUser = users.find(
      (u) => u.user === user && String(u.password) === pass
    );
    if (foundUser) {
      localStorage.setItem("Auth", "true");
      localStorage.setItem("role", foundUser.role);
      localStorage.setItem("user", foundUser.user);
      localStorage.setItem("email", foundUser.email);
      navigate("/dashboard");
    } else {
      alert("usuario o contraseña son incorrectos");
    }
  });
}

// Inicializa la SPA al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});

// Maneja la navegación con el historial del navegador
window.addEventListener("popstate", () => {
  navigate(location.pathname);
});

// Inicializa el formulario de registro de usuario
function createUser() {
  let form = document.getElementById("register-form")
  form.addEventListener("submit", async (event)=>{
    event.preventDefault()
    let name = document.getElementById("name").value
    let password = document.getElementById("password").value
    let confirmPassword = document.getElementById("confirm-password").value
    let email = document.getElementById("email").value
    let usuarios = {
        "user": name,
        "email": email,
        "password": password,
        "role": "user",
        "courses": "none",
        "dateOfAdmission": "08-Dec-2021"
    }
    // Validaciones de campos
    if (!name || !email || !password || !confirmPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    let newUser = await post(urlUsers, usuarios)
    if (newUser){
      alert("usuario creado correctamente")
      navigate("/login");
    }else{
      alert("usuario no creado correctamente")
    }
  })
}

// Renderiza el perfil del usuario en el dashboard
async function getProfile() {
  let containerProfile = document.getElementById("profile");
  let dataProfile = await getUsers();
  const userName = localStorage.getItem("user");
  const user = dataProfile.find(u => u.user === userName);
  const isAdmin = user && user.role === "admin";
  if (containerProfile && user) {
    containerProfile.innerHTML = `
      <h2>Perfil de Usuario</h2>
      <p class=rainbow> Usuario</p>
      <p><span id="user-name">${user.user}</span></p>
      <p class=rainbow> Email </p>
      <p><span id="user-email">${user.email}</span></p>
      <p class=rainbow> Rol </p>
      <p><span id="user-role">${user.role}</span></p>
      <button id="logout-btn">Cerrar sesión</button>
      ${isAdmin ? '<button id="create-course-btn">Crear Curso</button>' : ''}
    `;
    // Botón para cerrar sesión
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.setItem("Auth", "false");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("email");
        navigate("/login");
      });
    }
    // Botón para crear curso si es admin
    if (isAdmin) {
      const createBtn = document.getElementById("create-course-btn");
      if (createBtn) {
        createBtn.addEventListener("click", () => {
          navigate("/eventform");
        });
      }
    }
  }
}

// Renderiza la lista de cursos/eventos y gestiona inscripción, edición y eliminación
async function renderCurses() {
  let containerCurses = document.getElementById("container-curses");
  let dataCourses = await getCourses();
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";
  containerCurses.innerHTML = "";
  const userName = localStorage.getItem("user");
  let usuarios = await getUsers();
  let currentUser = usuarios.find(u => u.user === userName);
  dataCourses.forEach(course => {
    let isEnrolled = false;
    // Verifica si el usuario está inscrito en el curso
    if (!isAdmin && currentUser && currentUser.courses) {
      if (Array.isArray(currentUser.courses)) {
        isEnrolled = currentUser.courses.includes(course.id);
      } else if (typeof currentUser.courses === "string") {
        isEnrolled = currentUser.courses === course.id;
      }
    }
    containerCurses.innerHTML += `
      <div>
        <span class="rainbow">Evento</span><span>${course.name}</span>
        <span class="rainbow">Descripción:</span> <span>${course.description}</span>
        <span class="rainbow">Fecha</span><span>${course.dateOfEvent}</span>
        <span class="rainbow">Capacidad</span><span>${course.capacity}</span>
        ${!isAdmin ? `<button class="enroll-btn" data-id="${course.id}" ${isEnrolled ? "disabled" : ""}>${isEnrolled ? "Inscrito" : "Inscribirse"}</button>` : ""}
        ${isAdmin ? `<button class="admin-btn edit-btn" data-id="${course.id}">Edit</button>
        <button class="admin-btn delete-btn" data-id="${course.id}">Delete</button>` : ""}
      </div>
    `;
  });
  // Botones de inscripción para usuarios
  const enrollButtons = containerCurses.querySelectorAll(".enroll-btn");
  enrollButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const courseId = btn.getAttribute("data-id");
      let usuarios = await getUsers();
      const userName = localStorage.getItem("user");
      let currentUser = usuarios.find(u => u.user === userName);
      if (!currentUser) return;
      // Actualiza la lista de cursos inscritos
      let userCourses = currentUser.courses;
      if (!userCourses || userCourses === "none") {
        userCourses = [];
      }
      if (typeof userCourses === "string") {
        userCourses = [userCourses];
      }
      if (!userCourses.includes(courseId)) {
        userCourses.push(courseId);
      }
      // Actualiza el usuario en el backend
      try {
        await update(urlUsers, currentUser.id, { ...currentUser, courses: userCourses });
        alert("Inscripción exitosa");
        renderCurses();
      } catch (error) {
        alert("Error al inscribirse");
      }
    });
  });
  // Botones de eliminar para admin
  const deleteButtons = containerCurses.querySelectorAll(".delete-btn");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.getAttribute("data-id");
      const deleteCourse = await deletes(urlCourses, id);
      if (deleteCourse) {
        alert("evento eliminado correctamente");
        navigate("/dashboard");
      } else {
        alert("no se pudo eliminar el evento");
      }
    });
  });
  // Botones de editar para admin
  const editButtons = containerCurses.querySelectorAll(".edit-btn");
  editButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.getAttribute("data-id");
      // Guarda el id del curso a editar en localStorage
      localStorage.setItem("editCourseId", id);
      await navigate(`/editform`);
      // Rellena el formulario de edición con los datos del curso
      const course = (await getCourses()).find(c => c.id === id);
      if (course) {
        document.getElementById("course-name").value = course.name;
        document.getElementById("course-description").value = course.description;
        document.getElementById("course-date").value = course.dateOfEvent;
        document.getElementById("course-capacity").value = course.capacity;
      }
    });
  });
}

// Inicializa el formulario de creación de curso
async function createCourse() {
  let form = document.getElementById("course-form");
  if (!form) return;
  // Botón cancelar para volver al dashboard
  const cancelBtn = document.getElementById("cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      navigate("/dashboard");
    });
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let name = document.getElementById("course-name").value;
    let description = document.getElementById("course-description").value;
    let dateOfEvent = document.getElementById("course-date").value;
    let capacity = document.getElementById("course-capacity").value;
    // Validación de campos
    if (!name || !description || !dateOfEvent || !capacity) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    let newCourse = {
      name,
      description,
      dateOfEvent,
      capacity
    };
    try {
      const createdCourse = await post(urlCourses, newCourse);
      if (createdCourse) {
        alert("Curso creado correctamente");
        navigate("/dashboard");
      } else {
        alert("Error al crear el curso");
      }
    } catch (error) {
      console.error("Error al crear el curso:", error);
      alert("Error al crear el curso. Inténtalo de nuevo.");
    }
  });
}
