// 전역 변수
const { jsPDF } = window.jspdf;
const Tesseract = window.Tesseract; // Tesseract 객체
let images = [];
let pdf = null;
let dragSrcEl = null;
let isOcrRunning = false; // OCR 실행 중 플래그
let isGeneratingPdf = false; // PDF 생성 중 플래그 추가
let currentLang = 'ko'; // 현재 언어 코드 (기본값)

// --- 언어 텍스트 데이터 직접 정의 ---
const translations = {
    'ko': {
        "pageTitle": "이미지 PDF 변환 및 OCR",
        "mainTitle": "이미지 PDF 변환 및 OCR",
        "uploadInstruction": "이미지 파일을 여기에 드래그하거나 클릭하여 선택하세요",
        "selectBtnText": "파일 선택",
        "sortLabel": "정렬 기준:",
        "sortOptNone": "정렬 안함 (수동 순서)",
        "sortOptNameAsc": "파일 이름 (오름차순)",
        "sortOptNameDesc": "파일 이름 (내림차순)",
        "sortOptDateAsc": "날짜 (오래된 순)",
        "sortOptDateDesc": "날짜 (최신 순)",
        "clearAllBtnText": "전체 삭제",
        "pdfControlsTitle": "PDF 생성 옵션",
        "pdfSizeLabel": "PDF 페이지 크기:",
        "pdfSizeOptA4": "A4 맞춤",
        "pdfSizeOptImage": "이미지 크기",
        "qualityLabel": "이미지 품질:",
        "qualityOptMedium": "중간화질 (기본)",
        "qualityOptFast": "저화질 (파일 크기 작음)",
        "qualityOptSlow": "고화질",
        "qualityOptNone": "원본화질 (압축 최소화)",
        "filenameLabel": "PDF 파일 이름:",
        "filenameInput": "이미지_모음",
        "splitLabel": "페이지 수로 분할:",
        "splitUnit": "페이지 마다 (0 = 분할 안함)",
        "generateBtnText": "PDF 생성",
        "imageCountText": "업로드된 이미지 ({count}개)",
        "removeBtnTitle": "이미지 제거",
        "ocrBtnTitle": "텍스트 인식 (OCR)",
        "dragHandleTitle": "드래그하여 순서 변경",
        "ocrModalTitleKey": "OCR 결과: {filename}",
        "ocrModalCloseBtnText": "닫기",
        "ocrResultPlaceholder": "(추출된 텍스트 없음)",
        "status_reading": "파일 읽는 중...",
        "status_invalid_file": "'{filename}' 파일은 이미지 파일이 아닙니다.",
        "status_read_error": "'{filename}' 파일 읽기 오류",
        "status_ready": "{count}개의 이미지가 준비되었습니다.",
        "status_no_images": "이미지를 먼저 추가하세요.",
        "status_pdf_prep": "PDF 생성 준비 중... (0%)",
        "status_pdf_progress": "이미지 처리 중 {current}/{total} ({progress}%)",
        "status_pdf_saving_part": "PDF 파트 {partIndex} 저장 중...",
        "status_pdf_saving_last": "PDF {partInfo}저장 중...",
        "status_pdf_saving_last_part": "마지막 파트 ",
        "status_pdf_complete": "PDF {partInfo}생성이 완료되었습니다.",
        "status_pdf_complete_multi": "총 {count}개 파트 ",
        "status_pdf_error": "PDF 저장 중 오류가 발생했습니다.",
        "status_pdf_error_final": "PDF 생성이 완료되지 않았습니다 (오류 발생 가능).",
        "status_pdf_image_error": "오류: 이미지 {index} 처리 실패. 건너뜁니다.",
        "status_pdf_image_load_error": "'{filename}' 이미지 로드 실패. 건너뜁니다.",
        "status_ocr_running_other": "현재 다른 OCR 작업이 실행 중입니다. 잠시 후 다시 시도해주세요.",
        "status_ocr_prep": "OCR 처리 중: '{filename}' (첫 실행 시 언어 데이터 다운로드 가능)",
        "status_ocr_recognizing": "텍스트 인식 중... ({progress}%)",
        "status_ocr_complete": "OCR 완료: '{filename}'",
        "status_ocr_error": "OCR 오류: '{filename}'",
        "alert_ocr_error": "OCR 처리 중 오류가 발생했습니다: {message}",
        "alert_ocr_while_generating": "PDF 생성 중에는 OCR을 실행할 수 없습니다.",
        "alert_generate_while_ocr": "OCR 작업이 실행 중입니다. 완료 후 PDF 생성을 시도해주세요."
    },
    'en': {
        "pageTitle": "Image to PDF Converter & OCR",
        "mainTitle": "Image to PDF Converter & OCR",
        "uploadInstruction": "Drag & drop image files here or click to select",
        "selectBtnText": "Select Files",
        "sortLabel": "Sort by:",
        "sortOptNone": "Manual Order",
        "sortOptNameAsc": "Filename (Asc)",
        "sortOptNameDesc": "Filename (Desc)",
        "sortOptDateAsc": "Date (Oldest first)",
        "sortOptDateDesc": "Date (Newest first)",
        "clearAllBtnText": "Clear All",
        "pdfControlsTitle": "PDF Generation Options",
        "pdfSizeLabel": "PDF Page Size:",
        "pdfSizeOptA4": "Fit to A4",
        "pdfSizeOptImage": "Image Size",
        "qualityLabel": "Image Quality:",
        "qualityOptMedium": "Medium (Default)",
        "qualityOptFast": "Low (Smaller Size)",
        "qualityOptSlow": "High",
        "qualityOptNone": "Maximum (Min Compress)",
        "filenameLabel": "PDF Filename:",
        "filenameInput": "image_collection",
        "splitLabel": "Split by Pages:",
        "splitUnit": "pages per file (0 = No split)",
        "generateBtnText": "Generate PDF",
        "imageCountText": "Uploaded Images ({count})",
        "removeBtnTitle": "Remove Image",
        "ocrBtnTitle": "Recognize Text (OCR)",
        "dragHandleTitle": "Drag to reorder",
        "ocrModalTitleKey": "OCR Result: {filename}",
        "ocrModalCloseBtnText": "Close",
        "ocrResultPlaceholder": "(No text extracted)",
        "status_reading": "Reading files...",
        "status_invalid_file": "'{filename}' is not a valid image file.",
        "status_read_error": "Error reading file '{filename}'",
        "status_ready": "{count} images ready.",
        "status_no_images": "Please add images first.",
        "status_pdf_prep": "Preparing PDF generation... (0%)",
        "status_pdf_progress": "Processing image {current}/{total} ({progress}%)",
        "status_pdf_saving_part": "Saving PDF part {partIndex}...",
        "status_pdf_saving_last": "Saving PDF {partInfo}...",
        "status_pdf_saving_last_part": "last part ",
        "status_pdf_complete": "PDF {partInfo}generation complete.",
        "status_pdf_complete_multi": "{count} parts total ",
        "status_pdf_error": "Error saving PDF.",
        "status_pdf_error_final": "PDF generation did not complete (possible errors).",
        "status_pdf_image_error": "Error: Failed to process image {index}. Skipping.",
        "status_pdf_image_load_error": "Failed to load image '{filename}'. Skipping.",
        "status_ocr_running_other": "Another OCR process is currently running. Please wait.",
        "status_ocr_prep": "Processing OCR: '{filename}' (Language data may download on first run)",
        "status_ocr_recognizing": "Recognizing text... ({progress}%)",
        "status_ocr_complete": "OCR Complete: '{filename}'",
        "status_ocr_error": "OCR Error: '{filename}'",
        "alert_ocr_error": "An error occurred during OCR processing: {message}",
        "alert_ocr_while_generating": "Cannot run OCR while PDF generation is in progress.",
        "alert_generate_while_ocr": "OCR process is running. Please wait until it finishes before generating PDF."
    }
};
let currentLangStrings = translations[currentLang]; // 현재 언어 문자열 객체

