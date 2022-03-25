import { Combat } from "../../../model/combat";
import { CombatTurn } from "../../../model/combatTurn";
import { state } from "../../../state";
import { template } from "../../../template";
import { mechanicsEngine } from "../mechanicsEngine";

/** Bow tournament final */
export const book6sect26 = {

    run() {

        // Replace the combat turns generation:
        const sectionState = state.sectionStates.getSectionState();
        for (const combat of sectionState.combats) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            combat.nextTurnAsync = book6sect26.nextTurnAsync.bind(combat);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            combat.applyTurn = book6sect26.applyTurn.bind(combat);
        }

        // Add UI
        const $UI = mechanicsEngine.getMechanicsUI("mechanics-book6sect26");
        $(".combat").append( $UI );
        book6sect26.updatePlayerTargetPointsUI(true);
    },

    /** Replacement for combat turns generation */
    async nextTurnAsync(): Promise<CombatTurn> {
        const turn = <CombatTurn> await Combat.prototype.nextTurnAsync.call(this)
        // Do not remove EP to the player. Do a backup of the real loss at turn.loneWolfExtra
        turn.loneWolfExtra = turn.loneWolf;
        turn.loneWolf = turn.loneWolfBase = 0;
        return turn;
    },

    /** Replacement for turns application */
    applyTurn(this: Combat, turn: CombatTurn ) {
        // Apply normal combat
        Combat.prototype.applyTurn.call(this, turn);

        // Remove player target points (stored at turn.loneWolfExtra)
        let targetPoints = book6sect26.getPlayerTargetPoints();
        targetPoints = Combat.applyLoss( targetPoints , turn.loneWolfExtra );
        book6sect26.setPlayerTargetPoints( targetPoints );

        // Combat is finished?
        if ( targetPoints <= 0 ) {
            this.combatFinished = true;
        }

        // Update player target points
        book6sect26.updatePlayerTargetPointsUI(false);
    },

    getPlayerTargetPoints(): number {
        const targetPoints = <number> state.sectionStates.otherStates.book6sect26TargetPoints;
        if ( targetPoints === undefined || targetPoints === null ) {
            return 50;
        }
        return targetPoints;
    },

    setPlayerTargetPoints( targetPoints: number ) {
        state.sectionStates.otherStates.book6sect26TargetPoints = targetPoints;
    },

    updatePlayerTargetPointsUI( doNotAnimate: boolean ) {
        const targetPoints = book6sect26.getPlayerTargetPoints();
        const color = ( targetPoints <= 0 ? "red" : null );
        template.animateValueChange( $("#mechanics-targetpoins") , targetPoints , doNotAnimate , color );
    },
};
