/* ============================================================
    MARQUEE VIDEO LIST
============================================================ */
const marqueeVideos = [
    { id: "Ol6lj7PlepE", thumb: "https://i.ytimg.com/vi/Ol6lj7PlepE/hq720.jpg", title: "Real State" },
    { id: "RffMtROZP-w", thumb: "https://i.ytimg.com/vi/RffMtROZP-w/hq720.jpg", title: "Advertisment" },
    { id: "leRKGx927aA", thumb: "https://i.ytimg.com/vi/leRKGx927aA/hq720.jpg", title: "Podcast" },
    { id: "iUchqSKX6u4", thumb: "https://i.ytimg.com/vi/iUchqSKX6u4/hq720.jpg", title: "Gym" },
    { id: "gC19MqJSaFg", thumb: "https://i.ytimg.com/vi/gC19MqJSaFg/hq720.jpg", title: "Talking Head" },
    { id: "DzBjGQZKR1k", thumb: "https://i.ytimg.com/vi/DzBjGQZKR1k/hq720.jpg", title: "Vlogs" }
];

// Global object to hold YouTube Player instances
const youtubePlayers = {}; 

/* ============================================================
    1. LOAD YOUTUBE API
============================================================ */
// This function will be called when the API is ready.
function onYouTubeIframeAPIReady() {
    document.querySelectorAll(".video-hover-card").forEach(card => {
        const videoId = card.getAttribute('data-video-id');
        
        // Only initialize players for the original cards
        if (card.closest(".duplicate-card")) return;

        youtubePlayers[videoId] = new YT.Player(`player-${videoId}`, {
            videoId: videoId,
            playerVars: {
                'controls': 1,  
                'autoplay': 0, 
                'mute': 1, // Start muted as per best practice
                'enablejsapi': 1,
                'loop': 1,
                'playlist': videoId, 
                'fs': 1          // Explicitly enables fullscreen button
            },
            events: {
                'onReady': onPlayerReady
            }


            
        });
    });
}

function onPlayerReady(event) {
    // Ensure the player is muted when ready
    event.target.mute();

    // 2. *** CRITICAL FULLSCREEN FIX ***
    // Get the actual iframe element that the API created
    const iframe = event.target.getIframe(); 
    
    if (iframe) {
        // Add the necessary 'allow' attribute for modern browser fullscreen support
        // We ensure 'fullscreen' is included in the policy list.
        iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
        
        // This attribute is also necessary for older browser compatibility
        iframe.setAttribute('allowfullscreen', true); 
    }
}

// Load the IFrame Player API asynchronously
function loadYouTubeAPI() {
    if (typeof YT == 'undefined' || typeof YT.Player == 'undefined') {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        onYouTubeIframeAPIReady();
    }
}

/* ============================================================
    2. CREATE MARQUEE CARDS
============================================================ */
function createMarqueeCards(container) {
    container.innerHTML = "";
    marqueeVideos.forEach(video => {
        const card = document.createElement("div");
        card.className = "marquee-card flex-shrink-0 transition-transform duration-300 hover:scale-[1.05] original-card";
        card.innerHTML = `
            <div class="relative w-full aspect-video video-hover-card" data-video-id="${video.id}">
                <img src="${video.thumb}" class="video-thumb w-full h-full object-cover rounded-md absolute inset-0">
                <div class="marquee-title-bar">${video.title.toUpperCase()}</div>
                <div id="player-${video.id}" class="marquee-video absolute inset-0 w-full h-full rounded-md hidden"></div>
                </div>
        `;
        container.appendChild(card);
    });
}

/* ============================================================
    3. INIT MARQUEE
============================================================ */
function initMarquee() {
    const marqueeInner = document.getElementById("marqueeInner");
    
    // Clear and create cards
    createMarqueeCards(marqueeInner); 
    loadYouTubeAPI();

    // Duplicate cards ONLY on desktop for smooth looping
    if (window.innerWidth > 640) {
        const originalCards = Array.from(marqueeInner.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("duplicate-card");
            
            const videoId = card.querySelector(".video-hover-card").getAttribute('data-video-id');
            const clonedPlayerDiv = clone.querySelector(`#player-${videoId}`);
            const newVideoId = `${videoId}-clone`;

            if (clonedPlayerDiv) {
                clonedPlayerDiv.id = `player-${newVideoId}`;
                clone.querySelector(".video-hover-card").setAttribute('data-video-id', newVideoId);
            }
            marqueeInner.appendChild(clone);
        });
    }
}
window.addEventListener("load", initMarquee);
window.addEventListener("resize", initMarquee);

