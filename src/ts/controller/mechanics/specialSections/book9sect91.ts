import { randomTable } from "../../../model/randomTable";
import { state } from "../../../state";
import { translations } from "../../../views/viewsUtils/translations";
import { actionChartController } from "../../actionChartController";
import { mechanicsEngine } from "../mechanicsEngine";

/** Book 9, sect91: Drop half of your backpack content */
export const book9sect91 = {

    run() {
        try {
            // Check if this has been executed
            let coinState = <string>state.sectionStates.otherStates.book9sect91;
            if (coinState) {
                // Already executed
                book9sect91.setUI(coinState);
                return;
            }

            // Count up the number of Backpack Items you possess and, if there is an odd number, erase the last one on your list
            const l = state.actionChart.backpackItems.length;
            if (l % 2 === 1) {
                const index = l - 1;
                actionChartController.getInstance().drop(state.actionChart.backpackItems[index].id, false, false, 0, index);
            }

            // Get the two lists
            const headsIndices = new Array<number>();
            const tailsIndices = new Array<number>();
            const halfIndex = state.actionChart.backpackItems.length / 2;
            for (let i = 0; i < state.actionChart.backpackItems.length; i++) {
                if (i < halfIndex) {
                    headsIndices.push(i);
                } else {
                    tailsIndices.push(i);
                }
            }

            // Get the list to remove
            coinState = (randomTable.getRandomValue() % 2 === 0 ? "heads" : "tails");

            // Drop objects
            actionChartController.getInstance().dropItemIndicesList(state.actionChart.backpackItems,
                coinState === "heads" ? headsIndices : tailsIndices);

            // Store state
            state.sectionStates.otherStates.book9sect91 = coinState;

            // Set UI
            book9sect91.setUI(coinState);
        } catch (e) {
            // throw new Error(e);
            mechanicsEngine.debugWarning(e);
        }
    },

    setUI(coinState: string) {
        mechanicsEngine.showMessage(translations.text(coinState));
    },
};
