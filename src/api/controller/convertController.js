require('isomorphic-fetch');
const { getYear, isAfter } = require("date-fns");
const ExchangeRatesError = require("./exchange-rates-error");
const QueryStringBuilder = require("./query-string-builder");
const currencies = require("./currencies");
const utils = require("./utils");
const API_BASE_URL = 'https://api.exchangeratesapi.io';

class ExchangeRates {
    constructor() {
        this._base = null;          
        this._symbols = null;       
        this._from = 'latest';      
        this._to = null;           
    }
    
    _validateCurrency(currency) {
        if (!(currency in currencies)) {
            throw new ExchangeRatesError(`${currency} is not a valid currency`);
        }
    }

    _isHistoryRequest() {
        return this._to !== null;
    }
    
    
    _validate() {
        if (this._isHistoryRequest()) {
            if (this._from === 'latest')
                throw new ExchangeRatesError
            if (isAfter(this._from, this._to))
                throw new ExchangeRatesError;
        }
        if (this._from !== 'latest' && getYear(this._from) < 1999)
            throw new ExchangeRatesError('Cannot get historical rates before 1999');
    }
    
    _buildUrl() {
        let url = API_BASE_URL + '/';
        let qs = new QueryStringBuilder();
        if (this._isHistoryRequest()) {
            url += 'history';
            qs.addParam('start_at', utils.formatDate(this._from));
            qs.addParam('end_at', utils.formatDate(this._to));
        } else {
            url += (this._from === 'latest') ? 'latest' : utils.formatDate(this._from);
        }
        if (this._base)
            qs.addParam('base', this._base);
        if (this._symbols)
            qs.addParam('symbols', this._symbols.join(','), false);
        return url + qs;
    }
    
    
    at(date) {
        this._from = utils.parseDate(date);
        return this;    // chainable
    }
    
    latest() {
        this._from = 'latest';
        return this;    // chainable
    }
   
    from(date) {
        this._from = utils.parseDate(date);
        return this;    // chainable
    }
    
    to(date) {
        this._to = utils.parseDate(date);
        return this;   
    }
    
    base(currency) {
        if (typeof currency !== 'string')
            throw new TypeError('Base currency has to be a string');
        currency = currency.toUpperCase();
        this._validateCurrency(currency);
        this._base = currency;
        return this;   
    }
    symbols(currencies) {
        currencies = Array.isArray(currencies) ? currencies : [currencies];
        for (let i = 0; i < currencies.length; i++) {
            let currency = currencies[i];
            if (typeof currency !== 'string')
                throw new TypeError('Symbol currencies have to be strings');
            currency = currency.toUpperCase();
            this._validateCurrency(currency);
            currencies[i] = currency;
        }
        this._symbols = currencies;
        return this;  
    }
    
    get url() {
        this._validate();
        return this._buildUrl();
    }
    fetch() {
        this._validate();
        return fetch(this._buildUrl())
            .then(response => {
                if (response.status !== 200)
                    throw new ExchangeRatesError(`API returned a bad response (HTTP ${response.status})`);
                return response.json();
            })
            .then(data => {
                const keys = Object.keys(data.rates);
                return (keys.length === 1) ? data.rates[keys[0]] : data.rates;
            })
            .catch(err => {
                throw new ExchangeRatesError(`Couldn't fetch the exchange rate, ${err.message}`);
            });
    }
    
    avg(decimalPlaces = null) {
        if (decimalPlaces !== null && !Number.isInteger(decimalPlaces))
            throw new ExchangeRatesError('The decimal places parameter has to be an integer');
        if (decimalPlaces !== null && decimalPlaces < 0)
            throw new ExchangeRatesError('Decimal places cannot be negative');
        return this.fetch().then(rates => {
            if (!this._isHistoryRequest()) return rates;
            let mergedObj = {};
            Object.values(rates).forEach(obj => {
                Object.keys(obj).forEach(key => {
                    mergedObj[key] = mergedObj[key] || [];
                    mergedObj[key].push(obj[key]);
                });
            });
            let avgRates = {};
            const keys = Object.keys(mergedObj);
            keys.forEach(key => {
                let avgRate = mergedObj[key].reduce((p, c) => p + c, 0) / mergedObj[key].length;
                avgRates[key] = (decimalPlaces === null) ? avgRate : +avgRate.toFixed(decimalPlaces);
            });
            return (keys.length === 1) ? avgRates[keys[0]] : avgRates;
        });
    }
}

const convert = (amount, fromCurrency, toCurrency, date = 'latest') => {
    if (typeof amount !== 'number')
        throw new TypeError('The \'amount\' parameter has to be a number');
    if (Array.isArray(toCurrency))
        throw new TypeError('Cannot convert to multiple currencies at the same time');
    let instance = new ExchangeRates();
    if (date === 'latest') {
        instance.latest();
    } else {
        instance.at(date);
    }
    return instance.base(fromCurrency).symbols(toCurrency).fetch().then(rate => rate * amount);
};
const exchangeRates = () => new ExchangeRates();
module.exports = { exchangeRates, currencies, convert };