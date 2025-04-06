import { Given, Then, When } from '@wdio/cucumber-framework';
import { CustomWorld } from '../pageobjects/utility/World';
import { getHomePage, getEventDetailsPage } from '../pageobjects/utility/PageFactory';

Given('Home page is displayed', async function  (this: CustomWorld) {
    const homePage = getHomePage(this);
    await homePage.elementDisplayed(homePage.kantoLocation);
});

When('I click on the Popular in Kanto link', async function  (this: CustomWorld) {
    const homePage = getHomePage(this);
    await homePage.tapElement(homePage.popularLink);
});

Then('the event details page is displayed', async function  (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    await eventDetailsPage.elementDisplayed(eventDetailsPage.eventDetailsHeader);
});

Then('the additional section is displayed', async function  (this:CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    await eventDetailsPage.elementDisplayed(eventDetailsPage.battlesSection);
});

When('I store all the event details', async function (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    const eventHeaderText = await eventDetailsPage.getElementText(eventDetailsPage.eventHeader);
    const eventDateText = await eventDetailsPage.getElementText(eventDetailsPage.eventDate);
    const eventLocationText = await eventDetailsPage.getElementText(eventDetailsPage.eventLocation);
    const imageText = await eventDetailsPage.getElementAttribute(eventDetailsPage.image, 'content-desc');
    this.context.set('eventHeader', eventHeaderText);
    this.context.set('eventDate', eventDateText.replace(/^When:\s*/, ''));
    this.context.set('eventLocation', eventLocationText.replace(/^Where:\s*/, ''));
    this.context.set('image', imageText);
});

Then('I return to the Home page', async function (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    await eventDetailsPage.tapElement(eventDetailsPage.backToHomeIcon);
});

Then('the popular event should match the event details', async  function (this: CustomWorld) {
    const homePage = getHomePage(this);
    //Building the locators from the corresponding xpath in the home page and the text retrieved from scenarioContext
    let popularEventHeader = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.context.get<string>('eventHeader')}"]`);
    let popularEventDate = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.context.get<string>('eventDate')}"]`);
    let popularEventLocation = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.context.get<string>('eventLocation')}"]`);
    let popularEventImage = $(`//android.widget.ScrollView/android.view.View[1]/android.view.View[@content-desc="${this.context.get<string>('image')}"]`);
    await homePage.elementDisplayed(popularEventHeader);
    await homePage.elementDisplayed(popularEventDate);
    await homePage.elementDisplayed(popularEventLocation);
    await homePage.elementDisplayed(popularEventImage);
});


