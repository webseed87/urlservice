// upload.js 기능 작성 송주현
// 이미지 파일로 업로드, 드래그로 업로드 가능 모바일에서는 드래그로 업로드 기능 보이지 않음
// 이미지 파일명 표시 이미지 각각 x버튼으로 삭제 가능
// 전체 삭제 버튼으로 전체 삭제 기능
// 드래그로 업로드시 파일을 드래그 안내 문구 안보였다가 파일이 하나도 없으면 다시 보이게 하는 기능


document.addEventListener('DOMContentLoaded', function () {
//드롭 영역을 가져오고 드롭된 파일을 저장할 배열을 만듬
let dropArea = document.getElementById("drop-area"); 
let droppedFiles = []; 

// 삭제 버튼 생성 후 삭제 버튼 클릭시 실행될 함수 선언
let deleteAllButton = document.createElement('button');
deleteAllButton.addEventListener('click', function () {
  deleteAllImages(); 
});

//드래그 앤 드롭 이벤트의 기본 동작을 방지하기 위해 이벤트 리스너를 추가
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
});

//드롭 이벤트를 처리하는 이벤트 리스너 추가
dropArea.addEventListener('drop', handleDrop, false)

//드래그 앤 드롭 이벤트의 기본 동작을 방지하는 함수
function preventDefaults (e) {
  e.preventDefault() // 고유 동작을 중지 시키고 
  e.stopPropagation() // 상위 엘리먼트로 이벤트 전파를 중단 시키기 위한 기본 함수
}

dropArea.addEventListener('drop', handleDrop, false);

// 드래그 시 실행시킬 함수
function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;
  droppedFiles = []; //드래그 한 파일을 배열에 담고 
  droppedFiles = droppedFiles.concat([...files]); // 배열을 전개 연산자로 값을 풀기
  initializeProgress(droppedFiles.length);
  processFilesSequentially(droppedFiles);
}
// 삭제된 파일 배열을 재설정하고 각 파일의 진행 상태를 초기화
function deleteAllImages() {
  let gallery = document.getElementById('gallery');
  let paragraphs = document.querySelectorAll('.my-form p');
  let deleteAllButton = document.getElementById('deleteAllButton');

  // 갤러리 아래 모든 엘리먼트 삭제
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }

  //삭제 버튼 누르면 다시 파일 드래그 안내 부분 보이게
  paragraphs.forEach(function (paragraph) {
    paragraph.classList.remove('hidden');
  });

  //전체 삭제 버튼을 눌렀을때 버튼 안보이게 
  if (deleteAllButton) {
    deleteAllButton.parentNode.removeChild(deleteAllButton);
  }

}
//파일을 순차적으로 처리하는 기능
function processFilesSequentially(files) {
  let chain = Promise.resolve();
  files.forEach((file, index) => {
    chain = chain.then(() => {
      return new Promise((resolve) => {
        uploadFile(file, index);
        previewFile(file);
        resolve();
      });
    });
  });
}

// 파일 업로드버튼 눌렀을때 파일을 순차적으로 처리하는 기능
let uploadProgress = []
function initializeProgress(numFiles) {
  uploadProgress = []
  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}
// 파일 입력 요소를 가져오고 파일 선택을 처리하기 위한 이벤트 리스너를 추가
let fileInput = document.getElementById("fileElem");
fileInput.addEventListener('change', function () {
  handleFiles(this.files);
});
// 선택한 파일을 처리하는 기능
function handleFiles(files) {
  files = [...files];

  // 각 파일의 진행 상황을 초기화하고 업로드/미리보기
  initializeProgress(files.length);
  files.forEach((file, index) => {
    uploadFile(file, index);
    previewFile(file);
  });
}
//파일 미리 보기 처리 하는 부분
function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let imgContainer = document.createElement('div');
    let img = document.createElement('img');
    let fileNameContainer = document.createElement('div');
    let closeButton = document.createElement('span');
    var paragraphs = document.querySelectorAll('.my-form p');

    let loaderImgBox = document.createElement('div'); //로딩이미지 추가하는 div 
    loaderImgBox.className = 'img-loader-box'; //로딩이미지 추가하는 div 클래스명 
    
    // 이미지 주소 속성
    img.src = reader.result;
    closeButton.src = '/images/x.svg'; 
    closeButton.className = 'close-image'; 

    //파일 마다 삭제 버튼 관련된 이벤트 리스너 
    closeButton.addEventListener('click', function () {
      imgContainer.remove();
      checkShowMessages(); 

      //이미지가 하나도 없으면 전체 삭제 버튼 안보이게
      if (document.getElementById('gallery').childElementCount === 0) {
        let deleteAllButton = document.getElementById('deleteAllButton');
        if (deleteAllButton) {
          deleteAllButton.remove();
        }
      }
    });

    fileNameContainer.innerText = file.name;
    fileNameContainer.className = 'file-name';

    //이미지 미리 보기에 넣을 엘리먼트
    imgContainer.appendChild(img);
    imgContainer.appendChild(fileNameContainer); 
    imgContainer.appendChild(closeButton);
  //  imgContainer.appendChild(loaderImgBox); // 리사이징 완료 되면 삭제 해서 쓰세요.

  //갤러리에 이미지 없으면 드래그 안내 문구 다시 띄우기
    document.getElementById('gallery').appendChild(imgContainer);
    paragraphs.forEach(function (paragraph) {
      paragraph.classList.add('hidden');
    });

    //전체 삭제 버튼이 없으면 다시 보여지는 부분 선언
    if (!document.getElementById('deleteAllButton')) {
      let deleteAllButton = document.createElement('button');
      deleteAllButton.id = 'deleteAllButton';
      deleteAllButton.innerHTML = '전체 삭제';
      deleteAllButton.addEventListener('click', function () {
        deleteAllImages();
      });

      document.getElementById('drop-area').appendChild(deleteAllButton);
    }
  };
}
 //갤러리 아이디 부분에 이미지가 있는지 여부에 따라서 메세지 출력하는 함수
function checkShowMessages() {
  let gallery = document.getElementById('gallery');
  let paragraphs = document.querySelectorAll('.my-form p');
  let deleteAllButton = document.getElementById('deleteAllButton');

  if (gallery.childElementCount === 0) {
    paragraphs.forEach(function (paragraph) {
      paragraph.classList.remove('hidden');
    });
    if (deleteAllButton) {
      deleteAllButton.style.display = 'none';
    }
  } else {
    if (deleteAllButton) {
      deleteAllButton.style.display = 'block';
    }
  }
}

// XMLHttpRequest를 사용하여 Cloudinary 엔드포인트에 파일을 업로드하는 기능  
// 참고문서 https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest

function uploadFile(file, i) {
  var url = 'https://api.cloudinary.com/v1_1/urlservice/image/upload?api_key=842582577334323' // 통신 부분은 바꿔서 사용해주세요
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  
  formData.append('upload_preset', 'ujpu6gyk');
  formData.append('file', file);
  xhr.send(formData);
}
});