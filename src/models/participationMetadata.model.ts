export enum ParticipantKind {
    USER,
    SAVED_PLAYER,
    ANONYMOUS_PARTICIPANT,
}

export type ParticipationMetadata = {
    id: string;
    gameId: string;
    kind: ParticipantKind;
    turnOrder: number;
};
