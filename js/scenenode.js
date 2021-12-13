'use strict'

class SceneNode
{

    constructor( name, parent, translation = vec3.create( ), rotation = vec3.create( ), scale = vec3.fromValues( 1, 1, 1 ) )
    {

        this.type = "node"
        this.name = name
        this.translation = translation
        this.rotation = rotation
        this.scale = scale

        const q = quat.fromEuler( quat.create( ), this.rotation[ 0 ], this.rotation[ 1 ], this.rotation[ 2 ] )
        this.transform = mat4.fromRotationTranslationScale( mat4.create( ), q, this.translation, this.scale )

        this.parent = parent
        this.children = [ ]

    }

    /**
     * Performs any updates if necessary
     */
    update( )
    {


    }

    /**
     * Gives the transform of this node
     * @returns The transformation of this node
     */
    getTransform( )
    {

        if ( this.parent != null )
            return mat4.mul( mat4.create( ), this.parent.getTransform( ), this.transform)
        else
            return this.transform

    }

    /**
     * Gives the world space position of this SceneNode
     * @returns The world space position
     */
    getWorldSpacePosition( )
    {
        return vec3.transformMat4(vec3.create(), vec3.create(), this.transform)
    }

    /**
     * Renders this node; Note that by default scene note does not render as it has no context
     * @param { WebGL2RenderingContext } gl The WebGL2 rendering context for this app
     * @param { Shader } shader The shader to use for rendering
     * @param { Boolean } flat Flag to toggle flat shading
     */
    render( gl, shader, flat = false )
    {

        return

    }

}

export default SceneNode
