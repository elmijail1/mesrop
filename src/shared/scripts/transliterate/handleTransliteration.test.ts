import { describe, expect, it } from "vitest";
import { handleTransliteration } from "./handleTransliteration.ts";
import { transliterate } from "./transliterate.ts";
import { transliterateFromArm } from "./transliterateFromArm.ts";

function expectArmLat(input: string) {
  expect(handleTransliteration(input)).toEqual({
    ok: true,
    direction: "arm-lat",
    text: transliterateFromArm(input),
  });
}

function expectLatArm(input: string) {
  expect(handleTransliteration(input)).toEqual({
    ok: true,
    direction: "lat-arm",
    text: transliterate(input),
  });
}

describe("handleTransliteration", () => {
  it("transliterates Armenian-only input Arm-Lat", () => {
    expectArmLat("Բարև ձեզ");
  });

  it("transliterates Latin-only input Lat-Arm", () => {
    expectLatArm("Barev dzez");
  });

  it.each(["...բարև", "123 բարև", "абв բարև", "აბგ բարև", "«՝Երևան»", "կոma"])(
    "picks Arm-Lat based on the first valid letter in %j",
    (input) => {
      expectArmLat(input);
    },
  );

  it.each(["...barev", "123 barev", "абв barev", "აბგ barev", "aկոma"])(
    "picks Lat-Arm based on the first valid letter in %j",
    (input) => {
      expectLatArm(input);
    },
  );

  it.each(["", "...!? 123", "абв где", "։՝"])(
    "returns a non-ok result for %j",
    (input) => {
      expect(handleTransliteration(input)).toEqual({
        ok: false,
        reason: "no-supported-script",
      });
    },
  );
});
