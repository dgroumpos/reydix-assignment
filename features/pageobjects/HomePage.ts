import BasePage from './BasePage';
import { CustomWorld } from './utility/World';
import { Event } from '../interfaces/Event';
import { expect } from 'chai';

export default class HomePage extends BasePage {

  constructor(world: CustomWorld) {
    super(world);
  }

  //Locators
  public readonly popularLink = $('//android.widget.TextView[@text="Popular in Kanto"]');
  public readonly kantoLocation = $('//android.widget.TextView[@text="Kanto"]');
  public readonly popularPokemonHeader = $('//android.widget.TextView[@text="Popular Pokemons"]');
  public readonly popularPokemonScrollView = $('//android.widget.TextView[@text="Popular Pokemons"]/following-sibling::android.view.View');

  //Getters
  get thisWeekImages() {
    return $$('//android.widget.TextView[@text="This week"]/following-sibling::android.view.View[1]//android.view.View[@content-desc]');
  }

  get popularPokemonImages() {
    return $$('//android.widget.TextView[@text="Popular Pokemons"]/following-sibling::android.view.View/android.widget.ImageView[@content-desc]');
  }

  get popularPokemonNames() {
    return $$('//android.widget.TextView[@text="Popular Pokemons"]/following-sibling::android.view.View/android.widget.TextView');
  }

  get connectButtons() {
    return $$('//android.widget.TextView[@text="Popular Pokemons"]/following-sibling::android.view.View/android.view.View/android.widget.Button');
  }

  get buttonStateTexts() {
    return $$('//android.widget.TextView[@text="Popular Pokemons"]/following-sibling::android.view.View/android.view.View/android.widget.TextView');
  }

  //Functions
  async homePageIsDisplayed() {
    await this.retryElementAction(this.kantoLocation, async () => {
      console.log('👀 Element is displayed');
    });
    expect(await this.kantoLocation.isDisplayed()).to.be.true;
  }

  async checkPopularEventDetails() {
    //Building the locators from the corresponding xpath in the home page and the text retrieved from scenarioContext
    let popularEventHeader = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.world.context.get<string>('eventHeader')}"]`);
    let popularEventDate = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.world.context.get<string>('eventDate')}"]`);
    let popularEventLocation = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.world.context.get<string>('eventLocation')}"]`);
    let popularEventImage = $(`//android.widget.ScrollView/android.view.View[1]/android.view.View[@content-desc="${this.world.context.get<string>('image')}"]`);

    expect(await popularEventHeader.isDisplayed()).to.be.true;
    expect(await popularEventDate.isDisplayed()).to.be.true;
    expect(await popularEventLocation.isDisplayed()).to.be.true;
    expect(await popularEventImage.isDisplayed()).to.be.true;
  }

  async getThisWeekPokemonInfo() {
    const events: Event[] = [];
    const baseImage = '//android.widget.TextView[@text="This week"]/following-sibling::android.view.View[1]//android.view.View[@content-desc]';

    await this.retryElementAction(this.thisWeekImages[0], async () => {
      console.log('👀 Waiting for first weekly image to be visible...');
    });
    const count = await this.thisWeekImages.length;

    if (count === 0)
      throw new Error('🔥 Unable to locate weekly events...')

    for (let i = 0; i < count; i++) {
      const eventImg = await $$(`${baseImage}`)[i];
      await this.swipeUpFromScreen();
      await this.swipeLeftOnElement(eventImg);
      const imageTitle = await $$(`${baseImage}//following-sibling::android.widget.TextView[1]`)[i];
      const imageDate = await $$(`${baseImage}//following-sibling::android.widget.TextView[2]`)[i];
      const imageLocation = await $$(`${baseImage}//following-sibling::android.widget.TextView[3]`)[i];

      events.push({
        eventHeader: await this.getElementText(imageTitle),
        eventDate: await this.getElementText(imageDate),
        eventLocation: await this.getElementText(imageLocation),
        image: await this.getElementAttribute(eventImg, 'content-desc')
      })
    }
    this.world.context.set('events', events);
  }

  async openWeeklyEvent(idx: number) {
    await this.retryElementAction(this.thisWeekImages[idx], async () => {
      console.log(`👀 Waiting for weekly image ${idx} to be visible...`);
    });
    await this.tapElement(this.thisWeekImages[idx]);
  }

}
