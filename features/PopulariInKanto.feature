Feature: Popular in Kanto

  Scenario: Navigate to event and validate data
    Given the app is launched
    And the Popular in Kanto element is displayed
    When I store all the event details
    And I click on the event
    Then the event details page is displayed
    And the correct event details are displayed
    And the additional sections are displayed

    
