import { Combat } from "../../../model/combat";
import { COMBATTABLE_DEATH } from "../../../model/combatTable";
import { CombatTurn } from "../../../model/combatTurn";
import { randomTable } from "../../../model/randomTable";
import { state } from "../../../state";

/**
 * Javek venom test
 */
export const book3sect88 = {

    run() {
        // Replace the combat turns generation:
        const sectionState = state.sectionStates.getSectionState();

        const nextTurnAsyncFunction = async function (): Promise<CombatTurn> {
            const turn = <CombatTurn> await Combat.prototype.nextTurnAsync.call(this);
            // Check the bite:
            if (turn.loneWolf > 0 && turn.loneWolf !== COMBATTABLE_DEATH) {
                const biteRandomValue = randomTable.getRandomValue();
                turn.playerLossText = "(" + turn.playerLossText + ")";
                turn.playerLossText += " Random: " + biteRandomValue.toString();
                if (biteRandomValue === 9) {
                    turn.loneWolf = COMBATTABLE_DEATH;
                } else {
                    turn.loneWolf = 0;
                }
            }

            return turn;
        };

        for (const combat of sectionState.combats) {
            combat.nextTurnAsync = nextTurnAsyncFunction;
        }
    },
};
