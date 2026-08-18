const API_KEY = "rc_live_321945d2bb314663bc9918e97ffac14e";
const API_URL = "https://api.restcountries.com/countries/v5";
let countries = [];
let projectCountries = [];
let regionChart = null;
let exploreChart = null;
let comparisonChart = null;
let selectedCountry = null;
const chartAnimation = {
    duration: 1800,
    easing: "easeOutCubic"
};
/*For the Chart Numbers*/
function formatChartNumber(value) {
    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return Number(value).toLocaleString();
}
/*Fetching Country Data From API*/
async function fetchCountries() {
    const CACHE_KEY = "worldPopulationCountries";
    const CACHE_TIME_KEY = "worldPopulationCountriesTime";
    const CACHE_DURATION = 24 * 60 * 60 * 1000;
    try {
        const cachedCountries =
            localStorage.getItem(CACHE_KEY);
        const cachedTime =
            localStorage.getItem(CACHE_TIME_KEY);
        const cacheIsValid =
            cachedCountries &&
            cachedTime &&
            (
                Date.now() -
                Number(cachedTime)
                < CACHE_DURATION
            );
/*Using Cached Data*/
if (cacheIsValid) {
    countries =
        JSON.parse(cachedCountries);
    console.log(
        "Using cached country data."
    );
} else {
/*Fetching From API*/
const limit = 100;
let offset = 0;
let allCountries = [];
let more = true;
while (more) {
    const response = await fetch(
        `${API_URL}?limit=${limit}&offset=${offset}`,
        {
            headers: {
                "Authorization":
                    `Bearer ${API_KEY}`
            }
        }
    );
    if (!response.ok) {
        throw new Error(
            `HTTP error: ${response.status}`
        );
    }
    const result =
        await response.json();
    const page =
        result.data.objects;
    allCountries =
        allCountries.concat(page);
    more =
        result.data.meta.more;
    offset += limit;
}
countries = allCountries;
/*Using cache for 24 hr*/
localStorage.setItem(
    CACHE_KEY,
    JSON.stringify(countries)
);
localStorage.setItem(
    CACHE_TIME_KEY,
    Date.now().toString()
);
console.log(
    "Fresh country data fetched from API."
);
}
/*Project Dataset*/
projectCountries =
    countries.filter(country =>
        country.classification?.un_member === true ||
        country.classification?.un_observer === true
    );
console.log(
    "Countries available:",
    countries.length
);
console.log(
    "Project countries:",
    projectCountries.length
);
initializeDashboard();
} catch (error) {
console.error(
    "Failed to fetch country data:",
    error
);
}
}
/*initializing The Dashboard*/
function initializeDashboard() {
    updateGlobalSummary();
    createRegionChart();
    initializeExploreState();
    setupCountrySearch();
    setupContinentFilter();
    setupCountryComparison();
    setupRankingFilter();
    setupNavigation();
    setupThemeToggle();
    displayPopulationRankings();
    updateRankingTitles();
}
/*Global Overview*/
function updateGlobalSummary() {
    const globalPopulation =
        projectCountries.reduce(
            (total, country) =>
                total + (country.population || 0),
            0
        );
    const totalCountries =
        projectCountries.length;
    const populationElement =
        document.getElementById(
            "total-population"
        );
    const countriesElement =
        document.getElementById(
            "total-countries"
        );
    if (populationElement) {
        animateNumber(
            populationElement,
            globalPopulation
        );
    }
    if (countriesElement) {
        animateNumber(
            countriesElement,
            totalCountries
        );
    }
}
/*Explore: Select Continent*/
function getSelectedContinent() {
    const continentSelect =
        document.getElementById(
            "continent-select"
        );
    if (!continentSelect) {
        return "all";
    }
    return continentSelect.value || "all";
}
/*Explore: Filter Country*/
function getFilteredCountries() {
    const selectedContinent =
        getSelectedContinent();
    if (
        !selectedContinent ||
        selectedContinent === "all"
    ) {
        return projectCountries;
    }
    return projectCountries.filter(country =>
        country.continents?.includes(
            selectedContinent
        )
    );
}
/*Finding Countries*/
function findCountry(searchTerm) {
    const query =
        searchTerm.trim().toLowerCase();
    if (!query) {
        return null;
    }
    /* Exact match */
    const exactMatch =
        projectCountries.find(country =>
            country.names?.common
                ?.toLowerCase() === query
        );
    if (exactMatch) {
        return exactMatch;
    }
    /* Partial match */
    return projectCountries.find(country =>
        country.names?.common
            ?.toLowerCase()
            .includes(query)
    ) || null;
}
/*Population Density*/
function getPopulationDensity(country) {
    const population =
        country.population || 0;
    const area =
        country.area?.kilometers || 0;
    if (!area) {
        return null;
    }
    return population / area;
}