// --- 유틸리티 함수 ---
function formatString(str, values) {
    if (!str) return '';
    return str.replace(/\{(\w+)\}/g, (match, key) => {
        return typeof values[key] !== 'undefined' ? values[key] : match;
    });
}

// --- 언어 관련 함수 ---
function switchLanguage(langCode) {
    if (translations[langCode]) {
        currentLang = langCode;
        currentLangStrings = translations[langCode];
        document.documentElement.lang = langCode;
        localStorage.setItem('preferredLang', langCode);
        updateUI(); // 언어 변경 후 UI 즉시 업데이트
        // 파일 이름 입력 필드 기본값도 업데이트
        const filenameInput = document.getElementById('pdfFilename');
        if (filenameInput) {
            filenameInput.value = currentLangStrings.filenameInput || (langCode === 'ko' ? '이미지_모음' : 'image_collection');
        }
    } else {
        console.error("지원하지 않는 언어 코드:", langCode);
    }
}

function updateUI() {
    // data-lang-key 속성을 가진 모든 요소 업데이트
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.dataset.langKey;
        const titleKey = element.dataset.langKeyTitle; // title 번역 키

        if (currentLangStrings[key]) {
            const translation = currentLangStrings[key];
            if (element.tagName === 'INPUT') {
                if (element.type === 'button' || element.type === 'submit' || element.type === 'reset') {
                    element.value = translation;
                } else if (element.placeholder) {
                    element.placeholder = translation;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        }
        // Title 속성 업데이트
        if (titleKey && currentLangStrings[titleKey]) {
            element.title = currentLangStrings[titleKey];
        }
    });
    // 동적으로 업데이트되는 부분들
    updateImageCountDisplay();
    // 버튼 title 업데이트 (renderImagePreview에서도 하지만, 언어 변경 시 즉시 반영 위해)
    document.querySelectorAll('.remove-btn').forEach(btn => btn.title = currentLangStrings.removeBtnTitle || '이미지 제거');
    document.querySelectorAll('.ocr-btn-on-item').forEach(btn => btn.title = currentLangStrings.ocrBtnTitle || '텍스트 인식 (OCR)');
    document.querySelectorAll('.drag-handle').forEach(btn => btn.title = currentLangStrings.dragHandleTitle || '드래그하여 순서 변경');
}

