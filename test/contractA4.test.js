'use strict';


const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const ContractA4_690 = require('../contractA4.js');

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
let assert = sinon.assert;
chai.use(sinonChai);

describe('Hyperledger Contract A4 Test: ', () => {
    let transactionContext690, chaincodeStub, asset;
    beforeEach(() => {                                              //Initializes smart contract.
        transactionContext690 = new Context();

        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext690.setChaincodeStub(chaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            chaincodeStub.states[key] = value;
        });

        chaincodeStub.getState.callsFake(async (key) => {
            let ret;
            if (chaincodeStub.states) {
                ret = chaincodeStub.states[key];
            }
            return Promise.resolve(ret);
        });

        chaincodeStub.deleteState.callsFake(async (key) => {
            if (chaincodeStub.states) {
                delete chaincodeStub.states[key];
            }
            return Promise.resolve(key);
        });

        asset = {
            key: "150",
            value: "Greenlight"
        };

    });

    describe('Test PUT method:', () => {				//Test case for put method.

        it('returns success on put method', async () => {
            let contractA4 = new ContractA4_690();

            await contractA4.put_690(transactionContext690, asset.key, asset.value);

            let ret = await chaincodeStub.getState(asset.key);
            expect(ret.toString()).to.equal(asset.value);
        });
    });

    describe('Test GET method:', () => {				//Test case for get method.

        it('returns error on get function', async () => {       //Tests with incorrect key.
            let contractA4 = new ContractA4_690();
            await contractA4.put_690(transactionContext690, asset.key, asset.value);

            try {
                await contractA4.get_690(transactionContext690, '180');
                assert.fail('get method failed');
            } catch (err) {
                expect(err.message).to.equal('Asset 180 does not exist');
            }
        });

        it('returns success on get method', async () => {       //Passes correct key.
            let contractA4 = new ContractA4_690();
            await contractA4.put_690(transactionContext690, asset.key, asset.value);

            let ret = await chaincodeStub.getState(asset.key);
            expect(ret.toString()).to.equal(asset.value);
        });
    });

    describe('Test DELETE method:', () => {			//Test case for delete method.

        it('returns error on delete method', async () => {      //Tests with incorrect key.
            let contractA4 = new ContractA4_690();
            await contractA4.put_690(transactionContext690, asset.key, asset.value);

            try {
                await contractA4.get_690(transactionContext690, '120');
                assert.fail('delete method failed');
            } catch (err) {
                expect(err.message).to.equal('Asset 120 does not exist');
            }
        });

        it('returns success on delete function', async () => {      //Passes correct values.
            let contractA4 = new ContractA4_690();
            await contractA4.put_690(transactionContext690, asset.key, asset.value);

            await chaincodeStub.deleteState(asset.key);
            let ret = await chaincodeStub.getState(asset.key);
            expect(ret).to.equal(undefined);
        });
    });
});