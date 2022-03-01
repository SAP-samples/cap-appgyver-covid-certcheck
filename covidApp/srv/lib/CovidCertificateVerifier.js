const fetch = require('node-fetch')
const base45 = require('base45-js')
const pako = require('pako')
const cbor = require('cbor')
const zlib = require('zlib')
const rs = require('jsrsasign');
const cose = require('cose-js');
const x509 = require('@fidm/x509')
const certLogicJs = require('certlogic-js');
const CertificateVerificationException = require('../lib/CertificateVerificationException')
class CovidCertificateVerifier {

    keysURL = 'https://de.dscg.ubirch.com/trustList/DSC/'
    rulesURL = 'https://distribution.dcc-rules.de/rules'
    valueSetURL = 'https://distribution.dcc-rules.de/valuesets'
    keys = {}
    ruleSetCountries = new Array()
    availableCountries = new Set()
    valueSets = new Object()
    EXPIRES_AT = 6
    ISSUED_AT = 4
    PAYLOAD = -260

    async init(certificateString) {
        await this.loadKeys()
        await this.loadBusinessRules()
        await this.loadValueSets()
    }

    async checkCertificate(certificateString, countryOfOffice, date) {

        const base45data = certificateString.slice(4)

        const decodedb45 = base45.decode(base45data)
        if (decodedb45.length == 0) {
            console.error("cannot base45decode string")
            throw new CertificateVerificationException("certificate not valid yet")
        }

        const coseRaw = pako.inflate(decodedb45)
        if (!coseRaw) {
            console.error("cannot inflate string")
            throw new CertificateVerificationException("certificate not valid yet")
        }

        const message = cbor.decodeFirstSync(coseRaw)
        const [protected_header, unprotected_header, cbor_data, signature] = message.value

        const greenpassData = cbor.decodeAllSync(cbor_data)
        let kid = cbor.decodeFirstSync(protected_header).get(cose.common.HeaderParameters.kid);
        if (kid === undefined) {
            kid = unprotected_header.get(cose.common.HeaderParameters.kid)
        }
        let kidb64 = Buffer.from(kid).toString('base64')

        let result = await this.verifyCertificate(coseRaw, kidb64)

        const payload = cbor.decodeFirstSync(cbor_data)

        this.checkDates(payload)
        this.executeRules(payload, countryOfOffice, date)
        return payload.get(this.PAYLOAD).get(1)
    }

    checkDates(payload) {
        const today = new Date()
        let startDate = new Date()
        let endDate = new Date()
        try {
            startDate = new Date(payload.get(this.EXPIRES_AT) * 1000)
            endDate = new Date(payload.get(this.ISSUED_AT) * 1000)
        } catch (error) {
            console.error(error)
        }

        if (startDate > today) throw new CertificateVerificationException("certificate not valid yet")
        if (endDate < today) throw new CertificateVerificationException("certificate not valid anymore")
    }

    executeRules(payload, countryOfOffice, date) {

        let options = {
            validationClock: date.toISOString(),
            valueSets: this.valueSets
        }
        let countryRules = this.ruleSetCountries.filter(rule => rule.Country == countryOfOffice)

        //TODO: add additional rules via file
        let actualPayload = payload.get(this.PAYLOAD).get(1)
        countryRules.forEach(rule => {
            let rulePassed = certLogicJs.evaluate(rule.Logic, { payload: actualPayload, external: options })
            if (!rulePassed) {
                console.error(rule.Description.find((element) => element.lang === 'en').desc)
                throw new CertificateVerificationException(rule.Description.find((element) => element.lang === 'en').desc)
            }
        })
    }

    async loadKeys() {
        const response = await fetch(this.keysURL);
        const certWithChecksum = await response.text();
        const certWithoutChecksum = certWithChecksum.substring(certWithChecksum.indexOf('\n') + 1, certWithChecksum.length)
        this.keys = JSON.parse(certWithoutChecksum).certificates
    }

    async loadBusinessRules() {

        //url as a property in the mta.yaml
        let response = await fetch(this.rulesURL);
        const ruleSet = await response.json();

        let ruleURLs = new Array()
        ruleSet.forEach(element => {
            ruleURLs.push(this.rulesURL + '/' + element.country + '/' + element.hash)
        });

        this.availableCountries = [... new Set(ruleSet.map(rule => rule.country))]

        this.ruleSetCountries = await Promise.all(ruleURLs.map(async url => {
            const resp = await fetch(url);
            return resp.json();
        }));
    }

    async loadValueSets() {

        //url as a property in the mta.yaml
        let response = await fetch(this.valueSetURL);
        const valueSetMetadata = await response.json();

        let valueSetURLS = new Array()
        valueSetMetadata.forEach(element => {
            valueSetURLS.push(this.valueSetURL + '/' + element.hash)
        });

        await Promise.all(valueSetURLS.map(async url => {
            const resp = await fetch(url)
            const json = await resp.json()
            this.valueSets[json.valueSetId] = Object.keys(json.valueSetValues)
        }));
    }

    splitIntoArray(string) {
        return string.match(new RegExp('.{1,' + 64 + '}', 'g'))
    }

    async verifyCertificate(coseRaw, kid) {
        const keyByKid = this.keys.find(cert => cert.kid == kid)
        const certList = keyByKid ? [keyByKid] : this.keys
        for (const cert of certList) {
            const rawDataSplitted = this.splitIntoArray(cert.rawData).join('\n')
            const certBuff = Buffer.from(`-----BEGIN CERTIFICATE-----\n${rawDataSplitted}\n-----END CERTIFICATE-----`)
            const publicKeySplitted = this.splitIntoArray(x509.Certificate.fromPEM(certBuff).publicKeyRaw.toString('base64')).join('\n')
            const pubkeyBuff = Buffer.from(`-----BEGIN PUBLIC KEY-----\n${publicKeySplitted}\n-----END PUBLIC KEY-----`)
            const publicKey = x509.PublicKey.fromPEM(pubkeyBuff).keyRaw
            await cose.sign.verify(coseRaw, { key: { x: publicKey.slice(1, 33), y: publicKey.slice(33, 65) } })
            return true
        }
        return false

    }

}

module.exports = CovidCertificateVerifier


