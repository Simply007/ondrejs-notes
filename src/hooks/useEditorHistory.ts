import { useRef, useState, useCallback } from 'react';

interface HistoryState {
    content: string;
}

class EditorHistory {
    private history: HistoryState[] = [];
    private currentIndex: number = -1;
    private maxHistory: number = 100;

    push(state: HistoryState): void {
        // Remove any forward history when pushing new state
        this.history = this.history.slice(0, this.currentIndex + 1);

        this.history.push(state);

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
    }

    canUndo(): boolean {
        return this.currentIndex > 0;
    }

    canRedo(): boolean {
        return this.currentIndex < this.history.length - 1;
    }

    undo(): HistoryState | null {
        if (this.canUndo()) {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }
        return null;
    }

    redo(): HistoryState | null {
        if (this.canRedo()) {
            this.currentIndex++;
            return this.history[this.currentIndex];
        }
        return null;
    }
}

export const useEditorHistory = (debounceMs: number = 500) => {
    const [history] = useState(() => new EditorHistory());
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const lastContentRef = useRef<string>('');

    const saveToHistory = useCallback((content: string) => {
        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Don't save if content hasn't changed
        if (content === lastContentRef.current) return;

        // Debounce history saves
        timeoutRef.current = setTimeout(() => {
            history.push({ content });
            lastContentRef.current = content;
            setCanUndo(history.canUndo());
            setCanRedo(history.canRedo());
        }, debounceMs);
    }, [history, debounceMs]);

    const undo = useCallback(() => {
        const state = history.undo();
        if (state) {
            lastContentRef.current = state.content;
            setCanUndo(history.canUndo());
            setCanRedo(history.canRedo());
            return state.content;
        }
        return null;
    }, [history]);

    const redo = useCallback(() => {
        const state = history.redo();
        if (state) {
            lastContentRef.current = state.content;
            setCanUndo(history.canUndo());
            setCanRedo(history.canRedo());
            return state.content;
        }
        return null;
    }, [history]);

    return { saveToHistory, undo, redo, canUndo, canRedo };
};
