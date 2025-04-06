import BasePage from './BasePage';
import { CustomWorld } from './utility/World';
import { Event } from '../interfaces/Event';

export default class HomePage extends BasePage {

  constructor(world: CustomWorld) {
    super(world);
  }

  //Locators
  public readonly popularLink = $('//android.widget.TextView[@text="Popular in Kanto"]');
  public readonly kantoLocation = $('//android.widget.TextView[@text="Kanto"]');

  get thisWeekImages() {
    return $$('//android.widget.TextView[@text="This week"]/following-sibling::android.view.View[1]//android.view.View[@content-desc]');
}


  //Functions
  async checkPopularEventDetails(){
        //Building the locators from the corresponding xpath in the home page and the text retrieved from scenarioContext
        let popularEventHeader = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.world.context.get<string>('eventHeader')}"]`);
        let popularEventDate = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.world.context.get<string>('eventDate')}"]`);
        let popularEventLocation = $(`//android.widget.ScrollView/android.view.View[1]//android.widget.TextView[@text="${this.world.context.get<string>('eventLocation')}"]`);
        let popularEventImage = $(`//android.widget.ScrollView/android.view.View[1]/android.view.View[@content-desc="${this.world.context.get<string>('image')}"]`);
        await this.elementDisplayed(popularEventHeader);
        await this.elementDisplayed(popularEventDate);
        await this.elementDisplayed(popularEventLocation);
        await this.elementDisplayed(popularEventImage);
  }

  async getThisWeekPokemonInfo() {
    const events: Event[] = [];
    const baseImage = '//android.widget.TextView[@text="This week"]/following-sibling::android.view.View[1]//android.view.View[@content-desc]';

    await this.elementDisplayed(this.thisWeekImages[0]);
    const count = await this.thisWeekImages.length;

    if (count === 0)
      throw new Error('🔥 Unable to locate weekly events...')

    for (let i = 0; i < count; i++) {
      const eventImg = await $$(`${baseImage}`)[i];
      await this.swipeUp(eventImg);
      await this.swipeElementLeft(eventImg);
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

  async openWeeklyEvent(idx : number){
    await this.elementDisplayed(this.thisWeekImages[idx]);
    await this.tapElement(this.thisWeekImages[idx]);
  }

}
