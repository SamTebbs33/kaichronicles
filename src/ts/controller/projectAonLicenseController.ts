import { views } from "../views";
import { translations } from "../views/viewsUtils/translations";
import { Controller } from "./controllerFactory";


/**
 * Project Aon license controller
 */
export class projectAonLicenseController implements Controller {

    private static instance: projectAonLicenseController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): projectAonLicenseController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    async index() {
        document.title = translations.text("projectAonLicense");
        // There is no traslations of the license, so, english:
        await views.loadView("projectAonLicense.html");
    }

}
