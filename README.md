# Placements.io Coding Challenge by Joseph Cortez

## Installation
1. Make sure you have Rails installed locally (https://guides.rubyonrails.org/v5.0/getting_started.html)
2. Clone or fork this git repo locally
3. Run `bundle install` in your terminal (within your `placements_challenge` project directory).

## Running
1. Run `bundle exec rails server` in your terminal (within your `placements_challenge` project directory).
2. Go to `localhost:3000` in your browser to view the invoice

## Implementation

In the web-app you will see the features from bucket 1 and bucket 2 implemented and explained below.

Bucket 1:
- The user should be able to browse through the line-item data as either a list or table (ie. pagination or infinite-scrolling).
    - I decided to display he line-item data through an infinite scrolling table, where it displays 50 items to start with, and then loads more as you scroll.

- The user should be able to see each line-item's billable amount(sub-total = actuals + adjustments).
    - The last column in the table displays the sub-total.

- The user should be able to see the invoice grand-total (sum of each line-item's billable amount).
    - Underneath the table is a button to display the grand total, the reason it is a button is because the app load time is much faster, and the grand-total may be sensitive information.

- The user should be able to edit line-item 'adjustments'.
- The user should be able to flag individual line-items as "reviewed" (meaning they are disabled from further editing).
    - When you hover over a row in the table you will see that the table will be highlighted and a edit icon will appear. You can click on the icon where a form will pop up. Through this form you can edit the adjustments to any number, and you can decide to check if the item has been reviewed.
    - If it was checked as review, if you click to edit a different form will appear, where you cannot edit the adjustments.

- The user should be able to sort the data.
    - Hovering over the table column labels will allow you to click and sort the data based on the item data selected in either ascending or descending order. You can also select the clear button in the top right to reset the table.

Bucket 2:
- The user should be able to filter the data (ie. by campaign name, etc., should affect the grand-total)
    - In table header you can type in any string that you would like to filter by. Anything in the line-item data that contains that string will filter the data and only display those data points. You can also show the grand-total of the currently displayed data items. 