import { getUsers, getCurses , post , update ,deletes } from "./scripts/services";
const urlUsers = "http://localhost:3000/usuarios";
const urlCurses = "http://localhost:3000/curses";

// routes
const routes = {
  "/login": "./spa/login.html",
  "/register": "./spa/register.html",
  "/dashboard": "./spa/dashboard.html",
};

function isAuth() {
  const result = localStorage.getItem("Auth") || null;
  const resultBool = result === "true";
  return resultBool;
}

async function navigate(pathname) {
  if (!isAuth()) {
    pathname = "/login";
  }
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  if (pathname === "/login") setupLoginForm();
  if (pathname === "/register") createUser();
  if (pathname === "/dashboard") renderCurses(); setupUsers();
  }

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    navigate(path);
  }
});

function setupUsers() {
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";
  const userName = localStorage.getItem("user");
  document.querySelectorAll(".admin-btn").forEach((button) => {
    button.style.display = isAdmin ? "" : "none";
  });
}

// login
function setupLoginForm() {
  const form = document.getElementById("login-spa");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = document.getElementById("user").value;
    const pass = document.getElementById("password").value;

    const users = await getUsers();

    // Buscar usuario que coincida
    const foundUser = users.find(
      (u) => u.user === user && String(u.password) === pass
    );

    if (foundUser) {
      localStorage.setItem("Auth", "true");
      localStorage.setItem("role", foundUser.role);
      navigate("/dashboard");
    } else {
      alert("usuario o contraseña son incorrectos");
    }
  });
}

// // logout
// const buttonCloseSession = document.getElementById("close-sesion");
// buttonCloseSession.addEventListener("click", () => {
//   localStorage.setItem("Auth", "false");
//   localStorage.removeItem("role");
//   navigate("/login");
// });


window.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});

window.addEventListener("popstate", () => {
  console.log("se hizo clic");
  console.log(location);
  navigate(location.pathname);
});

function createUser() {
  let form = document.getElementById("register-form")
  form.addEventListener("submit", async (event)=>{
    event.preventDefault()
    let name = document.getElementById("name").value
    let password = document.getElementById("password").value
    let confirmPassword = document.getElementById("confirm-password").value
    let email = document.getElementById("email").value
    console.log(name,password,email)
    let usuarios = {
        "user": name,
        "email": email,
        "password": password,
        "role": "user",
        "courses": "none",
        "dateOfAdmission": "08-Dec-2021"
    }

    // Validaciones
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

async function renderCurses() {
  let containerCurses = document.getElementById("container-curses")
  let dataCurses = await getCurses();
  dataCurses.forEach(curses => {
    containerCurses.innerHTML += `
    <div id="container-curses">
      <p>Evento: ${curses.name}</p>
      <p>${curses.description}</p>
      <p>${curses.dateOfEvent}</p>
      <p>${curses.capacity}</p>
      <button class="admin-btn ${curses}>Edit</button>
      <button class="admin-btn ${curses.id}">Delete</button>
    </div>
    `
  });
}

let buttons = document.querySelectorAll(".delete-btn")
  buttons.forEach(btn =>{
  btn.addEventListener("click", async (e)=>{
      let id = btn.id
      let deleteCurse = await deletes(urlCurses, id)
      if (deleteCurse){
      alert("evento eliminado correctamente")
      navigate("/dashboard");
      location.reload();
    }else{
      alert("no se pudo eliminar el evento")
    }
    })
  })
 
