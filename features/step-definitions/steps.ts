import { Given, Then, When } from '@wdio/cucumber-framework';
import allure from '@wdio/allure-reporter';
import HomePage from '../pageobjects/HomePage';

Given('the app is launched', async () => {
    await allure.addStep('Launching the Pokémon Events app');
    await driver.pause(2000);
});

Then('the Popular in Kanto element is displayed', async  () => {
    await allure.addStep('Display Popular in Kanto');
    await HomePage.tapElement(HomePage.popularLink);
});

When('I store all the event details', async  () => {
    await driver.pause(5000);
});

Then('I close the app', async  () => {
    await driver.execute('mobile: terminateApp', { appId: 'dev.raschke.pokevent' });
});

