import BasePage from './BasePage';

class HomePage extends BasePage {

    //Locators
    public readonly popularLink = $('//android.widget.TextView[@text="Popular in Kanto"]');
    public readonly kantoLocation = $('//android.widget.TextView[@text="Kanto"]');
}

export default new HomePage();