function updateImageCountDisplay() {
    const imageCountDisplay = document.getElementById('imageCountDisplay');
    const imageCount = images.length;
    if (imageCountDisplay) {
        imageCountDisplay.textContent = formatString(currentLangStrings.imageCountText || "업로드된 이미지 ({count}개)", { count: imageCount });
    }
}

function updateStatusMessage(key, values = {}) {
    const status = document.getElementById('status');
    if (status && key === 'clear') {
        status.textContent = '';
        return;
    }
    if (status && currentLangStrings[key]) {
        status.textContent = formatString(currentLangStrings[key], values);
    } else if (status && key === 'error') { // 오류 키 직접 처리
        status.textContent = values?.message || '알 수 없는 오류 발생'; // Fallback error message
    } else if (status) {
        status.textContent = values?.message || ''; // Fallback or clear
    }
}


// --- DOMContentLoaded 이벤트 리스너 ---
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 선택
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
    const languageSelector = document.getElementById('languageSelector');
    const ocrModal = document.getElementById('ocrModal');
    const ocrModalTitle = document.getElementById('ocrModalTitle');
    const ocrResultText = document.getElementById('ocrResultText');
    const ocrModalCloseBtn = document.getElementById('ocrModalCloseBtn');

    // --- 이벤트 리스너 추가 ---
    if (selectBtn && fileInput) {
        selectBtn.addEventListener('click', () => { fileInput.click(); });
    } else { console.error('selectBtn 또는 fileInput 요소를 찾을 수 없습니다!'); }

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    } else { console.error('fileInput 요소를 찾을 수 없습니다!'); }

    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeaveUpload);
        uploadArea.addEventListener('drop', handleDrop);
    } else { console.error('uploadArea 요소를 찾을 수 없습니다!'); }

    if (generateBtn) {
        generateBtn.addEventListener('click', generatePDF);
    } else { console.error('generateBtn 요소를 찾을 수 없습니다!'); }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllImages);
    } else { console.error('clearAllBtn 요소를 찾을 수 없습니다!'); }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => { sortImages(); renderImagePreview(); });
    } else { console.error('sortSelect 요소를 찾을 수 없습니다!'); }

    if (languageSelector) {
        languageSelector.addEventListener('change', (event) => { switchLanguage(event.target.value); });
    } else { console.error('languageSelector 요소를 찾을 수 없습니다!'); }

    if (imagePreview) {
        imagePreview.addEventListener('click', function (event) {
            if (event.target.classList.contains('ocr-btn-on-item')) {
                if (isOcrRunning) { alert(currentLangStrings.status_ocr_running_other || "OCR running."); return; }
                if (isGeneratingPdf) { alert(currentLangStrings.alert_ocr_while_generating || "Cannot OCR while generating PDF."); return; }
                const index = parseInt(event.target.dataset.index);
                runOCR(index);
            }
        });
    } else { console.error('imagePreview 요소를 찾을 수 없습니다!'); }

    if (ocrModalCloseBtn) {
        ocrModalCloseBtn.addEventListener('click', closeOcrModal);
    } else { console.error('ocrModalCloseBtn 요소를 찾을 수 없습니다!'); }


    // --- 초기 설정 ---
    const preferredLang = localStorage.getItem('preferredLang');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = preferredLang || (translations[browserLang] ? browserLang : 'ko');

    // 초기 언어 설정 및 UI 업데이트 (switchLanguage 호출 전에 currentLang 설정)
    currentLang = initialLang; // 전역 변수 먼저 설정
    languageSelector.value = initialLang; // 드롭다운 값 설정
    switchLanguage(initialLang); // 초기 언어 적용 (내부에서 updateUI 호출)

    // 나머지 초기값 설정
    renderImagePreview(); // 초기 렌더링 호출
    document.querySelector('input[name="pdfSizeMode"][value="a4"]').checked = true;
    qualitySelect.value = 'MEDIUM';
    // filenameInput 기본값은 switchLanguage 내부에서 설정됨
    splitPageCountInput.value = '0';

}); // --- End of DOMContentLoaded Listener ---


