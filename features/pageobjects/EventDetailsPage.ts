import BasePage from './BasePage';

export default class EventDetailsPage extends BasePage {

    //Locators
    public readonly eventDetailsHeader = $('//android.widget.TextView[@text="Event Details"]');
    public readonly eventHeader = $('//android.widget.ScrollView//android.widget.TextView[1]');
    public readonly eventDate = $('//android.widget.ScrollView//android.widget.TextView[2]');
    public readonly eventLocation = $('//android.widget.ScrollView//android.widget.TextView[3]');
    public readonly image = $('//android.widget.ImageView');
    public readonly battlesSection = $('//android.widget.ScrollView//android.widget.TextView[4]');
    public readonly backToHomeIcon = $('android.widget.Button');
}

