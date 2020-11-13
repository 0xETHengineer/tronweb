const chai = require('chai');
const assert = chai.assert;

const assertThrow = require('../helpers/assertThrow');
const tronWebBuilder = require('../helpers/tronWebBuilder');
const wait = require('../helpers/wait');
const shieldedUtils = require('../helpers/shieldedUtils');


const TronWeb = tronWebBuilder.TronWeb;

describe("Tronweb.ztron", function (){

    let tronWeb;
    let noteTxs; //notes
    const keysInfo = {};
    const shieldedAddress = 'TPcKtz5TRfP4xUZSos81RmXB9K2DBqj2iu';
    const trc20Address = 'TFUD8x3iAZ9dF7NDCGBtSjznemEomE5rP9';
    let startBlockIndex = 0, endBlockIndex = 0;
    let scalingFactor;
    let shieldedSpends;
    let shieldedReceives;
    let shieldedInfo;

    let methodInstance;

    const narrowValue = 1;
    let realCost;


    before(async function () {
        tronWeb = tronWebBuilder.createInstance({
            fullNode: 'https://api.nileex.io/',
            solidityNode: 'https://api.nileex.io/'
        });
        methodInstance = shieldedUtils.makeShieldedMethodInstance(tronWeb, shieldedAddress);
        scalingFactor = (await methodInstance.scalingFactor().call()).toNumber();
        realCost = tronWeb.BigNumber(narrowValue).multipliedBy(scalingFactor).toFixed();
        // console.log(realCost, narrowValue)
        shieldedInfo = await tronWeb.ztron.getNewShieldedAddress();
        // console.log(await tronWeb.ztron.getNewShieldedAddress())
    });

    describe('#constructor()', function () {

        it('should have been set a full instance in tronWeb', function () {

            assert.instanceOf(tronWeb.ztron, TronWeb.ZTron);
        });

    });

    describe('#getspendingkey', function (){
        it('should get a value', async function (){
            const spendingKeyInfo = await tronWeb.ztron.getSpendingKey();
            assert.ok(spendingKeyInfo.value);
            assert.strictEqual(spendingKeyInfo.value.length, 64);
            keysInfo.spendingKey = spendingKeyInfo.value
        })
    });

    describe("#getExpandedSpendingKey", function (){
        it('should get spending keys with the spendingKey', async function (){
            // const spendingKeyInfo = await tronWeb.ztron.getSpendingKey();
            const result  = await tronWeb.ztron.getExpandedSpendingKey(keysInfo.spendingKey);
            assert.ok(result.ask);
            assert.ok(result.nsk);
            assert.ok(result.ovk);
            assert.strictEqual(result.ask.length, 64);
            assert.strictEqual(result.nsk.length, 64);
            assert.strictEqual(result.ovk.length, 64);
            keysInfo.ask = result.ask;
            keysInfo.nsk = result.nsk;
            keysInfo.ovk = result.ovk;
        })

        it('should throw if The length of spendingKey is not equal to 64', async function (){
            const result = await tronWeb.ztron.getExpandedSpendingKey('0d1fd0aa0cca9f74eac4b542b62ec36ab84263534dae8814c69210180d3d49');
            assert.ok(result.Error.indexOf('should be 64') !== -1)
            // await assertThrow(
            //     tronWeb.ztron.getExpandedSpendingKey('0d1fd0aa0cca9f74eac4b542b62ec36ab84263534dae8814c69210180d3d49'),
            //     null,
            //     'the length of spendingKey\'s hex string should be 64'
            // )
        })

        it('should throw if spendingKey is null.', async function (){
            await assertThrow(
                tronWeb.ztron.getExpandedSpendingKey(null),
                'Invalid spendingKey provided'
            )
        })

        it('should throw if spendingKey is undefined.', async function (){
            await assertThrow(
                tronWeb.ztron.getExpandedSpendingKey(undefined),
                'Invalid spendingKey provided'
            )
        })

        it('should throw if spendingKey is empty string.', async function (){
            await assertThrow(
                tronWeb.ztron.getExpandedSpendingKey(''),
                'Invalid spendingKey provided'
            )
        })

    })

    describe("#getAkFromAsk", function (){

        it('should get ak value with ask', async function (){
            const result = await tronWeb.ztron.getAkFromAsk(keysInfo.ask);
            assert.ok(result.value);
            assert.strictEqual(result.value.length, 64);
            keysInfo.ak = result.value;
        })

        it('should throw if The length of ask is not equal to 64', async function (){
            const result = await tronWeb.ztron.getAkFromAsk('f1549d4a039140b07d0400cd0442be994bd16b9269b225eb75d1b6d334');
            assert.ok(result.Error.indexOf('should be 64') !== -1)
            // await assertThrow(
            //     tronWeb.ztron.getAkFromAsk('f1549d4a039140b07d0400cd0442be994bd16b9269b225eb75d1b6d334'),
            //     null,
            //     'the length of ask\'s hex string should be 64'
            // )
        })

        it('should throw if ask is null.', async function (){
            await assertThrow(
                tronWeb.ztron.getAkFromAsk(null),
                'Invalid ask provided'
            )
        })

        it('should throw if ask is undefined.', async function (){
            await assertThrow(
                tronWeb.ztron.getAkFromAsk(undefined),
                'Invalid ask provided'
            )
        })

        it('should throw if ask is empty string.', async function (){
            await assertThrow(
                tronWeb.ztron.getAkFromAsk(''),
                'Invalid ask provided'
            )
        })
    })

    describe("#getNkFromNsk", function (){

        it('should get nk value with nsk', async function (){
            const result = await tronWeb.ztron.getNkFromNsk(keysInfo.nsk);
            assert.ok(result.value);
            assert.strictEqual(result.value.length, 64);
            keysInfo.nk = result.value;
        })

        it('should throw if The length of nsk is not equal to 64', async function (){
            const result = await tronWeb.ztron.getNkFromNsk('ebaff02009978d74731bc81e08012927da1aaa6564f18d7');
            assert.ok(result.Error.indexOf('should be 64') !== -1)
            // await assertThrow(
            //     tronWeb.ztron.getNkFromNsk('ebaff02009978d74731bc81e08012927da1aaa6564f18d7'),
            //     null,
            //     'the length of nsk\'s hex string should be 64'
            // )
        })

        it('should throw if nsk is null.', async function (){
            await assertThrow(
                tronWeb.ztron.getNkFromNsk(null),
                'Invalid nsk provided'
            )
        })

        it('should throw if nsk is undefined.', async function (){
            await assertThrow(
                tronWeb.ztron.getNkFromNsk(undefined),
                'Invalid nsk provided'
            )
        })

        it('should throw if nsk is empty string.', async function (){
            await assertThrow(
                tronWeb.ztron.getNkFromNsk(''),
                'Invalid nsk provided'
            )
        })
    })

    describe("#getDiversifier", function (){
        it('should get a value', async function (){
            const result = await tronWeb.ztron.getDiversifier();
            assert.ok(result.d);
            keysInfo.d = result.d
        })
    })

    describe("#getIncomingViewingKey", function (){
        it('should get ivk', async function (){
            const result = await tronWeb.ztron.getIncomingViewingKey(keysInfo.ak, keysInfo.nk);
            assert.ok(result.ivk);
            assert.strictEqual(result.ivk.length, 64);
            keysInfo.ivk = result.ivk;
        })

        it('should throw if ak is empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getIncomingViewingKey('', keysInfo.nk),
                'Invalid ak provided'
            )
        })

        it('should throw if ak provides an irregular length', async function (){
            const result = await tronWeb.ztron.getIncomingViewingKey(keysInfo.ak.slice(0, 10), keysInfo.nk);
            assert.ok(result.Error.indexOf('param length must be 32') !== -1)
        })


        it('should throw if nk is empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getIncomingViewingKey(keysInfo.ak, ''),
                'Invalid nk provided'
            )
        })

        it('should throw if nk provides an irregular length', async function (){
            const result = await tronWeb.ztron.getIncomingViewingKey(keysInfo.ak, keysInfo.nk.slice(0, 10));
            assert.ok(result.Error.indexOf('param length must be 32') !== -1)
        })
    })

    describe("#getZenPaymentAddress", function (){
        it('should get paymentAddress', async function (){
            const result = await tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk, keysInfo.d);
            assert.ok(result.payment_address && result.pkD);
            keysInfo.pkD = result.pkD;
            keysInfo.payment_address = result.payment_address;
        })

        it('should throw if The length of ivk does not match the rules', async function (){
            const result = await tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk.slice(0, 10), keysInfo.d);
            assert.ok(result.Error.indexOf('param length must be 32') !== -1);
        })

        it('should throw if an invalid d is passed', async function (){
            const result = await tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk, '52a2416b346f416ed75049');
            assert.ok(result.Error.indexOf('d is not valid') !== -1);
        })

        it('should throw if ivk is an empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getZenPaymentAddress('', keysInfo.d),
                'Invalid ivk provided'
            )
        })

        it('should throw if d is an empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk, ''),
                'Invalid d provided'
            )
        })
    })

    describe("#getRcm", function (){
        it('should get rcm value', async function (){
            const result = await tronWeb.ztron.getRcm();
            assert.ok(result.value);
            assert.strictEqual(result.value.length, 64);
            keysInfo.rcm = result.value
        })
    })

    describe("#getNewShieldedAddress", function (){
        it('should get shieldedAddress value', async function () {
            const result = await tronWeb.ztron.getNewShieldedAddress();
            assert.ok(result.ask && result.sk && result.nsk && result.ovk
                && result.ak && result.nk && result.ivk && result.d && result.pkD && result.payment_address);
        })
    })

    describe("#createMintParams", function (){

        it('should get mintParams with ovk is object', async function (){
            const startBlockInfo = await tronWeb.trx.getCurrentBlock()

            for(let i = 0; i < 4; i++){
                const rcmInfo = await tronWeb.ztron.getRcm();
                const params = {
                    from_amount: realCost,
                    shielded_receives: {
                        note: {
                            value: narrowValue,
                            payment_address: shieldedInfo.payment_address,
                            rcm: rcmInfo.value
                        }
                    },
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: shieldedInfo.ovk
                }

                const result = await tronWeb.ztron.createMintParams(params);
                assert.ok(result && result.trigger_contract_input);

                const address = tronWeb.defaultAddress.base58;
                //approve
                await shieldedUtils.makeAndSendTransaction(tronWeb, trc20Address, 'approve(address,uint256)', {},
                    [{type: 'address', value: shieldedAddress},{type: 'uint256', value: narrowValue * scalingFactor}], address)

                const options = {
                    shieldedParameter: result.trigger_contract_input
                }
                await shieldedUtils.makeAndSendTransaction(tronWeb, shieldedAddress, 'mint(uint256,bytes32[9],bytes32[2],bytes32[21])', options, [], address);

            }
            // const endBlockInfo = await tronWeb.trx.getCurrentBlock();
            startBlockIndex = startBlockInfo.block_header.raw_data.number;
            endBlockIndex = startBlockIndex + 999;
        })

        it('should get mintParams with Expanded parameters', async function(){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: narrowValue,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const result = await tronWeb.ztron.createMintParams(shieldedInfo.ovk, realCost, shieldedReceives, shieldedAddress);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should get mintParams with options param', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: narrowValue,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const options = {
                visible: false,
                from_amount: tronWeb.BigNumber(10).multipliedBy(scalingFactor).toFixed(),
                shielded_receives: {
                    note: {
                        value: 10,
                        payment_address: shieldedInfo.payment_address,
                        rcm: rcmInfo.value
                    }
                }
            }
            const result = await tronWeb.ztron.createMintParams(shieldedInfo.ovk, realCost, shieldedReceives, shieldedAddress, options);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should throw if avk not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const invalidOvk = 1111;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParams(invalidOvk, fromAmount, shieldedReceives, shieldedAddress),
                'Invalid ovk provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: invalidOvk
                }),
                'Invalid ovk provided'
            )
        })

        it('should throw if fromAmount not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const invalidFromAmount = 1000;
            await assertThrow(
                tronWeb.ztron.createMintParams(ovk, invalidFromAmount, shieldedReceives, shieldedAddress),
                'Invalid fromAmount provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: invalidFromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid fromAmount provided'
            )
        })

        it('should throw if shieldedReceives is an empty Object', async function (){
            const ovk = shieldedInfo.ovk;
            const shieldedReceivesEmpty = {};
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParams(ovk, fromAmount, shieldedReceivesEmpty, shieldedAddress),
                'Invalid shieldedReceives provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: fromAmount,
                    shielded_receives: null,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid shieldedReceives provided'
            )
        })

        it('should throw if shieldedTRC20ContractAddress not an address', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            const invalidAddress = shieldedAddress.slice(0, shieldedAddress.length - 3);
            await assertThrow(
                tronWeb.ztron.createMintParams(ovk, fromAmount, shieldedReceives, invalidAddress),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: invalidAddress,
                    ovk: ovk
                }),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
        })
    })

    describe("#createMintParamsWithoutAsk", function (){

        it('should get mintParams with ovk is object', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const params = {
                from_amount: '1000',
                shielded_receives: {
                    note: {
                        value: 100,
                        payment_address: shieldedInfo.payment_address,
                        rcm: rcmInfo.value
                    }
                },
                shielded_TRC20_contract_address: shieldedAddress,
                ovk: shieldedInfo.ovk
            }

            const result = await tronWeb.ztron.createMintParamsWithoutAsk(params);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should get mintParams with Expanded parameters', async function(){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const result = await tronWeb.ztron.createMintParamsWithoutAsk(shieldedInfo.ovk, '1000', shieldedReceives, shieldedAddress);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should get mintParams with options param', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const options = {
                visible: false,
                from_amount: '10000',
                shielded_receives: {
                    note: {
                        value: 1000,
                        payment_address: shieldedInfo.payment_address,
                        rcm: rcmInfo.value
                    }
                }
            }
            const result = await tronWeb.ztron.createMintParamsWithoutAsk(shieldedInfo.ovk, '1000', shieldedReceives, shieldedAddress, options);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should throw if avk not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const invalidOvk = 1111;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(invalidOvk, fromAmount, shieldedReceives, shieldedAddress),
                'Invalid ovk provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: invalidOvk
                }),
                'Invalid ovk provided'
            )
        })

        it('should throw if fromAmount not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const invalidFromAmount = 1000;
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(ovk, invalidFromAmount, shieldedReceives, shieldedAddress),
                'Invalid fromAmount provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: invalidFromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid fromAmount provided'
            )
        })

        it('should throw if shieldedReceives is an empty Object', async function (){
            const ovk = shieldedInfo.ovk;
            const shieldedReceivesEmpty = {};
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(ovk, fromAmount, shieldedReceivesEmpty, shieldedAddress),
                'Invalid shieldedReceives provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: fromAmount,
                    shielded_receives: null,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid shieldedReceives provided'
            )
        })

        it('should throw if shieldedTRC20ContractAddress not an address', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            const invalidAddress = shieldedAddress.slice(0, shieldedAddress.length - 3);
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(ovk, fromAmount, shieldedReceives, invalidAddress),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: invalidAddress,
                    ovk: ovk
                }),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
        })

    })

    describe("#scanShieldedTRC20NotesByIvk No publicity", function (){
        it('should get shielded_spends with startBlockIndex is object', async function (){
            await wait(10)
            const params = {
                "start_block_index": startBlockIndex,
                "end_block_index": endBlockIndex,
                "shielded_TRC20_contract_address": shieldedAddress,
                "ivk": shieldedInfo.ivk,
                "ak": shieldedInfo.ak,
                "nk": shieldedInfo.nk,
                "visible": true
            }
            const options = {
                visible: true
            }
            const result = await shieldedUtils.scanShieldedTRC20NotesByIvk(tronWeb, params, options);
            assert.ok(result && result.noteTxs && result.noteTxs.length > 0);
            noteTxs = result.noteTxs;
            // noteTxs = result.noteTxs.filter(item => !item.is_spent)
        })

        after(async () => {
            const pathInfo = await methodInstance.getPath([noteTxs[0].position]).call();
            shieldedSpends = [{
                "note": noteTxs[0].note,
                "alpha": (await tronWeb.ztron.getRcm()).value,
                "root":  pathInfo[0].replace('0x', ''),
                "path":  pathInfo[1].map(v => v.replace('0x', '')).join(''),
                "pos": noteTxs[0].position
            }];
            shieldedReceives = [{
                note: {
                    value: 1,
                    payment_address: shieldedInfo.payment_address,
                    rcm: ( await tronWeb.ztron.getRcm()).value
                }
            }]
        })
    })

    describe("#createTransferParams", function (){
        before(async ()=>{

        })
        it('should get transferParams with ask is object', async function (){
            const params = {
                shielded_spends: shieldedSpends,
                shielded_receives: shieldedReceives,
                shielded_TRC20_contract_address: shieldedAddress,
                ovk: shieldedInfo.ovk,
                ask: shieldedInfo.ask,
                nsk: shieldedInfo.nsk
            }
            const result = await tronWeb.ztron.createTransferParams(params);
            assert.ok(result && result.trigger_contract_input);

            const options = {
                shieldedParameter: result.trigger_contract_input
            }
            const transactionResult = await shieldedUtils.makeAndSendTransaction(tronWeb, shieldedAddress,
                'transfer(bytes32[10][],bytes32[2][],bytes32[9][],bytes32[2],bytes32[21][])', options, [], tronWeb.defaultAddress.base58);
            assert.ok(transactionResult && transactionResult.result);
        })

        it('should get transferParams with Expanded parameters', async function(){
            const result = await tronWeb.ztron.createTransferParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                shieldedSpends, shieldedReceives, shieldedAddress, {});
            assert.ok(result && result.trigger_contract_input);
        })

        it('should throw if ask|nsk|ovk not a string', async function (){
            const invalidAsk = 1111;
            const invalidNsk = 1111;
            const invalidOvk = 1111;

            await assertThrow(
                tronWeb.ztron.createTransferParams(invalidAsk, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, shieldedReceives, shieldedAddress, {}),
                'Invalid ask provided'
            )
            await assertThrow(
                tronWeb.ztron.createTransferParams({
                    shielded_spends: shieldedSpends,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: shieldedInfo.ovk,
                    ask: invalidAsk,
                    nsk: shieldedInfo.nsk
                }),
                'Invalid ask provided'
            )

            await assertThrow(
                tronWeb.ztron.createTransferParams(shieldedInfo.ask, invalidNsk, shieldedInfo.ovk,
                    shieldedSpends, shieldedReceives, shieldedAddress, {}),
                'Invalid nsk provided'
            )

            await assertThrow(
                tronWeb.ztron.createTransferParams(shieldedInfo.ask, shieldedInfo.nsk, invalidOvk,
                    shieldedSpends, shieldedReceives, shieldedAddress, {}),
                'Invalid ovk provided'
            )
        })

        it('should throw if shieldedSpends|shieldedReceives not an array', async function (){
            const invalidShieldedSpends = {};
            const invalidShieldedReceives = {};
            await assertThrow(
                tronWeb.ztron.createTransferParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    invalidShieldedSpends, shieldedReceives, shieldedAddress, {}),
                'Invalid shieldedSpends provided'
            )

            await assertThrow(
                tronWeb.ztron.createTransferParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, invalidShieldedReceives, shieldedAddress, {}),
                'Invalid shieldedReceives provided'
            )
        })

        it('should throw if shieldedTRC20ContractAddress is not an address', async function (){
            const invalidShieldedTRC20ContractAddress = shieldedAddress.slice(0, 10);
            await assertThrow(
                tronWeb.ztron.createTransferParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, shieldedReceives, invalidShieldedTRC20ContractAddress, {}),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
        })
    })

    describe("#createTransferParamsWithoutAsk chain", function (){
        let transferParamsResult;
        let spendAuthoritySignature;
        let transferTriggerContractInput;
        describe('#createTransferParamsWithoutAsk', function (){
            it('should get transferParams without ask, ak is an object', async function (){
                const params = {
                    shielded_spends: shieldedSpends,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: shieldedInfo.ovk,
                    ak: shieldedInfo.ak,
                    nsk: shieldedInfo.nsk
                }
                const result = await tronWeb.ztron.createTransferParamsWithoutAsk(params);
                assert.ok(result && result.binding_signature && result.message_hash);
                transferParamsResult = result;
            })

            it('should get transferParams without ask, The parameters are expanded', async function (){
                const result = await tronWeb.ztron.createTransferParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, shieldedReceives, shieldedAddress, {});
                assert.ok(result && result.binding_signature && result.message_hash);
            })

            it('should trow if ak|nsk|ovk is not a string', async function (){
                const invalidAk = 1111;
                const invalidNsk = 1111;
                const invalidOvk = 1111;

                await assertThrow(
                    tronWeb.ztron.createTransferParamsWithoutAsk(invalidAk, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, shieldedReceives, shieldedAddress, {}),
                    'Invalid ak provided'
                )

                await assertThrow(
                    tronWeb.ztron.createTransferParamsWithoutAsk(shieldedInfo.ak, invalidNsk, shieldedInfo.ovk,
                        shieldedSpends, shieldedReceives, shieldedAddress, {}),
                    'Invalid nsk provided'
                )

                await assertThrow(
                    tronWeb.ztron.createTransferParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, invalidOvk,
                        shieldedSpends, shieldedReceives, shieldedAddress, {}),
                    'Invalid ovk provided'
                )
            })

            it('should throw if shieldedSpends|shieldedReceives not an array', async function (){
                const invalidShieldedSpends = {};
                const invalidShieldedReceives = {};
                await assertThrow(
                    tronWeb.ztron.createTransferParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                        invalidShieldedSpends, shieldedReceives, shieldedAddress, {}),
                    'Invalid shieldedSpends provided'
                )

                await assertThrow(
                    tronWeb.ztron.createTransferParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, invalidShieldedReceives, shieldedAddress, {}),
                    'Invalid shieldedReceives provided'
                )
            })

            it('should throw if shieldedTRC20ContractAddress is not an address', async function (){
                const invalidShieldedTRC20ContractAddress = shieldedAddress.slice(0, 10);
                await assertThrow(
                    tronWeb.ztron.createTransferParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, shieldedReceives, invalidShieldedTRC20ContractAddress, {}),
                    'Invalid shieldedTRC20ContractAddress address provided'
                )
            })
        })

        describe("#createSpendAuthSig", async function (){
            let txHash;
            let alpha;
            before(async () => {
                txHash = transferParamsResult.message_hash;
                alpha = (await tronWeb.ztron.getRcm()).value;
            })
            it('should get a value with txHash', async function (){
                const rcmInfo = await tronWeb.ztron.getRcm();
                const result = await tronWeb.ztron.createSpendAuthSig(shieldedInfo.ask, txHash, rcmInfo.value);
                assert.ok(result && result.value);
                spendAuthoritySignature = result.value;
            })

            it('should throw if ask is an empty string or not a string', async function (){
                const askNotString = 1111;
                const askEmptyString = '';
                await assertThrow(
                    tronWeb.ztron.createSpendAuthSig(askNotString, txHash, alpha),
                    'Invalid ask provided'
                )

                await assertThrow(
                    tronWeb.ztron.createSpendAuthSig(askEmptyString, txHash, alpha),
                    'Invalid ask provided'
                )
            })

            it('should throw if txHash is an empty string or not a string', async function (){
                const txHashNotString = 1111;
                const txHashEmptyString = '';
                await assertThrow(
                    tronWeb.ztron.createSpendAuthSig(shieldedInfo.ask, txHashNotString, alpha),
                    'Invalid txHash provided'
                )

                await assertThrow(
                    tronWeb.ztron.createSpendAuthSig(shieldedInfo.ask, txHashEmptyString, alpha),
                    'Invalid txHash provided'
                )
            })

            it('should throw if alpha is not a string or is less than 64', async function (){
                const alphaNotString = 1111;
                const alphaLengthNotEnough = alpha.slice(0, 54);
                await assertThrow(
                    tronWeb.ztron.createSpendAuthSig(shieldedInfo.ask, txHash, alphaNotString),
                    'Invalid alpha provided'
                )

                await assertThrow(
                    tronWeb.ztron.createSpendAuthSig(shieldedInfo.ask, txHash, alphaLengthNotEnough),
                    'Invalid alpha provided'
                )
            })
        })

        describe("#getTriggerInputForShieldedTRC20Contract", function (){
            const shieldedTRC20Parameters = {};
            let spendAuthoritySignatureArray;

            before(async ()=> {
                Object.assign(shieldedTRC20Parameters, transferParamsResult);
                spendAuthoritySignatureArray = [{
                    value: spendAuthoritySignature
                }];
            })

            it('it should return transfer trigger_contract_input value', async function (){
                const result = await tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(shieldedTRC20Parameters, spendAuthoritySignatureArray);
                assert.ok(result && result.value)
                transferTriggerContractInput = result.value;
            })

            it('should throw if shieldedTRC20Parameters is not an object', async function (){
                const invalidShieldedTRC20Parameters = [];
                await assertThrow(
                    tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(invalidShieldedTRC20Parameters, spendAuthoritySignatureArray),
                    'Invalid shieldedTRC20Parameters provided'
                )
            })

            it('should throw if spendAuthoritySignature is not an array', async function (){
                const invalidSpendAuthoritySignature = {};
                await assertThrow(
                    tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(shieldedTRC20Parameters, invalidSpendAuthoritySignature),
                    'Invalid spendAuthoritySignature provided'
                )
            })

            it('should throw if shieldedTRC20Parameters.spend_description is not an array', async function (){
                const invalidShieldedTRC20Parameters = {
                    spend_description: {}
                };
                await assertThrow(
                    tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(Object.assign({}, shieldedTRC20Parameters, invalidShieldedTRC20Parameters), spendAuthoritySignatureArray),
                    'Invalid shieldedTRC20Parameters.spend_description provided'
                )
            })

            it('should throw if shieldedTRC20Parameters.receive_description is not an array', async function (){
                const invalidShieldedTRC20Parameters = {
                    receive_description: {}
                };
                await assertThrow(
                    tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(Object.assign({}, shieldedTRC20Parameters, invalidShieldedTRC20Parameters), spendAuthoritySignatureArray),
                    'Invalid shieldedTRC20Parameters.receive_description provided'
                )
            })

            it('should throw if shieldedTRC20Parameters.binding_signature is not a string', async function (){
                const invalidShieldedTRC20Parameters = {
                    binding_signature: 1111,
                };
                await assertThrow(
                    tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(Object.assign({}, shieldedTRC20Parameters, invalidShieldedTRC20Parameters), spendAuthoritySignatureArray),
                    'Invalid shieldedTRC20Parameters.binding_signature provided'
                )
            })

            it('should throw if shieldedTRC20Parameters.message_hash is not a string', async function (){
                const invalidShieldedTRC20Parameters = {
                    message_hash: 1111,
                };
                await assertThrow(
                    tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(Object.assign({}, shieldedTRC20Parameters, invalidShieldedTRC20Parameters), spendAuthoritySignatureArray),
                    'Invalid shieldedTRC20Parameters.message_hash provided'
                )
            })

            it('should throw if shieldedTRC20Parameters.parameter_type is not a string', async function (){
                const invalidShieldedTRC20Parameters = {
                    parameter_type: 1111,
                };
                await assertThrow(
                    tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(Object.assign({}, shieldedTRC20Parameters, invalidShieldedTRC20Parameters), spendAuthoritySignatureArray),
                    'Invalid shieldedTRC20Parameters.parameter_type provided'
                )
            })
        })

    })

    describe("#createBurnParams", function (){
        let burnShieldedReceives = [];
        let toAmount;
        const transParentToAddress = 'TRM11TZjzC8Gksria7tpYZvHEWpGW2T68r'

        before(async () => {
            Object.assign(burnShieldedReceives, shieldedReceives);
            burnShieldedReceives[0].note.value = 0;
            toAmount = tronWeb.BigNumber(shieldedSpends[0].note.value).minus(burnShieldedReceives[0].note.value).multipliedBy(scalingFactor).toFixed()
        })

        it('should get burnParams with ask is object', async function (){
            let params = {
                shielded_spends: shieldedSpends,
                shielded_receives: burnShieldedReceives,
                shielded_TRC20_contract_address: shieldedAddress,
                ovk: shieldedInfo.ovk,
                ask: shieldedInfo.ask,
                nsk: shieldedInfo.nsk,
                to_amount: toAmount,
                transparent_to_address: transParentToAddress
            }

            const result = await tronWeb.ztron.createBurnParams(params);
            assert.ok(result && result.trigger_contract_input);

            const options = {
                shieldedParameter: result.trigger_contract_input
            }
            const transactionResult = await shieldedUtils.makeAndSendTransaction(tronWeb, shieldedAddress,
                'burn(bytes32[10],bytes32[2],uint256,bytes32[2],address,bytes32[3],bytes32[9][],bytes32[21][])', options, [], tronWeb.defaultAddress.base58);
            assert.ok(transactionResult && transactionResult.result);
        })

        it('should get burnParams with Expanded parameters', async function(){
            const result = await tronWeb.ztron.createBurnParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should throw if ask|nsk|ovk not a string', async function (){
            const invalidAsk = 1111;
            const invalidNsk = 1111;
            const invalidOvk = 1111;

            await assertThrow(
                tronWeb.ztron.createBurnParams(invalidAsk, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                'Invalid ask provided'
            )

            await assertThrow(
                tronWeb.ztron.createBurnParams(shieldedInfo.ask, invalidNsk, shieldedInfo.ovk,
                    shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                'Invalid nsk provided'
            )

            await assertThrow(
                tronWeb.ztron.createBurnParams(shieldedInfo.ask, shieldedInfo.nsk, invalidOvk,
                    shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                'Invalid ovk provided'
            )
        })

        it('should throw if shieldedSpends|shieldedReceives not an array', async function (){
            const invalidShieldedSpends = {};
            const invalidShieldedReceives = {};
            await assertThrow(
                tronWeb.ztron.createBurnParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    invalidShieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                'Invalid shieldedSpends provided'
            )

            await assertThrow(
                tronWeb.ztron.createBurnParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, invalidShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                'Invalid shieldedReceives provided'
            )
        })

        it('should throw if toAmount is not a string', async function (){
            const invalidToAmount = 10;
            await assertThrow(
                tronWeb.ztron.createBurnParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, burnShieldedReceives, transParentToAddress, invalidToAmount, shieldedAddress),
                'Invalid toAmount provided'
            )
        })

        it('should throw if transparentToAddress is not an address', async function (){
            const invalidTransparentToAddress = transParentToAddress.slice(0, 10);
            await assertThrow(
                tronWeb.ztron.createBurnParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, burnShieldedReceives, invalidTransparentToAddress, toAmount, shieldedAddress),
                'Invalid transparentToAddress address provided'
            )
        })

        it('should throw if shieldedTRC20ContractAddress is not an address', async function (){
            const invalidShieldedTRC20ContractAddress = shieldedAddress.slice(0, 10);
            await assertThrow(
                tronWeb.ztron.createBurnParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, invalidShieldedTRC20ContractAddress),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
        })



    })

    describe("#createBurnParamsWithoutAsk chain", function (){
        let burnParamsResult;
        let spendAuthoritySignature;
        let burnTriggerContractInput;

        let burnShieldedReceives = [];
        let toAmount;
        const transParentToAddress = 'TRM11TZjzC8Gksria7tpYZvHEWpGW2T68r'

        before(async () => {
            Object.assign(burnShieldedReceives, shieldedReceives);
            burnShieldedReceives[0].note.value = 0;
            toAmount = tronWeb.BigNumber(shieldedSpends[0].note.value).minus(burnShieldedReceives[0].note.value).multipliedBy(scalingFactor).toFixed()
        })

        describe('#createBurnParamsWithoutAsk', function (){
            it('should get burnParams without ask, ak is an object', async function (){
                 let params = {
                    shielded_spends: shieldedSpends,
                    shielded_receives: burnShieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: shieldedInfo.ovk,
                    ak: shieldedInfo.ak,
                    nsk: shieldedInfo.nsk,
                    to_amount: toAmount,
                    transparent_to_address: transParentToAddress
                }
                const result = await tronWeb.ztron.createBurnParamsWithoutAsk(params);
                assert.ok(result && result.binding_signature && result.message_hash);
                burnParamsResult = result;
            })

            it('should get transferParams without ask, The parameters are expanded', async function (){
                const result = await tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress);
                assert.ok(result && result.binding_signature && result.message_hash);
            })

            it('should trow if ak|nsk|ovk is not a string', async function (){
                const invalidAk = 1111;
                const invalidNsk = 1111;
                const invalidOvk = 1111;

                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(invalidAk, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                    'Invalid ak provided'
                )

                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ak, invalidNsk, shieldedInfo.ovk,
                        shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                    'Invalid nsk provided'
                )

                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, invalidOvk,
                        shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                    'Invalid ovk provided'
                )
            })

            it('should throw if shieldedSpends|shieldedReceives not an array', async function (){
                const invalidShieldedSpends = {};
                const invalidShieldedReceives = {};
                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                        invalidShieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                    'Invalid shieldedSpends provided'
                )

                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, invalidShieldedReceives, transParentToAddress, toAmount, shieldedAddress),
                    'Invalid shieldedReceives provided'
                )
            })

            it('should throw if toAmount is not a string', async function (){
                const invalidToAmount = 10;
                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, burnShieldedReceives, transParentToAddress, invalidToAmount, shieldedAddress),
                    'Invalid toAmount provided'
                )
            })

            it('should throw if transparentToAddress is not an address', async function (){
                const invalidTransparentToAddress = transParentToAddress.slice(0, 10);
                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, burnShieldedReceives, invalidTransparentToAddress, toAmount, shieldedAddress),
                    'Invalid transparentToAddress address provided'
                )
            })

            it('should throw if shieldedTRC20ContractAddress is not an address', async function (){
                const invalidShieldedTRC20ContractAddress = shieldedAddress.slice(0, 10);
                await assertThrow(
                    tronWeb.ztron.createBurnParamsWithoutAsk(shieldedInfo.ak, shieldedInfo.nsk, shieldedInfo.ovk,
                        shieldedSpends, burnShieldedReceives, transParentToAddress, toAmount, invalidShieldedTRC20ContractAddress),
                    'Invalid shieldedTRC20ContractAddress address provided'
                )
            })
        })

        describe("#createSpendAuthSig Burn", async function (){
            let txHash;
            let alpha;
            before(async () => {
                txHash = burnParamsResult.message_hash;
                alpha = (await tronWeb.ztron.getRcm()).value;
            })
            it('should get a value with txHash', async function (){
                const rcmInfo = await tronWeb.ztron.getRcm();
                const result = await tronWeb.ztron.createSpendAuthSig(shieldedInfo.ask, txHash, rcmInfo.value);
                assert.ok(result && result.value);
                spendAuthoritySignature = result.value;
            })
        })

        describe("#getTriggerInputForShieldedTRC20Contract Burn", function (){
            it('it should return transfer trigger_contract_input value', async function (){
                const shieldedTRC20Parameters = Object.assign({}, burnParamsResult);
                const spendAuthoritySignatureArray = [{
                    value: spendAuthoritySignature
                }];
                const options = {
                    amount: toAmount,
                    transparent_to_address: transParentToAddress,
                    visible: true
                }
                const result = await tronWeb.ztron.getTriggerInputForShieldedTRC20Contract(shieldedTRC20Parameters, spendAuthoritySignatureArray, options);
                assert.ok(result && result.value)
                burnTriggerContractInput = result.value;
            })
        })

    })

    describe("#isShieldedTRC20ContractNoteSpent", function (){
        let spendNote, pendingNote;

        before(async () => {
            spendNote = shieldedSpends[0].note;
            pendingNote = noteTxs[noteTxs.length - 1]
        })

        it('should return is_spent is true, The ak is an object', async function (){
            const params = {
                note: spendNote,
                ak: shieldedInfo.ak,
                nk: shieldedInfo.nk,
                position: shieldedSpends[0].pos,
                shielded_TRC20_contract_address: shieldedAddress
            }
            const result = await tronWeb.ztron.isShieldedTRC20ContractNoteSpent(params);
            assert.ok(result && result.is_spent);
        });

        it('should return is_spent is true, The parameters are expanded', async function (){
            const result = await tronWeb.ztron.isShieldedTRC20ContractNoteSpent(shieldedInfo.ak, shieldedInfo.nk, spendNote, shieldedSpends[0].pos, shieldedAddress);
            assert.ok(result && result.is_spent);
        });

        it('should return is_spent is false', async function (){
            const params = {
                note: pendingNote.note,
                ak: shieldedInfo.ak,
                nk: shieldedInfo.nk,
                position: pendingNote.position,
                shielded_TRC20_contract_address: shieldedAddress
            }
            const result = await tronWeb.ztron.isShieldedTRC20ContractNoteSpent(params);
            console.log("true:", result);
            assert.ok(result && !result.is_spent);
        })

        it('should throw if ak|nk is not a string', async function (){
            const invalidAk = 1111;
            const invalidNk = 1111;
            await assertThrow(
                tronWeb.ztron.isShieldedTRC20ContractNoteSpent(invalidAk, shieldedInfo.nk, spendNote, shieldedSpends[0].pos, shieldedAddress),
                'Invalid ak provided'
            )

            await assertThrow(
                tronWeb.ztron.isShieldedTRC20ContractNoteSpent(shieldedInfo.ak, invalidNk, spendNote, shieldedSpends[0].pos, shieldedAddress),
                'Invalid nk provided'
            )
        })

        it('should throw if note is not an object', async function (){
            const invalidNote = []
            await assertThrow(
                tronWeb.ztron.isShieldedTRC20ContractNoteSpent(shieldedInfo.ak, shieldedInfo.nk, invalidNote, shieldedSpends[0].pos, shieldedAddress),
                'Invalid note provided'
            )
        })

        it('should throw if position is not an integer', async function (){
            const invalidPosition = "1"
            await assertThrow(
                tronWeb.ztron.isShieldedTRC20ContractNoteSpent(shieldedInfo.ak, shieldedInfo.nk, spendNote, invalidPosition, shieldedAddress),
                'Invalid position provided'
            )
        })

        it('should throw if shieldedTRC20ContractAddress is not an address', async  function (){
            const invalidShieldedTRC20ContractAddress = shieldedAddress.slice(0, 10);
            await assertThrow(
                tronWeb.ztron.isShieldedTRC20ContractNoteSpent(shieldedInfo.ak, shieldedInfo.nk, spendNote, shieldedSpends[0].pos, invalidShieldedTRC20ContractAddress),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
        })
    })

    describe("redjubjub tool", function (){
        it('should all passed.', function (){
            const keys = tronWeb.ztron.generate_keys();
            assert.ok(keys.sk && keys.ask && keys.nsk && keys.ovk && keys.ak && keys.nk && keys.ivk && keys.d && keys.pk_d && keys.payment_address)

            const keysBySk = tronWeb.ztron.generate_keys_by_sk(keys.sk)
            assert.ok(keysBySk.sk && keysBySk.ask && keysBySk.nsk && keysBySk.ovk && keysBySk.ak && keysBySk.nk
                && keysBySk.ivk && keysBySk.d && keysBySk.pk_d && keysBySk.payment_address)

            const keysByskd = tronWeb.ztron.generate_keys_by_sk_d(keys.sk, keysBySk.d)
            assert.ok(keysByskd.sk && keysByskd.ask && keysByskd.nsk && keysByskd.ovk && keysByskd.ak && keysByskd.nk
                && keysByskd.ivk && keysByskd.d && keysByskd.pk_d && keysByskd.payment_address)

            const rk_by_ask = tronWeb.ztron.generate_rk_by_ask(keys.ask, '2608999c3a97d005a879ecdaa16fd29ae434fb67b177c5e875b0c829e6a1db05')
            assert.ok(rk_by_ask)

            const spend_auth_sign = tronWeb.ztron.generate_spend_auth_sig(keys.ask, '2608999c3a97d005a879ecdaa16fd29ae434fb67b177c5e875b0c829e6a1db05', '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502')
            assert.ok(spend_auth_sign)

            const  verifySpendAuthSig = tronWeb.ztron.verify_spend_auth_sig(rk_by_ask, '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502', spend_auth_sign)
            assert.ok(verifySpendAuthSig === true)

            const generate_pk_by_sk = tronWeb.ztron.generate_pk_by_sk(keys.ask);
            assert.ok(generate_pk_by_sk)

            const generate_binding_sig = tronWeb.ztron.generate_binding_sig(keys.ask, '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502');
            assert.ok(generate_binding_sig)

            const verify_binding_sig = tronWeb.ztron.verify_binding_sig(generate_pk_by_sk, '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502', generate_binding_sig)
            assert.ok(verify_binding_sig === true)
        })
    })
})
