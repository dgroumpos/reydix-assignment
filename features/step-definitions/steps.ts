import { Given, Then } from '@wdio/cucumber-framework';
import allure from '@wdio/allure-reporter';

Given('the app is launched', async () => {
    await allure.addStep('Launching the Pokémon Events app');
    await driver.pause(2000); // Wait for app to load
});

Then('I close the app', async function () {
    await driver.execute('mobile: terminateApp', { appId: 'dev.raschke.pokevent' });
});



