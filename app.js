let groupedData = {};
let currentList = [];

async function init() {
    try {
        const res = await fetch('data.json');
        const rawStudyData = await res.json();

        // Group by Major
        groupedData = rawStudyData.reduce((acc, item) => {
            const m = item.majior;
            if (!acc[m]) acc[m] = [];
            acc[m].push(item);
            return acc;
        }, {});

        const sel = document.getElementById('majorSelect');
        sel.innerHTML = '<option value="">-- Choose Major --</option>';
        Object.keys(groupedData).sort().forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            sel.appendChild(opt);
        });

    } catch (err) {
        alert("data.json not found or invalid JSON.");
    }
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

document.getElementById('majorSelect').onchange = (e) => {
    const m = e.target.value;
    const ts = document.getElementById('topicSelect');
    ts.disabled = !m;

    if (m) {
        currentList = groupedData[m];
        updateTopics(currentList);
    }
};

function updateTopics(list) {
    const ts = document.getElementById('topicSelect');
    ts.innerHTML = '<option value="">-- Select Topic --</option>';

    list.forEach((item, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = item.topic;
        ts.appendChild(opt);
    });
}

function filter() {
    const m = document.getElementById('majorSelect').value;
    if (!m) return;

    const q = document.getElementById('search').value.toLowerCase();
    currentList = groupedData[m].filter(t =>
        t.topic.toLowerCase().includes(q)
    );

    updateTopics(currentList);
}

document.getElementById('topicSelect').onchange = (e) => {
    const item = currentList[e.target.value];

    if (item) {
        document.getElementById('display').innerHTML = `
            <div class="card">
                <span class="m-tag">${item.majior}</span>
                <h1>${item.topic}</h1>
                <div class="sol-text">${item.solution}</div>
            </div>
        `;
        toggleMenu();
    }
};

function changeFont(d) {
    let s = parseInt(window.getComputedStyle(document.body).fontSize) + d;
    document.body.style.fontSize = s + "px";
    localStorage.setItem('study_fs', s);
}

window.onload = () => {
    document.body.style.fontSize =
        (localStorage.getItem('study_fs') || 18) + "px";
    init();
};