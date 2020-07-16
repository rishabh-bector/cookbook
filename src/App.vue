<template>
  <div id="app" v-bind:style="topStyle">
    <md-button
      v-if="stage == 0 && theme == 'default'"
      v-on:click="setDarkMode"
      class="md-flat"
      style="position: absolute; bottom: 4%; right: 0%; font-size: 10px; text-align: right; line-height: initial;"
      v-bind:md-theme="theme"
    >Dark Theme</md-button>
    <md-button
      v-if="stage == 0 && theme == 'testing'"
      v-on:click="setLightMode"
      class="md-flat"
      style="position: absolute; bottom: 4%; right: 0%; font-size: 10px; text-align: right; line-height: initial;"
      v-bind:md-theme="theme"
    >Light Theme</md-button>
    <md-button
      v-if="stage == 0"
      v-on:click="runTests"
      class="md-flat"
      style="position: absolute; bottom: 1%; right: 0%; font-size: 10px; text-align: right; line-height: initial;"
      v-bind:md-theme="theme"
    >Run Tests</md-button>
    <md-button
      v-if="stage == -1"
      v-on:click="backToMain"
      class="md-flat"
      style="position: absolute; bottom: 1%; right: 0%; font-size: 10px; text-align: right; line-height: initial;"
      v-bind:md-theme="theme"
    >Back</md-button>
    <div :style="appStyle">
      <md-card v-if="stage == 0" class="centered" v-bind:md-theme="theme">
        <md-card-content style="height: 100%;">
          <md-field>
            <md-textarea placeholder="Enter ingredients here." v-model="autogrow" md-autogrow></md-textarea>
          </md-field>
        </md-card-content>
        <div class="md-layout" style="height: 100%;">
          <div class="md-layout-item"></div>
          <div class="md-layout-item">
            <md-button
              v-on:click="nextStage"
              class="md-raised centerbutton"
              style="font-size: 15px;"
            >Go</md-button>
          </div>
          <div class="md-layout-item"></div>
        </div>
      </md-card>
      <div v-if="stage == 1" style="height: 100%;">
        <span
          class="md-subheading"
          style="position: absolute; left: 50%; top: 50%; margin-right: -50%; transform: translate(-50%, -50%);"
        >Organizing the cookbook...</span>
        <pacman-loader
          class="centered"
          style="position: absolute; left: 47.5%; top: 40%; margin-right: -50%; transform: translate(-50%, -50%);"
        />
      </div>
      <div v-if="stage == 2" style="height: 100%;">
        <span
          class="md-title"
          style="position: absolute; left: 50%; top: 10%; margin-right: -50%; transform: translate(-50%, -50%);"
        >Ok, does this look right?</span>
        <md-card class="centered-without-height" v-bind:md-theme="theme">
          <md-card-content style="height: 100%;">
            <md-table v-model="parsed">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Quantity" md-sort-by="quantity">
                  {{
                  item.quantity
                  }}
                </md-table-cell>
                <md-table-cell md-label="Unit" md-sort-by="unit">
                  {{
                  item.unit
                  }}
                </md-table-cell>
                <md-table-cell md-label="Ingredient" md-sort-by="ingredient">
                  {{
                  item.name
                  }}
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
          <div class="md-layout" style="height: 100%;">
            <div class="md-layout-item"></div>
            <div class="md-layout-item">
              <md-button v-on:click="nextStage" class="md-raised md-primary centerbutton-top">Yes</md-button>
            </div>
            <div class="md-layout-item"></div>
          </div>
        </md-card>
      </div>
      <div v-if="stage == 3" style="height: 100%;">
        <span
          class="md-subheading"
          style="position: absolute; left: 50%; top: 50%; margin-right: -50%; transform: translate(-50%, -50%);"
        >Crunching the numbers...</span>
        <pacman-loader
          class="centered"
          style="position: absolute; left: 47.5%; top: 40%; margin-right: -50%; transform: translate(-50%, -50%);"
        />
      </div>
      <div v-if="stage == 4" style="height: 100%;">
        <span
          class="md-title"
          style="position: absolute; left: 50%; top: 10%; margin-right: -50%; transform: translate(-50%, -50%);"
        >Here's what I've got:</span>
        <md-card class="centered-without-height" v-bind:md-theme="theme">
          <md-card-content style="height: 100%;">
            <md-table v-model="parsed">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Quantity" md-sort-by="quantity">
                  {{
                  item.quantity
                  }}
                </md-table-cell>
                <md-table-cell md-label="Unit" md-sort-by="unit">
                  {{
                  item.unit
                  }}
                </md-table-cell>
                <md-table-cell md-label="Ingredient" md-sort-by="ingredient">
                  {{
                  item.name
                  }}
                </md-table-cell>
                <md-table-cell v-bind:md-label="makeLabel(item)" md-sort-by="cost">
                  <a v-bind:href="makeLink(item)" target="_blank">${{
                    (displayPriceOf(item).quantity).toFixed(2)
                  }}</a>
                </md-table-cell>
                <md-table-cell md-label="Total Cost" md-sort-by="ingredient">
                  ${{
                    (displayPriceOf(item).quantity * item.quantity).toFixed(2)
                  }}
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
          <div class="md-layout" style="height: 100%;">
            <div class="md-layout-item"></div>
            <div class="md-layout-item">
              <md-button v-on:click="nextStage" class="md-raised md-primary centerbutton-top">Yes</md-button>
            </div>
            <div class="md-layout-item"></div>
          </div>
        </md-card>
      </div>
      <div v-if="stage == -1" style="height: 100%;">
        <md-card class="centered" v-bind:md-theme="theme">
          <md-card-content style="height: 100%;">
            <md-table v-model="testStatus">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell
                  href="https://weather.com"
                  md-label="Test"
                  md-sort-by="quantity"
                  v-bind:style="testColor(item.name)"
                >
                  {{
                  item.name
                  }}
                </md-table-cell>
                <md-table-cell
                  md-label="Status"
                  md-sort-by="unit"
                  v-bind:style="testColor(item.name)"
                >
                  {{
                  item.status
                  }}
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import * as C from "./common/common";
import * as T from "./tests/tests";
import { ParseLine, ParseUnit } from './logic/parser';
import * as RM from 'typed-rest-client/RestClient';

