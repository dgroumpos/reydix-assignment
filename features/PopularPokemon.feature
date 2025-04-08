Feature: Popular Pokemon

    Scenario: Connect with all the available pokemon
        Given Home page is displayed
        When The user scrolls to Popular Pokemon section
        And The user connects with all the pokemon

    Scenario: Test connect / disconnect functionality
        Given Home page is displayed
        When The user scrolls to Popular Pokemon section
        And The user connects with the first pokemon
        Then The state changes to "DISCONNECT"
        When The user disconnects from the first pokemon
        Then The state changes to "CONNECT"