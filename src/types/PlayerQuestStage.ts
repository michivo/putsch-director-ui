export interface PlayerQuestStage {
    playerId: string,
    name: string,
    triggerType: string,
    triggerIds: string[],
    text: string,
    backupTimeSeconds: number,
    backupTextId: string,
    stageIndex: number,
    questId: string,
    currentLocation: string,
    stageCount: number,
    playlistName: string,
    questsComplete: string[],
    feedbackCount: number,
}

export interface Player {
    id: string,
    currentLocation: string,
    feedbackCount: number,
    questsComplete: string[],
    questActive: string,
}