document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    console.log("TravelMate: JavaScript loaded");


    /* =========================================================
       DESTINATION DATA
       ========================================================= */

    const destinations = {

        bali: {
            name: "Bali",
            country: "Indonesia",
            rating: 4.8,
            bestTime: "April - October",
            stay: "5 - 7 Days",
            budget: "₹35,000 - ₹60,000",
            travelType: "Beach & Adventure",

            description:
                "Tropical beaches, beautiful temples, rice terraces and unforgettable sunsets.",

            places: [
                "Uluwatu Temple",
                "Kuta Beach",
                "Seminyak",
                "Nusa Penida",
                "Tegallalang Rice Terrace"
            ]
        },

        "swiss-alps": {
            name: "Swiss Alps",
            country: "Switzerland",
            rating: 4.7,
            bestTime: "June - September",
            stay: "5 - 8 Days",
            budget: "₹1,20,000 - ₹2,00,000",
            travelType: "Mountain & Adventure",

            description:
                "Snow-covered peaks, peaceful villages and breathtaking mountain landscapes.",

            places: [
                "Jungfraujoch",
                "Interlaken",
                "Zermatt",
                "Matterhorn",
                "Lake Geneva"
            ]
        },

        santorini: {
            name: "Santorini",
            country: "Greece",
            rating: 4.6,
            bestTime: "April - October",
            stay: "4 - 6 Days",
            budget: "₹90,000 - ₹1,50,000",
            travelType: "Beach & Romantic",

            description:
                "Whitewashed buildings, blue domes, coastal views and romantic sunsets.",

            places: [
                "Oia",
                "Fira",
                "Red Beach",
                "Kamari Beach",
                "Akrotiri"
            ]
        },

        paris: {
            name: "Paris",
            country: "France",
            rating: 4.7,
            bestTime: "April - June",
            stay: "4 - 6 Days",
            budget: "₹90,000 - ₹1,60,000",
            travelType: "City & Culture",

            description:
                "Iconic architecture, world-famous cuisine, museums and unforgettable city experiences.",

            places: [
                "Eiffel Tower",
                "Louvre Museum",
                "Notre-Dame",
                "Arc de Triomphe",
                "Montmartre"
            ]
        },

        tokyo: {
            name: "Tokyo",
            country: "Japan",
            rating: 4.9,
            bestTime: "March - May",
            stay: "5 - 7 Days",
            budget: "₹1,00,000 - ₹1,70,000",
            travelType: "City & Culture",

            description:
                "A futuristic city filled with technology, culture, food and traditional experiences.",

            places: [
                "Shibuya",
                "Tokyo Tower",
                "Senso-ji Temple",
                "Akihabara",
                "Shinjuku"
            ]
        },

        dubai: {
            name: "Dubai",
            country: "United Arab Emirates",
            rating: 4.6,
            bestTime: "November - March",
            stay: "4 - 6 Days",
            budget: "₹60,000 - ₹1,00,000",
            travelType: "Luxury & Adventure",

            description:
                "Luxury experiences, futuristic architecture, shopping and desert adventures.",

            places: [
                "Burj Khalifa",
                "Dubai Mall",
                "Palm Jumeirah",
                "Dubai Marina",
                "Desert Safari"
            ]
        }

    };


    /* =========================================================
       ELEMENTS - MATCHING YOUR ACTUAL HTML
       ========================================================= */

    const searchInput =
        document.getElementById("searchInput");

    const clearSearch =
        document.getElementById("clearSearch");

    const filterButton =
        document.getElementById("filterButton");

    const filterPanel =
        document.getElementById("filterPanel");

    const closeFilter =
        document.getElementById("closeFilter");

    const applyFilter =
        document.getElementById("applyFilter");

    const ratingFilter =
        document.getElementById("ratingFilter");

    const sortSelect =
        document.getElementById("sortSelect");

    const viewAll =
        document.getElementById("viewAll");

    const destinationGrid =
        document.getElementById("destinationGrid");

    const emptyState =
        document.getElementById("emptyState");

    const resetSearch =
        document.getElementById("resetSearch");

    const toast =
        document.getElementById("toast");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const planTripButton =
        document.getElementById("planTripButton");

    const exploreMore =
        document.getElementById("exploreMore");


    /* =========================================================
       STATE
       ========================================================= */

    let selectedCategory = "all";
    let minimumRating = 0;
    let showingAll = false;

    let toastTimer = null;


    /* =========================================================
       TOAST
       ========================================================= */

    function showToast(message, error = false) {

        if (!toast) {
            console.error(message);
            return;
        }

        const text =
            toast.querySelector("span");

        const icon =
            toast.querySelector("i");


        if (text) {
            text.textContent = message;
        }


        if (icon) {

            if (error) {

                icon.className =
                    "fa-solid fa-circle-exclamation";

            } else {

                icon.className =
                    "fa-solid fa-circle-check";

            }

        }


        toast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer = setTimeout(function () {

            toast.classList.remove("show");

        }, 2500);

    }


    /* =========================================================
       GET DESTINATION
       ========================================================= */

    function getDestination(card) {

        if (!card) {
            return null;
        }


        const id =
            card.getAttribute("data-destination");


        if (!id) {

            console.error(
                "No data-destination found on card"
            );

            return null;

        }


        return destinations[id] || null;

    }


    /* =========================================================
       CREATE DESTINATION MODAL
       ========================================================= */

    function createModal() {

        let modal =
            document.getElementById(
                "travelmateDestinationModal"
            );


        if (modal) {
            return modal;
        }


        modal =
            document.createElement("div");


        modal.id =
            "travelmateDestinationModal";


        modal.innerHTML = `

            <div class="tm-overlay"></div>

            <div class="tm-modal">

                <button
                    type="button"
                    class="tm-close"
                    id="tmClose">

                    <i class="fa-solid fa-xmark"></i>

                </button>


                <div class="tm-image">

                    <img
                        id="tmImage"
                        src=""
                        alt="Destination">

                    <div class="tm-rating">

                        <i class="fa-solid fa-star"></i>

                        <span id="tmRating"></span>

                    </div>

                </div>


                <div class="tm-content">

                    <div class="tm-country">

                        <i class="fa-solid fa-location-dot"></i>

                        <span id="tmCountry"></span>

                    </div>


                    <h2 id="tmTitle"></h2>


                    <p id="tmDescription"></p>


                    <div class="tm-info">

                        <div>
                            <i class="fa-solid fa-calendar-days"></i>
                            <small>Best Time</small>
                            <strong id="tmBestTime"></strong>
                        </div>

                        <div>
                            <i class="fa-solid fa-clock"></i>
                            <small>Stay</small>
                            <strong id="tmStay"></strong>
                        </div>

                        <div>
                            <i class="fa-solid fa-wallet"></i>
                            <small>Budget</small>
                            <strong id="tmBudget"></strong>
                        </div>

                        <div>
                            <i class="fa-solid fa-person-hiking"></i>
                            <small>Travel Type</small>
                            <strong id="tmTravelType"></strong>
                        </div>

                    </div>


                    <h3>
                        <i class="fa-solid fa-location-dot"></i>
                        Places To Visit
                    </h3>


                    <div id="tmPlaces"></div>


                    <div class="tm-actions">

                        <button
                            type="button"
                            id="tmAddTrip">

                            <i class="fa-solid fa-suitcase-rolling"></i>

                            Add To My Trip

                        </button>


                        <button
                            type="button"
                            id="tmCloseBottom">

                            Close

                        </button>

                    </div>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        /* =====================================================
           MODAL CSS
           ===================================================== */

        const style =
            document.createElement("style");


        style.id =
            "travelmateDestinationModalStyle";


        style.textContent = `

            #travelmateDestinationModal {
                position: fixed;
                inset: 0;
                z-index: 999999;
                display: none;
                align-items: center;
                justify-content: center;
            }

            #travelmateDestinationModal.active {
                display: flex;
            }

            .tm-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,.78);
                backdrop-filter: blur(8px);
            }

            .tm-modal {
                position: relative;
                z-index: 2;
                width: min(900px, 92%);
                max-height: 90vh;
                overflow-y: auto;
                background: #111827;
                color: white;
                border-radius: 22px;
                box-shadow: 0 30px 100px rgba(0,0,0,.6);
                animation: tmOpen .3s ease;
            }

            @keyframes tmOpen {

                from {
                    opacity: 0;
                    transform: translateY(30px) scale(.96);
                }

                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

            }

            .tm-close {
                position: absolute;
                right: 16px;
                top: 16px;
                z-index: 10;
                width: 42px;
                height: 42px;
                border: 0;
                border-radius: 50%;
                background: rgba(0,0,0,.7);
                color: white;
                cursor: pointer;
                font-size: 18px;
            }

            .tm-image {
                position: relative;
                height: 300px;
            }

            .tm-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .tm-rating {
                position: absolute;
                right: 18px;
                bottom: 18px;
                padding: 9px 15px;
                border-radius: 30px;
                background: rgba(0,0,0,.75);
            }

            .tm-rating i {
                color: #fbbf24;
            }

            .tm-content {
                padding: 28px;
            }

            .tm-country {
                color: #94a3b8;
                margin-bottom: 7px;
            }

            .tm-content h2 {
                margin: 0 0 12px;
                font-size: 32px;
            }

            #tmDescription {
                color: #cbd5e1;
                line-height: 1.7;
            }

            .tm-info {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
                margin: 22px 0;
            }

            .tm-info > div {
                padding: 15px;
                border-radius: 14px;
                background: rgba(255,255,255,.06);
                border: 1px solid rgba(255,255,255,.08);
            }

            .tm-info i {
                display: block;
                margin-bottom: 8px;
            }

            .tm-info small {
                display: block;
                color: #94a3b8;
                margin-bottom: 5px;
            }

            .tm-info strong {
                font-size: 13px;
            }

            #tmPlaces {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 15px 0 25px;
            }

            .tm-place {
                padding: 8px 12px;
                border-radius: 20px;
                background: rgba(255,255,255,.08);
                font-size: 13px;
            }

            .tm-actions {
                display: flex;
                gap: 12px;
            }

            .tm-actions button {
                flex: 1;
                padding: 13px;
                border: 0;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 700;
            }

            #tmAddTrip {
                background: #2563eb;
                color: white;
            }

            #tmCloseBottom {
                background: rgba(255,255,255,.1);
                color: white;
            }

            @media(max-width:700px) {

                .tm-info {
                    grid-template-columns: repeat(2,1fr);
                }

                .tm-image {
                    height: 220px;
                }

                .tm-actions {
                    flex-direction: column;
                }

            }

        `;


        document.head.appendChild(style);


        /* =====================================================
           CLOSE EVENTS
           ===================================================== */

        document
            .getElementById("tmClose")
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById("tmCloseBottom")
            .addEventListener(
                "click",
                closeModal
            );


        modal
            .querySelector(".tm-overlay")
            .addEventListener(
                "click",
                closeModal
            );


        return modal;

    }


    /* =========================================================
       OPEN DESTINATION
       ========================================================= */

    function openDestination(card) {
        if (!card) return;

        const destinationId = card.dataset.destination;
        const destination = destinations[destinationId];

        if (!destination) {
            showToast("Destination details not found.");
            console.error("Destination not found:", destinationId);
            return;
        }

        // Remove existing modal
        const oldModal = document.getElementById("destinationModal");
        if (oldModal) {
            oldModal.remove();
        }

        // Get image directly from the card
        const imageElement = card.querySelector("img");
        const image = imageElement
            ? imageElement.src
            : "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85";

        const modal = document.createElement("div");
        modal.id = "destinationModal";

        modal.innerHTML = `
        <div class="destination-modal-overlay">
            <div class="destination-modal-content">

                <button class="destination-modal-close" id="closeDestinationModal">
                    &times;
                </button>

                <div class="destination-modal-image">
                    <img src="${image}" alt="${destination.name}">
                </div>

                <div class="destination-modal-body">

                    <div class="destination-modal-header">
                        <div>
                            <h2>${destination.name}</h2>
                            <p class="modal-country">
                                ${destination.country || ""}
                            </p>
                        </div>

                        <div class="modal-rating">
                            ⭐ ${destination.rating || card.dataset.rating || "4.5"}
                        </div>
                    </div>

                    <p class="modal-description">
                        ${destination.description ||
            "Discover beautiful places, amazing experiences and unforgettable memories at this destination."}
                    </p>

                    <div class="modal-details">

                        <div class="modal-detail-box">
                            <span>📍</span>
                            <div>
                                <small>Location</small>
                                <strong>${destination.country || destination.name}</strong>
                            </div>
                        </div>

                        <div class="modal-detail-box">
                            <span>🌤️</span>
                            <div>
                                <small>Best Time</small>
                                <strong>${destination.bestTime || "Year Round"}</strong>
                            </div>
                        </div>

                        <div class="modal-detail-box">
                            <span>💰</span>
                            <div>
                                <small>Estimated Budget</small>
                                <strong>${destination.budget || "₹50,000+"}</strong>
                            </div>
                        </div>

                        <div class="modal-detail-box">
                            <span>⭐</span>
                            <div>
                                <small>Rating</small>
                                <strong>${destination.rating || card.dataset.rating || "4.5"}/5</strong>
                            </div>
                        </div>

                    </div>

                    <div class="modal-highlights">
                        <h3>✨ Highlights</h3>

                        <div class="highlight-list">
                            ${destination.highlights
                ? destination.highlights
                    .map(item => `<span>✓ ${item}</span>`)
                    .join("")
                : `
                                        <span>✓ Beautiful places</span>
                                        <span>✓ Local attractions</span>
                                        <span>✓ Amazing experiences</span>
                                        <span>✓ Great photography spots</span>
                                    `
            }
                        </div>
                    </div>

                    <div class="modal-actions">

                        <button 
                            class="modal-trip-btn"
                            id="modalAddTrip"
                            data-destination="${destinationId}">
                            🧳 Add To My Trip
                        </button>

                        <button 
                            class="modal-close-btn"
                            id="modalCloseBottom">
                            Close
                        </button>

                    </div>

                </div>
            </div>
        </div>
    `;

        document.body.appendChild(modal);

        // Close button
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = "";
        };

        document
            .getElementById("closeDestinationModal")
            ?.addEventListener("click", closeModal);

        document
            .getElementById("modalCloseBottom")
            ?.addEventListener("click", closeModal);

        // Close when clicking outside
        const overlay = modal.querySelector(".destination-modal-overlay");

        overlay?.addEventListener("click", (event) => {
            if (event.target === overlay) {
                closeModal();
            }
        });

        // Add to trip
        document
            .getElementById("modalAddTrip")
            ?.addEventListener("click", () => {

                const trips = JSON.parse(
                    localStorage.getItem("travelMateTrips") || "[]"
                );

                const alreadyAdded = trips.some(
                    trip => trip.id === destinationId
                );

                if (alreadyAdded) {
                    showToast(`${destination.name} is already in your trip.`);
                    return;
                }

                trips.push({
                    id: destinationId,
                    name: destination.name,
                    country: destination.country || "",
                    rating: destination.rating || card.dataset.rating,
                    image: image,
                    addedAt: new Date().toISOString()
                });

                localStorage.setItem(
                    "travelMateTrips",
                    JSON.stringify(trips)
                );

                showToast(`${destination.name} added to your trip!`);

                const button = document.getElementById("modalAddTrip");

                if (button) {
                    button.innerHTML = "✓ Added To My Trip";
                    button.disabled = true;
                }
            });

        // Prevent background scrolling
        document.body.style.overflow = "hidden";
    }

    /* =========================================================
       CLOSE MODAL
       ========================================================= */

    function closeModal() {

        const modal =
            document.getElementById(
                "travelmateDestinationModal"
            );


        if (!modal) {
            return;
        }


        modal.classList.remove("active");


        document.body.style.overflow =
            "";

    }


    /* =========================================================
       ESC KEY
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeModal();

            }

        }
    );


    /* =========================================================
       ADD TO MY TRIP
       ========================================================= */

    function addToTrip(data) {

        let trips = [];


        try {

            trips =
                JSON.parse(
                    localStorage.getItem(
                        "travelMateTrips"
                    )
                ) || [];

        } catch (error) {

            trips = [];

        }


        const exists =
            trips.some(function (trip) {

                return trip.name === data.name;

            });


        if (exists) {

            showToast(
                data.name +
                " is already in My Trips."
            );

            return;

        }


        trips.push({

            name: data.name,
            country: data.country,
            rating: data.rating,
            bestTime: data.bestTime,
            stay: data.stay,
            budget: data.budget,
            travelType: data.travelType,
            places: data.places,
            description: data.description,
            addedAt: new Date().toISOString()

        });


        localStorage.setItem(
            "travelMateTrips",
            JSON.stringify(trips)
        );


        showToast(
            data.name +
            " added to My Trip!"
        );

    }


    /* =========================================================
       FAVORITES
       ========================================================= */

    function getFavorites() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "travelMateFavorites"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveFavorites(favorites) {

        localStorage.setItem(
            "travelMateFavorites",
            JSON.stringify(favorites)
        );

    }


    function updateFavorite(button, active) {

        const icon =
            button.querySelector("i");


        if (!icon) {
            return;
        }


        if (active) {

            icon.className =
                "fa-solid fa-heart";

            button.classList.add(
                "favorite-active"
            );

        } else {

            icon.className =
                "fa-regular fa-heart";

            button.classList.remove(
                "favorite-active"
            );

        }

    }


    function toggleFavorite(button) {

        const card =
            button.closest(
                ".destination-card"
            );


        if (!card) {
            return;
        }


        const name =
            card.dataset.name;


        let favorites =
            getFavorites();


        const exists =
            favorites.includes(name);


        if (exists) {

            favorites =
                favorites.filter(
                    function (item) {

                        return item !== name;

                    }
                );


            updateFavorite(
                button,
                false
            );


            showToast(
                name +
                " removed from favorites."
            );

        } else {

            favorites.push(name);


            updateFavorite(
                button,
                true
            );


            showToast(
                name +
                " added to favorites!"
            );

        }


        saveFavorites(favorites);

    }


    function loadFavorites() {

        const favorites =
            getFavorites();


        document
            .querySelectorAll(
                ".favorite"
            )
            .forEach(function (button) {

                const card =
                    button.closest(
                        ".destination-card"
                    );


                if (!card) {
                    return;
                }


                updateFavorite(
                    button,
                    favorites.includes(
                        card.dataset.name
                    )
                );

            });

    }


    /* =========================================================
       SEARCH / FILTER
       ========================================================= */

    function applyAllFilters() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const cards =
            Array.from(
                document.querySelectorAll(
                    ".destination-card"
                )
            );


        let visible =
            0;


        cards.forEach(function (card) {

            const name =
                (
                    card.dataset.name || ""
                ).toLowerCase();


            const category =
                (
                    card.dataset.category || ""
                ).toLowerCase();


            const description =
                (
                    card.querySelector(
                        ".description"
                    )?.textContent || ""
                ).toLowerCase();


            const rating =
                parseFloat(
                    card.dataset.rating || "0"
                );


            const matchesSearch =
                !search ||
                name.includes(search) ||
                category.includes(search) ||
                description.includes(search);


            const matchesCategory =
                selectedCategory === "all" ||
                category.includes(
                    selectedCategory
                );


            const matchesRating =
                rating >= minimumRating;


            const isExtra =
                card.classList.contains(
                    "extra-card"
                );


            const matchesView =
                showingAll ||
                !isExtra;


            const shouldShow =
                matchesSearch &&
                matchesCategory &&
                matchesRating &&
                matchesView;


            card.style.display =
                shouldShow
                    ? ""
                    : "none";


            if (shouldShow) {
                visible++;
            }

        });


        if (emptyState) {

            emptyState.style.display =
                visible === 0
                    ? "block"
                    : "none";

        }


        if (viewAll) {

            viewAll.innerHTML =
                showingAll
                    ? `Show less <i class="fa-solid fa-arrow-up"></i>`
                    : `View all <i class="fa-solid fa-arrow-right"></i>`;

        }

    }


    /* =========================================================
       SEARCH
       ========================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                applyAllFilters();

            }
        );

    }


    /* =========================================================
       CLEAR SEARCH
       ========================================================= */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value =
                        "";

                    searchInput.focus();

                }


                applyAllFilters();

            }
        );

    }


    /* =========================================================
       FILTER PANEL OPEN
       ========================================================= */

    if (filterButton) {

        filterButton.addEventListener(
            "click",
            function () {

                if (filterPanel) {

                    filterPanel.classList.toggle(
                        "active"
                    );

                }

            }
        );

    }


    /* =========================================================
       CLOSE FILTER
       ========================================================= */

    if (closeFilter) {

        closeFilter.addEventListener(
            "click",
            function () {

                if (filterPanel) {

                    filterPanel.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =========================================================
       CATEGORY FILTER
       ========================================================= */

    document
        .querySelectorAll(
            ".filter-option"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".filter-option"
                        )
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    selectedCategory =
                        button.dataset.category ||
                        "all";

                }
            );

        });


    /* =========================================================
       RATING FILTER
       ========================================================= */

    if (ratingFilter) {

        ratingFilter.addEventListener(
            "change",
            function () {

                minimumRating =
                    parseFloat(
                        ratingFilter.value
                    ) || 0;

            }
        );

    }


    /* =========================================================
       APPLY FILTER
       ========================================================= */

    if (applyFilter) {

        applyFilter.addEventListener(
            "click",
            function () {

                applyAllFilters();


                if (filterPanel) {

                    filterPanel.classList.remove(
                        "active"
                    );

                }


                updateFilterCount();

            }
        );

    }


    /* =========================================================
       FILTER COUNT
       ========================================================= */

    function updateFilterCount() {

        const countElement =
            document.getElementById(
                "filterCount"
            );


        if (!countElement) {
            return;
        }


        let count = 0;


        if (
            selectedCategory !== "all"
        ) {
            count++;
        }


        if (
            minimumRating > 0
        ) {
            count++;
        }


        countElement.textContent =
            count;

    }


    /* =========================================================
       VIEW ALL
       ========================================================= */

    if (viewAll) {

        viewAll.addEventListener(
            "click",
            function () {

                showingAll =
                    !showingAll;


                applyAllFilters();

            }
        );

    }


    /* =========================================================
       SORT
       ========================================================= */

    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            function () {

                const value =
                    sortSelect.value;


                const cards =
                    Array.from(
                        document.querySelectorAll(
                            ".destination-card"
                        )
                    );


                cards.sort(
                    function (a, b) {

                        if (
                            value === "rating"
                        ) {

                            return (
                                parseFloat(
                                    b.dataset.rating
                                ) -
                                parseFloat(
                                    a.dataset.rating
                                )
                            );

                        }


                        if (
                            value === "name"
                        ) {

                            return (
                                a.dataset.name
                                    .localeCompare(
                                        b.dataset.name
                                    )
                            );

                        }


                        return 0;

                    }
                );


                cards.forEach(
                    function (card) {

                        destinationGrid
                            .appendChild(card);

                    }
                );


                applyAllFilters();

            }
        );

    }


    /* =========================================================
       EXPLORE BUTTON
       ========================================================= */

    function closeExploreModal() {
        modal.remove();

        // Restore page scrolling.
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    }

    modal.querySelectorAll(
        ".explore-modal-close, .explore-modal-done"
    ).forEach(function (button) {
        button.onclick = closeExploreModal;
    });

    modal.onclick = function (event) {
        if (event.target === modal) {
            closeExploreModal();
        }
    };

    document.addEventListener("keydown", function escapeHandler(event) {
        if (event.key === "Escape") {
            closeExploreModal();
            document.removeEventListener("keydown", escapeHandler);
        }
    });

    /* =========================================================
       FAVORITE BUTTON
       ========================================================= */

    document.querySelectorAll(".explore-btn").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const card = button.closest(".destination-card");

            if (!card) {
                console.error("Destination card not found.");
                return;
            }

            // Open the destination details modal
            openDestination(card);
        });
    });


    /* =========================================================
       PLAN A TRIP
       ========================================================= */

    if (planTripButton) {

        planTripButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "/itinerary/";

            }
        );

    }


    /* =========================================================
       EXPLORE MORE
       ========================================================= */

    if (exploreMore) {

        exploreMore.addEventListener(
            "click",
            function () {

                showingAll = true;

                applyAllFilters();

                destinationGrid.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    /* =========================================================
       RESET
       ========================================================= */

    if (resetSearch) {

        resetSearch.addEventListener(
            "click",
            function () {

                if (searchInput) {
                    searchInput.value = "";
                }


                selectedCategory =
                    "all";


                minimumRating =
                    0;


                showingAll =
                    false;


                if (ratingFilter) {

                    ratingFilter.value =
                        "0";

                }


                document
                    .querySelectorAll(
                        ".filter-option"
                    )
                    .forEach(
                        function (button) {

                            button.classList.remove(
                                "active"
                            );

                        }
                    );


                const allFilter =
                    document.querySelector(
                        '.filter-option[data-category="all"]'
                    );


                if (allFilter) {

                    allFilter.classList.add(
                        "active"
                    );

                }


                updateFilterCount();

                applyAllFilters();

            }
        );

    }


    /* =========================================================
       MOBILE MENU
       ========================================================= */

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            function () {

                const sidebar =
                    document.querySelector(
                        ".sidebar"
                    );


                if (sidebar) {

                    sidebar.classList.toggle(
                        "active"
                    );

                }

            }
        );

    }


    /* =========================================================
       INITIAL LOAD
       ========================================================= */

    loadFavorites();

    updateFilterCount();

    applyAllFilters();


    console.log(
        "TravelMate: All destination functions initialized successfully."
    );

});
