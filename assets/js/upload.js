document.addEventListener('DOMContentLoaded', function () {
  let dropArea = document.getElementById("drop-area");
let droppedFiles = [];

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

  // Add dropped files to the array without sorting
  droppedFiles = droppedFiles.concat([...files]);

  initializeProgress(droppedFiles.length);

  // Process files in the order they were dropped
  processFilesSequentially(droppedFiles);
  
  unhighlight();
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
let progressBar = document.getElementById('progress-bar')

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

        img.src = reader.result;
        closeButton.src = '/images/x.svg'; // Set the path to your close image
        closeButton.className = 'close-image'; // Add a class for styling

        closeButton.addEventListener('click', function () {
            imgContainer.remove();
        });

        fileNameContainer.innerText = file.name;
        fileNameContainer.className = 'file-name';

        imgContainer.appendChild(img);
        imgContainer.appendChild(fileNameContainer); // Append file name container
        imgContainer.appendChild(closeButton);

        document.getElementById('gallery').appendChild(imgContainer);
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