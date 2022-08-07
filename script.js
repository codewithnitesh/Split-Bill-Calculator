class Translator {
  constructor() {
    this._lang = this.getLanguage()

    // This is new:
    this._elements = document.querySelectorAll('[data-i18n]')
  }

  getLanguage() {
    var lang = navigator.languages ? navigator.languages[0] : navigator.language

    return lang.substr(0, 2)
  }

  load(lang = null) {
    if (lang) {
      this._lang = lang
    }

    fetch(`/i18n/${this._lang}.json`)
      .then((res) => res.json())
      .then((translation) => {
        this.translate(translation)
        translator.toggleLangTag(this._lang)
      })
      .catch(() => {
        console.error(`Could not load ${this._lang}.json.`)
      })
  }

  translate(translation) {
    this._elements.forEach((element) => {
      var keys = element.dataset.i18n.split('.')
      var text = keys.reduce((obj, i) => obj[i], translation)
      if (text) {
        element.innerHTML = text
      }
    })
  }

  toggleLangTag() {
    if (document.documentElement.lang !== this._lang) {
      document.documentElement.lang = this._lang
    }
  }
}

var translator = new Translator()

const setLanguage = (language) => {
  translator.load(language)
}

const currencyMap = new Map()
currencyMap.set('INR', '₹')
currencyMap.set('USD', '$')

let selectedCurrency = 'INR'

const setCurrency = (currency) => {
  selectedCurrency = currencyMap.get(currency)

  const elements = document.getElementsByClassName('currencySymbol')

  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].innerText = selectedCurrency
    }
  }
}

const getCurrency = () => {
  return currencyMap.get(currency) || ''
}

const languageElem = document.getElementById('language')
setLanguage(languageElem.value)
setCurrency(selectedCurrency)

// Get global access to all inputs / divs here (you'll need them later 😘)
// bill input, tip input, number of people div, and per person total div
const billInput = document.getElementById('billTotalInput')
const tipInput = document.getElementById('tipInput')
const numberOfPeopleDiv = document.getElementById('numberOfPeople')
const perPersonTotalDiv = document.getElementById('perPersonTotal')
const billTipTotalDiv = document.getElementById('billTipTotal')

// Get number of people from number of people div
let numberOfPeople = Number(
  numberOfPeopleDiv.innerText ? numberOfPeopleDiv.innerText : 1,
)

// ** Calculate the total bill per person **
const calculateBill = () => {
  // get bill from user input & convert it into a number
  const bill = Number(billInput.value)

  // get the tip from user
  const tipAmount = Number(tipInput.value)
  
  // calculate the total (tip amount + bill)
  const total = tipAmount + bill

  // update the billTipTotal on DOM & show it to user
  billTipTotalDiv.innerText = `${total.toFixed(2)}`

  // calculate the per person total (total divided by number of people)
  const perPersonTotal = total / numberOfPeople

  // update the perPersonTotal on DOM & show it to user
  perPersonTotalDiv.innerText = `${perPersonTotal.toFixed(2)}`
}

// ** Splits the bill between more people **
const increasePeople = () => {
  // increment the amount
  numberOfPeople += 1

  // update the DOM with the new number of people
  numberOfPeopleDiv.innerText = numberOfPeople

  // calculate the bill based on the new number of people
  calculateBill()
}

// ** Splits the bill between fewer people **
const decreasePeople = () => {
  // guard clause
  // if amount is 1 or less simply return
  // (a.k.a you can't decrease the number of people to 0 or negative!)
  if (numberOfPeople <= 1) {
    return
  }

  // decrement the amount
  numberOfPeople -= 1

  // update the DOM with the new number of people
  numberOfPeopleDiv.innerText = numberOfPeople

  // calculate the bill based on the new number of people
  calculateBill()
}
