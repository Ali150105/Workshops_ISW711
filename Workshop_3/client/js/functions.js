const API_URL = "http://localhost:3001/teachers";

async function getTeachers() {
  const response = await fetch(API_URL);
  const teachers = await response.json();
  const tableBody = document.getElementById('teachersTable');
  tableBody.innerHTML = '';

  teachers.forEach(teacher => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${teacher.first_name}</td>
      <td>${teacher.last_name}</td>
      <td>${teacher.cedula}</td>
      <td>${teacher.age}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editTeacher('${teacher._id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${teacher._id}')">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function saveTeacher() {
  const id = document.getElementById('teacherId').value;
  const teacher = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    cedula: document.getElementById('cedula').value,
    age: document.getElementById('age').value
  };

  let method = "POST";
  let url = API_URL;
  if (id) {
    method = "PUT";
    url = `${API_URL}/${id}`;
  }

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(teacher)
  });

  if (response.ok) {
    alert(id ? "Profesor actualizado" : "Profesor agregado");
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherId').value = "";
    getTeachers();
    bootstrap.Modal.getInstance(document.getElementById('modalTeacher')).hide();
  } else {
    alert("Error al guardar el profesor");
  }
}

async function editTeacher(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const teacher = await response.json();

  document.getElementById('teacherId').value = teacher._id;
  document.getElementById('first_name').value = teacher.first_name;
  document.getElementById('last_name').value = teacher.last_name;
  document.getElementById('cedula').value = teacher.cedula;
  document.getElementById('age').value = teacher.age;
  document.getElementById('modalTitle').textContent = "Editar Profesor";

  new bootstrap.Modal(document.getElementById('modalTeacher')).show();
}

async function deleteTeacher(id) {
  if (confirm("¿Estás seguro de eliminar este profesor?")) {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (response.ok) {
      alert("Profesor eliminado");
      getTeachers();
    } else {
      alert("Error al eliminar el profesor");
    }
  }
}

function clearForm() {
  document.getElementById('teacherForm').reset();
  document.getElementById('teacherId').value = "";
  document.getElementById('modalTitle').textContent = "Agregar Profesor";
}