/* ============================================================
    4. SMOOTH MARQUEE SCROLL
============================================================ */
const marqueeWrapper = document.getElementById("marqueeWrapper");
const marqueeInner = document.getElementById("marqueeInner");
let scrollSpeed = 0.9;
let scrollPos = 0;
let isMobile = window.innerWidth <= 640;

function smoothMarquee() {
    if (!isMobile) {
        scrollPos += scrollSpeed;
        const halfWidth = marqueeInner.scrollWidth / 2;
        if (scrollPos >= halfWidth) scrollPos = 0;
        marqueeInner.style.transform = `translateX(${-scrollPos}px)`;
    } else {
        marqueeInner.style.transform = "";
    }
    requestAnimationFrame(smoothMarquee);
}
smoothMarquee();
window.addEventListener("resize", () => isMobile = window.innerWidth <= 640);

/* ============================================================
    5. VIDEO PLAY / PAUSE LOGIC
============================================================ */

/**
 * Stops all currently playing videos, mutes them, and resumes the marquee.
 */
function stopAllVideos() {
    document.querySelectorAll(".video-hover-card").forEach(card => {
        const videoId = card.getAttribute('data-video-id');
        const player = youtubePlayers[videoId];
        const playerDiv = document.getElementById(`player-${videoId}`); 
        const thumb = card.querySelector(".video-thumb");
        
        // 1. Pause the video, mute it, and reset API player state
        if (player && player.pauseVideo) {
            player.pauseVideo();
            player.seekTo(0);
            player.mute(); 
        }

        // 2. Hide the player and show the thumbnail
        if (playerDiv) playerDiv.classList.add("hidden");
        if (thumb) thumb.style.opacity = "1";
    });
    // CRITICAL: Resumes the marquee animation
    scrollSpeed = 0.9; 
}

/**
 * Plays a specific video card.
 * @param {HTMLElement} card The .video-hover-card element.
 */
function playVideo(card) {
    const videoId = card.getAttribute('data-video-id');
    const player = youtubePlayers[videoId];
    const playerDiv = document.getElementById(`player-${videoId}`);
    const thumb = card.querySelector(".video-thumb");

    if (!player || !playerDiv) return;

    // 1. Use the API to start playing (muted)
    if (player.playVideo) {
        player.playVideo();
        player.mute(); 
    }

    // 2. Show the player
    if (thumb) thumb.style.opacity = "0";
    playerDiv.classList.remove("hidden");
    
    // Stop the marquee animation
    scrollSpeed = 0; 
}

// --- Desktop Hover Logic ---
marqueeInner.addEventListener("mouseenter", e => {
    if (isMobile) return;
    const card = e.target.closest(".video-hover-card");
    if (!card) return;
    if (card.closest(".duplicate-card")) return; // Ignore duplicates

    stopAllVideos();
    playVideo(card);

}, true);

// FIX: Marquee Resuming - Mouse leaves the whole inner container
marqueeInner.addEventListener("mouseleave", e => {
    if (isMobile) return;
    
    // When the mouse leaves the entire inner container, stop all videos.
    // stopAllVideos() automatically sets scrollSpeed = 0.9, resuming the marquee.
    stopAllVideos();
});

// --- Mobile Tap Logic ---
marqueeInner.addEventListener("click", e => {
    if (!isMobile) return;
    const card = e.target.closest(".video-hover-card");
    if (!card || card.closest(".duplicate-card")) return;

    const playerDiv = document.getElementById(`player-${card.getAttribute('data-video-id')}`);
    const isPlaying = playerDiv && !playerDiv.classList.contains("hidden");

    stopAllVideos(); 

    if (!isPlaying) {
        // If it was *not* playing, play it now.
        playVideo(card);
    }
});

