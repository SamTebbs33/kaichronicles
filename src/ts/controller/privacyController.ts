/**
 * Privacy controller page
 */

import { views } from "../views";
import { Controller } from "./controllerFactory";

// tslint:disable-next-line: class-name
export class privacyController implements Controller {

    private static instance: privacyController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): privacyController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * Render the page
     */
    public async index() {
        await views.loadView( "privacy.html" );
    }

}
