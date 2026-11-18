/* eslint-disable import/no-unresolved */
import { createStructureOfMarkdown } from "../../src/util/index";

describe("createStructureOfMarkdown", () => {
  test("builds markdown for a valid collection", () => {
    const md = createStructureOfMarkdown({
      info: {
        name: "Sample API",
        description: "Sample description",
      },
      item: [
        {
          name: "Health",
          request: {
            method: "GET",
            url: { raw: "https://api.example.com/health" },
          },
        },
      ],
    });
    expect(md).toContain("# Project: Sample API");
    expect(md).toContain("Sample description");
    expect(md).toContain("## End-point: Health");
  });

  test("throws a clear error when info.name is missing", () => {
    expect(() =>
      createStructureOfMarkdown({} as unknown as Parameters<typeof createStructureOfMarkdown>[0])
    ).toThrow("Invalid Postman collection: missing required 'info.name' field.");
  });
});
