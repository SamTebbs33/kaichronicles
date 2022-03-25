
/**
 * The Kai monastery storage controller
 */

import { Book } from "../model/book";
import { Item } from "../model/item";
import { SectionItem } from "../model/sectionState";
import { routing } from "../routing";
import { state } from "../state";
import { views } from "../views";
import { Controller } from "./controllerFactory";
import { mechanicsEngine } from "./mechanics/mechanicsEngine";
import { setupController } from "./setupController";

// tslint:disable-next-line: class-name
export class kaimonasteryController implements Controller {

    private static instance: kaimonasteryController;

    private constructor() {
        // Set constructor private
    }

    onLeave() {
        // Do Nothing
    }

    public static getInstance(): kaimonasteryController {
        if(!this.instance) {
            this.instance = new this()
        }
        return this.instance;
    }

    /** Controller name */
    public static readonly NAME = "kaimonasteryController";

    /**
     * Render page
     */
    public async index() {

        if (!setupController.getInstance().checkBook()) {
            return;
        }

        if (state.sectionStates.currentSection !== Book.KAIMONASTERY_SECTION) {
            // This page should be only available if the current section is KAIMONASTERY_SECTION
            // This is beacause on that section state will be stored the objects info
            routing.redirect("game");
            return;
        }

        await views.loadView("kaimonastery.html");
        // Go back to the equipment section
        $("#monastery-goback").on("click", (e: JQuery.Event) => {
            this.onGoBackToEquipment(e);
        });

        // Render available objects on the Kai monastery
        mechanicsEngine.showAvailableObjects(true);
    }

    /** Go back to the Equipment section clicked */
    private onGoBackToEquipment(e: JQuery.Event) {
        e.preventDefault();

        // Save the Kai monastery inventory to the Action Chart
        state.actionChart.kaiMonasterySafekeeping = state.sectionStates.getSectionState().objects;
        state.persistState();

        // Go back to Equipment section
        state.sectionStates.currentSection = Book.EQUIPMENT_SECTION;
        routing.redirect("game");
    }

    /** Remove any Special Item non allowed in Grand Master from Kai Monastery. */
    public removeSpecialGrandMaster() {
        const kaiMonasterySection = state.sectionStates.getSectionState(Book.KAIMONASTERY_SECTION);

        // Remove any non allowed Special Item
        kaiMonasterySection.objects = kaiMonasterySection.objects.filter((sectionItem: SectionItem) => {
            const item = state.mechanics.getObject(sectionItem.id);
            if (!item) {
                return false;
            }
            if (item.type !== Item.SPECIAL) {
                return true;
            }
            return Item.ALLOWED_GRAND_MASTER.includes(sectionItem.id);
        });

        // Update action chart
        state.actionChart.kaiMonasterySafekeeping = kaiMonasterySection.objects;
    }

    /** Return page */
    public getBackController() { return "mainMenu"; }

}
