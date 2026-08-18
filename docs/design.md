# Design Phase

## Overview

The design phase focuses on planning how the World Population Dashboard will be arranged and how users will interact with its main features. The design was based on the requirements identified during the analysis phase and the approved Project Requirements Document (PRD).

The dashboard was designed as a simple, responsive and interactive web application. The interface was arranged to allow users to quickly view population information, search for countries, filter results, compare countries and view population charts.

## Dashboard Layout

The dashboard contains the following main sections:

- Header and project title
- Dashboard navigation
- Global population overview
- Country search
- Continent filter
- Explore results
- Population statistics chart
- Population rankings
- Population by region
- Country comparison
- Footer

The dashboard uses a sidebar navigation on larger screens. The sidebar contains links for the main dashboard sections and the country search and continent filter.

The main content area contains the global overview, exploration results, population rankings, regional chart and country comparison sections.

## User Interface

The interface uses a card-based dashboard layout so that related information is grouped together.

The Global Overview displays:

- Global Population
- Total Countries
- Selected Continent

The Explore section displays the population information for the current selection and provides visual comparison of population, area and population density.

The ranking section displays the Top 10 most populous and Top 10 least populous countries. A separate continent selector is provided for the ranking section so that the ranking filter does not affect the Explore section.

The comparison section allows the user to select two countries and compare their population, area and population density.

## Search and Filter Design

The country search field provides suggestions while the user types.

The user must press Enter to confirm the search before the country information is displayed.

When a valid country is found, the dashboard automatically identifies and selects the country's continent.

The continent filter can also be used directly without searching for a country.

When All Continents is selected, the Explore section displays the overall population, total countries, total area and overall population density.

## Charts

Chart.js is used for the dashboard visualizations.

The dashboard contains three main chart areas:

1. Explore Chart
2. Population by Region Chart
3. Country Comparison Chart

The Explore Chart displays:

- Population
- Area
- Population Density

The chart changes according to the current Explore selection.

The Population by Region chart shows the population totals for each geographic region.

The Country Comparison chart displays the selected countries and compares their population, area and population density.

The charts also include animations to make changes easier to notice when new data is displayed.

## Population Rankings

The ranking section contains two lists:

- Top 10 Most Populous Countries
- Top 10 Least Populous Countries

A separate continent dropdown is used for the ranking section.

Selecting a continent changes the ranking lists without changing the Explore Results section.

## Responsive Design

The dashboard was designed to work on desktop, tablet and mobile screens.

On larger screens:

- The navigation is displayed in a sidebar.
- The search and continent controls are available from the sidebar.
- Dashboard cards are arranged in columns.
- Charts use the available screen width.

On smaller screens:

- The navigation becomes a horizontal section.
- The dashboard sections are arranged vertically.
- Search and filter controls are moved into the normal page flow.
- Cards are stacked to make them easier to read.
- Charts resize to fit the available screen width.
- Country comparison cards are arranged vertically.

## Colour and Typography

The dashboard uses a simple blue-based colour scheme with light backgrounds and white cards.

The interface uses different levels of text size to separate:

- Section headings
- Card titles
- Main statistics
- Supporting information

The light theme uses a soft background effect to provide more visual separation between the dashboard cards.

A dark theme is also available and changes the background, cards, borders and text colours.

## API Data Mapping

The dashboard obtains its country data from the REST Countries API.

The main API information used by the system includes:

- Country name
- Population
- Area
- Region
- Continent
- Country classification

The country population is used for the global overview, population rankings and charts.

The area is used to calculate population density and for country comparison.

The continent information is used by the Explore filter and ranking filter.

The classification information is used to create the 195-country project dataset.

## Data Caching

The dashboard uses browser localStorage to temporarily store the country data.

The cache is kept for 24 hours.

If valid cached data exists, the dashboard uses the cached data instead of requesting the data again.

After 24 hours, the dashboard requests fresh data from the API and replaces the old cached data.

This reduces unnecessary API requests during normal use of the application.

## Technology

The dashboard was developed using:

- HTML5
- CSS3
- JavaScript
- REST Countries API
- Chart.js
- Browser localStorage

## Design Outcome

The final design provides a dashboard where users can view population information, search for countries, filter by continent, compare countries and analyze population information through charts and rankings.

The design also provides a responsive interface so that the dashboard can be used on desktop and mobile devices.

The completed design served as the basis for the implementation of the World Population Dashboard.