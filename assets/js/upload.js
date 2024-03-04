document.addEventListener('DOMContentLoaded', function () {
  let dropArea = document.getElementById("drop-area");
let droppedFiles = [];


let deleteAllButton = document.createElement('button');
deleteAllButton.addEventListener('click', function () {
  deleteAllImages();
});

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;

  // Reset droppedFiles array for each drop event
  droppedFiles = [];

  // Add dropped files to the array without sorting
  droppedFiles = droppedFiles.concat([...files]);

  initializeProgress(droppedFiles.length);

  // Process files in the order they were dropped
  processFilesSequentially(droppedFiles);

  unhighlight();
}
function deleteAllImages() {
  let gallery = document.getElementById('gallery');
  let paragraphs = document.querySelectorAll('.my-form p');
  let deleteAllButton = document.getElementById('deleteAllButton');

  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }

  paragraphs.forEach(function (paragraph) {
    paragraph.classList.remove('hidden');
  });

  // Remove the deleteAllButton after deleting all images
  if (deleteAllButton) {
    deleteAllButton.parentNode.removeChild(deleteAllButton);
  }

}
function processFilesSequentially(files) {
  // Create a promise chain to process files in order
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
let uploadProgress = []
// let progressBar = document.getElementById('progress-bar')

function initializeProgress(numFiles) {
  // progressBar.value = 0
  uploadProgress = []

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  // let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  // progressBar.value = total
}
let fileInput = document.getElementById("fileElem");
fileInput.addEventListener('change', function () {
  handleFiles(this.files);
});
function handleFiles(files) {
  files = [...files];

  initializeProgress(files.length);
  files.forEach((file, index) => {
    uploadFile(file, index);
    previewFile(file);
  });
}
function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let imgContainer = document.createElement('div');
    let img = document.createElement('img');
    let fileNameContainer = document.createElement('div');
    let closeButton = document.createElement('span');
    var paragraphs = document.querySelectorAll('.my-form p');
    // 로딩 이미지 추가 부분입니다, 이 부분을 리사이징 되면 삭제 하셔서 쓰세요
    let loaderSVG = document.createElement('div');
    loaderSVG.className = 'loader';
    loaderSVG.innerHTML = `
      <svg>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
          </filter>
        </defs>
      </svg>
    `;

    img.src = reader.result;
    closeButton.src = '/images/x.svg'; // Set the path to your close image
    closeButton.className = 'close-image'; // Add a class for styling

    closeButton.addEventListener('click', function () {
      imgContainer.remove();
      checkShowMessages(); // Check and show messages after removing the image

      // Check and remove the deleteAllButton if no images are left
      if (document.getElementById('gallery').childElementCount === 0) {
        let deleteAllButton = document.getElementById('deleteAllButton');
        if (deleteAllButton) {
          deleteAllButton.remove();
        }
      }
    });

    fileNameContainer.innerText = file.name;
    fileNameContainer.className = 'file-name';

    imgContainer.appendChild(img);
    imgContainer.appendChild(fileNameContainer); // Append file name container
    imgContainer.appendChild(closeButton);
   imgContainer.appendChild(loaderSVG); // 리사이징 완료 되면 삭제 해서 쓰세요.

    document.getElementById('gallery').appendChild(imgContainer);
    paragraphs.forEach(function (paragraph) {
      paragraph.classList.add('hidden');
    });

    // Create the deleteAllButton only if it doesn't exist
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
function checkShowMessages() {
  let gallery = document.getElementById('gallery');
  let paragraphs = document.querySelectorAll('.my-form p');
  let deleteAllButton = document.getElementById('deleteAllButton');

  if (gallery.childElementCount === 0) {
    paragraphs.forEach(function (paragraph) {
      paragraph.classList.remove('hidden');
    });

    // Hide the deleteAllButton when there are no images
    if (deleteAllButton) {
      deleteAllButton.style.display = 'none';
    }
  } else {
    // Show the deleteAllButton when there are images
    if (deleteAllButton) {
      deleteAllButton.style.display = 'block';
    }
  }
}
function uploadFile(file, i) {
  var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })
  
  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        updateProgress(i, 100);
      } else {
        console.error('Error uploading file:', xhr.status, xhr.statusText);
      }
    }
  })
  
  formData.append('upload_preset', 'ujpu6gyk');
  formData.append('file', file);
  xhr.send(formData);
}
});