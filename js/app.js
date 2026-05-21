// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Create Form Handler
const createForm = document.getElementById('createForm');
const previewBtn = document.getElementById('previewBtn');
const generateBtn = document.getElementById('generateBtn');

previewBtn.addEventListener('click', () => {
    if (createForm.checkValidity() === false) {
        alert('Mohon isi semua field yang wajib diisi!');
        return;
    }
    showPreview(getFormData(createForm));
});

generateBt.addEventListener('click', () => {
    if (createForm.checkValidity() === false) {
        alert('Mohon isi semua field yang wajib diisi!');
        return;
    }
    generateSOR(getFormData(createForm));
});

// Edit Form Handler
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const editForm = document.getElementById('editForm');
const updateBtn = document.getElementById('updateBtn');
const clearEditBtn = document.getElementById('clearEditBtn');

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#1e40af';
    uploadArea.style.background = 'rgba(37, 99, 235, 0.15)';
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#2563eb';
    uploadArea.style.background = 'rgba(37, 99, 235, 0.05)';
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2563eb';
    uploadArea.style.background = 'rgba(37, 99, 235, 0.05)';
    handleFileUpload(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = parseSOR(e.target.result);
            if (data) {
                populateEditForm(data);
                editForm.style.display = 'grid';
                uploadArea.style.display = 'none';
            }
        } catch (error) {
            alert('Error membaca file SOR: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function populateEditForm(data) {
    document.getElementById('editCableId').value = data.cableId || '';
    document.getElementById('editOperator').value = data.operator || '';
    document.getElementById('editOrgLocation').value = data.orgLocation || '';
    document.getElementById('editTermLocation').value = data.termLocation || '';
    document.getElementById('editComment').value = data.comment || '';
}

clearEditBtn.addEventListener('click', () => {
    editForm.style.display = 'none';
    uploadArea.style.display = 'block';
    editForm.reset();
    fileInput.value = '';
});

updateBtn.addEventListener('click', () => {
    const data = getFormData(editForm);
    downloadSOR(data);
});

// Template Handler
const templateCards = document.querySelectorAll('.template-card');
const templateForm = document.getElementById('templateForm');
const backTemplateBtn = document.getElementById('backTemplateBtn');
const generateTemplateBtn = document.getElementById('generateTemplateBtn');
const templateGrid = document.querySelector('.template-grid');

const templates = {
    'anritsu-standard': {
        wavelength: '1310',
        pulseWidth: '10',
        range: '50',
        resolution: '1',
        fiberType: 'SMF',
        otdrModel: 'ANRITSU MT9090A',
        numDataPoints: '5000',
        attenuationRate: '0.35'
    },
    'anritsu-extended': {
        wavelength: '1310',
        pulseWidth: '30',
        range: '100',
        resolution: '2',
        fiberType: 'SMF',
        otdrModel: 'ANRITSU MT9090A',
        numDataPoints: '10000',
        attenuationRate: '0.35'
    },
    'high-resolution': {
        wavelength: '1550',
        pulseWidth: '0.3',
        range: '10',
        resolution: '0.5',
        fiberType: 'SMF',
        otdrModel: 'ANRITSU MT9090A',
        numDataPoints: '10000',
        attenuationRate: '0.2'
    },
    'long-range': {
        wavelength: '1550',
        pulseWidth: '100',
        range: '100',
        resolution: '5',
        fiberType: 'SMF',
        otdrModel: 'ANRITSU MT9090A',
        numDataPoints: '5000',
        attenuationRate: '0.35'
    },
    'standard-test': {
        wavelength: '1310',
        pulseWidth: '5',
        range: '25',
        resolution: '0.5',
        fiberType: 'SMF',
        otdrModel: 'ANRITSU MT9090A',
        numDataPoints: '3000',
        attenuationRate: '0.35'
    }
};

templateCards.forEach(card => {
    card.addEventListener('click', () => {
        const templateName = card.getAttribute('data-template');
        const template = templates[templateName];
        
        if (template) {
            // Populate template form
            Object.keys(template).forEach(key => {
                const input = templateForm.querySelector(`[name="${key}"]`);
                if (input) input.value = template[key];
            });
            
            // Show template form, hide template grid
            templateGrid.style.display = 'none';
            templateForm.style.display = 'grid';
        }
    });
});

backTemplateBtn.addEventListener('click', () => {
    templateGrid.style.display = 'grid';
    templateForm.style.display = 'none';
    templateForm.reset();
});

generateTemplateBtn.addEventListener('click', () => {
    if (templateForm.checkValidity() === false) {
        alert('Mohon isi semua field yang wajib diisi!');
        return;
    }
    generateSOR(getFormData(templateForm));
});

// Helper Functions
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function showPreview(data) {
    const modal = document.getElementById('previewModal');
    const modalInfo = document.getElementById('modalInfo');
    const tableBody = document.getElementById('tableBody');
    
    // Generate preview info
    let infoHtml = `
        <strong>Cable ID:</strong> ${data.cableId}<br>
        <strong>Fiber Type:</strong> ${data.fiberType}<br>
        <strong>Wavelength:</strong> ${data.wavelength} nm<br>
        <strong>Range:</strong> ${data.range} km<br>
        <strong>Data Points:</strong> ${data.numDataPoints}
    `;
    modalInfo.innerHTML = infoHtml;
    
    // Generate preview data
    tableBody.innerHTML = '';
    const numDataPoints = Math.min(parseInt(data.numDataPoints), 20); // Show max 20
    const dataPoints = generateDataPoints(data);
    
    dataPoints.slice(0, 20).forEach((point, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${point.distance.toFixed(3)}</td>
                <td>${point.power.toFixed(2)}</td>
                <td>${point.reflectance.toFixed(2)}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    
    modal.style.display = 'flex';
}

function closePreviewModal() {
    document.getElementById('previewModal').style.display = 'none';
}

// Close modal on outside click
document.getElementById('previewModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') {
        closePreviewModal();
    }
});

window.closePreviewModal = closePreviewModal;