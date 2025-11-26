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

/* ============================================================
   CREATE MARQUEE CARDS
============================================================ */
function createMarqueeCards(container) {
    marqueeVideos.forEach(video => {
        const card = document.createElement("div");
        card.className = "marquee-card flex-shrink-0 transition-transform duration-300 hover:scale-[1.05] original-card";
        card.innerHTML = `
            <div class="relative w-full aspect-video video-hover-card" data-video-id="${video.id}" id="card-${video.id}">
                <img src="${video.thumb}" class="video-thumb w-full h-full object-cover rounded-md absolute inset-0">
                <div class="marquee-title-bar">${video.title.toUpperCase()}</div>
                <iframe id="player-${video.id}" class="marquee-video absolute inset-0 w-full h-full rounded-md hidden"
                    src="https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&enablejsapi=1"
                    allow="autoplay" allowfullscreen></iframe>
                <button class="unmute-btn absolute top-2 right-2 bg-white/80 rounded-full p-1 hidden z-20">🔊</button>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ============================================================
   INIT MARQUEE
============================================================ */
function initMarquee() {
    const marqueeInner = document.getElementById("marqueeInner");
    marqueeInner.innerHTML = "";
    createMarqueeCards(marqueeInner);

    // Duplicate cards on desktop for smooth looping
    if (window.innerWidth > 640) {
        const originalCards = Array.from(marqueeInner.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("duplicate-card");
            marqueeInner.appendChild(clone);
        });
    }
}

window.addEventListener("load", initMarquee);
window.addEventListener("resize", initMarquee);

/* ============================================================
   SMOOTH MARQUEE SCROLL
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
   VIDEO PLAY / PAUSE LOGIC
============================================================ */
function stopAllVideos() {
    document.querySelectorAll(".video-hover-card").forEach(card => {
        const thumb = card.querySelector(".video-thumb");
        const iframe = card.querySelector("iframe");
        const unmuteBtn = card.querySelector(".unmute-btn");
        if (iframe) {
            iframe.classList.add("hidden");
            iframe.src = iframe.src.replace("mute=0", "mute=1"); // reset mute
        }
        if (thumb) thumb.style.opacity = "1";
        if (unmuteBtn) unmuteBtn.style.display = "none";
    });
    scrollSpeed = 0.9; // resume marquee
}

// Desktop hover logic
marqueeInner.addEventListener("mouseenter", e => {
    if (isMobile) return;
    const card = e.target.closest(".video-hover-card");
    if (!card) return;

    stopAllVideos();
    const thumb = card.querySelector(".video-thumb");
    const iframe = card.querySelector("iframe");
    const unmuteBtn = card.querySelector(".unmute-btn");

    if (thumb) thumb.style.opacity = "0";
    if (iframe) iframe.classList.remove("hidden");
    if (unmuteBtn) unmuteBtn.style.display = "block";
    scrollSpeed = 0;
}, true);

// Desktop leave
marqueeInner.addEventListener("mouseleave", e => {
    if (isMobile) return;
    const card = e.target.closest(".video-hover-card");
    if (!card) return;
    stopAllVideos();
});

// Mobile tap logic
marqueeInner.addEventListener("click", e => {
    if (!isMobile) return;
    const card = e.target.closest(".video-hover-card");
    if (!card) return;

    const thumb = card.querySelector(".video-thumb");
    const iframe = card.querySelector("iframe");
    const unmuteBtn = card.querySelector(".unmute-btn");

    const isHidden = iframe.classList.contains("hidden");

    stopAllVideos(); // stop all videos before playing tapped one

    if (isHidden) {
        if (thumb) thumb.style.opacity = "0";
        if (iframe) iframe.classList.remove("hidden");
        if (unmuteBtn) unmuteBtn.style.display = "block";
        scrollSpeed = 0;
    }
});

// Click outside to stop all videos (desktop and mobile)
document.addEventListener("click", e => {
    if (!e.target.closest(".video-hover-card")) {
        stopAllVideos();
    }
});

// Unmute button logic
marqueeInner.addEventListener("click", e => {
    const btn = e.target.closest(".unmute-btn");
    if (!btn) return;
    e.stopPropagation();

    const card = btn.closest(".video-hover-card");
    const iframe = card.querySelector("iframe");
    if (!iframe) return;

    if (iframe.src.includes("mute=1")) {
        iframe.src = iframe.src.replace("mute=1", "mute=0");
    }
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