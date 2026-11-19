/* eslint-disable import/no-unresolved */
import fs from "fs";
import os from "os";
import path from "path";
import { init, resolveOutputPath, writeFile } from "../src/index";

describe("pm2md CLI & file writer", () => {
  let tmpDir: string;
  let originalExitCode: typeof process.exitCode;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pm2md-pkg-test-"));
    originalExitCode = process.exitCode;
    process.exitCode = undefined;
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    fs.rmSync(tmpDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  test("resolveOutputPath keeps directory and sets .md extension", () => {
    expect(resolveOutputPath("examples/api.json")).toBe(
      path.join("examples", "api.md")
    );
  });

  test("writeFile creates parent directories and writes UTF-8 markdown", () => {
    const out = writeFile("# Demo\n", path.join(tmpDir, "sub", "demo.json"));
    expect(out).toBe(path.join(tmpDir, "sub", "demo.md"));
    expect(fs.readFileSync(out, "utf8")).toBe("# Demo\n");
  });

  test("CLI supports --toc, --no-redact, --no-footer, and --stdout", () => {
    const input = path.join(tmpDir, "api.json");
    fs.writeFileSync(
      input,
      JSON.stringify({
        info: { name: "CLI Test" },
        item: [
          {
            name: "Ping",
            request: {
              method: "GET",
              header: [{ key: "Authorization", value: "Bearer secret" }],
            },
          },
        ],
      }),
      "utf8"
    );

    let captured = "";
    jest.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      captured += String(chunk);
      return true;
    });

    init([input, "--stdout", "--toc", "--no-footer"]);
    expect(process.exitCode).toBeUndefined();
    expect(captured).toContain("## Table of Contents");
    expect(captured).toContain("|Authorization|[REDACTED]|");
    expect(captured).not.toContain("Powered by:");
  });

  test("CLI sets exitCode = 1 on missing file", () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    init([path.join(tmpDir, "missing.json")]);
    expect(process.exitCode).toBe(1);
    expect(errSpy).toHaveBeenCalled();
  });
});
