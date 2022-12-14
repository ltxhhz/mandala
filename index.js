/**@type {HTMLCanvasElement} */
const can = document.getElementById('main')
const ctx = can.getContext('2d')
const config = {
  text: [{
    content: '</><>',
    num: 16,
  }, {
    content: '../../',
    num: 7,
  }, {
    content: '{{{{ }}}}',
    num: 6,
  }, {
    content: '++++++',
    num: 7,
  }, {
    content: '\/\/\/\/\/\/\/\/\/\/\/\/',
    num: 6,
  }],
  divide: 0.3,
  bgColor: 'white',
  color: 'black',
  fontsize: 12,
  bold: true,
  rotationSpeed: 0.007
}
can.width = innerWidth
can.height = innerHeight

//#region wallpaper engine config
window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    console.log(properties);
    if (properties.backgroundcolor) {
      const color = wpGetInputColor(properties.backgroundcolor.value)
      config.bgColor = color.str
    }
    if (properties.color) {
      const color = wpGetInputColor(properties.color.value)
      config.color = color.str
    }
    if (properties.fontsize) {
      config.fontsize = properties.fontsize.value
    }
    if (properties.bold) {
      config.bold = properties.bold.value
    }
    if (properties.rotationspeed) {
      config.rotationSpeed = properties.rotationspeed.value
    }
    console.log(config);
  },
};
//#endregion

let i = 0

function start(start) {
  ctx.font = `${config.bold ? 'bold ' : ''}${config.fontsize}px Microsoft YaHei`
  let r1
  const end = Math.PI * 2 + start
  config.text.forEach((e, i) => {
    const m = ctx.measureText(e.content)
    if (i == 0) {
      const c = m.width * e.num
      const r = r1 = c / 2 / Math.PI
      drawCircularText({
        x: can.width / 2,
        y: can.height / 2,
        radius: r,
      }, e.content.repeat(e.num), start, end - (Math.PI * 2 / (e.content.length * e.num)))
    } else {
      const r = r1 + i * config.fontsize * 4
      const avg = Math.PI * 2 / e.num
      for (let i = 0; i < e.num; i++) {
        drawCircularText({
          x: can.width / 2,
          y: can.height / 2,
          radius: r,
        }, e.content, i * avg + start, (i + 1) * avg + start - config.divide)
      }
    }
  });

}
(function animloop() {
  // ctx.clearRect(0, 0, can.width, can.height)
  fillBg(config.bgColor)
  start(i += config.rotationSpeed);
  requestAnimationFrame(animloop);
})();

function fillBg(color = 'white') {
  ctx.save()
  ctx.fillStyle = color
  ctx.fillRect(0, 0, can.width, can.height)
  ctx.restore()
}

//????????????
function rads(x) {
  return (Math.PI * x) / 180
}
/**
 * @param {{x:number,y:number,radius:number}} s
 * @param {string} string
 * @param {number} startAngle
 * @param {number} endAngle
 */
function drawCircularText(s, string, startAngle, endAngle) {
  var radius = s.radius,
    angleDecrement =
      (startAngle - endAngle) / (string.length - 1),
    angle = parseFloat(startAngle),
    index = 0,
    character
  ctx.save()
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  while (index < string.length) {
    character = string[index]
    ctx.save()
    ctx.beginPath()
    ctx.translate(
      s.x + Math.cos(angle) * radius,
      s.y + Math.sin(angle) * radius
    )
    ctx.rotate(Math.PI / 2 + angle)
    ctx.fillText(character, 0, 0)
    angle -= angleDecrement
    index++
    ctx.restore()
  }
  ctx.restore()
}

function wpGetInputColor(str) {
  const arr = str.split(' ').map(e => Math.ceil(e * 255))
  return {
    arr,
    str: `rgb(${arr})`
  }
}