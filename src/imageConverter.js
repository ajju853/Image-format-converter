export function setupImageConverter() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const formatButtons = document.getElementById('formatButtons');
    const preview = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileInfo = document.getElementById('fileInfo');
    const currentFormat = document.getElementById('currentFormat');
    const status = document.getElementById('status');
    const result = document.getElementById('result');

    let currentImage = null;


    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.background = 'rgba(255, 255, 255, 0.1)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'transparent';

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        } else {
            showStatus('Please upload an image file', 'error');
        }
    });

    // Handle file input
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // Handle format conversion
    formatButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('format-btn')) {
            const format = e.target.dataset.format;
            if (currentImage) {
                convertImage(currentImage, format);
            } else {
                showStatus('Please upload an image first', 'error');
            }
        }
    });

    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = e.target.result;
            preview.src = currentImage;
            result.classList.remove('hidden');
            fileInfo.classList.remove('hidden');
            currentFormat.textContent = file.type.split('/')[1].toUpperCase();
            showStatus('Image uploaded successfully', 'success');
        };
        reader.readAsDataURL(file);
    }

    function convertImage(imageData, format) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            try {
                const convertedImage = canvas.toDataURL(`image/${format}`);
                preview.src = convertedImage;
                downloadBtn.href = convertedImage;
                downloadBtn.download = `converted-image.${format}`;
                downloadBtn.classList.remove('hidden');
                showStatus(`Converted to ${format.toUpperCase()} successfully`, 'success');
            } catch (error) {
                showStatus('Error converting image', 'error');
            }
        };
        img.src = imageData;
    }

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');
        setTimeout(() => {
            status.classList.add('hidden');
        }, 3000);
    }
}