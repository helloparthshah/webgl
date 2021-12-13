'use strict'

import
{

    getRelativeMousePosition

}
from './utils.js'

class Input
{

    constructor( )
    {

        this.down_keys = {}
        this.pressed_keys = {}
        this.last_key_pressed = null
        this.mouse_down = {}
        this.mouse_clicked = {}
        this.mousex = 0
        this.mousey = 0
        this.last_mousex = 0
        this.last_mousey = 0
        window.onkeyup = ( e ) => this.down_keys[ e.key ] = false;
        window.onkeydown = ( e ) =>
        {

            this.down_keys[ e.key ] = true;
            this.pressed_keys[ e.key ] = true;
            this.last_key_pressed = e.key

        }
        window.onmousedown = ( e ) =>
        {

            this.mouse_down[ e.button ] = true;
            this.mouse_clicked[ e.button ] = true

        }
        window.onmouseup = ( e ) => this.mouse_down[ e.button ] = false
        window.onmousemove = ( e ) =>
        {

            const pos = getRelativeMousePosition( e )
            this.last_mousex = this.mousex
            this.last_mousey = this.mousey
            this.mousex = pos.x
            this.mousey = pos.y

        }
        // to avoid infinite movement if dx / dy are > 0 and mouse hasn't moved since
        setInterval( ( ) =>
        {

            this.last_mousex = this.mousex
            this.last_mousey = this.mousey

        }, 50 )
    }

    /**
     * Update mouse clicks and key presses
     */
    update( )
    {

        for ( let key in this.pressed_keys )
            this.pressed_keys[ key ] = false

        for ( let key in this.mouse_clicked )
            this.mouse_clicked[ key ] = false

    }

    /**
     * Get x delta between frames
     * @returns { Number } The x delta between frame's mouse pos and last frame's mouse pos
     */
    getMouseDx( )
    {

        return this.mousex - this.last_mousex

    }

    /**
     * Get y delta between frames
     * @returns { Number } The y delta between frame's mouse pos and last frame's mouse pos
     */
    getMouseDy( )
    {

        return this.mousey - this.last_mousey

    }

    /**
     * Getter for last key pressed
     * @returns { String } The last key pressed on the keyboard
     */
    getLastKeyPressed( )
    {

        return this.last_key_pressed

    }

    /**
     * Checks whether a given keyboard key is down
     * @param { String } key_code The event.key found here https://keycode.info
     * @returns { Boolean } boolean whether keyboard key was down
     */
    isKeyDown( key_code )
    {

        return this.down_keys[ key_code ]

    }

    /**
     * Checks whether a given keyboard key is pressed
     * @param {String} key_code The event.key found here https://keycode.info
     * @returns {Boolean} A boolean whether keyboard key was pressed
     */
    isKeyPressed( key_code )
    {

        return this.pressed_keys[ key_code ]

    }

    /**
     * Checks whether a given mouse button is down
     * @param { Number } button The mouse button used; See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button     
     * @returns { Boolean } A boolean whether mouse button was down
     */
    isMouseDown( button )
    {

        return this.mouse_down[ button ]

    }

    /**
     * Checks whether a given mouse button was clicked
     * @param { Number } button The mouse button used; See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     * @returns { Boolean } A boolean whether mouse button was clicked
     */
    isMouseClicked( button )
    {

        return this.mouse_clicked[ button ]

    }

}

export default new Input( )
