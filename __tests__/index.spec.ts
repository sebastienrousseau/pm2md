/* eslint-disable import/no-unresolved */
import fs from "fs";
import os from "os";
import path from "path";
import { convertPostmanToMarkdown, init } from "../src/index";

describe("convertPostmanToMarkdown", () => {
  test("converts Twitter_API_v2.postman_collection.json cleanly", () => {
    const raw = fs.readFileSync(
      path.resolve(__dirname, "Twitter_API_v2.postman_collection.json"),
      "utf8"
    );
    const json = JSON.parse(raw);
    const md = convertPostmanToMarkdown(json);

    expect(md).toContain("# Project: Twitter API v2");
    expect(md).toContain("## End-point:");
    expect(md).toContain("Powered by: [pm2md](https://pm2md.com)");
  });

  test("supports omitting the footer", () => {
    const md = convertPostmanToMarkdown(
      { info: { name: "No Footer" }, item: [] },
      { footer: false }
    );
    expect(md).toBe("# Project: No Footer\n");
  });
});

describe("CLI init()", () => {
  let tmpDir: string;
  let originalExitCode: typeof process.exitCode;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pm2md-cli-test-"));
    originalExitCode = process.exitCode;
    process.exitCode = undefined;
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    fs.rmSync(tmpDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  test("sets exitCode = 1 when no file argument is provided", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    init([]);
    expect(process.exitCode).toBe(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  test("sets exitCode = 1 for invalid JSON file", () => {
    const badFile = path.join(tmpDir, "bad.json");
    fs.writeFileSync(badFile, "{not-json", "utf8");
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});

    init([badFile, "--quiet"]);
    expect(process.exitCode).toBe(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  test("writes output to --output path when provided", () => {
    const inputFile = path.join(tmpDir, "api.json");
    const outputFile = path.join(tmpDir, "out", "custom.md");
    fs.writeFileSync(
      inputFile,
      JSON.stringify({ info: { name: "Demo" }, item: [] }),
      "utf8"
    );

    init([inputFile, "--output", outputFile, "--quiet"]);
    expect(process.exitCode).toBeUndefined();
    expect(fs.existsSync(outputFile)).toBe(true);
    expect(fs.readFileSync(outputFile, "utf8")).toContain("# Project: Demo");
  });

  test("prints markdown to stdout when --stdout is passed", () => {
    const inputFile = path.join(tmpDir, "api.json");
    fs.writeFileSync(
      inputFile,
      JSON.stringify({ info: { name: "Stdout Demo" }, item: [] }),
      "utf8"
    );
    const stdoutSpy = jest
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    init([inputFile, "--stdout", "--no-footer"]);
    expect(process.exitCode).toBeUndefined();
    expect(stdoutSpy).toHaveBeenCalledWith("# Project: Stdout Demo\n");
  });
});
