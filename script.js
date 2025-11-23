/* ============================================================
   MARQUEE VIDEO LIST
============================================================ */
const marqueeVideos = [
    {
  id: "Ol6lj7PlepE", thumb: "https://i.ytimg.com/vi/Ol6lj7PlepE/hq720.jpg",title: "Real State",iframeSrc: "https://www.youtube.com/embed/Ol6lj7PlepE?list=PLQhU-CdBeWjpVlLKG-HJGQTZNzSdwc8i6" },

    { id: "RffMtROZP-w", thumb: "https://i.ytimg.com/vi/RffMtROZP-w/hq720.jpg", title: "Advertisment" },
    { id: "leRKGx927aA", thumb: "https://i.ytimg.com/vi/leRKGx927aA/hq720.jpg", title: "Podcast" },
    { id: "iUchqSKX6u4", thumb: "https://i.ytimg.com/vi/iUchqSKX6u4/hq720.jpg", title: "Gym" },
    { id: "gC19MqJSaFg", thumb: "https://i.ytimg.com/vi/gC19MqJSaFg/hq720.jpg", title: "Talking Head" },
   {id: "DzBjGQZKR1k",thumb: "https://i.ytimg.com/vi/DzBjGQZKR1k/hq720.jpg",title: "Vlogs",iframeSrc: "https://www.youtube.com/embed/DzBjGQZKR1k?list=PLQhU-CdBeWjqysahyTTz4JzRhLirVQVTL"}

];

/* ============================================================
   CREATE MARQUEE CARDS
============================================================ */
function createMarqueeCards(container) {
    marqueeVideos.forEach(video => {
        const card = document.createElement("div");
        card.className = "marquee-card transition-transform duration-300 hover:scale-[1.05] flex-shrink-0 original-card";
        card.innerHTML = `
            <div class="relative w-full aspect-video video-hover-card" data-video-id="${video.id}">
                <img src="${video.thumb}" class="video-thumb w-full h-full object-cover rounded-md absolute inset-0">
                <div class="marquee-title-bar">${video.title.toUpperCase()}</div>
                <iframe class="marquee-video absolute inset-0 w-full h-full rounded-md hidden"
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

    // Duplicate only on desktop for looping
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

let speed = 0.9;
let scrollPos = 0;
let isMobile = window.innerWidth <= 640;

function smoothMarquee() {
    if (!isMobile) {
        scrollPos += speed;
        const halfWidth = marqueeInner.scrollWidth / 2;
        if (scrollPos >= halfWidth) scrollPos = 0;
        marqueeInner.style.transform = `translateX(${-scrollPos}px)`;
    } else {
        marqueeInner.style.transform = "";
    }
    requestAnimationFrame(smoothMarquee);
}
smoothMarquee();

window.addEventListener("resize", () => {
    isMobile = window.innerWidth <= 640;
});

/* ============================================================
   HOVER PLAY VIDEO (MUTED) + SOUND BUTTON
============================================================ */
marqueeInner.addEventListener("mouseover", function (e) {
    const card = e.target.closest(".video-hover-card");
    if (!card || !card.closest(".original-card")) return;

    const thumb = card.querySelector(".video-thumb");
    const iframe = card.querySelector("iframe");
    const unmuteBtn = card.querySelector(".unmute-btn");

    if (thumb) thumb.style.opacity = "0";
    if (iframe) iframe.classList.remove("hidden");
    if (unmuteBtn) unmuteBtn.style.display = "block";

    speed = 0; // Pause marquee
});

// Tap-to-play only on small screens
marqueeInner.addEventListener("click", function (e) {
    if (!isMobile) return; // Only run on mobile

    const card = e.target.closest(".video-hover-card");
    if (!card) return;

    const thumb = card.querySelector(".video-thumb");
    const iframe = card.querySelector("iframe");
    const unmuteBtn = card.querySelector(".unmute-btn");

    // Toggle video visibility
    if (iframe.classList.contains("hidden")) {
        thumb.style.opacity = "0";
        iframe.classList.remove("hidden");
        unmuteBtn.style.display = "block";
        speed = 0; // Pause marquee
    } else {
        thumb.style.opacity = "1";
        iframe.classList.add("hidden");
        unmuteBtn.style.display = "none";
        speed = 0.9; // Resume marquee
    }
});


marqueeInner.addEventListener("mouseout", function (e) {
    const card = e.target.closest(".video-hover-card");
    if (!card || !card.closest(".original-card")) return;

    const thumb = card.querySelector(".video-thumb");
    const iframe = card.querySelector("iframe");
    const unmuteBtn = card.querySelector(".unmute-btn");

    if (thumb) thumb.style.opacity = "1";
    if (iframe) iframe.classList.add("hidden");
    if (unmuteBtn) unmuteBtn.style.display = "none";

    speed = 0.9; // Resume marquee
});

/* ============================================================
   CLICK TO UNMUTE / PLAY SOUND
============================================================ */
marqueeInner.addEventListener("click", function (e) {
    const btn = e.target.closest(".unmute-btn");
    if (!btn) return;

    const card = btn.closest(".video-hover-card");
    const iframe = card.querySelector("iframe");
    if (!iframe) return;

    // Unmute video by reloading src with mute=0
    const src = iframe.src;
    if (src.includes("mute=1")) {
        iframe.src = src.replace("mute=1", "mute=0");
    }
});

/* ============================================================
   AOS + ICONS INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({ duration: 1000, once: true });
    lucide.createIcons();
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