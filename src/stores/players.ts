import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { writable, type Writable } from 'svelte/store';
import { putschFirestore } from '../tools/firebase';
import type { Player, PlayerQuestStage } from '../types/PlayerQuestStage';

let questsUnsubscribe: Unsubscribe;
let playersUnsubscribe: Unsubscribe;
let currentPlayers: PlayerQuestStage[] = [];

export async function initPlayerStore() {
    const docRef = collection(putschFirestore, 'playerQuests');

    questsUnsubscribe = onSnapshot(docRef, (data) => {
        const newPlayerData: PlayerQuestStage[] = [];
        data.forEach((doc) => {
            const item = doc.data() as PlayerQuestStage;
            newPlayerData.push(item);
            const currentPlayer = currentPlayers.find(p => p.playerId === item.playerId);
            if (currentPlayer) {
                item.questsComplete = currentPlayer.questsComplete;
                item.feedbackCount = currentPlayer.feedbackCount;
            }
        });
        addDummyPlayers(newPlayerData);
        currentPlayers = newPlayerData.sort(comparePlayers);
        players.set(currentPlayers);
    });

    const playerRef = collection(putschFirestore, 'players');
    playersUnsubscribe = onSnapshot((playerRef), (data) => {
        const newPlayerData: PlayerQuestStage[] = [];
        data.forEach((doc) => {
            const item = doc.data() as Player;
            const currentPlayer = currentPlayers.find(p => p.playerId === item.id);
            if (currentPlayer) {
                currentPlayer.questsComplete = item.questsComplete;
                currentPlayer.feedbackCount = item.feedbackCount;
                newPlayerData.push(currentPlayer);
            }
            else {
                newPlayerData.push({
                    playerId: item.id,
                    currentLocation: item.currentLocation,
                    questsComplete: item.questsComplete,
                    backupTextId: '',
                    questId: item.questActive,
                    backupTimeSeconds: 0,
                    feedbackCount: item.feedbackCount,
                    name: '',
                    playlistName: '',
                    stageCount: 0,
                    stageIndex: 0,
                    text: '',
                    triggerIds: [],
                    triggerType: '',
                });
            }
        });
        for(const currentPlayer of currentPlayers) {
            const newPlayer = newPlayerData.find(p => p.playerId === currentPlayer.playerId);
            if(!newPlayer) {
                newPlayerData.push(currentPlayer);
            }
        }
        addDummyPlayers(newPlayerData);

        currentPlayers = newPlayerData.sort(comparePlayers);
        players.set(currentPlayers);
    });
}

function addDummyPlayers(newPlayerData: PlayerQuestStage[]) {
    for(let playerCount = 1; playerCount <= 30; playerCount++) {
        const playerId = `P${playerCount.toString(10)}`;
        const existingPlayer = newPlayerData.find(p => p.playerId === playerId);
        if(!existingPlayer) {
            newPlayerData.push(createDummyPlayer(playerId));
        }
    }
    for(let radioCount = 1; radioCount <= 20; radioCount++) {
        const playerId = `R${radioCount.toString(10)}`;
        const existingPlayer = newPlayerData.find(p => p.playerId === playerId);
        if(!existingPlayer) {
            newPlayerData.push(createDummyPlayer(playerId));
        }
    }
}

function createDummyPlayer(playerId: string) {
    return {
        playerId: playerId,
        currentLocation: '',
        questsComplete: [],
        backupTextId: '',
        questId: '',
        backupTimeSeconds: 0,
        feedbackCount: 0,
        name: '',
        playlistName: '',
        stageCount: 0,
        stageIndex: 0,
        text: '',
        triggerIds: [],
        triggerType: '',
    };
}

export function cleanupPlayerStore() {
    if (questsUnsubscribe) {
        questsUnsubscribe();
    }
    if(playersUnsubscribe) {
        playersUnsubscribe();
    }
}

function comparePlayers(p1: PlayerQuestStage, p2: PlayerQuestStage): number {
    if (!p1.playerId && !p2.playerId) {
        return 0;
    }
    if (!p1.playerId) {
        return -1;
    }
    if (!p2.playerId) {
        return 1;
    }
    if (p1.playerId.match(/P\d+/) && p2.playerId.match(/P\d+/)) {
        const id1 = Number.parseInt(p1.playerId.substring(1));
        const id2 = Number.parseInt(p2.playerId.substring(1));

        return id1 - id2;
    }

    if (p1.playerId.match(/P\d+/)) {
        return -1;
    }

    if (p2.playerId.match(/P\d+/)) {
        return 1;
    }

    if (p1.playerId.match(/R\d+/) && p2.playerId.match(/R\d+/)) {
        const id1 = Number.parseInt(p1.playerId.substring(1));
        const id2 = Number.parseInt(p2.playerId.substring(1));

        return id1 - id2;
    }

    return p1.playerId.localeCompare(p2.playerId);
}

export const players: Writable<PlayerQuestStage[]> = writable([]);