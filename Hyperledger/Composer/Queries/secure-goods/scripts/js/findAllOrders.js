/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Ignore the specified global functions (or the code won't lint)
/* global getParticipantRegistry getAssetRegistry getFactory emit query */

query();

/**
 * The program mainline
 */
async function query() {
    // Catch any exceptions and exit if any are thrown
    try {
        // Get the Composer client API BusinessConnection
        const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
        const bnc = new BusinessNetworkConnection();

        // Get the required parameters and exit if all not present
        const { authIdCard } = checkRequiredParameters();

        // Connect to the business network
        await bnc.connect(authIdCard);

        // Get the factory
        const factory = bnc.getBusinessNetwork().getFactory();

        // Build the query
        const query = await bnc.buildQuery('SELECT com.makotogo.learn.composer.securegoods.asset.Order');

        // Submit the query
        const results = await bnc.query(query);
        console.log(results.length + ' Order(s) found.');

        // Process the results
        results.forEach(record => {
            console.log('Order ID: ' + record.id);
            console.log('\tOrder Status: ' + record.status);
            console.log('\tQuantity: ' + record.quantity);
            console.log('\tItem: ' + record.item.$identifier);
            console.log('\tSeller: ' + record.seller.$identifier);
            console.log('\tBuyer: ' + record.buyer.$identifier);
            console.log('\tShipper: ' + record.shipper.$identifier);
        });

        // Disconnect so Node can exit
        await bnc.disconnect();
    } catch (err) {
        console.log('Error occurred: ' + err.message + ', Node process exiting.');
        process.exit(1);
    }
}

/**
 * Check for the required parameters.
 * If they are all found, this function returns them in
 * an object. If not, process.exit() is called to bail
 * out, since there's no point in continuing.
 */
function checkRequiredParameters() {
    // The ID card used for authentication
    const authIdCard = process.env.AUTH_ID_CARD;
    if (authIdCard === null) {
        console.log('ID card must be specified, cannot continue!');
        process.exit(1);
    }

    return { authIdCard };
}