Feature: Popular Pokemon

  Scenario: Test connect - disconnect functionality
    Given Home page is displayed
    When The user scrolls to Popular Pokemon section
    And the user "connects" with all the pokemon
    Then all the button texts are set to status "DISCONNECT"
    When the user "disconnects" from all the pokemon
    Then all the button texts are set to status "CONNECT"