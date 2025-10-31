export declare class StorageService {
    private static readonly PREFIX;
    static set<T>(key: string, value: T): void;
    static get<T>(key: string): T | null;
    static remove(key: string): void;
    static clear(): void;
    static getAllKeys(): string[];
}
//# sourceMappingURL=StorageService.d.ts.map