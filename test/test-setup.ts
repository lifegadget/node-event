interface ITestConsole {
  /* Redirects writes to stdout into an array instead of writing them to console */
  inspect(): ITestConsoleInspector;
  /* Just like inspect(), but automatically restores the console when done */
  inspectSync(f: (result: string[]) => void): void;
  /* Prevent writes to stdout from appearing on the console. */
  ignore(f: () => void): void;
  /* Just like ignore(), but automatically restores the console when done. */
  ignoreSync(f: () => void): void;
}

interface ITestConsoleInspector {
  /* returned as an array containing one string for each call to stdout.write() */
  output: string[];
  /* Restores output to stdout */
  restore(): void;
}

declare module 'test-console' {
  export let stdout: ITestConsole;
  export let stderr: ITestConsole;
}
