
/* =========================================================
   TRAVELMATE — DESTINATIONS.JS
   Explore | Search | Filter | Sort | Favorites | Plan Trip
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const cards = [...document.querySelectorAll(".destination-card")];
    const searchInput = document.querySelector(
        "#destinationSearch, #searchInput, .search-input, input[type='search']"
    );
    const categoryFilter = document.querySelector(
        "#categoryFilter, #category-filter, .category-filter"
    );
    const sortSelect = document.querySelector(
        "#sortFilter, #sort-filter, .sort-filter"
    );

    let showFavoritesOnly = false;

    // Safely read saved favorites.
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem("travelmateFavorites")) || [];
        } catch {
            return [];
        }
    }

    function saveFavorites(favorites) {
        try {
            localStorage.setItem(
                "travelmateFavorites",
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.warn("Favorites could not be saved.", error);
        }
    }

    function getDestinationName(card) {
        return (
            card.dataset.name ||
            card.dataset.destination ||
            card.querySelector("h2, h3, .destination-name, .card-title")
                ?.textContent.trim() ||
            "Destination"
        );
    }

    function getDestinationImage(card) {
        const image = card.querySelector("img");

        return image?.currentSrc ||
            image?.src ||
            card.dataset.image ||
            "";
    }

    function getDestinationDescription(card) {
        return (
            card.dataset.description ||
            card.querySelector(
                ".destination-description, .destination-content p, .card-description"
            )?.textContent.trim() ||
            "Discover beautiful places, local attractions, and unforgettable experiences."
        );
    }

    function getDestinationLocation(card) {
        return (
            card.dataset.location ||
            card.querySelector(
                ".destination-location, .location, .destination-country"
            )?.textContent.trim() ||
            "Explore this destination"
        );
    }

    function getDestinationRating(card) {
        return (
            card.dataset.rating ||
            card.querySelector(
                ".destination-rating, .rating, .destination-card-rating"
            )?.textContent.trim() ||
            "Not rated"
        );
    }

    function getDestinationBudget(card) {
        return (
            card.dataset.budget ||
            card.querySelector(
                ".destination-budget, .budget, .destination-info strong"
            )?.textContent.trim() ||
            "Check local prices"
        );
    }

    function getDestinationCategory(card) {
        return (
            card.dataset.category ||
            card.querySelector(".destination-category, .category")
                ?.textContent.trim() ||
            "Travel"
        );
    }

    function slugify(value) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    // Create accessible modal styles once.
    function addModalStyles() {
        if (document.getElementById("destinations-modal-styles")) return;

        const style = document.createElement("style");
        style.id = "destinations-modal-styles";

        style.textContent = `
            .tm-destination-overlay {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(3, 7, 18, .82);
                backdrop-filter: blur(10px);
                opacity: 0;
                transition: opacity .25s ease;
            }

            .tm-destination-overlay.tm-visible {
                opacity: 1;
            }

            .tm-destination-modal {
                position: relative;
                width: min(680px, 100%);
                max-height: 90vh;
                overflow-y: auto;
                background: #111827;
                color: #f9fafb;
                border: 1px solid rgba(255,255,255,.12);
                border-radius: 22px;
                box-shadow: 0 25px 80px rgba(0,0,0,.5);
                transform: translateY(18px) scale(.98);
                transition: transform .25s ease;
            }

            .tm-destination-overlay.tm-visible .tm-destination-modal {
                transform: translateY(0) scale(1);
            }

            .tm-destination-modal img {
                display: block;
                width: 100%;
                height: 260px;
                object-fit: cover;
                background: #1f2937;
            }

            .tm-destination-modal-content {
                padding: 25px;
            }

            .tm-destination-modal h2 {
                margin: 0 0 8px;
                font-size: 28px;
                color: #fff;
            }

            .tm-destination-modal p {
                color: #cbd5e1;
                line-height: 1.7;
            }

            .tm-destination-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin: 18px 0;
            }

            .tm-destination-meta span {
                padding: 8px 12px;
                background: #1f2937;
                border: 1px solid #374151;
                border-radius: 10px;
                color: #e5e7eb;
                font-size: 13px;
            }

            .tm-destination-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 20px;
            }

            .tm-destination-actions button {
                border: 0;
                border-radius: 10px;
                padding: 12px 17px;
                cursor: pointer;
                font-weight: 600;
                transition: transform .2s ease, opacity .2s ease;
            }

            .tm-destination-actions button:hover {
                transform: translateY(-2px);
                opacity: .9;
            }

            .tm-destination-primary {
                background: #38bdf8;
                color: #082f49;
            }

            .tm-destination-secondary {
                background: #263244;
                color: #f9fafb;
            }

            .tm-destination-close {
                position: absolute;
                top: 12px;
                right: 12px;
                z-index: 2;
                width: 40px;
                height: 40px;
                border: 0;
                border-radius: 50%;
                background: rgba(0,0,0,.65);
                color: white;
                font-size: 25px;
                cursor: pointer;
            }

            .tm-destination-toast {
                position: fixed;
                right: 22px;
                bottom: 22px;
                z-index: 100000;
                max-width: min(360px, calc(100vw - 44px));
                padding: 14px 18px;
                background: #0f172a;
                color: #f8fafc;
                border: 1px solid #334155;
                border-radius: 12px;
                box-shadow: 0 12px 35px rgba(0,0,0,.35);
                opacity: 0;
                transform: translateY(10px);
                transition: .25s ease;
            }

            .tm-destination-toast.tm-toast-visible {
                opacity: 1;
                transform: translateY(0);
            }

            .destination-card.tm-hidden {
                display: none !important;
            }

            @media (max-width: 600px) {
                .tm-destination-overlay {
                    padding: 10px;
                }

                .tm-destination-modal img {
                    height: 200px;
                }

                .tm-destination-modal-content {
                    padding: 18px;
                }

                .tm-destination-modal h2 {
                    font-size: 23px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .tm-destination-overlay,
                .tm-destination-modal,
                .tm-destination-toast {
                    transition: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function showToast(message) {
        let toast = document.querySelector(".tm-destination-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "tm-destination-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("tm-toast-visible");

        clearTimeout(showToast.timeout);
        showToast.timeout = setTimeout(() => {
            toast.classList.remove("tm-toast-visible");
        }, 2600);
    }

    function closeDestinationModal() {
        const overlay = document.querySelector(".tm-destination-overlay");
        if (!overlay) return;

        overlay.remove();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.removeEventListener("keydown", handleModalKeydown);
    }

    function handleModalKeydown(event) {
        if (event.key === "Escape") {
            closeDestinationModal();
        }
    }

    function openDestinationModal(card) {
        if (!card) return;

        addModalStyles();
        closeDestinationModal();

        const name = getDestinationName(card);
        const image = getDestinationImage(card);
        const description = getDestinationDescription(card);
        const location = getDestinationLocation(card);
        const rating = getDestinationRating(card);
        const budget = getDestinationBudget(card);
        const category = getDestinationCategory(card);
        const destinationId = card.dataset.id || slugify(name);

        const overlay = document.createElement("div");
        overlay.className = "tm-destination-overlay";
        overlay.setAttribute("role", "presentation");

        const modal = document.createElement("section");
        modal.className = "tm-destination-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "tm-destination-title");
        modal.tabIndex = -1;

        const imageElement = document.createElement("img");
        imageElement.alt = name;
        imageElement.src = image;
        imageElement.hidden = !image;

        const closeButton = document.createElement("button");
        closeButton.className = "tm-destination-close";
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Close destination details");
        closeButton.textContent = "×";
        closeButton.addEventListener("click", closeDestinationModal);

        const content = document.createElement("div");
        content.className = "tm-destination-modal-content";

        const heading = document.createElement("h2");
        heading.id = "tm-destination-title";
        heading.textContent = name;

        const locationText = document.createElement("p");
        locationText.textContent = location;

        const descriptionText = document.createElement("p");
        descriptionText.textContent = description;

        const meta = document.createElement("div");
        meta.className = "tm-destination-meta";

        [ `Rating: ${rating}`, `Budget: ${budget}`, `Category: ${category}` ]
            .forEach((text) => {
                const item = document.createElement("span");
                item.textContent = text;
                meta.appendChild(item);
            });

        const actions = document.createElement("div");
        actions.className = "tm-destination-actions";

        const planButton = document.createElement("button");
        planButton.className = "tm-destination-primary";
        planButton.type = "button";
        planButton.textContent = "Plan a Trip";
        planButton.addEventListener("click", () => {
            closeDestinationModal();

            const destinationInput = document.querySelector(
                "#destination, #destinationName, input[name='destination']"
            );

            if (destinationInput) {
                destinationInput.value = name;
                destinationInput.dispatchEvent(
                    new Event("input", { bubbles: true })
                );
            }

            const tripUrl = card.dataset.planUrl;

            if (tripUrl) {
                window.location.href = tripUrl;
                return;
            }

            const planLink = document.querySelector(
                "#planTripLink, .plan-trip-link, a[href*='itinerary'], a[href*='MyTrip']"
            );

            if (planLink?.href) {
                window.location.href = planLink.href;
            } else {
                showToast(`Trip planning selected for ${name}.`);
            }
        });

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "tm-destination-secondary";
        favoriteButton.type = "button";

        function updateFavoriteButton() {
            const favorites = getFavorites();
            const isFavorite = favorites.includes(destinationId);
            favoriteButton.textContent = isFavorite
                ? "♥ Remove Favorite"
                : "♡ Add Favorite";
        }

        favoriteButton.addEventListener("click", () => {
            let favorites = getFavorites();

            if (favorites.includes(destinationId)) {
                favorites = favorites.filter(id => id !== destinationId);
                showToast(`${name} removed from favorites.`);
            } else {
                favorites.push(destinationId);
                showToast(`${name} added to favorites.`);
            }

            saveFavorites(favorites);
            updateFavoriteButton();
            updateFavoriteButtons();
            applyFilters();
        });

        updateFavoriteButton();

        const closeActionButton = document.createElement("button");
        closeActionButton.className = "tm-destination-secondary";
        closeActionButton.type = "button";
        closeActionButton.textContent = "Close";
        closeActionButton.addEventListener("click", closeDestinationModal);

        actions.append(planButton, favoriteButton, closeActionButton);
        content.append(heading, locationText, descriptionText, meta, actions);
        modal.append(closeButton, imageElement, content);
        overlay.appendChild(modal);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeDestinationModal();
            }
        });

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.addEventListener("keydown", handleModalKeydown);

        requestAnimationFrame(() => {
            overlay.classList.add("tm-visible");
            modal.focus();
        });
    }

    // Explore works for both static and Django-rendered cards.
    document.addEventListener("click", event => {
        const exploreButton = event.target.closest(
            ".explore-btn, .explore-button, [data-action='explore']"
        );

        if (exploreButton) {
            const card = exploreButton.closest(".destination-card");

            if (card) {
                event.preventDefault();
                openDestinationModal(card);
            }
        }
    });

    // Favorite buttons already present in the destination cards.
    function updateFavoriteButtons() {
        const favorites = getFavorites();

        cards.forEach(card => {
            const id = card.dataset.id ||
                slugify(getDestinationName(card));

            const button = card.querySelector(
                ".favorite-btn, .favorite-button, [data-action='favorite']"
            );

            if (!button) return;

            const isFavorite = favorites.includes(id);
            button.classList.toggle("is-favorite", isFavorite);
            button.setAttribute("aria-pressed", String(isFavorite));
            button.setAttribute("aria-label",
                isFavorite ? "Remove from favorites" : "Add to favorites"
            );

            if (button.dataset.iconLabel !== "true") {
                button.textContent = isFavorite ? "♥" : "♡";
            }
        });
    }

    document.addEventListener("click", event => {
        const favoriteButton = event.target.closest(
            ".favorite-btn, .favorite-button, [data-action='favorite']"
        );

        if (!favoriteButton) return;

        const card = favoriteButton.closest(".destination-card");
        if (!card) return;

        event.preventDefault();
        event.stopPropagation();

        const id = card.dataset.id || slugify(getDestinationName(card));
        let favorites = getFavorites();

        if (favorites.includes(id)) {
            favorites = favorites.filter(item => item !== id);
            showToast("Removed from favorites.");
        } else {
            favorites.push(id);
            showToast("Added to favorites.");
        }

        saveFavorites(favorites);
        updateFavoriteButtons();
        applyFilters();
    });

    // Search, category, favorites, and sort.
    function applyFilters() {
        const query = searchInput?.value.trim().toLowerCase() || "";
        const category = categoryFilter?.value.toLowerCase() || "all";
        const favorites = getFavorites();

        cards.forEach(card => {
            const name = getDestinationName(card).toLowerCase();
            const location = getDestinationLocation(card).toLowerCase();
            const description = getDestinationDescription(card).toLowerCase();
            const cardCategory = getDestinationCategory(card).toLowerCase();
            const id = card.dataset.id || slugify(getDestinationName(card));

            const matchesSearch =
                !query ||
                `${name} ${location} ${description} ${cardCategory}`
                    .includes(query);

            const matchesCategory =
                category === "all" ||
                category === "" ||
                cardCategory.includes(category) ||
                (card.dataset.category || "").toLowerCase() === category;

            const matchesFavorites =
                !showFavoritesOnly || favorites.includes(id);

            card.classList.toggle(
                "tm-hidden",
                !(matchesSearch && matchesCategory && matchesFavorites)
            );
        });

        sortCards();
    }

    function sortCards() {
        const container = cards[0]?.parentElement;
        if (!container || !sortSelect) return;

        const visibleCards = cards.filter(
            card => !card.classList.contains("tm-hidden")
        );

        const sortBy = sortSelect.value;

        visibleCards.sort((a, b) => {
            if (sortBy === "name" || sortBy === "alphabetical") {
                return getDestinationName(a).localeCompare(
                    getDestinationName(b)
                );
            }

            if (sortBy === "rating" || sortBy === "highest-rated") {
                return parseFloat(getDestinationRating(b)) -
                    parseFloat(getDestinationRating(a));
            }

            if (sortBy === "budget" || sortBy === "price") {
                const getPrice = card => {
                    const value = getDestinationBudget(card)
                        .replace(/,/g, "")
                        .match(/\d+(\.\d+)?/);

                    return value ? Number(value[0]) : Infinity;
                };

                return getPrice(a) - getPrice(b);
            }

            return 0;
        });

        visibleCards.forEach(card => container.appendChild(card));
    }

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);

    // Favorites-only filter controls, if present.
    document.querySelectorAll(
        "#favoritesFilter, .favorites-filter, [data-action='show-favorites']"
    ).forEach(button => {
        button.addEventListener("click", () => {
            showFavoritesOnly = !showFavoritesOnly;
            button.classList.toggle("active", showFavoritesOnly);
            applyFilters();
        });
    });

    // Reset search and filters.
    document.querySelectorAll(
        "#resetFilters, .reset-filters, [data-action='reset-filters']"
    ).forEach(button => {
        button.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (categoryFilter) categoryFilter.value = "all";
            if (sortSelect) sortSelect.value = "";
            showFavoritesOnly = false;
            applyFilters();
        });
    });

    // View all destinations.
    document.querySelectorAll(
        "#viewAll, .view-all, [data-action='view-all']"
    ).forEach(button => {
        button.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (categoryFilter) categoryFilter.value = "all";
            showFavoritesOnly = false;

            cards.forEach(card => card.classList.remove("tm-hidden"));
            sortCards();

            document.querySelector(".destinations-grid, .destination-grid, .destination-container")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Plan Trip links/buttons.
    document.querySelectorAll(
        ".plan-trip-btn, .plan-trip-button, [data-action='plan-trip']"
    ).forEach(button => {
        button.addEventListener("click", event => {
            const card = button.closest(".destination-card");
            const destination = card ? getDestinationName(card) : "";

            if (destination) {
                try {
                    sessionStorage.setItem(
                        "travelmateSelectedDestination",
                        destination
                    );
                } catch {}

                const destinationInput = document.querySelector(
                    "#destination, #destinationName, input[name='destination']"
                );

                if (destinationInput) {
                    destinationInput.value = destination;
                }
            }

            const url = button.dataset.url ||
                document.querySelector(
                    "#planTripLink, .plan-trip-link, a[href*='itinerary'], a[href*='MyTrip']"
                )?.href;

            if (url) {
                window.location.href = url;
            } else {
                showToast(
                    destination
                        ? `Ready to plan your trip to ${destination}.`
                        : "Choose a destination to start planning."
                );
            }
        });
    });

    // Optional mobile navigation toggle.
    const menuToggle = document.querySelector(
        "#menuToggle, .menu-toggle, .hamburger"
    );

    const sidebar = document.querySelector(".sidebar, .side-menu");

    menuToggle?.addEventListener("click", () => {
        sidebar?.classList.toggle("active");
        menuToggle.setAttribute(
            "aria-expanded",
            String(sidebar?.classList.contains("active") || false)
        );
    });

    // Initialize page.
    updateFavoriteButtons();
    applyFilters();
});
