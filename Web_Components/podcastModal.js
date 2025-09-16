import { podcasts, genres } from "./data.js";

class PodcastModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        .hidden { display: none !important; }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .content {
          background: #121212;
          border-radius: 6px;
          padding: 1rem;
          max-width: 900px;
          width: 100%;
          height: 615px;
          overflow-y: auto;
          position: relative;
        }
        button#close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 1.5rem;
          color: #EA5555;
          cursor: pointer;
          background: none;
          border: none;
        }
        .genre-tag {
          background: #F4F4F4;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin: 0 0.25rem 0.25rem 0;
          font-size: 0.875rem;
          color: #121212;
        }
      </style>

      <div class="modal hidden" id="modal">
        <div class="content" id="modal-body">
          <div class="modal-actions flex justify-between items-center mb-4">
            <h2 id="title">Podcast Title</h2>
            <button id="close">&times;</button>
          </div>
          <img id="pod-image" src="" alt="" class="rounded-md mb-4 w-[250px] h-[200px]">
          <p id="pod-desc"></p>
          <div id="genre-list" class="flex flex-wrap items-start gap-1 mb-4"></div>
          <div id="seasons-container" class="form-group relative mb-6"></div>
          <span id="updated" class="text-sm truncate"></span>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.modal = this.shadowRoot.querySelector("#modal");
    this.titleEl = this.shadowRoot.querySelector("#title");
    this.descEl = this.shadowRoot.querySelector("#pod-desc");
    this.imageEl = this.shadowRoot.querySelector("#pod-image");
    this.genreListEl = this.shadowRoot.querySelector("#genre-list");
    this.seasonsEl = this.shadowRoot.querySelector("#seasons-container");
    this.updatedEl = this.shadowRoot.querySelector("#updated");

    // Close button
    this.shadowRoot.querySelector("#close").addEventListener("click", () => this.close());

    // Click outside modal to close
    this.modal.addEventListener("click", e => {
      if (e.target === this.modal) this.close();
    });
  }

  open(podcast) {
    // Set title, description, updated
    this.titleEl.textContent = podcast.title || "Untitled";
    this.descEl.textContent = podcast.description || "No description available";
    this.updatedEl.textContent = podcast.updated
      ? `Last updated: ${new Date(podcast.updated).toLocaleDateString()}`
      : "";

    // Set image (handle missing image)
    this.imageEl.src = podcast.image || "placeholder.jpg"; // replace with placeholder if needed
    this.imageEl.alt = podcast.title || "Podcast image";

    // Render genres
    this.genreListEl.innerHTML = "";
    if (Array.isArray(podcast.genres) && podcast.genres.length > 0) {
      podcast.genres.map(id => genres.find(g => g.id === id)?.title || "Unknown")
        .forEach(title => {
          const span = document.createElement("span");
          span.className = "genre-tag";
          span.textContent = title;
          this.genreListEl.appendChild(span);
        });
    } else {
      this.genreListEl.innerHTML = "<em>No genres available</em>";
    }

    // Render seasons
    this.seasonsEl.innerHTML = "";
    if (Array.isArray(podcast.seasons) && podcast.seasons.length > 0) {
      podcast.seasons.forEach(s => {
        const div = document.createElement("div");
        div.textContent = `${s.title || "Season"}: ${s.episodes || 0} episodes`;
        this.seasonsEl.appendChild(div);
      });
    } else {
      this.seasonsEl.innerHTML = "<em>No seasons available</em>";
    }

    // Show modal
    this.modal.classList.remove("hidden");
  }

  close() {
    this.modal.classList.add("hidden");
  }
}

// Define the element
customElements.define("podcast-modal", PodcastModal);

// Ensure a modal exists in the DOM
let modalEl = document.querySelector("podcast-modal");
if (!modalEl) {
  modalEl = document.createElement("podcast-modal");
  document.body.appendChild(modalEl);
}

// Attach click events to podcast cards
document.querySelectorAll(".podcast-card").forEach(card => {
  card.addEventListener("click", () => {
    const podcastId = parseInt(card.getAttribute("data-id"));
    const podcastObj = podcasts.find(p => p.id === podcastId);
    if (podcastObj) modalEl.open(podcastObj);
  });
});
