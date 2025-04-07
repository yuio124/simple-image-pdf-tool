// 전역 변수 (DOM 로딩 전에도 접근 가능해야 하는 것들)
const { jsPDF } = window.jspdf;
const Tesseract = window.Tesseract; // Tesseract 객체 (window에서 가져옴)
let images = [];
let pdf = null;
let dragSrcEl = null;
let isOcrRunning = false; // OCR 실행 중 플래그

// --- HTML 문서 로딩 완료 후 실행될 코드 ---
document.addEventListener('DOMContentLoaded', () => {

    // DOM 요소 선택 (이제 안전하게 요소를 찾을 수 있음)
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectBtn');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const generateBtn = document.getElementById('generateBtn');
    const status = document.getElementById('status');
    const sortSelect = document.getElementById('sortSelect');
    const qualitySelect = document.getElementById('qualitySelect');
    const filenameInput = document.getElementById('pdfFilename');
    const loadingSpinnerContainer = document.getElementById('loadingSpinnerContainer');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const splitPageCountInput = document.getElementById('splitPageCount');
    const imageCountDisplay = document.getElementById('imageCountDisplay');
    // OCR 모달 요소
    const ocrModal = document.getElementById('ocrModal');
    const ocrModalTitle = document.getElementById('ocrModalTitle');
    const ocrResultText = document.getElementById('ocrResultText');
    const ocrModalCloseBtn = document.getElementById('ocrModalCloseBtn'); // 닫기 버튼도 선택

    // --- 이벤트 리스너 추가 ---
    selectBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeaveUpload);
    uploadArea.addEventListener('drop', handleDrop);
    generateBtn.addEventListener('click', generatePDF); // generatePDF는 async 함수
    clearAllBtn.addEventListener('click', clearAllImages);
    sortSelect.addEventListener('change', () => { sortImages(); renderImagePreview(); }); // 정렬 변경 시 바로 적용

    // OCR 버튼 클릭 이벤트 리스너 (이벤트 위임)
    imagePreview.addEventListener('click', function(event) {
        if (event.target.classList.contains('ocr-btn-on-item')) {
            if (isOcrRunning) {
                alert("현재 다른 OCR 작업이 실행 중입니다. 잠시 후 다시 시도해주세요.");
                return;
            }
            const index = parseInt(event.target.dataset.index);
            runOCR(index);
        }
    });

    // OCR 모달 닫기 버튼 리스너
     if(ocrModalCloseBtn) { // 버튼이 존재하는지 확인 후 리스너 추가
         ocrModalCloseBtn.addEventListener('click', closeOcrModal);
     }


    // --- 초기 설정 ---
    document.querySelector('input[name="pdfSizeMode"][value="a4"]').checked = true;
    qualitySelect.value = 'MEDIUM';
    filenameInput.value = '이미지_모음';
    splitPageCountInput.value = '0';
    renderImagePreview(); // 초기 렌더링 (버튼 상태 포함)


    // --- 함수 정의들 (DOMContentLoaded 내부에 위치해도 되고, 밖에 있어도 됨) ---
    // 여기서는 함수 정의들을 이 리스너 바깥(아래)에 두어 코드를 분리합니다.
    // 단, 호출되기 전에 정의되어 있어야 합니다.

}); // --- End of DOMContentLoaded Listener ---


// --- 함수 정의 영역 ---

