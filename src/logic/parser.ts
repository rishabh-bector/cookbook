import {
  IngredientData,
  Unit,
  UnitStrings,
  FracMap
} from "../common/common";

export function ParseUnit(token: string): Unit {
  const processed = token.toLowerCase();
  const doesIncludeArray = (input: string, terms: string[]): boolean => {
    for (let i = 0; i < terms.length; i++) {
      if (input.includes(terms[i])) return true;
    }
    return false;
  };

  // Volume
  if (doesIncludeArray(processed, UnitStrings.cup)) return Unit.Cup;
  if (doesIncludeArray(processed, UnitStrings.tablespoon)) return Unit.Tablespoon;
  if (doesIncludeArray(processed, UnitStrings.teaspoon)) return Unit.Teaspoon;
  if (doesIncludeArray(processed, UnitStrings.fluidounce)) return Unit.FluidOunce;

  // Mass
  if (doesIncludeArray(processed, UnitStrings.ounce)) return Unit.Ounce;
  if (doesIncludeArray(processed, UnitStrings.pound)) return Unit.Pound;
  if (doesIncludeArray(processed, UnitStrings.kilogram)) return Unit.Kilogram;
  if (doesIncludeArray(processed, UnitStrings.milligram)) return Unit.Milligram;

  return Unit.None;
}

function isQuantity(token: string): boolean {
  const chars = token.split("");
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] in FracMap) {
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
    if (chars[i] in FracMap) {
      chars[i] = FracMap[chars[i]];
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

export function ParseLine(line: string): IngredientData {
  const ingredient = {
    name: "",
    quantity: 0,
    unit: Unit.None
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
    if (parsedUnit != Unit.None) {
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