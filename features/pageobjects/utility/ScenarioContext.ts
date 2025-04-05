export default class ScenarioContext {
    private context: Map<string, unknown>;

    constructor() {
        this.context = new Map<string, unknown>();
    }

    set<T>(key: string, value: T): void {
        this.context.set(key, value);
    }

    get<T>(key: string): T {
        const value = this.context.get(key);
        if (value === undefined) {
            throw new Error(`❗ No value found in ScenarioContext for key: "${key}"`);
        }
        return value as T;
    }

    has(key: string): boolean {
        return this.context.has(key);
    }

    clear(): void {
        this.context.clear();
    }
}
