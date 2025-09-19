import { podcasts } from '../data.js';
import { createPodcastElement } from "../Components/renderCard.js";

/**
 * Grid Renderer - Responsible for rendering the grid of podcast cards.
 *
 * @principle SRP - Manages layout and rendering only; delegates card creation and modal logic elsewhere.
 */
export const createGrid = () => {
    const container = document.getElementById("podcastGrid");

    container.innerHTML = "";
    podcasts.forEach(podcast => {
        const podcastElement = createPodcastElement(podcast);
        container.appendChild(podcastElement);
    });
};