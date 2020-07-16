export interface IngredientData {
  name: string;
  quantity: number;
  unit: Unit;
  price?: Amount;
}

/* eslint-disable no-unused-vars */

export enum Unit {
  // Volume
  Cup = "Cup",
  Teaspoon = "Teaspoon",
  Tablespoon = "Tablespoon",
  FluidOunce = "FluidOunce",

  // Mass
  Ounce = "Ounce",
  Gram = "Gram",
  Milligram = "Milligram",
  Kilogram = "Kilogram",  
  Pound = "Pound",

  // Special
  None = "None",
}

export const VolumeUnits = [
  Unit.Cup,
  Unit.Teaspoon,
  Unit.Tablespoon,
  Unit.FluidOunce,
];
export const MassUnits = [Unit.Ounce];

// Parsing tokens
export const UnitStrings = {
  // Volume
  cup: ["cup", "cups"],
  tablespoon: ["tablespoon", "tbsp"],
  teaspoon: ["teaspoon", "tsp"],
  fluidounce: ["fl oz", "fluid ounce", "fluid ounces"],

  // Mass
  ounce: ["ounce", "ounces", "oz"],
  gram: ["gram", "g"],
  milligram: ["milligram", "milligrams", "mg"],
  kilogram: ["kilogram", "kilograms", "kg"],
  pound: ["pound", "pounds", "lb"],
};

export const ConversionTable: Record<string, Record<string, number>> = {
  // Volume
  Tablespoon: {
    Cup: 0.0625,
  },
  Teaspoon: {
    Cup: 0.02083,
  },
  FluidOunce: {
    Cup: 0.125,
  },
  Cup: {
    Tablespoon: 16,
    Teaspoon: 48,
    FluidOunce: 8,
    Cup: 1,
  },

  // Mass
  Ounce: {
    Gram: 28.3495,
  },
  Pound: {
    Gram: 453.592,
  },
  Milligram: {
    Gram: 0.001,
  },
  Kilogram: {
    Gram: 1000,
  },
  Gram: {
    Ounce: 0.035274,
    Pound: 0.00220462,
    Gram: 1,
  }
};

export interface Amount {
  quantity: number;
  unit: Unit;
}

export function ConvertUnit(amount: Amount, newUnit: Unit): Amount {
  // Converting from volume -> volume or mass -> mass
  if ((VolumeUnits.includes(amount.unit) && VolumeUnits.includes(newUnit)) || (MassUnits.includes(amount.unit) && MassUnits.includes(newUnit))) {
    const unitStr: string = Unit[amount.unit];
    const finalUnitStr: string = Unit[newUnit];
    const cups = amount.quantity / ConversionTable[unitStr][Unit.Cup];
    amount.quantity = cups / ConversionTable[Unit.Cup][finalUnitStr];
    amount.unit = newUnit
  }

  return amount;
}

export const FracMap: Record<string, string> = {
  "½": "1/2",
  "⅓": "1/3",
  "⅔": "2/3",
  "¼": "1/4",
  "¾": "3/4",
  "⅕": "1/5",
  "⅙": "1/6",
  "⅛": "1/8",
  "⅒": "1/10",
};

export const OuncesToCups: Record<string, number> = {
  milk: 0.11574,
  butter: 0.125,
}

// milk
