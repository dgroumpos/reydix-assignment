import { Given, Then, When } from '@wdio/cucumber-framework';
import allure from '@wdio/allure-reporter';
import HomePage from '../pageobjects/HomePage';
import EventDetailsPage from '../pageobjects/EventDetailsPage';
import { CustomWorld } from '../pageobjects/utility/world';

Given('Home page is displayed', async  () => {
    await HomePage.elementDisplayed(HomePage.kantoLocation);
});

When('I click on the Popular in Kanto link', async  () => {
    await allure.addStep('Display Popular in Kanto');
    await HomePage.tapElement(HomePage.popularLink);
});

Then('the event details page is displayed', async  () => {
    await allure.addStep('Event details page is displayed');
    await EventDetailsPage.elementDisplayed(EventDetailsPage.eventDetailsHeader);
});

Then('the additional section is displayed', async  () => {
    await allure.addStep('Additional section is displayed');
    await EventDetailsPage.elementDisplayed(EventDetailsPage.battlesSection);
});

When('I store all the event details', async function (this: CustomWorld) {
    const eventHeaderText = await EventDetailsPage.getElementText(EventDetailsPage.eventHeader);
    const eventDateText = await EventDetailsPage.getElementText(EventDetailsPage.eventDate);
    const eventLocationText = await EventDetailsPage.getElementText(EventDetailsPage.eventLocation);
    const imageText = await EventDetailsPage.getElementAttribute(EventDetailsPage.image, 'content-desc');
    this.context.set('eventHeader', eventHeaderText);
    this.context.set('eventDate', eventDateText.replace(/^When:\s*/, ''));
    this.context.set('eventLocation', eventLocationText.replace(/^Where:\s*/, ''));
    this.context.set('image', imageText);
});

Then('I return to the Home page', async  () => {
    await EventDetailsPage.tapElement(EventDetailsPage.backToHomeIcon);
});

Then('the popular event should match the event details', async  function (this: CustomWorld) {
    //Building the locators from the corresponding xpath in the home page and the text retrieved from scenarioContext
    let popularEventHeader = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.context.get<string>('eventHeader')}"]`);
    let popularEventDate = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.context.get<string>('eventDate')}"]`);
    let popularEventLocation = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.context.get<string>('eventLocation')}"]`);
    let popularEventImage = $(`//android.widget.ScrollView/android.view.View[1]/android.view.View[@content-desc="${this.context.get<string>('image')}"]`);
    await HomePage.elementDisplayed(popularEventHeader);
    await HomePage.elementDisplayed(popularEventDate);
    await HomePage.elementDisplayed(popularEventLocation);
    await HomePage.elementDisplayed(popularEventImage);
});


