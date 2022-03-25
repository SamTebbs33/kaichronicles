import { BookSeriesId } from "./bookSeries";
import { GndDiscipline, KaiDiscipline, MgnDiscipline } from "./disciplinesDefinitions";

/**
 * Disciplines helpers
 */
export class Disciplines {

    private static getDisciplinesIds(disciplinesEnum: unknown): string[] {
        const result = new Array<string>();
        for (const disciplineKey of Object.keys(disciplinesEnum)) {
            result.push(disciplinesEnum[disciplineKey]);
        }
        return result;
    }

    /** Returns all disciplines ids for the  given book series */
    public static getSeriesDisciplines(seriesId: BookSeriesId): string[] {
        switch (seriesId) {
            case BookSeriesId.Kai:
                return Disciplines.getDisciplinesIds(KaiDiscipline);
            case BookSeriesId.Magnakai:
                return Disciplines.getDisciplinesIds(MgnDiscipline);
            case BookSeriesId.GrandMaster:
                return Disciplines.getDisciplinesIds(GndDiscipline);
            default:
                return [];
        }
    }
}
