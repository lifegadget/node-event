interface ITestConsole {
    inspect(): ITestConsoleInspector;
    inspectSync(f: (result: string[]) => void): void;
    ignore(f: () => void): void;
    ignoreSync(f: () => void): void;
}
interface ITestConsoleInspector {
    output: string[];
    restore(): void;
}
declare module 'test-console' {
    let stdout: ITestConsole;
    let stderr: ITestConsole;
}
