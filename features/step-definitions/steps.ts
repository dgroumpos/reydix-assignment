import { Given, Then, When } from '@wdio/cucumber-framework';
import allure from '@wdio/allure-reporter';
import HomePage from '../pageobjects/HomePage';
import EventDetailsPage from '../pageobjects/EventDetailsPage';

Given('Home page is displayed', async  () => {
    await HomePage.elementDisplayed(HomePage.kantoLocation);
});

Given('I click on the Popular in Kanto link', async  () => {
    await allure.addStep('Display Popular in Kanto');
    await HomePage.tapElement(HomePage.popularLink);
});

Then('the event details page is displayed', async  () => {
    await allure.addStep('Event details page is displayed');
    await EventDetailsPage.elementDisplayed(EventDetailsPage.eventDetailsHeader);
});

When('I store all the event details', async  () => {
    await driver.pause(5000);
});



