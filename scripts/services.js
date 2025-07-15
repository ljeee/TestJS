// Obtiene la lista de usuarios desde el backend
export async function getUsers() {
  const res = await fetch("http://localhost:3000/usuarios");
  const data = await res.json();
  return data;
}

// Obtiene la lista de cursos/eventos desde el backend
export async function getCourses() {
  const res = await fetch("http://localhost:3000/courses");
  const data = await res.json();
  return data;
}

// Crea un nuevo recurso en el backend (usuario o curso)
export async function post(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en POST:", error.message || error);
    throw error;
  }
}

// Actualiza un recurso existente en el backend (usuario o curso)
// body debe ser un objeto con los datos actualizados
export async function update(url, id, body) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("PUT actualizado:", data);
    return data;
  } catch (error) {
    console.error("Error en PUT:", error);
    throw error;
  }
}

// Elimina un recurso del backend (usuario o curso) por id
export async function deletes(url, id) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("DELETE: recurso eliminado correctamente");
      return true;
    } else {
      console.error("Error al eliminar");
      return false;
    }
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
}