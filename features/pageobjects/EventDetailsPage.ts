import BasePage from './BasePage';
import { CustomWorld } from './utility/World';
import { Event } from '../interfaces/Event';
import { expect } from 'chai';

export default class EventDetailsPage extends BasePage {

      constructor(world: CustomWorld) {
        super(world);
      }

    //Locators
    public readonly eventDetailsHeader = $('//android.widget.TextView[@text="Event Details"]');
    public readonly eventHeader = $('//android.widget.ScrollView//android.widget.TextView[1]');
    public readonly eventDate = $('//android.widget.ScrollView//android.widget.TextView[2]');
    public readonly eventLocation = $('//android.widget.ScrollView//android.widget.TextView[3]');
    public readonly image = $('//android.widget.ImageView');
    public readonly battlesSection = $('//android.widget.ScrollView//android.widget.TextView[4]');
    public readonly backToHomeIcon = $('android.widget.Button');

    //Functions
    async verifyEventDetails(idx: number){
        const eventData: Event = this.world.context.get<Event[]>('events')[idx];
        const headerText: string = await this.getElementText(this.eventHeader);
        const locationText: string = await this.getElementText(this.eventLocation);
        const dateText: string = await this.getElementText(this.eventDate);
        const imageText: string = await this.getElementAttribute(this.image, 'content-desc');

        const cleanLocation = locationText.replace(/^Where:\s*/, '');
        const cleanDate = dateText.replace(/^When:\s*/, '');

        expect(headerText).to.equal(eventData.eventHeader);
        expect(cleanLocation).to.equal(eventData.eventLocation);
        expect(cleanDate).to.equal(eventData.eventDate);
        expect(imageText).to.equal(eventData.image);
    }
}