// --- 함수 정의 영역 ---

function handleFileSelect(e) {
    const fileInput = document.getElementById('fileInput'); // 함수 내에서 요소 접근
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addImagesToCollection(files);
    fileInput.value = ''; // Reset file input to allow selecting the same file again
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadArea').classList.add('drag-over');
}

function handleDragLeaveUpload(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadArea').classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadArea').classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    addImagesToCollection(files);
}

function clearAllImages() {
    if (images.length > 0) {
        images = [];
        renderImagePreview(); // UI 업데이트 먼저 호출
        updateStatusMessage('clear'); // 상태 메시지 초기화

        // 요소 찾기 및 확인
        const filenameInputEl = document.getElementById('pdfFilename');
        const splitCountInputEl = document.getElementById('splitPageCount');

        // 요소를 찾았는지 확인 후 .value 설정
        if (filenameInputEl) {
            filenameInputEl.value = currentLangStrings.filenameInput || (currentLang === 'ko' ? '이미지_모음' : 'image_collection');
        } else {
            console.error('#pdfFilename 요소를 찾을 수 없어 값을 설정할 수 없습니다!'); // 오류 로그 유지
        }

        if (splitCountInputEl) {
            splitCountInputEl.value = '0';
        } else {
            console.error('#splitPageCount 요소를 찾을 수 없어 값을 설정할 수 없습니다!'); // 오류 로그 유지
        }
    }
}

