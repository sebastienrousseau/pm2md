/* eslint-disable import/no-unresolved */
import fs from "fs";
import os from "os";
import path from "path";
import {
  resolveOutputPath,
  writeDirectory,
  writeFile,
} from "../../src/util/write";

describe("resolveOutputPath", () => {
  test("replaces non-.md extension with .md in the same directory", () => {
    expect(resolveOutputPath("examples/api.postman_collection.json")).toBe(
      path.join("examples", "api.postman_collection.md")
    );
    expect(resolveOutputPath("docs/out.md")).toBe(path.join("docs", "out.md"));
  });
});

describe("writeFile and writeDirectory", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pm2md-write-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test("writes markdown to the resolved target path and creates missing directories", () => {
    const target = path.join(tmpDir, "nested", "collection.json");
    const written = writeFile("# Hello\n", target);

    expect(written).toBe(path.join(tmpDir, "nested", "collection.md"));
    expect(fs.existsSync(written)).toBe(true);
    expect(fs.readFileSync(written, "utf8")).toBe("# Hello\n");
  });

  test("throws a descriptive TypeError when targetPath is empty", () => {
    expect(() => writeFile("content", "")).toThrow(
      "Output file path must be a non-empty string."
    );
  });

  test("writeDirectory creates nested directories", () => {
    const dirpath = path.join(tmpDir, "a", "b");
    writeDirectory(dirpath);
    expect(fs.existsSync(dirpath)).toBe(true);
  });
});
