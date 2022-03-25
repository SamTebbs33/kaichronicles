/**
 * FAQ controller
 */

import { template } from "../template";
import { views } from "../views";
import { translations } from "../views/viewsUtils/translations";
import { Controller } from "./controllerFactory";

// tslint:disable-next-line: class-name
export class faqController implements Controller {

    private static instance: faqController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): faqController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    public async index() {
        template.setNavTitle( translations.text("kaiChronicles"), "#mainMenu", true);
        await views.loadView("faq.html");
    }

    /** Return page */
    public getBackController() { return "mainMenu"; }

}
