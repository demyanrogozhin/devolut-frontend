# Devolut frontend

React component for currencies exchange

## User story

Feature: exchange currencies

  Rule: user with some currency should be able exchange it to other currency

  Scenario Outline:
    Given user with <bchBegin> BCH in BCH wallet
    And user has <etcBegin> ETC in ETC wallet
    And exchange rate is <rate>: one BCH exchanged for <rate> ETC
    When user inputs <bchSent> in first input field
    And presses "Exchange" button
    Then BCH wallet now has <bchEnd> BCH
    And ETC wallet has <etcEnd> ETC

    Examples:
      |   bchBegin |   etcBegin |    rate |    bchSent |     bchEnd |     etcEnd |
      |     100.00 |       0.00 |    0.25 |      50.00 |      50.00 |      12.50 |
      |       1.00 |        0.1 |    0.20 |       0.10 |       0.90 |       0.12 |
      |      13.00 |       1.42 |     1.2 |      12.99 |       0.01 |      17.00 |
      |       2.00 |       0.30 |      50 |       2.00 |       0.00 |     100.30 |
      |    9000.30 |       0.20 |       1 |       0.30 |    9000.00 |       0.50 |
      |    2000.00 |       0.00 |  0.9112 |      16.35 |    1983.65 |      14.89 |

Feature: actual rates

  Rule: user should see actual exchange rates

  Scenario Outline:
    Given user with some amount of <CurrencyA> in <CurrencyA> wallet
    And echange rate from <CurrencyA> to <CurrencyB> is <rate>
    When user select <CurrencyA> in send selector
    And user select <CurrencyB> in receive selector
    Then rate should contain text "<rate> <CurrencyB> per <CurrencyA>"

    Examples:
      |  CurrencyA | CurrencyB  |    rate |
      |        BCH |        ETC |    4.00 |
      |        ETC |        BCH |    0.25 |

Feature: specify received amount

  Rule: user shold be able specify received amount

  Scenario Outline:
    Given user with 20 BCH in BCH wallet
    And exchange rate 0.1 BCH per ETC
    And BCH is selected send selector
    And send input is empty
    When user type 100 in receive input
    And user selected ETC in receive selector
    Then send input should have value 10.00
    And send input should not have error

Feature: amount validation

  Rule: user sholdn't be able exchange more than have

  Scenario Outline:
    Given user with 1 BCH in BCH wallet
    And exchange rate 0.1 BCH per ETC
    And BCH is selected send selector
    And receive input is empty
    When user type 11 in send input
    Then receive input is empty
    And send input should have value 11
    And send input should have error

Feature: select wallet

  Rule: user should select wallet for exchange

  Scenario Outline:
    Given user has 1.11 BCH in BCH wallet
    And user has 2.22 ETC in ETC wallet
    And user has 3.33 XRP in XRP wallet
    When user click on send selector
    Then currency list is visible
    And currency list has 3 items
    And currency list has list item with text contains "1.11" and "BCH"
    And currency list has list item with text contains "2.22" and "ETC"
    And currency list has list item with text contains "3.33" and "XRP"
