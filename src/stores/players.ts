import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { writable, type Writable } from 'svelte/store';
import { putschFirestore } from '../tools/firebase';
import type { PlayerQuestStage } from '../types/PlayerQuestStage';

let firestoreUnsubscribe: Unsubscribe;

export async function initPlayerStore() {
    const docRef = collection(putschFirestore, 'playerQuests');

    firestoreUnsubscribe = onSnapshot(docRef, (data) => {
        if (data.empty) {
            players.set([]);
        } else {
            const newPlayerData: PlayerQuestStage[] = [];
            data.forEach((doc) => {
                const item = doc.data() as PlayerQuestStage;
                newPlayerData.push(item);
            });
            players.set(newPlayerData.sort(comparePlayers));
        }
    });
}

export function cleanupPlayerStore() {
    if(firestoreUnsubscribe) {
        firestoreUnsubscribe();
    }
}

function comparePlayers(p1: PlayerQuestStage, p2: PlayerQuestStage) : number {
    if(!p1.playerId && !p2.playerId) {
        return 0;
    }
    if(!p1.playerId) {
        return -1;
    }
    if(!p2.playerId) {
        return 1;
    }
    if(p1.playerId.match(/P\d+/) && p2.playerId.match(/P\d+/)) {
        const id1 = Number.parseInt(p1.playerId.substring(1));
        const id2 = Number.parseInt(p2.playerId.substring(1));

        return id1 - id2;
    } 

    if(p1.playerId.match(/P\d+/)) {
        return -1;
    }

    if(p2.playerId.match(/P\d+/)) {
        return 1;
    }

    return p1.playerId.localeCompare(p2.playerId);
}

export const players: Writable<PlayerQuestStage[]> = writable([]);