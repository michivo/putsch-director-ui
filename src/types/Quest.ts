export interface Quest {
    id: string,
    subNumber: number,
    state: string,
    name: string,
    description: string,
    phase: number[],
    repeatable: boolean,
    parallel: boolean,
    cooldownTimeMinutes: number,
    stages: QuestStage[],
    npcs: string,
    preconditionsPlayer: string,
}

export interface QuestStage {
    name: string,
    triggerType: string,
    triggerIds: string[],
    text: string,
    backupTimeSeconds: number,
    backupTextId: string,
    playlistName: string,
}
