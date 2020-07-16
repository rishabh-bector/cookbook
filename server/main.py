import os
from flask import Flask, request
from flask_cors import CORS
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

app = Flask(__name__)
CORS(app)


def searchHEB(ingredient, driver, unit):
    driver.get("https://www.heb.com/search/?q=" + ingredient)
    soup = BeautifulSoup(driver.page_source, features="html.parser")
    items = soup.find_all(
        "li", "responsivegriditem product-grid-large-fifth product-grid-small-6", limit=5)
    titles = []
    prices = []
    for item in items:
        titles.append(item.find("span", "responsivegriditem__title"))
        prices.append(item.find("span", "uomSalePrice"))
    if unit == 'none':
        prices = []
        for item in items:
            prices.append(item.find("span", "cat-price-number"))
    return items, titles, prices


def searchAmazon(ingredient, driver, unit):
    driver.get("https://www.amazon.com/s?k=" + ingredient)
    soup = BeautifulSoup(driver.page_source, features="html.parser")
    items = soup.find_all("div", "a-section a-spacing-medium", limit=6)
    titles = []
    prices = []
    for item in items:
        titles.append(
            item.find("h2", "a-size-mini a-spacing-none a-color-base s-line-clamp-4"))
        prices.append(item.find("span", "a-size-base a-color-secondary"))
    return items, titles, prices


@app.route('/ing')
def scrapePrice():
    ingredient = request.args.get("ing", "")
    unit = request.args.get("unit", "")
    print('Finding: ' + ingredient + ' ' + unit)

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(
        ChromeDriverManager().install(), chrome_options=options)

    items, titles, prices = searchHEB(ingredient, driver, unit)
    combinedPrice = 0
    numPrices = 0

    # Search for most common unit
    allUnits = {}
    if unit == "*" and "none" not in unit:
        for item in range(len(items)):
            if (not prices[item]):
                continue
            data = prices[item].get_text()[2:].split("/")
            currentUnit = data[1][:len(data[1])-1]
            if currentUnit not in allUnits:
                allUnits[currentUnit] = 0
            else:
                allUnits[currentUnit] += 1
        mostPopular = list(allUnits.keys())[0]
        for unitName in allUnits:
            if allUnits[unitName] > allUnits[mostPopular]:
                mostPopular = unitName
        unit = mostPopular.lower()

    # Parse prices for results using that unit
    for item in range(len(items)):
        if (not prices[item]):
            continue
        data = ""
        if unit == "none":
            data = prices[item].get_text().strip()[1:].split("e")
            data[0] = float(data[0])
            data[1] = "none"
        else:
            data = prices[item].get_text().strip()[2:].split("/")
            data[0] = float(data[0]) # quantity
            data[1] = data[1][:len(data[1])-1] # unit
        found = True
        print(titles[item].get_text().lower());
        for ingToken in ingredient.split(" "):
            if ingToken not in titles[item].get_text().lower():
                found = False
        if unit.lower() in data[1].lower() and found:
            combinedPrice += data[0]
            numPrices += 1

    finalData = {
        "average": round(combinedPrice / numPrices, 2),
        "unit": unit.lower(),
    }

    print("Response: " + str(finalData))

    return finalData