interface PriceResponse {
  average: number;
  unit: string;
}

@Component({
  components: {}
})
export default class App extends Vue {
  private autogrow = "2 teaspoon vanilla extract";
  private parsed: C.IngredientData[] = [];
  private stage = 0;
  private theme = "default";
  private statuses: T.TestStatus[] = [];

  async calculateIngPrice(ing: C.IngredientData): Promise<C.Amount> {
    const rest: RM.RestClient = new RM.RestClient('rest', 'http://35.206.77.217:5000');
    const search: string = (ing.unit !== C.Unit.None) ? `/ing?ing=${ing.name}&unit=*` : `/ing?ing=${ing.name}&unit=none`
    const res: RM.IRestResponse<PriceResponse> = await rest.get<PriceResponse>(search)
    let resMarshal: PriceResponse = { average: 0, unit: ''}
    if (res.result) resMarshal = res.result;
    console.log('Got resp: ' + JSON.stringify(resMarshal));
    const parsedUnit = ParseUnit(resMarshal.unit);

    // The server returns a price, along with its unit. Out of the search results, the server
    // chooses the most common unit to include in this average price. Now, we must determine
    // how to transform this unit into the unit given by the user.
    //
    // There are 3 possible cases:
    //    1. The unit returned by the server is the same as the user's unit. No need to do any conversions.
    //    2. The unit returned by the server is in the same class (volume or mass) as the user's unit, so can be easily converted via table.
    //    3. The unit returned by the server is in a different class as the user's unit. This leads to 2 risky options and a shitty fallback:
    //        a. Try to google to determine the ingredient-specific volume <-> mass conversion for this unit
    //        b. Try to use a handmade cache of common ingredient-specific conversions
    //
    //        c. As a fallback, ask the user to input their original amount in this new unit.

    // No need for conversion
    if (parsedUnit === ing.unit || ing.unit === C.Unit.None) {
      return {
        quantity: resMarshal.average,
        unit: parsedUnit,
      };
    }

    const price: C.Amount = {quantity: resMarshal.average, unit: parsedUnit};
    console.log('Got price: ' + JSON.stringify(price));

    // Volume -> volume conversion
    if (C.VolumeUnits.includes(parsedUnit) && C.VolumeUnits.includes(ing.unit)) {
      return C.ConvertUnit(price, ing.unit);
    }

    // Mass -> mass conversion
    if (C.MassUnits.includes(parsedUnit) && C.MassUnits.includes(ing.unit)) {
      return C.ConvertUnit(price, ing.unit);
    }

    // Try cache lookup
    let conversionFactor = null;
    Object.keys(C.OuncesToCups).forEach((ingName) => {
      if (ing.name.includes(ingName)) conversionFactor = C.OuncesToCups[ingName];
    })
    if (conversionFactor) {
      price.quantity = price.quantity * conversionFactor;
      return C.ConvertUnit(price, ing.unit);
    }

    return {
      quantity: -1,
      unit: C.Unit.None,
    };
  }

