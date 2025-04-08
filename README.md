<p align="center">
  <a href="#english">English</a> •
  <a href="#한국어">한국어</a>
</p>

---
<a id="english"></a>
## English

*(This section provides the English description of the project)*

### 📜 Description

This project (`simple-image-pdf-tool`) is a client-side web application that allows you to upload multiple images directly in the web browser, adjust their order, and convert them into a PDF file with various options (page size, quality, splitting, etc.). It also includes client-side OCR functionality using Tesseract.js to recognize text within images. All processing happens in the user's browser (no server needed), and it supports Korean and English.

### ✨ Key Features

* **Image Management:**
    * Multi-image upload via file selection or drag & drop.
    * Scrollable thumbnail previews of uploaded images.
    * Real-time display of the uploaded image count.
    * Individual image removal and 'Clear All' functionality.
    * Manual image reordering via drag & drop.
    * Automatic sorting by filename or date (Ascending/Descending).
* **PDF Generation:**
    * Page size options: 'Fit to A4' or 'Original Image Size'.
    * Image quality options: Low, Medium (Default), High, Maximum.
    * Customizable PDF filename.
    * **PDF Splitting:** Automatically split the output PDF into multiple files based on a specified page count (e.g., `filename_part1.pdf`, `filename_part2.pdf`...).
    * Generation progress display (%) and loading spinner.
* **Text Recognition (OCR):**
    * Run OCR on individual images (Supports Korean/English).
    * View extracted text in a popup (modal) window (Uses Tesseract.js).
* **Multilingual Support:** Supports Korean and English UI (Selectable at the top-right of the page).
* **User Interface:** Controls placed at the top, status messages, etc.

### 📁 Folder Structure

This project uses the following basic folder structure:

```text
simple-image-pdf-tool/
├── index.html          # Main page (HTML Structure)
├── css/                # CSS Stylesheet folder
│   └── style.css       # Main style definitions
├── js/                 # JavaScript code folder
│   └── script.js       # Application logic (Includes language data)
├── README.md           # Project description (This file)
└── LICENSE             # License information (MIT)
```
*(Note: Language data is embedded within js/script.js; a separate lang folder is not used.)*

### 🚀 How to Use