function addImagesToCollection(files) {
    let fileReadPromises = [];
    let invalidFileFound = false;
    updateStatusMessage('status_reading');
    document.getElementById('loadingSpinnerContainer').style.display = 'none';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) {
            updateStatusMessage('status_invalid_file', { filename: file.name });
            invalidFileFound = true;
            continue;
        }
        const promise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ data: e.target.result, file: file, name: file.name });
            reader.onerror = (error) => reject(new Error(formatString(currentLangStrings.status_read_error || "'{filename}' 파일 읽기 오류", { filename: file.name })));
            reader.readAsDataURL(file);
        });
        fileReadPromises.push(promise);
    }

    Promise.all(fileReadPromises).then(readImages => {
        images = images.concat(readImages);
        sortImages();
        // 파일 읽기 성공 후 상태 업데이트
        updateStatusMessage('status_ready', { count: images.length });
        renderImagePreview(); // UI 렌더링
    }).catch(error => {
        console.error('FileReader 오류 발생:', error); // 오류 로그는 유지
        updateStatusMessage('error', { message: error.message });
        renderImagePreview(); // 실패해도 렌더링 시도
    });
}

function sortImages() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return; // 요소 없으면 중단
    const sortBy = sortSelect.value;
    if (sortBy === 'name') {
        images.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'nameDesc') {
        images.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'date') {
        images.sort((a, b) => a.file.lastModified - b.file.lastModified);
    } else if (sortBy === 'dateDesc') {
        images.sort((a, b) => b.file.lastModified - a.file.lastModified);
    }
}

// --- 드래그 앤 드롭 (미리보기 순서) ---
function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}
function handleDragOverItem(e) {
    if (e.preventDefault) { e.preventDefault(); }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}
function handleDragLeaveItem(e) {
    this.classList.remove('drag-over');
}
function handleDropItem(e) {
    const imagePreview = document.getElementById('imagePreview');
    const sortSelect = document.getElementById('sortSelect');
    e.stopPropagation();
    e.preventDefault();
    if (dragSrcEl !== this) {
        const allItems = Array.from(imagePreview.querySelectorAll('.image-item'));
        const fromIndex = allItems.indexOf(dragSrcEl);
        const toIndex = allItems.indexOf(this);
        const movedItem = images.splice(fromIndex, 1)[0];
        images.splice(toIndex, 0, movedItem);
        if (sortSelect) {
            sortSelect.value = 'none'; // 드래그 시 수동 정렬로 변경
        }
        renderImagePreview();
    }
    this.classList.remove('drag-over');
    return false;
}
function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.getElementById('imagePreview')?.querySelectorAll('.image-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}
// --- End Drag/Drop ---

// 이미지 미리보기 렌더링 (버튼 title 번역 사용)
function renderImagePreview() {
    const imagePreview = document.getElementById('imagePreview');
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const loadingSpinnerContainer = document.getElementById('loadingSpinnerContainer');

    if (!imagePreview) {
        console.error("imagePreview element not found in renderImagePreview");
        return;
    }
    imagePreview.innerHTML = ''; // 초기화

    images.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.draggable = true;
        imageItem.dataset.index = index;
        imageItem.addEventListener('dragstart', handleDragStart, false);
        imageItem.addEventListener('dragover', handleDragOverItem, false);
        imageItem.addEventListener('dragleave', handleDragLeaveItem, false);
        imageItem.addEventListener('drop', handleDropItem, false);
        imageItem.addEventListener('dragend', handleDragEnd, false);

        const img = document.createElement('img');
        img.src = image.data;
        img.alt = image.name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = 'X';
        removeBtn.title = currentLangStrings.removeBtnTitle || '이미지 제거';
        removeBtn.onclick = () => { images.splice(index, 1); renderImagePreview(); };

        const ocrBtn = document.createElement('button');
        ocrBtn.className = 'ocr-btn-on-item';
        ocrBtn.innerHTML = 'OCR';
        ocrBtn.title = currentLangStrings.ocrBtnTitle || '텍스트 인식 (OCR)';
        ocrBtn.dataset.index = index;

        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '≡';
        dragHandle.title = currentLangStrings.dragHandleTitle || '드래그하여 순서 변경';

        imageItem.appendChild(img);
        imageItem.appendChild(removeBtn);
        imageItem.appendChild(ocrBtn);
        imageItem.appendChild(dragHandle);
        imagePreview.appendChild(imageItem);
    });

    updateImageCountDisplay(); // 개수 업데이트
    const hasImages = images.length > 0;
    if (generateBtn) generateBtn.disabled = !hasImages;
    if (clearAllBtn) clearAllBtn.disabled = !hasImages;

    // 상태 메시지 로직 제거 (각 함수가 완료 시점에 직접 설정)

    // 스피너 숨김 (PDF 생성 중 아닐 때)
    if (!isGeneratingPdf && loadingSpinnerContainer) {
        loadingSpinnerContainer.style.display = 'none';
    }
}

