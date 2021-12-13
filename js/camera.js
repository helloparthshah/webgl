'use strict'

import SceneNode from "./scenenode.js"
import {perspectiveProjectionMatrix, orthographicProjectionMatrix} from "./matrix.js"
import {clamp, deg2rad} from "./utils.js"

class Camera extends SceneNode
{
    constructor( position, look_at, up, fovy, aspect = ( 16 / 9 ), near = 0.01, far = 200000, canvas_height = 0, canvas_width = 0 )
    {

        super( )
        this.position = position
        this.look_at = look_at
        this.up = up
        this.fovy = fovy
        this.aspect = aspect
        this.canvas_height = canvas_height
        this.canvas_width = canvas_width
        this.near = near
        this.far = far

        this.view = mat4.create( )
        mat4.lookAt( this.view, this.position, this.look_at, this.up )

        // Implemented by subclasses
        this.projection = mat4.create( )
    }

    update( )
    {
        super.update( )
    }

    vp( )
    {
        return mat4.mul( mat4.create( ), mat4.mul( mat4.create( ), this.projection, this.view ), this.getTransform( ) )
    }

    invV() {
        return mat4.invert(mat4.create(), this.view)
    }

    invP() {
        return mat4.invert(mat4.create(), this.projection)
    }

}

class PerspectiveCamera extends Camera
{

    constructor( position, look_at, up, fovy, aspect = ( 16 / 9 ), near = 0.01, far = 200000 )
    {
        super( position, look_at, up, fovy, aspect, near, far )

        this.projection = perspectiveProjectionMatrix( deg2rad(this.fovy), this.aspect, this.near, this.far )

    }

    update( )
    {
        super.update( )
    }

    translate( translation )
    {
        this.translation = mat4.add( this.translation, this.translation, translation )
    }

}

class OrthographicCamera extends Camera
{

    constructor( position, look_at, up, fovy, aspect = ( 16 / 9 ), near = 0.01, far = 200000 )
    {
        super( position, look_at, up, fovy, aspect, near, far )

        this.zoom = 1

        this.projection = orthographicProjectionMatrix( -5.0 * this.zoom, 5.0 * this.zoom, -5.0 / this.aspect * this.zoom, 5.0 / this.aspect * this.zoom, this.near, this.far )
    }

    update( )
    {
        super.update( )
    }

    translate( translation )
    {
        this.zoom = clamp( this.zoom + translation[ 2 ], 0.01, 20 )

        mat4.ortho( this.projection, -5.0 * this.zoom, 5.0 * this.zoom, -5.0 / this.aspect * this.zoom, 5.0 / this.aspect * this.zoom, this.near, this.far )
    }

}

class FpsCamera extends Camera
{

    // BONUS CREDIT

}

export
{

    PerspectiveCamera,
    OrthographicCamera
    
}
