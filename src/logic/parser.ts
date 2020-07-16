import * as C from "../common/common";

export function ParseUnit(token: string): C.Unit {
  const processed = token.toLowerCase();
  const doesIncludeArray = (input: string, terms: string[]): boolean => {
    for (let i = 0; i < terms.length; i++) {
      if (input.includes(terms[i])) return true;
    }
    return false;
  };

  // Volume
  if (doesIncludeArray(processed, C.UnitStrings.cup)) return C.Unit.Cup;
  if (doesIncludeArray(processed, C.UnitStrings.tablespoon)) return C.Unit.Tablespoon;
  if (doesIncludeArray(processed, C.UnitStrings.teaspoon)) return C.Unit.Teaspoon;
  if (doesIncludeArray(processed, C.UnitStrings.fluidounce)) return C.Unit.FluidOunce;

  // Mass
  if (doesIncludeArray(processed, C.UnitStrings.ounce)) return C.Unit.Ounce;
  if (doesIncludeArray(processed, C.UnitStrings.pound)) return C.Unit.Pound;
  if (doesIncludeArray(processed, C.UnitStrings.kilogram)) return C.Unit.Kilogram;
  if (doesIncludeArray(processed, C.UnitStrings.milligram)) return C.Unit.Milligram;

  return C.Unit.None;
}

function isQuantity(token: string): boolean {
  const chars = token.split("");
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] in C.FracMap) {
      continue;
    }
    if (isNaN(Number(chars[i])) && chars[i] !== "/" && chars[i] !== ".")
      return false;
  }
  return true;
}

function parseQuantity(token: string): number {
  const chars = token.split("");
  let shouldEval = false;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] in C.FracMap) {
      chars[i] = C.FracMap[chars[i]];
      shouldEval = true;
    }
  }
  if (shouldEval) {
    const joined = chars.join("+");
    return Number(eval(joined));
  }
  if (token.includes("/")) {
    const frac = token.split("/");
    return Number(frac[0]) / Number(frac[1]);
  }
  return Number(token);
}

export function ParseLine(line: string): C.IngredientData {
  const ingredient = {
    name: "",
    quantity: 0,
    unit: C.Unit.None
  };

  const tokens = line.trim().split(" ");
  for (let i = 0; i < tokens.length; i++) {
    // Quantity
    if (isQuantity(tokens[i])) {
      ingredient.quantity = parseQuantity(tokens[i]);
      continue;
    }
    
    // Unit
    const parsedUnit = ParseUnit(tokens[i]);
    if (parsedUnit != C.Unit.None) {
      ingredient.unit = parsedUnit;
      continue;
    }

    // Name
    ingredient.name += tokens[i] + " ";
  }

  ingredient.name = ingredient.name.trim();
  if (ingredient.name.includes(",")) {
    ingredient.name = ingredient.name.substring(
      0,
      ingredient.name.indexOf(",")
    );
  }

  return ingredient;
}