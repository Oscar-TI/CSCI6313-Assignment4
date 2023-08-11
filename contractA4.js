'use strict';

const { Contract } = require('fabric-contract-api');

class ContractA4_690 extends Contract 
{

    async put_690(ctx, key, value) {        //Adds or updates data.
        await ctx.stub.putState(key, Buffer.from(value));
    }

    async get_690(ctx, key) {       //Retrieves value for corresponding key.
        const value = await ctx.stub.getState(key);
        if (!value || value.length === 0) {
            throw new Error(`Asset ${key} does not exist`);
        }

        return value.toString();
    }

    async delete_690(ctx, key) {        //Deletes values from current state.
        await ctx.stub.deleteState(key);
    }
    
}

module.exports = ContractA4_690;