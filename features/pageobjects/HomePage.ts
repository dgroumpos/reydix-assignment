import BasePage from './BasePage';
import { CustomWorld } from './utility/World';

export default class HomePage extends BasePage {

    constructor(world: CustomWorld) {
        super(world);
    }

    //Locators
    public readonly popularLink = $('//android.widget.TextView[@text="Popular in Kanto"]');
    public readonly kantoLocation = $('//android.widget.TextView[@text="Kanto"]');
    public readonly thisWeekImages = $$('//android.widget.TextView[@text="This week"]/following-sibling::android.view.View[1]//android.view.View[@content-desc]');

    //Functions
    async getThisWeekPokemonInfo() {
        const events = [];
        for (let i = 0; i < await this.thisWeekImages.length; i++) {
            let element = this.thisWeekImages[i];
            
            let eventHeaderText = await this.getElementText(element.$('/following-sibling::android.widget.TextView[1]'));
            let eventDateText = await this.getElementText(element.$('/following-sibling::android.widget.TextView[2]'));
            let eventLocationText = await this.getElementText(element.$('/following-sibling::android.widget.TextView[3]'));
            let imageText = await this.getElementAttribute(element, 'content-desc');

            events.push({
                eventHeader: eventHeaderText,
                eventDate: eventDateText,
                eventLocation: eventLocationText,
                image: imageText
            });
        }
    }
    
}
