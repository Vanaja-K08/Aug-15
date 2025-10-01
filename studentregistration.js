const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('idInput');
const emailidInput = document.getElementById('emailid');
const contactInput = document.getElementById('contact');
const studentListTbody = document.getElementById('studentList');
const emptyState = document.getElementById('emptyState');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let students = JSON.parse(localStorage.getItem('students') || '[]');
let editIndex = -1;
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mobileNav').classList.toggle('hidden');
});

function renderStudents() {
    studentListTbody.innerHTML = '';
    if (!students.length) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    students.forEach((s, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-700/30';
        tr.innerHTML = `
      <td class="px-3 py-2">${idx + 1}</td>
      <td class="px-3 py-2">${escapeHtml(s.name)}</td>
      <td class="px-3 py-2">${escapeHtml(s.id)}</td>
      <td class="px-3 py-2">${escapeHtml(s.emailid)}</td>
      <td class="px-3 py-2">${escapeHtml(s.contact)}</td>
      <td class="px-3 py-2">
        <button data-action="edit" data-index="${idx}" class="mr-2 px-2 py-1 rounded bg-yellow-500 text-slate-900">Edit</button>
        <button data-action="delete" data-index="${idx}" class="px-2 py-1 rounded bg-red-600 text-white">Delete</button>
      </td>
    `;
        studentListTbody.appendChild(tr);
    });
}

function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const stid = idInput.value.trim();
    const emailid = emailidInput.value.trim();
    const contact = contactInput.value.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !stid || !emailid || !contact) {
        alert('Please fill all fields.');
        return;
    }
    if (!regex.test(emailid)) {
        alert('Please enter a valid Email ID.');
        return;
    }
    if (!/^[\d+\-\s()]{5,20}$/.test(stid)) {
        alert('Please enter a valid Student ID contains atleast 5 digits.');
        return;
    }
    if (!/^[\d+\-\s()]{10,10}$/.test(contact)) {
        alert('Please enter a valid contact number contains 10 digits.');
        return;
    }

    const student = { name, id: stid, emailid, contact };
    if (editIndex >= 0) {
        students[editIndex] = student;
        editIndex = -1;
        submitBtn.textContent = 'Register Student';
        cancelEditBtn.classList.add('hidden');
    } else {
        students.push(student);
    }

    saveStudents();
    renderStudents();
    studentForm.reset();
});

cancelEditBtn.addEventListener('click', () => {
    editIndex = -1;
    studentForm.reset();
    submitBtn.textContent = 'Register Student';
    cancelEditBtn.classList.add('hidden');
});

studentListTbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const idx = Number(btn.dataset.index);
    if (action === 'edit') {
        const s = students[idx];
        nameInput.value = s.name;
        idInput.value = s.id;
        emailidInput.value = s.emailid;
        contactInput.value = s.contact;
        editIndex = idx;
        submitBtn.textContent = 'Update Student';
        cancelEditBtn.classList.remove('hidden');
        document.getElementById('form').scrollIntoView({ behavior: 'smooth' });
    }
    if (action === 'delete') {
        if (!confirm('Delete this Student?')) return;
        students.splice(idx, 1);
        saveStudents();
        renderStudents();
    }
});

renderStudents();