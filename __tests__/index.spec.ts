import fs from "fs";
import minimist from "minimist";
import { init } from "../src/index";
import { createStructureOfMarkdown } from "../src/util/index";

describe("Index Test initialization", () => {
  test("Check init function", () => {
    expect(init).toBeDefined();
    expect(init).toBeInstanceOf(Function);
  });
});

describe("Index Test initialization", () => {
  test("Check init function", () => {
    const args = minimist(process.argv.slice(2));
    init();
    expect(args).toBeDefined();
    expect(args).toBeInstanceOf(Object);
  });
  test("Check init function", () => {
    const chalk = require("chalk");
    init();
    expect(chalk).toBeDefined();
  });
  test("Check init function", () => {
    const path = "hello.json";
    init();
    expect(path).toBeDefined();
  });
});

it("should pushed arguments to init function", () => {
  process.argv.push("./__tests__/hello.json");
  process.argv.push("hello");
  let args = minimist(process.argv.slice(2));
  const path = args["_"];
  init();
  expect(path).toContain("hello");
  expect(path).toContain("./__tests__/hello.json");
  if (fs.existsSync(path[0])) {
    let rawData = fs.readFileSync(path[0]);
    const json = JSON.parse(rawData.toString());
    console.log(json);
    expect(json).toHaveProperty("hello");
  }
});

it("should check markdown content", () => {

  let markdown = createStructureOfMarkdown(
    {
      info: {
        description: "description",
        name: "name",
      },
      item: ["item"],
    }
  );
  expect(markdown).toContain("Project:");

});

it("compiling android goes as expected", async() => {
  process.argv.push("./__tests__/hello.json");
  process.argv.push("hello");
  init();

  // const data = init();
  // expect(init).toBe();

  // expect(init()).toThrowError();

  // expect(() => init()).toThrow();
  // expect(() => init()).toThrow(Error);

  // You can also use the exact error message or a regexp
  // expect(() => init()).toThrow("you are using the wrong JDK");
  // expect(() => init()).toThrow(/JDK/);
});

it("should return if markdown is defined", () => {
  init(); expect(createStructureOfMarkdown).toBeDefined();
});

//# sourceMappingURL=index.spec.js.map
// Language: typescript
// Path: __tests__/index.spec.ts
