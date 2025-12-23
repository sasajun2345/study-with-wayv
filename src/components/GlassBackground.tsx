import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GlassBackground() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 3
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    ref.current.appendChild(renderer.domElement)

    const plane = new THREE.PlaneGeometry(6, 6, 200, 200)
    const uniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#a7f3d0') },
      uColorB: { value: new THREE.Color('#34d399') }
    }
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main(){
          vUv = uv;
          vec3 pos = position;
          float w1 = sin(pos.x*1.2 + uTime*0.6)*0.03;
          float w2 = cos(pos.y*1.5 + uTime*0.7)*0.03;
          pos.z += w1 + w2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        void main(){
          float r = smoothstep(0.0,1.0,vUv.y);
          vec3 col = mix(uColorA,uColorB,r);
          float glass = 0.25 + 0.15*abs(sin(vUv.y*6.2831));
          gl_FragColor = vec4(col, glass);
        }
      `
    })
    const mesh = new THREE.Mesh(plane, material)
    scene.add(mesh)

    const count = 400
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6
      positions[i * 3 + 2] = Math.random() * 0.4
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(geo, new THREE.PointsMaterial({ color: '#10b981', size: 0.02, transparent: true, opacity: 0.6 }))
    scene.add(points)

    let running = true
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    const animate = () => {
      if (!running) return
      uniforms.uTime.value += clock.getDelta()
      points.rotation.z += 0.0008
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      running = false
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      plane.dispose()
      geo.dispose()
      material.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 z-0 pointer-events-none" />
}
