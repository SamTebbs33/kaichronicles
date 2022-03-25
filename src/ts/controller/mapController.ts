import { Section } from "../model/section";
import { state } from "../state";
import { views } from "../views";
import { mapView } from "../views/mapView";
import { Controller } from "./controllerFactory";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";
import { setupController } from "./setupController";

/**
 * The map controller
 */
export class mapController implements Controller {

    private static instance: mapController;

    private constructor() {
        // Set constructor private
    }

    public static getInstance(): mapController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /**
     * Render the map
     */
    async index() {
        if ( !setupController.getInstance().checkBook() ) {
            return;
        }

        const mapSection = new Section(state.book, "map", state.mechanics);
        if ( !mapSection.exists() ) {
            mechanicsEngine.debugWarning("Map section does not exists");
            return;
        }

        await views.loadView("map.html");
        if ( state.book.bookNumber === 11 ) {
            // Special case
            mapView.setMapBook11();
        } else {
            mapView.setSectionContent( mapSection );
        }
        mapView.bindEvents();
    }

    /**
     * On leave controller
     */
    onLeave() {
        mapView.unbindEvents();
    }

    /** Return page */
    getBackController() { return "game"; }

}