// Click outside to stop all videos (desktop and mobile)
// Click outside to stop all videos (desktop and mobile) - FIX
document.addEventListener("click", e => {
    // Stop the video only if the click is outside the card entirely.
    if (!e.target.closest(".video-hover-card")) {
        stopAllVideos();
    } 
    // If the click is inside the card, but not the thumbnail (meaning it's on the player/controls), 
    // we let the native controls handle it.
});
  // Animated typing effect using your exact logic
  
 

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (since you are using it in the HTML)
    AOS.init({
        duration: 800,
        once: true,
    });

    const menuButton = document.getElementById('mobile-menu-button');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    // Function to toggle the menu state
    function toggleMenu() {
        // Toggle the class on the button for the cross animation
        menuButton.classList.toggle('menu-open'); 
        
        // Toggle the class on the overlay for the slide animation
        if (menuOverlay.classList.contains('translate-x-full')) {
            // Open menu
            menuOverlay.classList.remove('translate-x-full');
            // Add a class to the body to prevent scrolling when menu is open
            document.body.style.overflow = 'hidden'; 
        } else {
            // Close menu
            menuOverlay.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // 1. Open/Close on Button Click
    menuButton.addEventListener('click', toggleMenu);

    // 2. Close when a link is clicked (for smooth scroll to section)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Wait slightly longer than the AOS delay to ensure the animation starts
            setTimeout(toggleMenu, 100); 
        });
    });

    // 3. Close menu on resize above MD breakpoint (desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && !menuOverlay.classList.contains('translate-x-full')) {
            // Close menu if resized to desktop size while open
            toggleMenu(); 
        }
    });
});




        // Function to handle form submission
        function handleSubmit(event) {
            event.preventDefault(); // Stop the default form submission

            const messageBox = document.getElementById('messageBox');
            const messageText = document.getElementById('messageText');
            const form = document.getElementById('contactForm');
            const submitButton = document.getElementById('submitButton');

            // 1. Disable the button and show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('opacity-70'); // Dim the button while loading

            // Clear previous messages
            messageBox.classList.add('hidden');
            
            // 2. Simulate API call / form processing (Replace with real logic if needed)
            setTimeout(() => {
                // Assuming successful submission for this example
                const success = true;

                // Reset message box classes (Dark Mode adjustments)
                messageBox.classList.remove('hidden', 'bg-red-800', 'border-red-600', 'text-red-300', 'bg-green-800', 'border-green-600', 'text-green-300', 'bg-gray-800', 'border-gray-600', 'text-gray-200');
                
                if (success) {
                    // Success state (Dark Mode Colors)
                    messageBox.classList.add('bg-green-800', 'border-green-600', 'text-green-300');
                    messageText.textContent = 'Success! Your message has been sent.';
                    form.reset(); // Clear the form fields
                } else {
                    // Error state (Dark Mode Colors)
                    messageBox.classList.add('bg-red-800', 'border-red-600', 'text-red-300');
                    messageText.textContent = 'Error: Could not send message. Please try again.';
                }

                // Show the message box
                messageBox.classList.remove('hidden');

                // 3. Reset button state
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-70');

                // 4. Optionally hide the message after a few seconds
                setTimeout(() => {
                    messageBox.classList.add('hidden');
                }, 5000);

            }, 2000); // 2 second delay to simulate network latency
        }


       
 const desktopVideo = document.getElementById("videoDesktop");
    const mobileVideo = document.getElementById("videoMobile");

    const desktopBtn = document.getElementById("soundToggleDesktop");
    const mobileBtn = document.getElementById("soundToggleMobile");

    function toggleSound(video, btn) {
        video.muted = !video.muted;
        btn.textContent = video.muted ? "🔇" : "🔊";
    }

    desktopBtn.addEventListener("click", () => toggleSound(desktopVideo, desktopBtn));
    mobileBtn.addEventListener("click", () => toggleSound(mobileVideo, mobileBtn));


    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    });

    // Hide loader and show floating buttons when page is fully loaded
    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        const floatingButtons = document.querySelector('.floating-buttons-mobile');
        
        // Fade out loader
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        
        setTimeout(function() {
            loader.style.display = 'none';
            // Show floating buttons after loader disappears
            if (floatingButtons) {
                floatingButtons.classList.add('show');
            }
        }, 500);
    });