// --- OCR 관련 함수 ---
async function runOCR(index) {
    const imageToOCR = images[index]; if (!imageToOCR || !Tesseract) return;
    const imagePreview = document.getElementById('imagePreview');
    const status = document.getElementById('status'); // 상태 메시지 요소 접근

    isOcrRunning = true;
    const ocrButton = imagePreview?.querySelector(`.ocr-btn-on-item[data-index="${index}"]`);
    if (ocrButton) ocrButton.disabled = true;
    updateStatusMessage('status_ocr_prep', { filename: imageToOCR.name });

    try {
        const langCode = currentLang === 'ko' ? 'kor' : 'eng'; // 현재 언어 사용
        // Tesseract 로거는 주석 처리 (필요시 활성화)
        const worker = await Tesseract.createWorker(langCode, 1/* , { logger: m => { if (m.status === 'recognizing text') { updateStatusMessage('status_ocr_recognizing', { progress: Math.round(m.progress * 100) }); } } } */);
        const { data: { text } } = await worker.recognize(imageToOCR.data);
        await worker.terminate();

        updateStatusMessage('status_ocr_complete', { filename: imageToOCR.name });
        displayOCRResult(text, imageToOCR.name);

    } catch (err) {
        console.error("OCR Error:", err); // 오류 로그 유지
        updateStatusMessage('status_ocr_error', { filename: imageToOCR.name });
        alert(formatString(currentLangStrings.alert_ocr_error || "OCR Error: {message}", { message: err.message }));
    } finally {
        isOcrRunning = false;
        if (ocrButton) ocrButton.disabled = false;
        // 완료/오류 메시지를 잠시 보여준 후, 최종 상태(준비)로 업데이트
        setTimeout(() => {
            if (!isGeneratingPdf && !isOcrRunning) { // 다른 작업이 또 시작되지 않았다면
                if (images.length > 0) {
                    updateStatusMessage('status_ready', { count: images.length });
                } else {
                    updateStatusMessage('clear');
                }
            }
        }, 3000); // 3초 후 상태 업데이트
    }
}

function displayOCRResult(text, filename) {
    const ocrModal = document.getElementById('ocrModal');
    const ocrModalTitle = document.getElementById('ocrModalTitle');
    const ocrResultText = document.getElementById('ocrResultText');
    if (!ocrModal || !ocrModalTitle || !ocrResultText) {
        console.error("OCR Modal elements not found.");
        return;
    }
    ocrModalTitle.textContent = formatString(currentLangStrings.ocrModalTitleKey || "OCR Result: {filename}", { filename: filename });
    ocrResultText.textContent = text || (currentLangStrings.ocrResultPlaceholder || "(No text extracted)");
    ocrModal.style.display = 'flex';
}