function initializeExploreState() {
    const continentSelect =
        document.getElementById(
            "continent-select"
        );
    if (continentSelect) {
        continentSelect.value = "all";
    }
    resetExploreResults();
}
/*Country Results*/
function displayCountryResults(country) {
    if (!country) {
        return;
    }
    selectedCountry = country;
    const continent =
        country.continents?.[0] ||
        "Unknown";
    const population =
        country.population || 0;
    const area =
        country.area?.kilometers || 0;
    const density =
        getPopulationDensity(country);
    const description =
        document.getElementById(
            "explore-results-description"
        );
    const populationLabel =
        document.getElementById(
            "explore-population-label"
        );
    const populationElement =
        document.getElementById(
            "explore-population"
        );
    const countriesLabel =
        document.getElementById(
            "explore-countries-label"
        );
    const countriesElement =
        document.getElementById(
            "explore-countries"
        );
    const selectionElement =
        document.getElementById(
            "explore-selection"
        );
    const statsElement =
        document.getElementById(
            "country-stats"
        );
    if (description) {
        description.textContent =
            `Population statistics for ${country.names.common}.`;
    }
    if (populationLabel) {
        populationLabel.textContent =
            "Population";
    }
    if (populationElement) {
        animateNumber(
            populationElement,
            population
        );
    }
    if (countriesLabel) {
        countriesLabel.textContent =
            "Continent";
    }
    if (countriesElement) {
        countriesElement.textContent =
            continent;
    }
    if (selectionElement) {
        selectionElement.textContent =
            country.names.common;
    }
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="statistics">
                <div class="stat-card">
                    <h3>Area</h3>
                    <p>
                        ${area.toLocaleString()} km²
                    </p>
                </div>
                <div class="stat-card">
                    <h3>Region</h3>
                    <p>
                        ${country.region || "Unknown"}
                    </p>
                </div>
                <div class="stat-card">
                    <h3>Population Density</h3>
                    <p>
                        ${
                            density === null
                                ? "Unavailable"
                                : `${density.toLocaleString(
                                    undefined,
                                    {
                                        maximumFractionDigits: 2
                                    }
                                )} people/km²`
                        }
                    </p>
                </div>
            </div>
        `;
    }
    updateExploreChartForCountry(country);
}
/*Continent Results*/
function displayContinentResults(continent) {
    const continentCountries =
        projectCountries.filter(country =>
            country.continents?.includes(
                continent
            )
        );
    const totalPopulation =
        continentCountries.reduce(
            (total, country) =>
                total + (country.population || 0),
            0
        );
    const totalArea =
        continentCountries.reduce(
            (total, country) =>
                total +
                (country.area?.kilometers || 0),
            0
        );
    const totalDensity =
        totalArea > 0
            ? totalPopulation / totalArea
            : 0;
    const description =
        document.getElementById(
            "explore-results-description"
        );
    const populationLabel =
        document.getElementById(
            "explore-population-label"
        );
    const populationElement =
        document.getElementById(
            "explore-population"
        );
    const countriesLabel =
        document.getElementById(
            "explore-countries-label"
        );
    const countriesElement =
        document.getElementById(
            "explore-countries"
        );
    const selectionElement =
        document.getElementById(
            "explore-selection"
        );
    const statsElement =
        document.getElementById(
            "country-stats"
        );
    if (description) {
        description.textContent =
            `Population statistics for ${continent}.`;
    }
    if (populationLabel) {
        populationLabel.textContent =
            "Population";
    }
    if (populationElement) {
        animateNumber(
            populationElement,
            totalPopulation
        );
    }
    if (countriesLabel) {
        countriesLabel.textContent =
            "Countries";
    }
    if (countriesElement) {
        animateNumber(
            countriesElement,
            continentCountries.length
        );
    }
    if (selectionElement) {
        selectionElement.textContent =
            continent;
    }
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="statistics">
                <div class="stat-card">
                    <h3>Total Area</h3>
                    <p>
                        ${totalArea.toLocaleString()} km²
                    </p>
                </div>
                <div class="stat-card">
                    <h3>Population Density</h3>
                    <p>
                        ${totalDensity.toLocaleString(
                            undefined,
                            {
                                maximumFractionDigits: 2
                            }
                        )} people/km²
                    </p>
                </div>
            </div>
        `;
    }
    selectedCountry = null;
    updateExploreChartForContinent(
        continent
    );
}
/*For Resetting Explore*/
function resetExploreResults() {
    const totalPopulation =
        projectCountries.reduce(
            (total, country) =>
                total + (country.population || 0),
            0
        );
    const totalCountries =
        projectCountries.length;
    const totalArea =
        projectCountries.reduce(
            (total, country) =>
                total +
                (country.area?.kilometers || 0),
            0
        );
    const overallDensity =
        totalArea > 0
            ? totalPopulation / totalArea
            : 0;
    const description =
        document.getElementById(
            "explore-results-description"
        );
    const populationElement =
        document.getElementById(
            "explore-population"
        );
    const countriesElement =
        document.getElementById(
            "explore-countries"
        );
    const selectionElement =
        document.getElementById(
            "explore-selection"
        );
    const statsElement =
        document.getElementById(
            "country-stats"
        );
    if (description) {
        description.textContent =
            "Population statistics for all continents.";
    }
    if (populationElement) {
        animateNumber(
            populationElement,
            totalPopulation
        );
    }
    if (countriesElement) {
        animateNumber(
            countriesElement,
            totalCountries
        );
    }
    if (selectionElement) {
        selectionElement.textContent =
            "All Continents";
    }
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="statistics">
                <div class="stat-card">
                    <h3>Total Area</h3>
                    <p>
                        ${totalArea.toLocaleString()} km²
                    </p>
                </div>
                <div class="stat-card">
                    <h3>Population Density</h3>
                    <p>
                        ${overallDensity.toLocaleString(
                            undefined,
                            {
                                maximumFractionDigits: 2
                            }
                        )} people/km²
                    </p>
                </div>
            </div>
        `;
    }
    createExploreChart();
}
/*For Searching Countries*/
function setupCountrySearch() {
    const searchInput =
        document.getElementById(
            "country-search"
        );
    const suggestionList =
        document.getElementById(
            "country-suggestions"
        );
    const errorElement =
        document.getElementById(
            "country-search-error"
        );
    if (!searchInput) {
        return;
    }
    /*Suggestions*/
    searchInput.addEventListener(
        "input",
        function () {
            const searchTerm =
                this.value.trim().toLowerCase();
            if (errorElement) {
                errorElement.textContent = "";
            }
            if (!suggestionList) {
                return;
            }
            suggestionList.innerHTML = "";
            if (!searchTerm) {
                return;
            }
            const matches =
                projectCountries
                    .filter(country =>
                        country.names?.common
                            ?.toLowerCase()
                            .includes(searchTerm)
                    )
                    .slice(0, 8);
            matches.forEach(country => {
                const option =
                    document.createElement(
                        "option"
                    );
                option.value =
                    country.names.common;
                suggestionList.appendChild(
                    option
                );
            });
        }
    );
    searchInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key !== "Enter") {
                return;
            }
            event.preventDefault();
            const searchTerm =
                this.value.trim();
            if (!searchTerm) {
                initializeExploreState();
                return;
            }
            const country =
                findCountry(searchTerm);
            if (!country) {
                if (errorElement) {
                    errorElement.textContent =
                        "Country not found. Please select a country from the suggestions.";
                }
                return;
            }
            if (errorElement) {
                errorElement.textContent = "";
            }
            const continent =
                country.continents?.[0];
            const continentSelect =
                document.getElementById(
                    "continent-select"
                );
            if (
                continent &&
                continentSelect
            ) {
                continentSelect.value =
                    continent;
            }
            displayCountryResults(
                country
            );
        }
    );
}
/*Coninent Selector*/
function setupContinentFilter() {
    const continentSelect =
        document.getElementById(
            "continent-select"
        );
    if (!continentSelect) {
        return;
    }
    continentSelect.addEventListener(
        "change",
        function () {
            const selected =
                this.value;
            selectedCountry = null;
            if (
                !selected ||
                selected === "all"
            ) {
                resetExploreResults();
            } else {
                displayContinentResults(
                    selected
                );
            }
        }
    );
}
/*Chart*/
function createExploreChart() {
    const chartCanvas =
        document.getElementById(
            "explore-chart"
        );
    if (
        !chartCanvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }
    const totalPopulation =
        projectCountries.reduce(
            (total, country) =>
                total + (country.population || 0),
            0
        );
    const totalArea =
        projectCountries.reduce(
            (total, country) =>
                total +
                (country.area?.kilometers || 0),
            0
        );
    const totalDensity =
        totalArea > 0
            ? totalPopulation / totalArea
            : 0;
    if (!exploreChart) {
        exploreChart =
            new Chart(
                chartCanvas,
                {
                    type: "bar",
                    data: {
                        labels: [
                            "Population",
                            "Total Area",
                            "Population Density"
                        ],
                        datasets: [
                            {
                                label:
                                    "Population",

                                data: [
                                    totalPopulation,
                                    null,
                                    null
                                ],
                                yAxisID:
                                    "population-axis"
                            },
                            {
                                label:
                                    "Area",
                                data: [
                                    null,
                                    totalArea,
                                    null
                                ],
                                yAxisID:
                                    "area-axis"
                            },
                            {
                                label:
                                    "Density",
                                data: [
                                    null,
                                    null,
                                    totalDensity
                                ],
                                yAxisID:
                                    "density-axis"
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation:
                            chartAnimation,
                        interaction: {
                            mode: "index",
                            intersect: false
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: "top",
                                labels: {
                                    padding: 20
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label:
                                        function(context) {
                                            if (
                                                context.raw === null ||
                                                context.raw === undefined
                                            ) {
                                                return;
                                            }
                                            return (
                                                context.dataset.label +
                                                ": " +
                                                Number(
                                                    context.raw
                                                ).toLocaleString()
                                            );
                                        }
                                }
                            }
                        },
                        scales: {
                            "population-axis": {
                                type: "linear",
                                position: "left",
                                beginAtZero: true,
                                weight: 3,
                                title: {
                                    display: true,
                                    text: "Population"
                                },
                                ticks: {
                                    callback:
                                        function(value) {
                                            return formatChartNumber(
                                                value
                                            );
                                        }
                                }
                            },
                            "area-axis": {
                                type: "linear",
                                position: "right",
                                beginAtZero: true,
                                weight: 2,
                                grid: {
                                    drawOnChartArea:
                                        false
                                },
                                title: {
                                    display: true,
                                    text: "Area (km²)"
                                },
                                ticks: {
                                    callback:
                                        function(value) {
                                            return formatChartNumber(
                                                value
                                            );
                                        }
                                }
                            },
                            "density-axis": {
                                type: "linear",
                                position: "right",
                                beginAtZero: true,
                                weight: 1,
                                grid: {
                                    drawOnChartArea:
                                        false
                                },
                                title: {
                                    display: true,
                                    text: "People/km²"
                                },
                                ticks: {
                                    callback:
                                        function(value) {
                                            return formatChartNumber(
                                                value
                                            );
                                        }
                                }
                            }
                        }
                    }
                }
            );
        return;
    }
    updateExploreChartValues(
        totalPopulation,
        totalArea,
        totalDensity,
        "Population",
        "Area",
        "Density"
    );
}
function updateExploreChartValues(
    population,
    area,
    density,
    populationLabel,
    areaLabel,
    densityLabel
) {
    if (!exploreChart) {
        createExploreChart();
        return;
    }
    exploreChart.data.labels = [
        "Population",
        "Total Area",
        "Population Density"
    ];
    exploreChart.data.datasets[0].data = [
        population,
        null,
        null
    ];
    exploreChart.data.datasets[1].data = [
        null,
        area,
        null
    ];
    exploreChart.data.datasets[2].data = [
        null,
        null,
        density
    ];
    exploreChart.data.datasets[0].label =
        populationLabel;
    exploreChart.data.datasets[1].label =
        areaLabel;
    exploreChart.data.datasets[2].label =
        densityLabel;
    exploreChart.update();
}
function updateExploreChartForCountry(
    country
) {
    if (!country) {
        return;
    }
    const population =
        country.population || 0;
    const area =
        country.area?.kilometers || 0;
    const density =
        getPopulationDensity(country) || 0;
    updateExploreChartValues(
        population,
        area,
        density,
        country.names.common,
        "Area",
        "Density"
    );
}
function updateExploreChartForContinent(
    continent
) {
    const continentCountries =
        projectCountries.filter(country =>
            country.continents?.includes(
                continent
            )
        );
    const totalPopulation =
        continentCountries.reduce(
            (total, country) =>
                total + (country.population || 0),
            0
        );
    const totalArea =
        continentCountries.reduce(
            (total, country) =>
                total +
                (country.area?.kilometers || 0),
            0
        );
    const totalDensity =
        totalArea > 0
            ? totalPopulation / totalArea
            : 0;
    updateExploreChartValues(
        totalPopulation,
        totalArea,
        totalDensity,
        `${continent} Population`,
        `${continent} Area`,
        `${continent} Density`
    );
}
/*Regional Population*/
function calculateRegionalPopulation() {
    const regionalPopulation = {};
    projectCountries.forEach(country => {
        const region =
            country.region;
        const population =
            country.population || 0;
        if (!region) {
            return;
        }
        if (!regionalPopulation[region]) {
            regionalPopulation[region] = 0;
        }
        regionalPopulation[region] +=
            population;
    });
    console.log(
        "Population by region:",
        regionalPopulation
    );
    return regionalPopulation;
}
/*Bar Chart*/
function createRegionChart() {
    const regionalPopulation =
        calculateRegionalPopulation();
    const regions =
        Object.keys(
            regionalPopulation
        );
    const populationTotals =
        Object.values(
            regionalPopulation
        );
    const chartCanvas =
        document.getElementById(
            "region-chart"
        );
    if (
        !chartCanvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }
    if (regionChart) {
        regionChart.destroy();
        regionChart = null;
    }
    regionChart =
        new Chart(
            chartCanvas,
            {
                type: "bar",
                data: {
                    labels: regions,
                    datasets: [
                        {
                            label: "Population",
                            data:
                                populationTotals
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation:
                        chartAnimation,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label:
                                    function(context) {
                                        return (
                                            "Population: " +
                                            Number(
                                                context.raw
                                            ).toLocaleString()
                                        );
                                    }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback:
                                    function(value) {
                                        return formatChartNumber(
                                            value
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}
/*Ranking Countries*/
function getRankingCountries() {
    const rankingSelect =
        document.getElementById(
            "ranking-continent-select"
        );
    if (!rankingSelect) {
        return projectCountries;
    }
    const selectedContinent =
        rankingSelect.value;
    if (
        !selectedContinent ||
        selectedContinent === "all"
    ) {
        return projectCountries;
    }
    return projectCountries.filter(country =>
        country.continents?.includes(
            selectedContinent
        )
    );
}
/*Ranking Population*/
function getPopulationRankings() {
    const countriesToRank =
        getRankingCountries();
    const rankedCountries =
        [...countriesToRank]
            .filter(country =>
                typeof country.population === "number"
            )
            .sort(
                (a, b) =>
                    b.population - a.population
            );
    return {
        top10:
            rankedCountries.slice(0, 10),
        bottom10:
            [...rankedCountries]
                .sort(
                    (a, b) =>
                        a.population - b.population
                )
                .slice(0, 10)
    };
}
function displayPopulationRankings() {
    const topList =
        document.getElementById(
            "top-populous-list"
        );
    const bottomList =
        document.getElementById(
            "least-populous-list"
        );
    if (!topList || !bottomList) {
        console.error(
            "Ranking lists not found in HTML."
        );
        return;
    }
    const rankings =
        getPopulationRankings();
    topList.innerHTML = "";
    bottomList.innerHTML = "";
    rankings.top10.forEach(country => {
        const listItem =
            document.createElement("li");
        listItem.textContent =
            `${country.names.common} — ${country.population.toLocaleString()}`;
        topList.appendChild(
            listItem
        );
    });
    rankings.bottom10.forEach(country => {
        const listItem =
            document.createElement("li");
        listItem.textContent =
            `${country.names.common} — ${country.population.toLocaleString()}`;
        bottomList.appendChild(
            listItem
        );
    });
}
function setupRankingFilter() {
    const rankingSelect =
        document.getElementById(
            "ranking-continent-select"
        );
    if (!rankingSelect) {
        return;
    }
    rankingSelect.addEventListener(
        "change",
        function () {
            displayPopulationRankings();
            updateRankingTitles();
        }
    );
}
function updateRankingTitles() {
    const rankingSelect =
        document.getElementById(
            "ranking-continent-select"
        );
    const topTitle =
        document.getElementById(
            "top-ranking-title"
        );
    const bottomTitle =
        document.getElementById(
            "bottom-ranking-title"
        );
    if (
        !rankingSelect ||
        !topTitle ||
        !bottomTitle
    ) {
        return;
    }
    const selectedContinent =
        rankingSelect.value;
    if (
        !selectedContinent ||
        selectedContinent === "all"
    ) {
        topTitle.textContent =
            "Top 10 Most Populous Countries";
        bottomTitle.textContent =
            "Top 10 Least Populous Countries";
        return;
    }
    topTitle.textContent =
        `Top 10 Most Populous Countries in ${selectedContinent}`;
    bottomTitle.textContent =
        `Top 10 Least Populous Countries in ${selectedContinent}`;
}
/*Country Comparison*/
function setupCountryComparison() {
    const countryOneSelect =
        document.getElementById(
            "country-one"
        );
    const countryTwoSelect =
        document.getElementById(
            "country-two"
        );
    if (
        !countryOneSelect ||
        !countryTwoSelect
    ) {
        return;
    }
    if (
        countryOneSelect.dataset.loaded === "true"
    ) {
        return;
    }
    projectCountries.forEach(country => {
        const countryName =
            country.names?.common;
        if (!countryName) {
            return;
        }
        const optionOne =
            document.createElement(
                "option"
            );
        optionOne.value =
            countryName;
        optionOne.textContent =
            countryName;
        const optionTwo =
            document.createElement(
                "option"
            );
        optionTwo.value =
            countryName;
        optionTwo.textContent =
            countryName;
        countryOneSelect.appendChild(
            optionOne
        );
        countryTwoSelect.appendChild(
            optionTwo
        );
    });
    countryOneSelect.dataset.loaded =
        "true";
    countryTwoSelect.dataset.loaded =
        "true";
    countryOneSelect.addEventListener(
        "change",
        updateComparison
    );
    countryTwoSelect.addEventListener(
        "change",
        updateComparison
    );
}
function findComparisonCountry(
    countryName
) {
    if (!countryName) {
        return null;
    }
    return projectCountries.find(
        country =>
            country.names?.common ===
            countryName
    ) || null;
}
function updateComparison() {
    const countryOneSelect =
        document.getElementById(
            "country-one"
        );
    const countryTwoSelect =
        document.getElementById(
            "country-two"
        );
    if (
        !countryOneSelect ||
        !countryTwoSelect
    ) {
        return;
    }
    const countryOne =
        findComparisonCountry(
            countryOneSelect.value
        );
    const countryTwo =
        findComparisonCountry(
            countryTwoSelect.value
        );
    updateComparisonCard(
        countryOne,
        "one"
    );
    updateComparisonCard(
        countryTwo,
        "two"
    );
    createComparisonChart(
        countryOne,
        countryTwo
    );
}
function updateComparisonCard(
    country,
    number
) {
    const populationElement =
        document.getElementById(
            `compare-population-${number}`
        );
    const areaElement =
        document.getElementById(
            `compare-area-${number}`
        );
    const densityElement =
        document.getElementById(
            `compare-density-${number}`
        );
    if (!country) {
        if (populationElement) {
            populationElement.textContent =
                "--";
        }
        if (areaElement) {
            areaElement.textContent =
                "--";
        }
        if (densityElement) {
            densityElement.textContent =
                "--";
        }
        return;
    }
    const population =
        country.population || 0;
    const area =
        country.area?.kilometers || 0;
    const density =
        getPopulationDensity(
            country
        );
    if (populationElement) {
        animateNumber(
            populationElement,
            population
        );
    }
    if (areaElement) {
        areaElement.textContent =
            `${area.toLocaleString()} km²`;
    }
    if (densityElement) {
        densityElement.textContent =
            density === null
                ? "Unavailable"
                : `${density.toLocaleString(
                    undefined,
                    {
                        maximumFractionDigits: 2
                    }
                )} people/km²`;
    }
}
/*ChartFor Comparison*/
function createComparisonChart(
    countryOne,
    countryTwo
) {
    const chartCanvas =
        document.getElementById(
            "comparison-chart"
        );
    if (
        !chartCanvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }
    if (comparisonChart) {
        comparisonChart.destroy();
        comparisonChart = null;
    }
    if (!countryOne && !countryTwo) {
        return;
    }
    const labels = [];
    const populationData = [];
    const areaData = [];
    const densityData = [];
    if (countryOne) {
        labels.push(
            countryOne.names.common
        );
        populationData.push(
            countryOne.population || 0
        );
        areaData.push(
            countryOne.area?.kilometers || 0
        );
        densityData.push(
            getPopulationDensity(
                countryOne
            ) || 0
        );
    }
    if (countryTwo) {
        labels.push(
            countryTwo.names.common
        );
        populationData.push(
            countryTwo.population || 0
        );
        areaData.push(
            countryTwo.area?.kilometers || 0
        );
        densityData.push(
            getPopulationDensity(
                countryTwo
            ) || 0
        );
    }
    comparisonChart =
        new Chart(
            chartCanvas,
            {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Population",
                            data:
                                populationData,
                            yAxisID:
                                "population-axis"
                        },
                        {
                            label: "Area (km²)",
                            data:
                                areaData,
                            yAxisID:
                                "area-axis"
                        },
                        {
                            label:
                                "Population Density",
                            data:
                                densityData,
                            yAxisID:
                                "density-axis"
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation:
                        chartAnimation,
                    interaction: {
                        mode: "index",
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                            labels: {
                                padding: 20
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label:
                                    function(context) {
                                        if (
                                            context.raw === null ||
                                            context.raw === undefined
                                        ) {
                                            return;
                                        }
                                        return (
                                            context.dataset.label +
                                            ": " +
                                            Number(
                                                context.raw
                                            ).toLocaleString()
                                        );
                                    }
                            }
                        }
                    },
                    scales: {
                        "population-axis": {
                            type: "linear",
                            position: "left",
                            beginAtZero: true,
                            title: {
                                display: true,
                                text:
                                    "Population"
                            },
                            ticks: {
                                callback:
                                    function(value) {
                                        return formatChartNumber(
                                            value
                                        );
                                    }
                            }
                        },
                        "area-axis": {
                            type: "linear",
                            position: "right",
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea:
                                    false
                            },
                            title: {
                                display: true,
                                text:
                                    "Area (km²)"
                            },
                            ticks: {
                                callback:
                                    function(value) {
                                        return formatChartNumber(
                                            value
                                        );
                                    }
                            }
                        },
                        "density-axis": {
                            type: "linear",
                            position: "right",
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea:
                                    false
                            },
                            title: {
                                display: true,
                                text:
                                    "People/km²"
                            },
                            ticks: {
                                callback:
                                    function(value) {
                                        return formatChartNumber(
                                            value
                                        );
                                    }
                            }
                        }
                    }
                }
            });
}
/*Side Bar Navigation*/
function setupNavigation() {
    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );
    navLinks.forEach(link => {
        link.addEventListener(
            "click",
            function(event) {
                const targetId =
                    this.getAttribute(
                        "href"
                    );
                if (
                    !targetId ||
                    !targetId.startsWith("#")
                ) {
                    return;
                }
                const target =
                    document.querySelector(
                        targetId
                    );
                if (!target) {
                    return;
                }
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                target.classList.remove(
                    "section-focus"
                );
                void target.offsetWidth;
                target.classList.add(
                    "section-focus"
                );
                setTimeout(
                    function() {
                        target.classList.remove(
                            "section-focus"
                        );
                    },
                    800
                );
                history.pushState(
                    null,
                    "",
                    targetId
                );
            }
        );
    });
}
/* Fot The Dark Mode Button And Effect */
function setupThemeToggle() {
    const themeToggle =
        document.getElementById(
            "theme-toggle"
        );
    if (!themeToggle) {
        return;
    }
    const savedTheme =
        localStorage.getItem(
            "dashboardTheme"
        );
    if (savedTheme === "dark") {
        document.documentElement
            .setAttribute(
                "data-theme",
                "dark"
            );
        themeToggle.textContent =
            "Light Mode";
    }
    themeToggle.addEventListener(
        "click",
        function() {
            const isDark =
                document.documentElement
                    .getAttribute(
                        "data-theme"
                    ) === "dark";
            if (isDark) {
                document.documentElement
                    .removeAttribute(
                        "data-theme"
                    );
                localStorage.setItem(
                    "dashboardTheme",
                    "light"
                );
                themeToggle.textContent =
                    "Dark Mode";
            } else {
                document.documentElement
                    .setAttribute(
                        "data-theme",
                        "dark"
                    );
                localStorage.setItem(
                    "dashboardTheme",
                    "dark"
                );
                themeToggle.textContent =
                    "Light Mode";
            }
        });
}
/*For the Animated Numbers*/
function animateNumber(
    element,
    targetValue,
    duration = 1200
) {
    if (!element) {
        return;
    }
    const startValue = 0;
    const startTime =
        performance.now();
    function updateNumber(currentTime) {
        const elapsed =
            currentTime - startTime;
        const progress =
            Math.min(
                elapsed / duration,
                1
            );
        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );
        const currentValue =
            Math.floor(
                startValue +
                (
                    targetValue -
                    startValue
                ) *
                easedProgress
            );
        element.textContent =
            currentValue.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(
                updateNumber
            );
        }
    }
    requestAnimationFrame(
        updateNumber
    );
}
fetchCountries();