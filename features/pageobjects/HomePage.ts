import BasePage from './BasePage';

class LoginPage extends BasePage {

    //Locators
    public readonly popularLink = $('//android.widget.TextView[@text="Popular in Kanto"]');
}

export default new LoginPage();
