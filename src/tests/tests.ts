import { IngredientData, Unit } from "../common/common";

export interface TestStatus {
  name: string;
  status: string;
}

export interface TestCase {
  name: string;
  link: string;
  input: string;
  output: IngredientData[];
}

export const TestCases: TestCase[] = [
  {
    name: "Home Fries",
    link: "",
    input: `3 large russet potatoes, peeled, quartered
            2 tablespoons olive oil
            1 tablespoon butter
            1/4 teaspoon paprika`,
    output: [
      {
        name: "large russet potatoes",
        quantity: 3,
        unit: Unit.None,
      },
      {
        name: "olive oil",
        quantity: 2,
        unit: Unit.Tablespoon,
      },
      {
        name: "butter",
        quantity: 1,
        unit: Unit.Tablespoon,
      },
      {
        name: "paprika",
        quantity: 0.25,
        unit: Unit.Teaspoon,
      },
    ],
  },
  {
    name: "2 Minute Cookie",
    link: "",
    input: `2 tablespoons unsalted butter
            ¼ cup light brown sugar
            ½ teaspoon vanilla extract
            2 tablespoons beaten egg
            6 tablespoons all-purpose flour
            ⅛ teaspoon kosher salt 
            5½ tablespoons semi-sweet chocolate chips`,
    output: [
      {
        name: "unsalted butter",
        quantity: 2,
        unit: Unit.Tablespoon,
      },
      {
        name: "light brown sugar",
        quantity: 1/4,
        unit: Unit.Cup,
      },
      {
        name: "vanilla extract",
        quantity: 1/2,
        unit: Unit.Teaspoon,
      },
      {
        name: "beaten egg",
        quantity: 2,
        unit: Unit.Tablespoon,
      },
      {
        name: "all-purpose flour",
        quantity: 6,
        unit: Unit.Tablespoon,
      },
      {
        name: "kosher salt",
        quantity: 0.125,
        unit: Unit.Teaspoon,
      },
      {
        name: "semi-sweet chocolate chips",
        quantity: 5.5,
        unit: Unit.Tablespoon,
      },
    ],
  },
];
