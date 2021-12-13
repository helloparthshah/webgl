'use strict'

import
{
    loadExternalFile
}
from "./utils.js"

class Shader
{
    constructor( gl, vertex_file, fragment_file )
    {

        this.gl = gl
        let vert = gl.createShader( gl.VERTEX_SHADER )
        let frag = gl.createShader( gl.FRAGMENT_SHADER )
        let program = gl.createProgram( );

        gl.shaderSource( vert, loadExternalFile( vertex_file ) )
        gl.shaderSource( frag, loadExternalFile( fragment_file ) )

        gl.compileShader( vert )
        if ( !gl.getShaderParameter( vert, gl.COMPILE_STATUS ) )
        {
            alert( `An error occurred compiling the shader: ${gl.getShaderInfoLog(vert)}` )
            gl.deleteShader( vert )
        }

        gl.compileShader( frag )
        if ( !gl.getShaderParameter( frag, gl.COMPILE_STATUS ) )
        {
            alert( `An error occurred compiling the shader: ${gl.getShaderInfoLog(frag)}` )
            gl.deleteShader( frag )
        }

        gl.attachShader( program, vert )
        gl.attachShader( program, frag )
        gl.linkProgram( program )

        if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) )
        {
            alert( `Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}` )
            gl.deleteProgram( program )
        }

        this.program = program

    }

    /**
     * Tell the webgl rendering context to use this.program as shaderprogram
     */
    use( )
    {

        this.gl.useProgram( this.program )

    }

    /**
     * Gets an attribute location by name
     * @param { String } name The name of the attribute
     * @returns { GLint } The location of the attribute
     */
    getAttributeLocation( name )
    {

        return this.gl.getAttribLocation( this.program, name )

    }

    /**
     * Gets a uniform location by name
     * @param { String } name The name of the uniform
     * @returns { GLint } The location of the uniform
     */
    getUniformLocation( name )
    {

        return this.gl.getUniformLocation( this.program, name )

    }

    /**
     * Sets a float scalar uniform by location name
     * @param { String } name The name of the uniform
     * @param { Number } value The value of the scalar
     */
    setUniform1f( name, value )
    {
        const location = this.getUniformLocation( name )
        if (location < 0) {
            console.log('Uniform not found: ' + name)
            return
        }
        this.gl.uniform1f( location, value )

    }

    /**
     * Sets a 2 dim float vector uniform by location name
     * @param { String } name The name of the uniform
     * @param { Array<Number> } value The value of the vector
     */
    setUniform2f( name, value )
    {
        const location = this.getUniformLocation( name )
        if (location < 0) {
            console.log('Uniform not found: ' + name)
            return
        }
        this.gl.uniform2fv( location, value )

    }

    /**
     * Sets a 3 dim float vector uniform by location name
     * @param { String } name The name of the uniform
     * @param { Array.<Number> } value The value of the vector
     */
    setUniform3f( name, value )
    {
        const location = this.getUniformLocation( name )
        if (location < 0) {
            console.log('Uniform not found: ' + name)
            return
        }
        this.gl.uniform3fv( location, value )

    }

    /**
     * Sets a scalar uniform integer by location name
     * @param { String } name The name of the uniform
     * @param { Number } value The value of the scalar
     */
    setUniform1i( name, value )
    {
        const location = this.getUniformLocation( name )
        if (location < 0) {
            console.log('Uniform not found: ' + name)
            return
        }
        this.gl.uniform1i( location, value )

    }

    /**
     * Sets a uniform 2-element integer by location name
     * @param { String } name The name of the uniform
     * @param { Array.<Number> } value The value of the 2-element integer
     */
    setUniform2i( name, value )
    {
        const location = this.getUniformLocation( name )
        if (location < 0) {
            console.log('Uniform not found: ' + name)
            return
        }
        this.gl.uniform2iv( location, value )

    }

    /**
     * Sets a uniform 3-element integer by location name
     * @param { String } name The name of the uniform
     * @param { Array.<Number> } value The value of the 3-element integer
     */
    setUniform3i( name, value )
    {
        const location = this.getUniformLocation( name )
        if (location < 0) {
            console.log('Uniform not found: ' + name)
            return
        }
        this.gl.uniform3iv( location, value )

    }

    /**
     * Sets a 4x4 matrix in the shader
     * @param { String } name The name of the matrix uniform 
     * @param { Array.<Number> } value The matrix 
     */
    setUniform4x4f( name, value )
    {
        const location = this.getUniformLocation( name )
        if (location < 0) {
            console.log('Uniform not found: ' + name)
            return
        }
        this.gl.uniformMatrix4fv( location, false, value )

    }

    /**
     * Convenience method to bind a buffer to a shader attribute
     * @param { String } name The name of the attribute
     * @param { WebGLBuffer } buffer The webgl buffer
     * @param { Number } num_components The number of components per entry
     * @param { Number } stride The stride to use
     * @param { Number } offset The offset to use
     */
    setArrayBuffer( name, buffer, num_components, stride = 0, offset = 0 )
    {

        const location = this.getAttributeLocation( name )
        if (location < 0) {
            return
        }

        this.gl.enableVertexAttribArray( location )
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, buffer )
        this.gl.vertexAttribPointer( location, num_components, this.gl.FLOAT, false, stride, offset )

    }

}

export default Shader