function closeOcrModal() {
    const ocrModal = document.getElementById('ocrModal');
    if (ocrModal) ocrModal.style.display = 'none';
}
// --- End OCR 함수 ---

// --- 비동기 이미지 로딩 헬퍼 함수 ---
function loadImageAsync(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

// --- 최종 파일 이름 생성 함수 (분할 고려) ---
function getFinalFilename(partIndex = null) {
    const filenameInput = document.getElementById('pdfFilename');
    const splitPageCountInput = document.getElementById('splitPageCount');
    let filename = filenameInput ? filenameInput.value.trim() : '';
    if (!filename) {
        filename = currentLangStrings.filenameInput || (currentLang === 'ko' ? '이미지_모음' : 'image_collection');
    }
    const splitLimit = splitPageCountInput ? (parseInt(splitPageCountInput.value) || 0) : 0;
    if (splitLimit > 0 && partIndex !== null && images.length > splitLimit) {
        filename += `_part${partIndex}`;
    }
    if (!filename.toLowerCase().endsWith('.pdf')) {
        filename += '.pdf';
    }
    return filename;
}

// --- PDF 생성 완료 처리 함수 ---
function completeGeneration(key, values = {}) {
    updateStatusMessage(key, values);
    const loadingSpinnerContainer = document.getElementById('loadingSpinnerContainer');
    if (loadingSpinnerContainer) loadingSpinnerContainer.style.display = 'none';
    const hasImages = images.length > 0;
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (generateBtn) generateBtn.disabled = !hasImages;
    if (clearAllBtn) clearAllBtn.disabled = !hasImages;
    isGeneratingPdf = false; // PDF 생성 플래그 해제
}

// --- PDF 생성 함수 (비동기 루프 및 분할 로직 적용) ---
async function generatePDF() {
    const status = document.getElementById('status');
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const loadingSpinnerContainer = document.getElementById('loadingSpinnerContainer');
    const qualitySelect = document.getElementById('qualitySelect');
    const splitPageCountInput = document.getElementById('splitPageCount');

    // 필수 UI 요소 확인
    if (!status || !generateBtn || !clearAllBtn || !loadingSpinnerContainer || !qualitySelect || !splitPageCountInput) {
        console.error("PDF Generation cannot proceed: Core UI element not found.");
        alert("오류: 필수 UI 요소를 찾을 수 없습니다. 페이지를 새로고침 해보세요.");
        return;
    }

    if (images.length === 0) { updateStatusMessage('status_no_images'); return; }
    if (isOcrRunning) { alert(currentLangStrings.alert_generate_while_ocr || "OCR process is running."); return; }

    isGeneratingPdf = true;
    generateBtn.disabled = true;
    clearAllBtn.disabled = true;
    loadingSpinnerContainer.style.display = 'inline-block';
    updateStatusMessage('status_pdf_prep');

    const sizeMode = document.querySelector('input[name="pdfSizeMode"]:checked').value;
    const qualitySetting = qualitySelect.value;
    const splitLimit = parseInt(splitPageCountInput.value) || 0;

    let currentPageInCurrentPDF = 0;
    let currentPDFIndex = 1;
    pdf = null; // 현재 작업중인 PDF 객체 초기화

    for (let i = 0; i < images.length; i++) {
        const currentImage = images[i];
        updateStatusMessage('status_pdf_progress', { current: i + 1, total: images.length, progress: Math.round(((i + 1) / images.length) * 100) });

        try {
            const img = await loadImageAsync(currentImage.data);
            const imageWidth = img.width;
            const imageHeight = img.height;
            let pageConfig = {};

            // 페이지 설정 계산
            if (sizeMode === 'image') {
                const pxToMm = 25.4 / 96;
                const imgWidthMm = imageWidth * pxToMm;
                const imgHeightMm = imageHeight * pxToMm;
                pageConfig = { unit: 'mm', orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait', format: [imgWidthMm, imgHeightMm], imgX: 0, imgY: 0, imgTargetWidth: imgWidthMm, imgTargetHeight: imgHeightMm };
            } else { // A4 모드
                const margin = 0;
                const pageWidth = 210; const pageHeight = 297;
                const maxWidth = pageWidth - (margin * 2); const maxHeight = pageHeight - (margin * 2);
                const ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
                pageConfig = { unit: 'mm', orientation: 'portrait', format: 'a4', imgTargetWidth: imageWidth * ratio, imgTargetHeight: imageHeight * ratio, imgX: (pageWidth - (imageWidth * ratio)) / 2, imgY: (pageHeight - (imageHeight * ratio)) / 2 };
            }

            // 새 PDF 시작 또는 페이지 추가
            if (pdf === null) {
                pdf = new jsPDF({ orientation: pageConfig.orientation, unit: pageConfig.unit, format: pageConfig.format });
                currentPageInCurrentPDF = 0; // 새 PDF 시작 시 페이지 카운터 리셋
            } else {
                // 첫 페이지가 아니거나, 이미지 크기 모드인데 이전 이미지가 있었던 경우 페이지 추가
                if (currentPageInCurrentPDF > 0 || (sizeMode === 'image' && i > 0)) {
                    pdf.addPage(pageConfig.format, pageConfig.orientation);
                }
            }

            // 이미지 추가
            pdf.addImage(img, 'JPEG', pageConfig.imgX, pageConfig.imgY, pageConfig.imgTargetWidth, pageConfig.imgTargetHeight, null, qualitySetting);
            currentPageInCurrentPDF++;

            // 분할 조건 확인 및 처리
            if (splitLimit > 0 && currentPageInCurrentPDF >= splitLimit && i < images.length - 1) {
                updateStatusMessage('status_pdf_saving_part', { partIndex: currentPDFIndex });
                await new Promise(resolve => setTimeout(resolve, 50)); // 상태 메시지 표시 시간
                pdf.save(getFinalFilename(currentPDFIndex)); // 현재 파트 저장
                currentPDFIndex++;
                pdf = null; // 다음 이미지에서 새 PDF 만들도록 초기화
                currentPageInCurrentPDF = 0; // 페이지 카운터도 리셋
                await new Promise(resolve => setTimeout(resolve, 200)); // 저장 및 다음 처리 준비 시간
            }
        } catch (error) {
            console.error(`Error processing image ${i}: ${currentImage.name}`, error); // 오류 로그 유지
            updateStatusMessage('status_pdf_image_error', { index: i + 1 });
            await new Promise(resolve => setTimeout(resolve, 100)); // 잠시 대기 후 계속 진행
        }
    } // End for loop

    // --- 마지막 남은 PDF 파트 저장 ---
    if (pdf !== null) {
        const isMultiPart = splitLimit > 0 && images.length > splitLimit;
        updateStatusMessage('status_pdf_saving_last', { partInfo: isMultiPart ? (currentLangStrings.status_pdf_saving_last_part || '마지막 파트 ') : '' });
        await new Promise(resolve => setTimeout(resolve, 50));
        try {
            pdf.save(getFinalFilename(currentPDFIndex));
            completeGeneration('status_pdf_complete', { partInfo: isMultiPart ? formatString(currentLangStrings.status_pdf_complete_multi || "총 {count}개 파트 ", { count: currentPDFIndex }) : '' });
        } catch (saveError) {
            console.error("PDF 저장 오류:", saveError); // 저장 오류 로그 추가
            completeGeneration('status_pdf_error');
        }
    } else if (images.length > 0) {
        // 루프는 끝났는데 pdf 객체가 null이면, 마지막 이미지 처리 중 오류가 발생했거나
        // 분할 직후 루프가 끝난 경우일 수 있음. 오류 메시지 표시.
        completeGeneration('status_pdf_error_final');
    } else {
        // 이미지가 애초에 없었던 경우 (시작 시 처리되지만 안전 장치)
        completeGeneration('clear'); // 메시지 없음
    }
} // End async generatePDF
