import BasePage from './BasePage';

class HomePage extends BasePage {

    //Locators
    public readonly popularLink = $('//android.widget.TextView[@text="Popular in Kanto"]');
}

export default new HomePage();
