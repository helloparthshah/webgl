'use strict'

import Input from "./input.js"
import AppState from "./appstate.js"
import Shader from "./shader.js"
import {
    OrbitMovement
} from "./movement.js"

class App {

    constructor(scene) {

        console.log("Initializing App")

        // canvas & gl
        this.canvas = document.getElementById("canvas")
        this.canvas.addEventListener("contextmenu", event => event.preventDefault());
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
        this.gl = this.initGl()

        // save the scene
        this.scene = scene.scene

        // shaders
        console.log("Loading Shaders")
        this.wireframe_shader = new Shader(this.gl, "../shaders/wireframe.vert.glsl", "../shaders/wireframe.frag.glsl")
        this.flat_shader = new Shader(this.gl, "../shaders/flat.vert.glsl", "../shaders/flat.frag.glsl")
        this.gouraud_shader = new Shader(this.gl, "../shaders/gouraud.vert.glsl", "../shaders/gouraud.frag.glsl")
        this.phong_shader = new Shader(this.gl, "../shaders/phong.vert.glsl", "../shaders/phong.frag.glsl")
        this.shader = this.phong_shader

        // camera
        this.camera = scene.camera
        this.initCamera()

        // light
        this.lights = scene.lights
        console.log(this.lights)

        // movement
        this.movement = new OrbitMovement(this, 0.4)

        // resize handling
        this.resizeToDisplay()
        window.onresize = this.resizeToDisplay.bind(this)

        this.filtering = this.gl.LINEAR

        // app state
        this.app_state = new AppState(this)
    }

    /**
     * Initialize the camera and update settings
     */
    initCamera() {
        this.camera.aspect = this.canvas.width / this.canvas.height
        this.camera.canvas_height = this.canvas.height
        this.camera.canvas_width = this.canvas.width
        this.camera.update()
    }

    /** 
     * Resizes camera and canvas to pixel-size-corrected display size
     */
    resizeToDisplay() {

        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
        this.camera.canvas_height = this.canvas.height
        this.camera.canvas_width = this.canvas.width
        this.camera.aspect = this.canvas.width / this.canvas.height
        this.camera.update()

    }

    /**
     * Initializes webgl2 with settings
     * @returns { WebGL2RenderingContext | null }
     */
    initGl() {

        let gl = this.canvas.getContext("webgl2")

        if (!gl) {
            alert("Could not initialize WebGL2.")
            return null
        }

        gl.enable(gl.CULL_FACE); // Turn on culling. By default backfacing triangles will be culled.
        gl.enable(gl.DEPTH_TEST); // Enable the depth buffer
        gl.clearDepth(1.0);
        gl.clearColor(0, 0, 0, 1);
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        return gl
    }

    /**
     * Starts render loop
     */
    start() {

        requestAnimationFrame(() => {

            this.update()

        })

    }

    /**
     * Called every frame, triggers input and app state update and renders a frame
     */
    update() {

        this.app_state.update()
        this.movement.update()
        Input.update()
        this.render()
        requestAnimationFrame(() => {

            this.update()

        })

    }

    /**
     * Main render loop
     */
    render() {

        // clear the screen
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        // render geometry
        this._render(this.scene)
    }

    /**
     * Recursively renders the SceneNode hierarchy
     * 
     * @param {SceneNode} node node to render and process
     */
    _render(node) {
        this.shader.use()

        // Matrices
        this.shader.setUniform4x4f("u_m_matrix", node.getTransform())
        this.shader.setUniform4x4f("u_v_matrix", this.camera.view)
        this.shader.setUniform4x4f("u_p_matrix", this.camera.projection)

        // Lights
        this.shader.setUniform1i("num_point_lights", this.lights.point_lights.length)
        for (let i = 0; i < this.lights.point_lights.length; i++) {
            this.shader.setUniform3f(`point_lights[${i}].position`, this.lights.point_lights[i].getPosition())
            this.shader.setUniform3f(`point_lights[${i}].Is`, this.lights.point_lights[i].Is)
            this.shader.setUniform3f(`point_lights[${i}].Id`, this.lights.point_lights[i].Id)
            this.shader.setUniform1f(`point_lights[${i}].k`, this.lights.point_lights[i].k)
        }

        this.shader.setUniform1i("num_directional_lights", this.lights.directional_lights.length)
        for (let i = 0; i < this.lights.directional_lights.length; i++) {
            this.shader.setUniform3f(`directional_lights[${i}].direction`, this.lights.directional_lights[i].getDirection())
            this.shader.setUniform3f(`directional_lights[${i}].Is`, this.lights.directional_lights[i].Is)
            this.shader.setUniform3f(`directional_lights[${i}].Id`, this.lights.directional_lights[i].Id)
        }

        this.shader.setUniform3f("Ia", this.lights.ambient)

        // Camera
        this.shader.setUniform3f("u_camera_position", this.camera.position)

        node.render(this.gl, this.shader, this.app_state.is_flatshading, this.filtering)

        for (let child of node.children) {
            if (child.type == 'light')
                this._renderLight(child)
            else
                this._render(child)
        }
    }

    _renderLight(node) {

        this.flat_shader.use()

        // Matrices
        this.flat_shader.setUniform4x4f("u_m_matrix", node.getTransform())
        this.flat_shader.setUniform4x4f("u_v_matrix", this.camera.view)
        this.flat_shader.setUniform4x4f("u_p_matrix", this.camera.projection)

        node.render(this.gl, this.flat_shader)

    }

}

export default App