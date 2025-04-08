Feature: Popular in Kanto

  Scenario: Navigate to event and validate data
    Given Home page is displayed
    When I click on the Popular in Kanto link
    Then the event details page is displayed
    And the additional section is displayed
    When I store all the event details
    And I return to the Home page
    When Home page is displayed
    Then the popular event should match the event details


