import Material from "./material.js"
import ObjectNode from "./object.js"
import {loadObjFile} from "./utils.js"

class PointLight extends ObjectNode {
    constructor(position, Id, Is, k, parent) {
        if (!PointLight.instanceCount)
            PointLight.instanceCount = 0

        let [sphere, _] = loadObjFile("../objects/sphere.obj", [1,0,0])

        super(sphere, 'point_light'+PointLight.instanceCount, parent, position, vec3.create(), vec3.fromValues(0.25, 0.25, 0.25))
        PointLight.instanceCount += 1

        this.type = "light"
        this.lightType = "point"
        this.Id = Id
        this.Is = Is
        this.k = k
    }

    getPosition() {

        return mat4.getTranslation( vec3.create(), this.getTransform() )
    }
}

class DirectionalLight extends ObjectNode {
    constructor(direction, Id, Is, parent) {

        if (!DirectionalLight.instanceCount)
        DirectionalLight.instanceCount = 0

        let [pyramid, _]  = loadObjFile("../objects/pyramid.obj", [1,0,0])

        super(pyramid, 'dir_light'+DirectionalLight.instanceCount, parent, vec3.fromValues(5 - 2.5 * (DirectionalLight.instanceCount%4), 3, 5 - 2.5*(Math.floor(DirectionalLight.instanceCount/4))), vec3.normalize( vec3.create(), direction ), vec3.fromValues(0.4, 0.4, 0.4))
        DirectionalLight.instanceCount += 1

        this.type = "light"
        this.lightType = "directional"
        this.Id = Id
        this.Is = Is
    }

    getDirection() {
        return vec3.transformQuat( vec3.create(), this.rotation, mat4.getRotation( quat.create(), this.getTransform() ))
    }
}


export {
    PointLight,
    DirectionalLight
}