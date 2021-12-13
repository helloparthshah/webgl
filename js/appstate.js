'use strict'

import Input from "./input.js"
import {
    PerspectiveCamera,
    OrthographicCamera
} from "./camera.js"
import {
    OrbitMovement,
    RaycastMovement
} from './movement.js'
import {
    hex2rgb,
    rgb2hex
} from './utils.js'

class AppState {

    constructor(app) {

        this.app = app
        this.is_selecting = false
        this.is_new_selection = false
        this.is_flatshading = false

        // get list of ui indicators
        this.ui_categories = {

            "camera_mode": {

                "fps": document.getElementById("fpsCamMode"),
                "stationary": document.getElementById("statCamMode")

            },
            "projection_mode": {

                "perspective": document.getElementById("perspProjMode"),
                "orthographic": document.getElementById("orthoProjMode")

            },
            "selection": {

                "raycasting": document.getElementById("selectionRaycasting"),
                "target": document.getElementById("selectionTarget")

            },
            "shading": {

                "wireframe": document.getElementById("wireframeShading"),
                "flat": document.getElementById("flatShading"),
                "flat_gouraud": document.getElementById("flatGouraudShading"),
                "gouraud": document.getElementById("gouraudShading"),
                "phong": document.getElementById("phongShading"),
            },
            "filtering": {

                "nearest": document.getElementById("nearest"),
                "linear": document.getElementById("linear"),
            }

        }

        // get list of material and light ui components
        this.ui_material_components = {
            "shininess": document.getElementById("materialShininess"),
            "ka": document.getElementById("materialKa"),
            "kd": document.getElementById("materialKd"),
            "ks": document.getElementById("materialKs"),
        }

        this.ui_lighting_components = {
            "ia": document.getElementById("lightingIa"),
            "id": document.getElementById("lightingId"),
            "is": document.getElementById("lightingIs"),
        }

        // update ui with default values
        this.updateUI("camera_mode", "stationary")
        this.updateUI("shading", "phong")
        this.updateUI("filtering", "linear")
        this.updateUI("projection_mode", "perspective")
        this.updateUI("selection", "target")
        this.updateMaterialUI(false)
        this.updateLightingUI(false)

    }

    /**
     * Updates the app state by checking the input module for changes in user input
     */
    update() {

        // Shading Input
        if (Input.isKeyDown("1")) {
            this.app.shader = this.app.wireframe_shader
            this.is_flatshading = true
            this.updateUI("shading", "wireframe")
        } else if (Input.isKeyDown("2")) {
            this.app.shader = this.app.flat_shader
            this.is_flatshading = true
            this.updateUI("shading", "flat")
        } else if (Input.isKeyDown("3")) {
            this.app.shader = this.app.gouraud_shader
            this.is_flatshading = true
            this.updateUI("shading", "flat_gouraud")
        } else if (Input.isKeyDown("4")) {
            this.app.shader = this.app.gouraud_shader
            this.is_flatshading = false
            this.updateUI("shading", "gouraud")
        } else if (Input.isKeyDown("5")) {
            this.app.shader = this.app.phong_shader
            this.is_flatshading = false
            this.updateUI("shading", "phong")
        }

        // Filtering Input
        if (Input.isKeyDown("n")) {
            this.app.filtering = this.app.gl.NEAREST
            this.updateUI("filtering", "nearest")
        } else if (Input.isKeyDown("l")) {
            this.app.filtering = this.app.gl.LINEAR
            this.updateUI("filtering", "linear")
        }


        // Camera Input
        if (Input.isKeyDown("o")) {
            this.app.camera = new OrthographicCamera(this.app.camera.position, this.app.camera.look_at, this.app.camera.up, this.app.camera.fovy, this.app.camera.aspect, this.app.camera.near, this.app.camera.far)
            this.app.movement.camera = this.app.camera
            this.app.initCamera()
            this.updateUI("projection_mode", "orthographic")
        } else if (Input.isKeyDown("p")) {
            this.app.camera = new PerspectiveCamera(this.app.camera.position, this.app.camera.look_at, this.app.camera.up, this.app.camera.fovy, this.app.camera.aspect, this.app.camera.near, this.app.camera.far)
            this.app.movement.camera = this.app.camera
            this.app.initCamera()
            this.updateUI("projection_mode", "perspective")
        }

        // Raycasting
        if (Input.isKeyPressed("r") && !this.is_selecting) {
            console.log("Raycast on")
            this.app.movement = new RaycastMovement(this.app)
            this.updateUI("selection", "raycasting")
            this.is_selecting = true
        } else if (Input.isKeyPressed("r") && this.is_selecting) {
            this.app.movement = new OrbitMovement(this.app)
            this.updateUI("selection", "target", "No Target Selected")
            this.is_selecting = false
            this.updateMaterialUI(false)
            this.updateLightingUI(false)
        }

        if (this.is_new_selection && this.app.movement.selected_object) {
            this.is_new_selection = false
            this.updateUI("selection", "target", "Selected '" + this.app.movement.selected_object.name + "'")
            if (this.app.movement.selected_object.type == 'object')
                this.updateMaterialUI(true)
            else if (this.app.movement.selected_object.type == 'light')
                this.updateLightingUI(true)
        }
    }

