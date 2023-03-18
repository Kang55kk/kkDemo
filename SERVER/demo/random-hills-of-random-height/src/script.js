import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 10, 10).setLength(30);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

let controls = new OrbitControls(camera, renderer.domElement);

let grid = new THREE.GridHelper(45, 5, "yellow", "yellow");
grid.position.y = 0.5;
scene.add(grid);


let g = new THREE.PlaneGeometry(45, 45, 100, 100);
g.rotateX(-Math.PI * 0.5);
let m = new THREE.MeshBasicMaterial({color: "aqua", wireframe: true});
let o = new THREE.Mesh(g, m);
scene.add(o);

let randoms = [];
let counter = 0;
const MAX_COUNT = THREE.MathUtils.randInt(5, 10);
while(counter < MAX_COUNT){
  let rnd = THREE.MathUtils.randInt(0, 24);
  if (!randoms.includes(rnd)){
    randoms.push(rnd);
    counter++;
  }
}

let pos = g.attributes.position;
randoms.forEach( rnd => {
  let itemX = rnd % 5;
  let itemY = Math.floor(rnd / 5);
  console.log(rnd, itemX, itemY);
  let itemStep = 40 / 2;
  let centerX = -15 + (itemX + 0.5) * itemStep;
  let centerY = 15 - (itemY + 0.5) * itemStep;
  
  
  let rndHeight = THREE.MathUtils.randInt(5, 10);
  
  for(let i = 0; i < pos.count; i++){
    let currentX = pos.getX(i);
    let currentY = pos.getZ(i);
    let diffX = currentX - centerX;
    let diffY = currentY - centerY;
    let dist = Math.hypot(diffX, diffY);
    if (dist <= itemStep * 0.5){
      let currentHeight = smoothstep(itemStep * 0.5, 0, dist) * rndHeight;
      pos.setY(i, currentHeight);
    }
  }
})
g.computeVertexNormals();

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});

// https://github.com/gre/smoothstep/blob/master/index.js
function smoothstep (min, max, value) {
  var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x*x*(3 - 2*x);
};