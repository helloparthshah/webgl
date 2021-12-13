'use strict'

import SceneNode from "./scenenode.js";
import Material from "./material.js"
import {
    loadTexture,
    imageExists
} from "./utils.js";
class ObjectNode extends SceneNode {

    constructor(vbo_data, name, parent, translation = vec3.create(), rotation = vec3.create(), scale = vec3.fromValues(1, 1, 1), material = new Material(), textureName = "", normalName = "") {

        super(name, parent, translation, rotation, scale)

        this.type = "object"
        this.vbo_data = new Float32Array(vbo_data)
        this.vbo = null
        this.material = material
        this.textureName = textureName
        this.normalName = normalName
        this.texture = null

        this.normalMap = null

        this.filtering = null

        this.hasTexture = 0;
        this.hasNormalMap = 0;
        if (textureName != "" && imageExists('objects/' + this.textureName)) {
            console.log("Loading texture: " + this.textureName)
            this.textureImage = new Image();
            this.textureImage.src = 'objects/' + this.textureName;
            this.textureImage.onload = function () {
                this.hasTexture = 1;
            }.bind(this);
        }

        if (normalName != "" && imageExists('objects/' + this.normalName)) {
            this.normalImage = new Image();
            this.normalImage.src = 'objects/' + this.normalName;
            this.normalImage.onload = function () {
                this.hasNormalMap = 1;
            }.bind(this);
        }
    }

    update() {

        super.update()

    }

    getWorldSpaceTriangles() {
        let triangles = []

        for (let i = 0; i < this.vbo_data.length; i += 60) {
            let offset = 0
            let triangle = []
            for (let j = 0; j < 3; j++) {
                offset = j * 20
                let v = vec3.fromValues(this.vbo_data[offset + i], this.vbo_data[offset + i + 1], this.vbo_data[offset + i + 2])
                v = vec3.transformMat4(v, v, this.getTransform())
                triangle.push(v)
            }

            triangles.push(triangle)
        }

        return triangles
    }

    createBuffers(gl) {
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.bufferData(gl.ARRAY_BUFFER, this.vbo_data, gl.STATIC_DRAW)
    }

    render(gl, shader, flat = false, filtering = gl.LINEAR) {
        let old_filtering = this.filtering
        this.filtering = filtering
        if (this.vbo == null)
            this.createBuffers(gl)

        if (this.hasTexture == 1 && (this.texture == null || this.filtering != old_filtering))
            this.texture = loadTexture(gl, this.textureImage, this.filtering);

        if (this.hasNormalMap == 1 && (this.normalMap == null || this.filtering != old_filtering))
            this.normalMap = loadTexture(gl, this.normalImage, this.filtering);

        // Geometric Properties
        let stride = (6 * 3 + 2) * 4,
            offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        shader.setArrayBuffer("a_position", this.vbo, 3, stride, offset);

        offset = 3 * 4
        shader.setArrayBuffer("a_color", this.vbo, 3, stride, offset);

        if (flat)
            offset = 2 * 3 * 4
        else
            offset = 3 * 3 * 4
        shader.setArrayBuffer("a_normal", this.vbo, 3, stride, offset);

        offset = 4 * 3 * 4
        shader.setArrayBuffer("a_texture", this.vbo, 2, stride, offset);

        offset = (4 * 3 + 2) * 4
        shader.setArrayBuffer("a_vertex_tangent", this.vbo, 3, stride, offset);

        offset = (5 * 3 + 2) * 4
        shader.setArrayBuffer("a_vertex_bitangent", this.vbo, 3, stride, offset);

        if (this.hasTexture == 1 && this.texture != null) {
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, this.texture)
            shader.setUniform1i("u_texture", 0)
        }

        if (this.hasNormalMap == 1 && this.normalMap != null) {
            gl.activeTexture(gl.TEXTURE1)
            gl.bindTexture(gl.TEXTURE_2D, this.normalMap)
            shader.setUniform1i("u_normal_map", 1)
        }

        shader.setUniform1f("t", this.hasTexture);
        shader.setUniform1f("n", this.hasNormalMap);

        // Material Properties
        shader.setUniform3f("ka", this.material.ka)
        shader.setUniform3f("kd", this.material.kd)
        shader.setUniform3f("ks", this.material.ks)
        shader.setUniform1f("alpha", this.material.alpha)

        gl.drawArrays(gl.TRIANGLES, 0, this.vbo_data.length / 12)

    }
}

export default ObjectNode