'use strict'

function uploadImg() {
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    //Encode the instance of certain characters in the url
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    console.log(encodedUploadedImgUrl)
    document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`
    //Create a link that on click will make a post in facebook with the image we uploaded
    document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
  }
  //Send the image to the server
  doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
  //Pack the image for delivery
  const formData = new FormData()
  formData.append('img', imgDataUrl)
  //Send a post req with the image to the server
  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData,
  }) //Gets the result and extract the text/ url from it
    .then((res) => res.text())
    .then((url) => {
      console.log('Got back live url:', url)
      //Pass the url we got to the callBack func onSuccess, that will create the link to facebook
      onSuccess(url)
    })
    .catch((err) => {
      console.error(err)
    })
}

function downloadImg(elLink) {
  var imgContent = gElCanvas.toDataURL('image/jpeg') // image/jpeg the default format
  elLink.href = imgContent
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system:
function onImgInput(ev) {
  loadImageFromInput(ev, renderImg)
}
//                               CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
  var reader = new FileReader()
  //After we read the file
  reader.onload = function (event) {
    var img = new Image() // Create a new html img element
    img.src = event.target.result // Set the img src to the img file we read
    //Run the callBack func , To render the img on the canvas
    img.onload = onImageReady.bind(null, img)
  }
  reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function renderImg(img) {
  //Draw the img on the canvas
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function downloadCanvas(elLink) {
  //protect the image soo attacker could not download imgs from diff domain
  const data = gElCanvas.toDataURL() // for security reason you can`t do toDataUrl on tainted canvas
  //This protects users from having private data exposed by using images
  // to pull information from remote web sites without permission.
  elLink.href = data
  elLink.download = 'my-img.jpg'
}