1.  Clone (`git clone`) or download the ZIP file of this repository (`simple-image-pdf-tool`) to your local machine.
2.  Maintain the folder structure as is (including `css/` and `js/` folders).
3.  Open the `index.html` file located in the root folder using a modern web browser (Chrome, Edge, Firefox recommended). You can **open it directly or run it through a local web server**.
4.  You can switch the language between Korean and English using the **language selection menu** at the top-right of the page. (Your preference is saved in the browser.)
5.  **Note:**
    * An **internet connection is required** for loading external libraries (jsPDF, Tesseract.js) and for the initial download of OCR language data (Korean or English).
    * Opening the file directly via `file:///...` might have limitations due to browser security policies (especially for OCR). Running it via a simple local web server (e.g., VS Code's Live Server extension, Python `http.server`) is recommended for full functionality.

### 🛠️ Technology Stack

* HTML5
* CSS3
* JavaScript (ES6+, DOMContentLoaded, Async/Await)
* **jsPDF:** Library for client-side PDF generation ([https://github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)) - MIT License
* **Tesseract.js:** Library for client-side OCR ([https://github.com/naptha/tesseract.js](https://github.com/naptha/tesseract.js)) - Apache License 2.0

### 🤖 Development Assistance (AI Assistance)

**Google's AI model, Gemini 2.5 Pro,** actively assisted throughout the development process of this application, including idea specification, code structure design (HTML/CSS/JS separation), implementation of new features (PDF splitting, OCR integration, UI improvements), and debugging. AI suggestions and code generation were significantly helpful in implementing complex logic and solving problems.

### 📄 License and Copyright Notice

* **Project Code:** The code included in this repository (HTML, CSS, custom JavaScript logic) is distributed under the **MIT License**.
* **External Libraries:** jsPDF and Tesseract.js are used under their respective licenses (MIT License and Apache License 2.0). Please refer to their official repositories for full license details.
* **AI Generated Code Note:** Google Gemini 2.5 Pro assisted in the development of this project. The code is provided primarily for learning and non-commercial purposes and adheres to the licenses of the external libraries used. Please review the relevant AI service terms and licenses if you intend to use this code for other purposes, such as commercial use.

### 💡 Known Issues / Limitations

* Client-side OCR (Tesseract.js) speed and accuracy may vary depending on image quality, text characteristics, and user's PC performance. Initial execution requires downloading language data files (Korean or English).
* When generating PDFs in 'Image Size' mode, the physical print size might not exactly match the original due to using web standards (assuming 96 DPI) instead of potentially embedded image DPI information.
* Processing very large high-resolution images or an extremely large number of images at once might lead to performance issues or browser memory limitations.

---
<a id="한국어"></a>
## 한국어

*(이 섹션은 프로젝트의 한국어 설명입니다)*

### 📜 설명

이 프로젝트(`simple-image-pdf-tool`)는 웹 브라우저에서 직접 여러 이미지를 업로드하고 순서를 조정한 뒤, 다양한 옵션(페이지 크기, 품질, 분할 등)을 적용하여 PDF 파일로 변환하는 기능을 제공하는 클라이언트 사이드 웹 애플리케이션입니다. 추가적으로 Tesseract.js를 이용한 이미지 내 텍스트 인식(OCR) 기능도 포함되어 있습니다. 모든 처리는 사용자의 브라우저에서 이루어지며, 한국어와 영어를 지원합니다.

### ✨ 주요 기능

* **이미지 관리:**
    * 파일 선택 또는 드래그 앤 드롭으로 다중 이미지 업로드
    * 업로드된 이미지 썸네일 미리보기 (스크롤 가능)
    * 업로드된 이미지 개수 실시간 표시
    * 개별 이미지 제거 및 전체 이미지 삭제
    * 드래그 앤 드롭으로 이미지 순서 수동 변경
    * 파일 이름 또는 날짜 기준으로 자동 정렬 (오름/내림차순)
* **PDF 생성:**
    * 페이지 크기 옵션: 'A4에 맞춤' 또는 '이미지 원본 크기'
    * 이미지 품질 옵션: 저화질, 중간화질(기본), 고화질, 원본화질
    * PDF 파일 이름 사용자 지정
    * **PDF 분할 저장:** 지정한 페이지 수마다 PDF 파일을 자동으로 나누어 저장 (예: `파일명_part1.pdf`, `파일명_part2.pdf`...)
    * 생성 진행률(%) 표시 및 로딩 스피너
* **텍스트 인식 (OCR):**
    * 개별 이미지에 대한 OCR 실행 기능 (**한국어/영어** 지원)
    * 추출된 텍스트를 팝업(모달) 창으로 확인 (Tesseract.js 사용)
* **다국어 지원:** 한국어/영어 UI 지원 (페이지 우측 상단에서 선택 가능)

### 📁 폴더 구조

이 프로젝트는 다음과 같은 기본 폴더 구조를 가집니다:

```text
simple-image-pdf-tool/
├── index.html          # 메인 페이지 (HTML 구조)
├── css/                # CSS 스타일시트 폴더
│   └── style.css       # 주요 스타일 정의
├── js/                 # JavaScript 코드 폴더
│   └── script.js       # 애플리케이션 로직 (언어 데이터 포함)
├── README.md           # 프로젝트 설명 (이 파일)
└── LICENSE             # 라이선스 정보 (MIT)
```
*(참고: 언어 데이터는 js/script.js 파일 내부에 포함되어 별도의 lang 폴더는 사용하지 않습니다.)*

### 🚀 사용 방법

1.  이 저장소(`simple-image-pdf-tool`)를 로컬 컴퓨터에 클론(`git clone`)하거나 ZIP 파일로 다운로드합니다.
2.  폴더 구조(`css/`, `js/` 폴더 포함)를 그대로 유지합니다.
3.  루트 폴더에 있는 `index.html` 파일을 웹 브라우저 (Chrome, Edge, Firefox 등 최신 브라우저 권장)로 **직접 열거나 로컬 웹 서버를 통해 실행**합니다.
4.  페이지 우측 상단의 **언어 선택 메뉴**를 사용하여 한국어 또는 영어로 언어를 변경할 수 있습니다. (선택한 언어는 브라우저에 저장됩니다.)
5.  **주의:**
    * 외부 라이브러리(jsPDF, Tesseract.js) 로딩 및 OCR 언어 데이터 최초 다운로드를 위해 **인터넷 연결이 필요**합니다.
    * 로컬 파일(`file:///...`)로 직접 열 경우 브라우저 보안 정책에 따라 일부 기능(특히 OCR 관련)이 제한될 수 있으므로, 안정적인 사용을 위해 간단한 로컬 웹 서버(예: VS Code의 Live Server 확장 기능, Python `http.server` 등)를 통해 실행하는 것을 권장합니다.

### 🛠️ 사용된 기술

* HTML5
* CSS3
* JavaScript (ES6+, DOMContentLoaded, Async/Await)
* **jsPDF:** 클라이언트 사이드 PDF 생성을 위한 라이브러리 ([https://github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)) - MIT License
* **Tesseract.js:** 클라이언트 사이드 OCR을 위한 라이브러리 ([https://github.com/naptha/tesseract.js](https://github.com/naptha/tesseract.js)) - Apache License 2.0

### 🤖 개발 지원 (AI Assistance)

이 애플리케이션의 개발 과정에서 아이디어 구체화, 코드 구조 설계(HTML/CSS/JS 분리), 새로운 기능(PDF 분할, OCR 연동, UI 개선 등) 구현 및 디버깅 과정 전반에 걸쳐 **Google의** AI **모델인 Gemini 2.5 Pro**의 적극적인 도움을 받았습니다.

### 📄 라이선스 및 저작권 관련 참고사항

* **이 프로젝트 코드:** 이 저장소에 포함된 코드(HTML, CSS, 직접 작성한 JavaScript 로직)는 **MIT License** 하에 배포됩니다.
* **외부 라이브러리:** 사용된 jsPDF와 Tesseract.js는 각각 MIT License와 Apache License 2.0을 따릅니다. 라이선스 전문은 각 라이브러리의 공식 저장소에서 확인하실 수 있습니다.
* **AI 생성 코드 참고:** 이 프로젝트 개발에는 Google Gemini 2.5 Pro의 도움을 받았습니다. 코드는 주로 학습 및 비상업적 용도로 제공되며, 사용된 외부 라이브러리(jsPDF, Tesseract.js)의 라이선스를 준수합니다. 상업적 이용 등 다른 목적으로 사용 시에는 관련 AI 서비스 약관 및 라이선스를 확인하시기 바랍니다.

### 💡 알려진 문제점 / 제한사항

* 클라이언트 사이드 OCR(Tesseract.js)은 이미지 품질, 텍스트의 형태, 사용자 PC 성능에 따라 처리 속도와 정확도가 달라질 수 있습니다. 첫 실행 시 선택된 언어(한국어 또는 영어)의 데이터 파일 다운로드 시간이 소요됩니다.
* PDF 생성 시 '이미지 크기' 모드는 이미지의 DPI 정보가 아닌 웹 표준(96 DPI 가정)으로 크기를 계산하므로, 인쇄 시 물리적 크기가 원본과 정확히 일치하지 않을 수 있습니다.
* 매우 큰 고해상도 이미지나 수백 장 이상의 이미지를 한 번에 처리할 경우 브라우저의 메모리 제한으로 인해 성능 저하나 중단이 발생할 수 있습니다.

---

*이 README는 Google Gemini 2.5 Pro의 도움을 받아 작성되었습니다.*