// 파일 선택 처리
function handleFileSelect(e) {
    const fileInput = document.getElementById('fileInput'); // 함수 내에서 다시 선택하거나 매개변수로 전달 필요
    const files = e.target.files; if (!files || files.length === 0) return; addImagesToCollection(files); fileInput.value = '';
}
// 드래그 & 드롭 관련 함수들
function handleDragOver(e) { e.preventDefault(); e.stopPropagation(); document.getElementById('uploadArea').classList.add('drag-over'); }
function handleDragLeaveUpload(e) { e.preventDefault(); e.stopPropagation(); document.getElementById('uploadArea').classList.remove('drag-over'); }
function handleDrop(e) {
    e.preventDefault(); e.stopPropagation(); document.getElementById('uploadArea').classList.remove('drag-over'); const files = e.dataTransfer.files; if (!files || files.length === 0) return; addImagesToCollection(files);
}
// 전체 삭제 함수
function clearAllImages() {
     if (images.length > 0) {
          // Optional: Confirm
         images = [];
         renderImagePreview(); // UI 업데이트
         document.getElementById('filenameInput').value = '이미지_모음'; // DOM 요소 접근 필요
         document.getElementById('splitPageCount').value = '0';      // DOM 요소 접근 필요
     }
}
// 이미지 컬렉션에 추가
function addImagesToCollection(files) {
    let fileReadPromises = []; let invalidFileFound = false;
    const status = document.getElementById('status'); // 함수 내에서 요소 접근
    status.textContent = "파일 읽는 중...";
    document.getElementById('loadingSpinnerContainer').style.display = 'none'; // 함수 내에서 요소 접근

    for (let i = 0; i < files.length; i++) {
        const file = files[i]; if (!file.type.match('image.*')) { status.textContent = `'${file.name}' 파일은 이미지 파일이 아닙니다.`; invalidFileFound = true; continue; }
        const promise = new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = (e) => resolve({ data: e.target.result, file: file, name: file.name }); reader.onerror = (error) => reject(new Error(`'${file.name}' 파일 읽기 오류`)); reader.readAsDataURL(file); }); fileReadPromises.push(promise);
    }
    Promise.all(fileReadPromises).then(readImages => { images = images.concat(readImages); sortImages(); renderImagePreview(); }).catch(error => { status.textContent = error.message; renderImagePreview(); });
}
// 이미지 정렬 함수
function sortImages() {
    const sortSelect = document.getElementById('sortSelect'); // 함수 내에서 요소 접근
    const sortBy = sortSelect.value;
    if (sortBy === 'name') images.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'nameDesc') images.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'date') images.sort((a, b) => a.file.lastModified - b.file.lastModified);
    else if (sortBy === 'dateDesc') images.sort((a, b) => b.file.lastModified - a.file.lastModified);
}
// --- 드래그 앤 드롭 (미리보기 순서) ---
function handleDragStart(e) { dragSrcEl = this; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/html', this.innerHTML); this.classList.add('dragging'); }
function handleDragOverItem(e) { if (e.preventDefault) { e.preventDefault(); } e.dataTransfer.dropEffect = 'move'; this.classList.add('drag-over'); return false; }
function handleDragLeaveItem(e) { this.classList.remove('drag-over'); }
function handleDropItem(e) {
    const imagePreview = document.getElementById('imagePreview'); // 함수 내에서 요소 접근
    const sortSelect = document.getElementById('sortSelect');
    e.stopPropagation(); e.preventDefault(); if (dragSrcEl !== this) { const allItems = Array.from(imagePreview.querySelectorAll('.image-item')); const fromIndex = allItems.indexOf(dragSrcEl); const toIndex = allItems.indexOf(this); const movedItem = images.splice(fromIndex, 1)[0]; images.splice(toIndex, 0, movedItem); sortSelect.value = 'none'; renderImagePreview(); } this.classList.remove('drag-over'); return false;
}
function handleDragEnd(e) { this.classList.remove('dragging'); document.getElementById('imagePreview').querySelectorAll('.image-item').forEach(item => item.classList.remove('drag-over')); }
// --- End Drag/Drop ---

// 이미지 미리보기 렌더링
function renderImagePreview() {
    // 함수 내에서 필요한 DOM 요소 다시 선택
    const imagePreview = document.getElementById('imagePreview');
    const imageCountDisplay = document.getElementById('imageCountDisplay');
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const status = document.getElementById('status');
    const loadingSpinnerContainer = document.getElementById('loadingSpinnerContainer');

    imagePreview.innerHTML = ''; // 초기화
    images.forEach((image, index) => {
        const imageItem = document.createElement('div'); imageItem.className = 'image-item'; imageItem.draggable = true; imageItem.dataset.index = index;
        imageItem.addEventListener('dragstart', handleDragStart, false); imageItem.addEventListener('dragover', handleDragOverItem, false); imageItem.addEventListener('dragleave', handleDragLeaveItem, false); imageItem.addEventListener('drop', handleDropItem, false); imageItem.addEventListener('dragend', handleDragEnd, false);
        const img = document.createElement('img'); img.src = image.data; img.alt = image.name;
        const removeBtn = document.createElement('button'); removeBtn.className = 'remove-btn'; removeBtn.innerHTML = 'X'; removeBtn.title = '이미지 제거'; removeBtn.onclick = () => { images.splice(index, 1); renderImagePreview(); };
        const ocrBtn = document.createElement('button'); ocrBtn.className = 'ocr-btn-on-item'; ocrBtn.innerHTML = 'OCR'; ocrBtn.title = '텍스트 인식 (OCR)'; ocrBtn.dataset.index = index;
        const dragHandle = document.createElement('div'); dragHandle.className = 'drag-handle'; dragHandle.innerHTML = '≡'; dragHandle.title = '드래그하여 순서 변경';
        imageItem.appendChild(img); imageItem.appendChild(removeBtn); imageItem.appendChild(ocrBtn); imageItem.appendChild(dragHandle);
        imagePreview.appendChild(imageItem);
    });
    const imageCount = images.length; imageCountDisplay.textContent = `업로드된 이미지 (${imageCount}개)`;
    const hasImages = imageCount > 0; generateBtn.disabled = !hasImages; clearAllBtn.disabled = !hasImages;
    const currentStatus = status.textContent; if (!currentStatus.includes('읽는 중') && !currentStatus.includes('생성 중') && !currentStatus.includes('OCR')) { if (hasImages && !currentStatus.includes('오류') && !currentStatus.includes('아닙니다')) { status.textContent = `${images.length}개의 이미지가 준비되었습니다.`; } else if (!hasImages) { status.textContent = ''; } } if (!currentStatus.includes('생성 중') && !currentStatus.includes('OCR')) { loadingSpinnerContainer.style.display = 'none'; }
}

// --- OCR 관련 함수 ---
async function runOCR(index) {
     const status = document.getElementById('status'); // 함수 내에서 요소 접근
     const imagePreview = document.getElementById('imagePreview'); // 함수 내에서 요소 접근
     const imageToOCR = images[index]; if (!imageToOCR || !Tesseract) return;
     isOcrRunning = true; const originalStatus = status.textContent; status.textContent = `OCR 처리 중: '${imageToOCR.name}' (첫 실행 시 언어 데이터 다운로드 가능)`; const ocrButton = imagePreview.querySelector(`.ocr-btn-on-item[data-index="${index}"]`); if(ocrButton) ocrButton.disabled = true;
     try {
         const worker = await Tesseract.createWorker('kor', 1, { logger: m => { console.log(m); if (m.status === 'recognizing text') { status.textContent = `텍스트 인식 중... (${Math.round(m.progress * 100)}%)`; } } });
         const { data: { text } } = await worker.recognize(imageToOCR.data); await worker.terminate();
         console.log('Recognized Text:', text); status.textContent = `OCR 완료: '${imageToOCR.name}'`; displayOCRResult(text, imageToOCR.name);
     } catch (err) {
         console.error("OCR Error:", err); status.textContent = `OCR 오류: '${imageToOCR.name}'`; alert("OCR 처리 중 오류가 발생했습니다: " + err.message);
     } finally {
         isOcrRunning = false; if(ocrButton) ocrButton.disabled = false;
         setTimeout(() => { if(status.textContent.includes('OCR')) renderImagePreview(); }, 3000);
     }
}
function displayOCRResult(text, filename) {
    const ocrModal = document.getElementById('ocrModal'); // 함수 내에서 요소 접근
    const ocrModalTitle = document.getElementById('ocrModalTitle');
    const ocrResultText = document.getElementById('ocrResultText');
    ocrModalTitle.textContent = `OCR 결과: ${filename}`; ocrResultText.textContent = text || "(추출된 텍스트 없음)"; ocrModal.style.display = 'flex';
}
function closeOcrModal() { document.getElementById('ocrModal').style.display = 'none'; } // 함수 내에서 요소 접근
// --- End OCR 함수 ---

// --- 비동기 이미지 로딩 헬퍼 함수 ---
function loadImageAsync(src) {
    return new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = (err) => reject(err); img.src = src; });
}

