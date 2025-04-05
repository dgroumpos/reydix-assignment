import BasePage from './BasePage';

class EventDetailsPage extends BasePage {

    //Locators
    public readonly eventDetailsHeader = $('//android.widget.TextView[@text="Event Details"]');
}

export default new EventDetailsPage();