    updateMaterialUI(enable) {
        if (enable) {
            this.ui_material_components["shininess"].value = this.app.movement.selected_object.material.alpha
            this.ui_material_components["ka"].value = rgb2hex(this.app.movement.selected_object.material.ka)
            this.ui_material_components["kd"].value = rgb2hex(this.app.movement.selected_object.material.kd)
            this.ui_material_components["ks"].value = rgb2hex(this.app.movement.selected_object.material.ks)
        } else {
            this.ui_material_components["shininess"].value = 0
            this.ui_material_components["ka"].value = "#000000"
            this.ui_material_components["kd"].value = "#000000"
            this.ui_material_components["ks"].value = "#000000"
        }

        this.updateMaterialUICallbacks(enable)
    }

    updateMaterialUICallbacks(enable) {

        if (enable) {
            window.materialShininessChanged = (value) => {
                this.app.movement.selected_object.material.alpha = value;
                console.log(value)
            }
            window.materialKaChanged = (value) => {
                this.app.movement.selected_object.material.ka = hex2rgb(value)
            }
            window.materialKdChanged = (value) => {
                this.app.movement.selected_object.material.kd = hex2rgb(value)
            }
            window.materialKsChanged = (value) => {
                this.app.movement.selected_object.material.ks = hex2rgb(value)
            }
        } else {
            window.materialShininessChanged = () => {}
            window.materialKaChanged = () => {}
            window.materialKdChanged = () => {}
            window.materialKsChanged = () => {}
        }
    }

    updateLightingUI(enable) {
        if (enable) {
            this.ui_lighting_components["ia"].value = rgb2hex(this.app.lights.ambient)
            this.ui_lighting_components["id"].value = rgb2hex(this.app.movement.selected_object.Id)
            this.ui_lighting_components["is"].value = rgb2hex(this.app.movement.selected_object.Is)
        } else {
            this.ui_lighting_components["ia"].value = rgb2hex(this.app.lights.ambient)
            this.ui_lighting_components["id"].value = "#000000"
            this.ui_lighting_components["is"].value = "#000000"
        }

        this.updateLightingUiCallbacks(enable)
    }

    updateLightingUiCallbacks(enable) {

        if (enable) {
            window.lightingIaChanged = (value) => {
                this.app.lights.ambient = hex2rgb(value)
            }
            window.lightingIdChanged = (value) => {
                this.app.movement.selected_object.Id = hex2rgb(value)
            }
            window.lightingIsChanged = (value) => {
                this.app.movement.selected_object.Is = hex2rgb(value)
            }
        } else {
            window.lightingIaChanged = (value) => {
                this.app.lights.ambient = hex2rgb(value)
            }
            window.lightingIdChanged = () => {}
            window.lightingIsChanged = () => {}
        }
    }

    /**
     * Updates the ui to represent the current interaction
     * @param { String } category The ui category to use; see this.ui_categories for reference
     * @param { String } name The name of the item within the category
     * @param { String | null } value The value to use if the ui element is not a toggle; sets the element to given string 
     */
    updateUI(category, name, value = null) {

        for (let key in this.ui_categories[category]) {

            this.updateUIElement(this.ui_categories[category][key], key == name, value)

        }

    }

    /**
     * Updates a single ui element with given state and value
     * @param { Element } el The dom element to update
     * @param { Boolean } state The state (active / inactive) to update it to
     * @param { String | null } value The value to use if the ui element is not a toggle; sets the element to given string 
     */
    updateUIElement(el, state, value) {

        el.classList.remove(state ? "inactive" : "active")
        el.classList.add(state ? "active" : "inactive")

        if (state && value != null)
            el.innerHTML = value

    }

}

export default AppState