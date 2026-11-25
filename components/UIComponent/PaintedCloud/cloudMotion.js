export const cloudArtwork = "/assets/painted-cumulus.webp";

const vertexSource = `
  attribute vec2 position;
  varying vec2 cloudUV;

  void main() {
    cloudUV = position * .5 + .5;
    gl_Position = vec4(position, 0., 1.);
  }
`;

// The painted tier's UV motion from DragonProject/src/scene/clouds.ts.
const fragmentSource = `
  precision mediump float;
  varying vec2 cloudUV;
  uniform sampler2D ink;
  uniform float time;

  void main() {
    vec2 uv = cloudUV;
    uv.x += .011 * sin(time * .7 + uv.y * 9. + .15)
          + .005 * sin(uv.y * 19. + time * .5);
    uv.y += .016 * sin(uv.x * 13. - time * .57 + .15);
    gl_FragColor = texture2D(ink, clamp(uv, 0., 1.));
  }
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createRenderer() {
  const surface = document.createElement("canvas");
  surface.width = 600;
  surface.height = 200;
  const gl = surface.getContext("webgl", { antialias: false, depth: false });
  if (!gl) return null;

  const program = gl.createProgram();
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  gl.useProgram(program);
  const positions = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positions);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const time = gl.getUniformLocation(program, "time");
  gl.uniform1i(gl.getUniformLocation(program, "ink"), 0);
  gl.viewport(0, 0, surface.width, surface.height);

  const texture = gl.createTexture();
  const artwork = new Image();
  artwork.src = cloudArtwork;

  return {
    gl,
    surface,
    ready: artwork.decode().then(() => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, artwork);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }),
    draw(seconds) {
      gl.uniform1f(time, seconds);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}

// Render one shared texture frame for the banks currently in view.
const visibleClouds = new Map();
let renderer;
let frame;
let lastPaint = 0;

function paintClouds(now) {
  frame = undefined;

  if (renderer.gl.isContextLost()) {
    visibleClouds.forEach((_, canvas) => canvas.removeAttribute("data-ready"));
    renderer = null;
    return;
  }

  if (now - lastPaint >= 32) {
    lastPaint = now;
    renderer.draw((now / 1000) * 0.8);
    visibleClouds.forEach((context, canvas) => {
      context.drawImage(renderer.surface, 0, 0);
      if (!canvas.hasAttribute("data-ready")) canvas.setAttribute("data-ready", "");
    });
  }
  frame = requestAnimationFrame(paintClouds);
}

export function watchCloud(canvas) {
  if (renderer === undefined) renderer = createRenderer();
  if (!renderer) return;

  const context = canvas.getContext("2d");
  if (!context) return;
  context.globalCompositeOperation = "copy";
  visibleClouds.set(canvas, context);

  renderer.ready.then(() => {
    if (renderer && visibleClouds.size && frame === undefined) {
      frame = requestAnimationFrame(paintClouds);
    }
  }).catch(() => {
    renderer = null;
  });

  return () => {
    visibleClouds.delete(canvas);
    canvas.removeAttribute("data-ready");
    if (!visibleClouds.size && frame !== undefined) {
      cancelAnimationFrame(frame);
      frame = undefined;
    }
  };
}
