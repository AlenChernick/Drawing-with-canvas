'use strict'

let gElCanvas
let gCtx
let gCurrShape = 'triangle'
let gIsPainting = false
let gUserPaintColor
let gUserTextColor
let gPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function onInit() {
  gElCanvas = document.querySelector('.main-canvas')
  gCtx = gElCanvas.getContext('2d')
  addListeners()
}

function onGetUserPaintColor(elInputColor) {
  gUserPaintColor = document.querySelector('.main-canvas').style.color = elInputColor.value
}

function onGetUserBackgroundColor(elInputColor) {
  document.body.style.backgroundColor = elInputColor.value
}

function onGetUserText(elInputText) {
  gUserTextColor = document.querySelector('.main-canvas').style.innerText = elInputText.value
}

function drawTriangle(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 2
  gCtx.moveTo(x, y)
  gCtx.lineTo(x - 50, y + 150)
  gCtx.lineTo(x + 50, y + 150)
  gCtx.closePath()
  gCtx.fillStyle = gUserPaintColor
  getPaint()
}

function drawCircle(x, y) {
  gCtx.beginPath()
  gCtx.arc(x, y, 50, 0, 2 * Math.PI)
  gCtx.fillStyle = gUserPaintColor
  gCtx.stroke()
  getPaint()
}

function drawText(x, y) {
  gCtx.font = '30px Arial'
  gCtx.strokeStyle = gUserPaintColor
  gCtx.strokeText(gUserTextColor, x, y)
}

function drawRect(x, y) {
  gCtx.beginPath()
  gCtx.rect(x, y, 150, 150)
  gCtx.fillStyle = gUserPaintColor
  gCtx.fillRect(x, y, 150, 150)
  gCtx.stroke()
}

function getPaint() {
  if (!gUserPaintColor) {
    gCtx.stroke()
  } else {
    gCtx.fill()
    gCtx.stroke()
  }
}

function getEvPos(ev) {
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault()
    const eventTouch = ev.changedTouches[0]
    gPos = {
      x: eventTouch.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: eventTouch.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  } else {
    gPos = {
      x: ev.offsetX,
      y: ev.offsetY,
    }
  }
}

function setShape(shape) {
  gCurrShape = shape
}

function startPosition(ev) {
  gIsPainting = true
  draw(ev)
}

function endPosition() {
  gIsPainting = false
}

function draw(ev) {
  if (!gIsPainting) return
  getEvPos(ev)
  switch (gCurrShape) {
    case 'triangle':
      drawTriangle(gPos.x, gPos.y)
      break
    case 'square':
      drawRect(gPos.x, gPos.y)
      break
    case 'circle':
      drawCircle(gPos.x, gPos.y)
      break

    case 'text':
      drawText(gPos.x, gPos.y)
      break
  }
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  document.body.style.backgroundColor = 'white'
}

function resizeCanvas() {
  const elContainer = document.querySelector('.main-canvas')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

// Handle the Listeners
function addListeners() {
  addMouseListeners()
  addTouchListeners()
  //   Listen for resize ev
  window.addEventListener('resize', () => {
    resizeCanvas()
  })
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', startPosition)
  gElCanvas.addEventListener('mouseup', endPosition)
  gElCanvas.addEventListener('mousemove', draw)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', startPosition)
  gElCanvas.addEventListener('touchend', endPosition)
  gElCanvas.addEventListener('touchmove', draw)
}
