# Analysis Phase

## Overview

The analysis phase of the World Population Dashboard project was completed by our team through a series of discussions and meetings. During this phase, we discussed the problem we wanted to solve, identified the intended users of the system, agreed on the major features, and documented the requirements for the project.

The findings from this phase were documented in the Project Requirements Document (PRD), which was presented to our lecturer as part of the Software Development Life Cycle (SDLC). The PRD was used as the main reference for the design and implementation of the dashboard.

## Problem Summary

From our analysis, we discovered that users who need world population information may have to visit different websites before getting the information they need. This can make it difficult to quickly search for countries, compare population information, and understand population statistics.

To address this problem, our team developed a World Population Dashboard that brings country and population information together in one place. The dashboard allows users to search for countries, filter countries by continent, compare countries, view population rankings, and visualize population statistics using charts.

## Target Users

Based on our analysis, the system is mainly intended for:

- Students carrying out assignments and research.
- Lecturers preparing teaching materials and classroom demonstrations.
- Researchers studying population and demographic information.
- Journalists who need quick access to population statistics.
- Other users who need simple and accessible population information.

## Key Functional Requirements

Based on the approved PRD and the features implemented during development, the dashboard provides the following core functions:

- Display the total population of the project countries.
- Display the total number of project countries.
- Search for a country using the country search field.
- Provide country suggestions while the user is typing.
- Display search results only after the user confirms the search.
- Display an error message when a country cannot be found.
- Automatically identify the continent of a searched country.
- Filter population information by continent.
- Display population, area, region and population density information.
- Display the Top 10 most populous countries.
- Display the Top 10 least populous countries.
- Filter the population rankings by continent.
- Display population by geographic region using a chart.
- Compare two countries using population, area and population density.
- Display charts using Chart.js.
- Provide animated population numbers.
- Provide light and dark themes.
- Provide smooth navigation between dashboard sections.
- Provide a responsive interface for desktop, tablet and mobile devices.

## Data and API Requirements

The dashboard uses the REST Countries API to obtain country information and population data.

The main information used by the system includes:

- Country name
- Population
- Area
- Region
- Continent
- Country classification

The API data is first loaded into the dashboard and stored temporarily in the browser using localStorage. This reduces unnecessary API requests while the user is working with the dashboard.

The cached data is used for 24 hours before the dashboard requests fresh data from the API.

The current REST Countries API uses version 5 and provides country records through a paginated countries endpoint. The API supports authentication using a bearer token. :contentReference[oaicite:0]{index=0}

## Outcome of the Analysis Phase

By the end of the analysis phase, our team was able to:

- Understand the problem the project is intended to solve.
- Identify the major users of the system.
- Define the main system requirements.
- Develop user stories and acceptance criteria.
- Identify the main dashboard features.
- Select the technologies to be used.
- Prepare and present the Project Requirements Document.
- Define the data required from the REST Countries API.

With the analysis phase completed, the project moved into the design and implementation stages.

## Note

This document provides a summary of the analysis carried out by the team. The complete requirements, user stories, acceptance criteria and other project details are available in the approved Project Requirements Document (PRD).