  private makeLabel(item: C.IngredientData): string {
    return `Cost / ${this.displayPriceOf(item).unit}`;
  }

  private makeLink(item: C.IngredientData): string {
    return `https://www.heb.com/search/?q=${item.name}`;
  }

  async nextStage() {
    if (this.stage === 0) {
      this.runParser();
    }
    this.stage++;
    if (this.stage === 3) {
      this.parsed.forEach(async (ing) => {
        ing.price = await this.calculateIngPrice(ing).then((p) => {
          console.log(`Price is ${p.quantity} per ${ing.unit}`)
          this.$nextTick().then(() => {
            this.$forceUpdate();
            this.stage = 4;
          })
          return p;
        });
      })
    }
  }

  private runParser() {
    this.parsed = [];
    this.autogrow.split("\n").forEach(line => this.parsed.push(ParseLine(line)));
  }

  private runTests() {
    this.stage = -1;
    this.statuses = [];
    T.TestCases.forEach(tc => {
      this.statuses.push({
        name: tc.name,
        status: "NOT STARTED"
      });
    });
    T.TestCases.forEach(tc => {
      const statusDataMaybe = this.statuses.find(s => s.name == tc.name);
      let statusData = this.statuses[0];
      if (statusDataMaybe) statusData = statusDataMaybe;
      statusData.status = "RUNNING";
      this.autogrow = tc.input;
      this.runParser();
      let correct = true;
      let failed = "";
      let reasonComplete = false;
      this.parsed.forEach((ing, index) => {
        if (ing.name !== tc.output[index].name) {
          correct = false;
          failed = `Expected: ${tc.output[index].name}\nGot: ${ing.name}`;
        }
        if (ing.quantity !== tc.output[index].quantity) {
          correct = false;
          failed = `Expected: ${tc.output[index].quantity}\nGot: ${ing.quantity}`;
        }
        if (ing.unit !== tc.output[index].unit) {
          correct = false;
          failed = `Expected: ${tc.output[index].unit}\nGot: ${ing.unit}`;
        }
        if (!correct && !reasonComplete) {
          failed += `\nFailed at: ${JSON.stringify(ing, null, 4)}`;
          reasonComplete = true;
        }
      });
      if (correct) statusData.status = "PASS";
      else {
        statusData.status = "FAIL";
        console.log("TEST FAILED: \n" + failed);
      }
    });
  }

  private displayPriceOf(ing: C.IngredientData): C.Amount {
    if (ing.price) return ing.price;
    return {
      quantity: 0,
      unit: ing.unit,
    }
  }

  private backToMain() {
    this.autogrow = "";
    this.parsed = [];
    this.stage = 0;
  }

  private testColor(name: string) {
    const statusData = this.statuses.find(s => s.name == name);
    if (statusData)
      if (statusData.status == "PASS") return "color: darkseagreen;";
    if (statusData) if (statusData.status == "FAIL") return "color: orangered;";
  }

  private setDarkMode() {
    this.theme = "testing";
  }

  private setLightMode() {
    this.theme = "default";
  }

  get testStatus(): T.TestStatus[] {
    return this.statuses;
  }

  get topStyle(): string {
    if (this.theme === "default") return "";
    return "background-color: #424242;";
  }

  get appStyle(): string {
    return `height: ${window.innerHeight}px`;
  }

  @Watch("stage")
  stageChanged(newStage: number) {
    if (newStage === 1) {
      setTimeout(() => {
        this.stage++;
      }, 0);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.centered {
  margin: auto;
  width: 50%;
  height: 40%;
  top: 20%;
}

.centered-without-height {
  margin: auto;
  width: 50%;
  top: 20%;
}

.centerbutton {
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  top: 50%;
}

.centerbutton-top {
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  top: 200%;
}
</style>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    primary: md-get-palette-color(blue, A200),
    // The primary color of your application
      accent: md-get-palette-color(red, A200),
    // The accent or secondary color
      theme: light,
    // This can be dark or light
  )
);

@include md-register-theme(
  "testing",
  (
    primary: md-get-palette-color(blue, A200),
    // The primary color of your application
      accent: md-get-palette-color(red, A200),
    // The accent or secondary color
      theme: dark,
    // This can be dark or light
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme
</style>