// --- 최종 파일 이름 생성 함수 (분할 고려) ---
function getFinalFilename(partIndex = null) {
     const filenameInput = document.getElementById('pdfFilename'); // 함수 내에서 요소 접근
     const splitPageCountInput = document.getElementById('splitPageCount'); // 함수 내에서 요소 접근
     let filename = filenameInput.value.trim(); if (!filename) { filename = '이미지_모음'; }
     const splitLimit = parseInt(splitPageCountInput.value) || 0;
     if (splitLimit > 0 && partIndex !== null && images.length > splitLimit) { filename += `_part${partIndex}`; }
     if (!filename.toLowerCase().endsWith('.pdf')) { filename += '.pdf'; } return filename;
}

// --- PDF 생성 완료 처리 함수 ---
function completeGeneration(successMessage) {
    const status = document.getElementById('status'); // 함수 내에서 요소 접근
    const loadingSpinnerContainer = document.getElementById('loadingSpinnerContainer');
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    status.textContent = successMessage; loadingSpinnerContainer.style.display = 'none';
    const hasImages = images.length > 0; generateBtn.disabled = !hasImages; clearAllBtn.disabled = !hasImages;
}

// --- PDF 생성 함수 (비동기 루프 및 분할 로직 적용) ---
async function generatePDF() {
    const status = document.getElementById('status'); // 함수 내에서 요소 접근
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const loadingSpinnerContainer = document.getElementById('loadingSpinnerContainer');
    const qualitySelect = document.getElementById('qualitySelect');
    const splitPageCountInput = document.getElementById('splitPageCount');

    if (images.length === 0) { status.textContent = '이미지를 먼저 추가하세요.'; return; }
    if (isOcrRunning) { alert("OCR 작업이 실행 중입니다. 완료 후 PDF 생성을 시도해주세요."); return; }

    generateBtn.disabled = true; clearAllBtn.disabled = true; loadingSpinnerContainer.style.display = 'inline-block'; status.textContent = 'PDF 생성 준비 중... (0%)';
    const sizeMode = document.querySelector('input[name="pdfSizeMode"]:checked').value; const qualitySetting = qualitySelect.value; const splitLimit = parseInt(splitPageCountInput.value) || 0;
    let currentPageInCurrentPDF = 0; let currentPDFIndex = 1; pdf = null;

    for (let i = 0; i < images.length; i++) {
        const currentImage = images[i]; const progress = Math.round(((i + 1) / images.length) * 100); status.textContent = `이미지 처리 중 ${i + 1}/${images.length} (${progress}%)`;
        try {
            const img = await loadImageAsync(currentImage.data); const imageWidth = img.width; const imageHeight = img.height;
            let pageConfig = {};
            if (sizeMode === 'image') { const pxToMm = 25.4 / 96; const imgWidthMm = imageWidth * pxToMm; const imgHeightMm = imageHeight * pxToMm; pageConfig = { unit: 'mm', orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait', format: [imgWidthMm, imgHeightMm], imgX: 0, imgY: 0, imgTargetWidth: imgWidthMm, imgTargetHeight: imgHeightMm }; }
            else { const margin = 0; const pageWidth = 210; const pageHeight = 297; const maxWidth = pageWidth - (margin*2); const maxHeight = pageHeight - (margin*2); const ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight); pageConfig = { unit: 'mm', orientation: 'portrait', format: 'a4', imgTargetWidth: imageWidth * ratio, imgTargetHeight: imageHeight * ratio, imgX: (pageWidth - (imageWidth * ratio)) / 2, imgY: (pageHeight - (imageHeight * ratio)) / 2 }; }

            if (pdf === null) { pdf = new jsPDF({ orientation: pageConfig.orientation, unit: pageConfig.unit, format: pageConfig.format }); currentPageInCurrentPDF = 0; }
            else { if(currentPageInCurrentPDF > 0 || (sizeMode === 'image' && i > 0)) { pdf.addPage(pageConfig.format, pageConfig.orientation); } }

            pdf.addImage(img, 'JPEG', pageConfig.imgX, pageConfig.imgY, pageConfig.imgTargetWidth, pageConfig.imgTargetHeight, null, qualitySetting); currentPageInCurrentPDF++;

            if (splitLimit > 0 && currentPageInCurrentPDF >= splitLimit && i < images.length - 1) {
                status.textContent = `PDF 파트 ${currentPDFIndex} 저장 중...`; pdf.save(getFinalFilename(currentPDFIndex)); currentPDFIndex++; pdf = null; await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (error) {
            console.error(`Error processing image ${i}: ${currentImage.name}`, error); status.textContent = `오류: 이미지 ${i+1} 처리 실패. 건너<0xEB>뜁니다.`; await new Promise(resolve => setTimeout(resolve, 100));
        }
    } // End for loop

    if (pdf !== null) { status.textContent = `PDF ${splitLimit > 0 && images.length > splitLimit ? '마지막 파트 ' : ''}저장 중...`; pdf.save(getFinalFilename(currentPDFIndex)); completeGeneration(`PDF ${splitLimit > 0 && images.length > splitLimit ? `총 ${currentPDFIndex}개 파트 ` : ''}생성이 완료되었습니다.`); }
    else if (images.length > 0) { completeGeneration('PDF 생성이 완료되지 않았습니다 (오류 발생 가능).'); }
    else { completeGeneration(''); }
} // End async generatePDF