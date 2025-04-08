import { Given, Then, When } from '@wdio/cucumber-framework';
import { CustomWorld } from '../pageobjects/utility/World';
import { getHomePage, getEventDetailsPage } from '../pageobjects/utility/PageFactory';
import { expect } from 'chai';

Given('Home page is displayed', async function (this: CustomWorld) {
    const homePage = getHomePage(this);
    await homePage.homePageIsDisplayed();
});

When('I click on the Popular in Kanto link', async function (this: CustomWorld) {
    const homePage = getHomePage(this);
    await homePage.tapElement(homePage.popularLink);
});

Then('the event details page is displayed', async function (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    await eventDetailsPage.retryElementAction(eventDetailsPage.eventDetailsHeader, async () => {
        console.log('👀 Waiting for element to be displayed');
    });
    expect(await eventDetailsPage.eventDetailsHeader.isDisplayed()).to.equal(true);
});

Then('the additional section is displayed', async function (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    expect(await eventDetailsPage.battlesSection.isDisplayed()).to.equal(true);
});

When('I store all the event details', async function (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    await eventDetailsPage.storeEventDetails();
});

Then('I return to the Home page', async function (this: CustomWorld) {
    const eventDetailsPage = getEventDetailsPage(this);
    await eventDetailsPage.tapElement(eventDetailsPage.backToHomeIcon);
});

Then('the popular event should match the event details', async function (this: CustomWorld) {
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

When('The user scrolls to Popular Pokemon section', async function (this: CustomWorld) {
    const homePage = getHomePage(this);
    await homePage.swipeUntilVisible(() => homePage.popularPokemonHeader);
});

When("The user connects with all the pokemon", async function (this: CustomWorld) {
    const homePage = getHomePage(this);
    let shouldKeepScrolling = true;
    let namesList: string[] = [];
    while (shouldKeepScrolling) {
        for (let i = 0; i < await homePage.connectButtons.length; i++) {
            let state = await homePage.getElementText(homePage.buttonStateTexts[i]);
            if (state === 'CONNECT') {
                let name = await homePage.getElementText(homePage.popularPokemonNames[i]);

                if (!namesList.includes(name)) {
                    namesList.push(name);
                    await homePage.tapElement(homePage.connectButtons[i])
                    await driver.pause(1000);
                }
                console.log(`---CONNECTED WITH POKEMON NAME: ${name} ---`);
                expect(await homePage.getElementText(homePage.buttonStateTexts[i])).to.equal('DISCONNECT');
            }
            await homePage.swipeLeftOnElement(homePage.popularPokemonImages[i], 2);
        }
        if (await homePage.getElementText(homePage.buttonStateTexts[await homePage.connectButtons.length - 1]) === 'DISCONNECT')
            shouldKeepScrolling = false;
    }
});

When(/^The user (connects with|disconnects from) the first pokemon$/, async function (this: CustomWorld, action: string) {
    const homePage = getHomePage(this);
    await homePage.tapElement(homePage.connectButtons[0]);
});

Then(/^The state changes to "(CONNECT|DISCONNECT)"$/, async function (this: CustomWorld,expectedState: string) {
    const homePage = getHomePage(this);
    const state = await homePage.getElementText(homePage.buttonStateTexts[0]);
    expect(state).to.equal(expectedState);
  });


