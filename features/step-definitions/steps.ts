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
    await eventDetailsPage.storeEventDetails();
});

Then('I return to the Home page', async function (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    await eventDetailsPage.tapElement(eventDetailsPage.backToHomeIcon);
});

Then('the popular event should match the event details', async  function (this: CustomWorld) {
    const homePage = getHomePage(this);
    await homePage.checkPopularEventDetails();
});

When('I get the information for each event', async function (this: CustomWorld) {
    const homePage = getHomePage(this);
    await homePage.getThisWeekPokemonInfo();
});

Then('I verify the individual details pages', async function (this: CustomWorld) {
    const homePage = getHomePage(this);
    const eventDetailsPage = getEventDetailsPage(this);

    const count = await homePage.thisWeekImages.length

    for (let i = 0; i < count; i++) {
        await homePage.openWeeklyEvent(i);
        await eventDetailsPage.verifyEventDetails(i);
        await eventDetailsPage.tapElement(eventDetailsPage.backToHomeIcon);
    }
});


