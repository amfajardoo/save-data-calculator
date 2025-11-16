import { Injectable, signal } from '@angular/core';
import { CharacterState, GlobalRunState } from '../models';

export interface StateSnapshot {
  characters: CharacterState[];
  globalState: GlobalRunState;
  timestamp: number;
  action: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryManager {
  private readonly maxHistorySize = 20;
  private readonly history = signal<StateSnapshot[]>([]);

  readonly canUndo = signal(false);
  readonly lastAction = signal<string>('');

  saveSnapshot(characters: CharacterState[], globalState: GlobalRunState, action: string): void {
    const snapshot: StateSnapshot = {
      characters: structuredClone(characters),
      globalState: structuredClone(globalState),
      timestamp: Date.now(),
      action,
    };

    this.history.update((hist) => {
      const newHistory = [...hist, snapshot];

      if (newHistory.length > this.maxHistorySize) {
        newHistory.shift();
      }

      return newHistory;
    });

    this.canUndo.set(true);
    this.lastAction.set(action);
  }

  undo(): StateSnapshot | null {
    const currentHistory = this.history();

    if (currentHistory.length === 0) {
      this.canUndo.set(false);
      return null;
    }

    const lastSnapshot = currentHistory[currentHistory.length - 1];

    this.history.update((hist) => hist.slice(0, -1));

    const stillHasHistory = this.history().length > 0;
    this.canUndo.set(stillHasHistory);

    if (stillHasHistory) {
      this.lastAction.set(this.history()[this.history().length - 1].action);
    } else {
      this.lastAction.set('');
    }

    return lastSnapshot;
  }

  clear(): void {
    this.history.set([]);
    this.canUndo.set(false);
    this.lastAction.set('');
  }

  getHistorySize(): number {
    return this.history().length;
  }
}
