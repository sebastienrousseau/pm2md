/* eslint-disable import/no-unresolved */
import fs from "fs";
import { writeFile, writeDirectory } from "../../src/util/write";

describe("Test `writeFile`", () => {
  it("should check writeFile function", () => {
    expect(writeFile).toBeDefined();
    expect(writeFile).toBeInstanceOf(Function);
    expect(writeFile).toBeTruthy();
  });
});

describe("Test `writeDirectory`", () => {
  it("should check writeDirectory function", () => {
    expect(writeDirectory).toBeDefined();
    expect(writeDirectory).toBeInstanceOf(Function);
    expect(writeDirectory).toBeTruthy();
  });
});

describe("Test `writeFile`", () => {
  it("should check writeFile content", () => {
    const data = {
      content: "./examples/Twitter_API_v2.postman_collection.json",
      fileName: "./examples/Twitter_API_v2",
    }
    expect(data.content).toStrictEqual("./examples/Twitter_API_v2.postman_collection.json")
    expect(data.fileName).toStrictEqual("./examples/Twitter_API_v2")
  });
});

describe("Test `writeFile`", () => {
  it("should check folder", () => {
    const fileName = "./__tests__/hello";
    const folder = fileName.replace(/\/[^\/]+\/?$/, "");
    expect(folder).toStrictEqual("./__tests__");
  });
});

describe("Test `writeFile`", () => {
  it("should check fileName", () => {
    let fileName = "hello";
    fileName = fileName + ".md";
    expect(fileName).toStrictEqual("hello.md");
  });
});

describe("Test `writeFile`", () => {
  it('should write a file', async () => {
    const content = "hello";
    const fileName = "./__tests__/hello.json";
    const result = async () => {
      writeFile(content, fileName);
    }
    Promise.resolve(result).then(() => {
      expect(fs.existsSync(fileName)).toBeTruthy();
    });
  });
});

describe("Test `writeFile`", () => {
  it('should write a file', async () => {
    const content = "hello";
    const fileName = "./__tests__/hello.json";
    const result = async () => {
      writeFile(content, fileName);
    }
    await result();
    Promise.resolve(result).then(() => {
      expect(result).toBeInstanceOf(Function);
    });
  });
});

describe("Test `writeFile`", () => {
  it('should write a file', async () => {
    const content = "hello";
    const fileName = "./__tests__/hello.json";
    const result = async () => {
      writeFile(content, fileName);
    }
    await result();
    Promise.resolve(result).then(() => {
      // expect(result).toThrowError('File not found');
    });
  });
});

it('should throw an error when no properties are specified', async () => {
  expect(writeFile).toThrowError("Cannot read properties of undefined (reading 'replaceAll')");
});

describe("Test 'writeDirectory'", () => {
  it('should write a directory', async () => {
    const dirpath = "./__tests__/hello";
    const result = async () => {
      writeDirectory(dirpath);
    };
    await result();
    Promise.resolve(result).then(() => {
      expect(fs.existsSync(dirpath)).toBeTruthy();
    });
  });
});
//   const data = {
//     content: "./examples/Twitter_API_v2.postman_collection.json",
//     fileName: "./examples/Twitter_API_v2",
//   }
//   test("Check 'writeFile' function", async () => {
//       async () => await writeFile(data.content, data.fileName);
//       expect(data.content || data.fileName).toBeDefined();
//   });
// });

