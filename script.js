const getCurrencyOptions = async () => {
    const response = await fetch('https://api.exchangerate.host/symbols');
    const json = await response.json();
    return json.symbols;
};

const getCurrencyRate = async (fromCurrency, toCurrency) => {
    const currencyConvertUrl = new URL('https://api.exchangerate.host/convert');
    currencyConvertUrl.searchParams.append('from', fromCurrency);
    currencyConvertUrl.searchParams.append('to', toCurrency);
    
    const response = await fetch(currencyConvertUrl); // Use the URL object directly
    const json = await response.json();
    
    return json.result;
};

const appendOptionToSelect = (selectElement, optionItem) => {
    const optionElement = document.createElement('option');
    optionElement.value = optionItem.code;
    optionElement.textContent = optionItem.description;
    
    selectElement.appendChild(optionElement);
};

const populateSelectElement = (selectElement, optionList) => {
    optionList.forEach(optionItem => {
        appendOptionToSelect(selectElement, optionItem);
    });
};

const setupCurrencies = async () => {
    const fromCurrencyElem = document.getElementById('fromCurrency');
    const toCurrencyElem = document.getElementById('toCurrency'); // Correct variable name

    const currencyOptions = await getCurrencyOptions();

    const currencies = Object.keys(currencyOptions).map(
        currencyKey => currencyOptions[currencyKey]
    );

    populateSelectElement(fromCurrencyElem, currencies);
    populateSelectElement(toCurrencyElem, currencies);

};

const setupEventListener = () => {
    const formElement = document.getElementById('convertForm');

    formElement.addEventListener('submit', async event => { // Mark the callback as async
        event.preventDefault();

        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        const amount = document.getElementById('amount');
        const convertResultElem = document.getElementById('ConvertResult');

        const rate = await getCurrencyRate(
            fromCurrency.value,
            toCurrency.value
        );
        const amountValue = Number(amount.value);
        const conversionResult = (amountValue * rate).toFixed(2); // Fixed the conversion calculation
        convertResultElem.textContent = `${amountValue} ${fromCurrency.value} = ${conversionResult} ${toCurrency.value}`;
    });
};

setupCurrencies();
setupEventListener(); // Call this function to set up the event listener
