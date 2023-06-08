let adjustmentCount = 0;

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function (e) {
      const fileContent = e.target.result;
      addAdjustment(file.name, fileContent);
    };

    reader.readAsText(file);
  }
}

function addAdjustment(filename, content) {
  const adjustmentList = document.getElementById('adjustmentList');

  const li = document.createElement('li');
  li.setAttribute('draggable', 'true');
  li.setAttribute('ondragstart', 'drag(event)');
  li.id = `adjustment${adjustmentCount}`;
  adjustmentCount++;

  const fileNameSpan = document.createElement('span');
  fileNameSpan.innerText = filename;
  li.appendChild(fileNameSpan);

  const cancelButton = document.createElement('a');
  cancelButton.href = '#';
  cancelButton.innerText = 'Cancel';
  cancelButton.className = 'cancel-button';
  cancelButton.onclick = function () {
    adjustmentList.removeChild(li);
  };
  li.appendChild(cancelButton);

  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = `adjustment${adjustmentCount}`;
  hiddenInput.value = content;
  li.appendChild(hiddenInput);

  adjustmentList.appendChild(li);
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function dropOnAdjustment(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const draggedElement = document.getElementById(data);
  const adjustmentList = document.getElementById('adjustmentList');

  adjustmentList.insertBefore(draggedElement, event.target);
}

function downloadFile() {
  const adjustmentList = document.getElementById('adjustmentList');
  const adjustedFiles = adjustmentList.getElementsByTagName('li');
  const mergedData = [];

  for (let i = 0; i < adjustedFiles.length; i++) {
    const hiddenInput = adjustedFiles[i].getElementsByTagName('input')[0];
    mergedData.push(hiddenInput.value);
  }

  const csvContent = mergedData.join('\n');
  const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
  const downloadButton = document.getElementById('downloadButton');
  downloadButton.setAttribute('href', encodedUri);
}

