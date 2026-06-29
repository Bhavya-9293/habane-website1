/* HABÄNE — smart feature detail dynamic page logic */

(function () {
  const H = window.HABANE;

  const DETAILS = {
    usb: {
      steps: [
        "Locate the USB interface on the side charging panel of the bag.",
        "Connect your internal power bank (in its dedicated slot) to the built-in USB cord.",
        "Plug your phone's charging cable into the external USB-A/C port to charge on the go."
      ],
      techInfo: "Our pass-through charging ports support USB-A and USB-C connections. Built with heavy-duty weather seals, the ports are IPX4 water-resistant and withstand dust, rain, and impacts."
    },
    power: {
      steps: [
        "Open the dedicated power compartment in the lining.",
        "Slide your standard 10,000mAh or 20,000mAh power bank into the snug neoprene pocket.",
        "Plug the integrated cable into your power bank's output port."
      ],
      techInfo: "The pocket is lined with shock-absorbent EVA foam. It features custom elastic cable routing channels that prevent cord bending and connection wear over time."
    },
    fingerprint: {
      steps: [
        "Hold the fingerprint sensor inside the main lock for 3 seconds to enter registration mode.",
        "Tap your finger 5 times to register your unique biometric signature.",
        "Simply touch the external sensor for 0.3s to instantly pop open the zippers."
      ],
      techInfo: "Uses an advanced capacitive biometric sensor storing up to 10 fingerprints. Powered by an internal lithium-ion battery that lasts 6 months on a single USB-C charge. Includes physical backup key override."
    },
    tsa: {
      steps: [
        "Set your custom 3-digit combination on the lock body.",
        "Push your zipper pulls into the heavy-duty lock slots until they click shut.",
        "TSA agents can access the interior using secure master keys without breaking your bag."
      ],
      techInfo: "Travel Sentry approved design meets airport security standards globally. Built with high-strength zinc alloy housing that resists tampering and physical force."
    },
    gps: {
      steps: [
        "Unzip the hidden lining pocket in the center section.",
        "Slide your Apple AirTag, Tile, or other smart tracker into the elastic pocket.",
        "Open your tracking app on your phone to see your bag's location in real-time."
      ],
      techInfo: "Features a dedicated pocket that shields against physical drops but is RF-transparent. This allows cellular and Bluetooth signals to pass through easily while keeping the tracker completely hidden from plain view."
    },
    antitheft: {
      steps: [
        "Utilize the double-layer anti-puncture zippers to seal the main pockets.",
        "Lock the zipper pulls into the integrated locking dock.",
        "Secure the bag to fixed objects using the lockable steel wire leash."
      ],
      techInfo: "Engineered with built-in lightweight steel mesh inside the canvas layers, preventing slash-and-grab thefts. Hidden zipper paths keep pulls tucked away when walking in crowds."
    },
    laptop: {
      steps: [
        "Unzip the dedicated lay-flat tech compartment.",
        "Slide your laptop into the suspended sleeve lined with soft microfiber.",
        "Secure the velcro strap to lock your laptop firmly in place."
      ],
      techInfo: "Suspended laptop sleeve design prevents the computer from hitting the floor when the bag is dropped. Fits devices up to 16\" (including MacBook Pro 16) with reinforced corner protectors."
    },
    hidden: {
      steps: [
        "Locate the hidden zipper pocket built into the padded back lumbar support.",
        "Slide your passport, credit cards, or cash inside.",
        "Put the bag on - the pocket will be pressed against your back, completely unreachable by others."
      ],
      techInfo: "Designed in the back cushioning panel of the bag to remain completely invisible while worn. Lined with waterproof fabric to keep documents safe from sweat and rain."
    },
    water: {
      steps: [
        "Expose the bag to rain, snow, or accidental spills.",
        "Watch liquid instantly bead up and roll off the coated canvas exterior.",
        "Wipe clean with a dry cloth - no moisture penetrates the inside compartments."
      ],
      techInfo: "Crafted from 1000D tech canvas treated with a Durable Water Repellent (DWR) coating. Lined with PU backing to offer premium weather protection (IPX4 rating)."
    },
    expand: {
      steps: [
        "Locate the hidden perimeter zipper around the bag body.",
        "Unzip the gusset to release the folded fabric expansion layer.",
        "Pull the internal compression straps to secure the cargo and keep it stable."
      ],
      techInfo: "Adds up to 8 Liters of extra storage capacity. Perfect for transitioning the bag from a daily work commuter to an overhead-bin travel duffel."
    },
    org: {
      steps: [
        "Use the structured internal panels to organize socks, shirts, and cables.",
        "Place shoes or dirty clothes in the ventilated bottom garage pocket.",
        "Pack tech accessories into the grid pocket layout for easy access."
      ],
      techInfo: "Built with labeled internal compartments for intuitive packing. Includes wet/dry split pocket dividers, laundry bags, and mesh zip pouches."
    },
    rfid: {
      steps: [
        "Place your credit cards, debit cards, and passports into the RFID-labeled pocket.",
        "Close the secure zip cover.",
        "Walk confidently through terminals knowing your card chips cannot be scanned remotely."
      ],
      techInfo: "Pocket is lined with a high-density nickel/copper composite fabric that blocks standard RFID/NFC scanner frequencies (13.56 MHz), preventing digital pickpocketing."
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();

    // 1. Parse query parameter ID
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (!id) {
      window.location.href = 'smart-series.html';
      return;
    }

    // 2. Find feature info
    const feature = H.SMART_FEATURES.find(f => f.id === id);
    if (!feature) {
      window.location.href = 'smart-series.html';
      return;
    }

    // 3. Populate header/hero content
    const titleEl = document.getElementById('fdTitle');
    const descEl = document.getElementById('fdDesc');
    const iconEl = document.getElementById('fdIcon');
    const stepsEl = document.getElementById('fdSteps');
    const techEl = document.getElementById('fdTechInfo');

    if (titleEl) titleEl.textContent = feature.title;
    if (descEl) descEl.textContent = feature.desc;
    if (iconEl) {
      iconEl.innerHTML = H.icon(feature.icon);
      H.refreshIcons(iconEl);
    }

    // 4. Map How It Works steps
    const details = DETAILS[id] || { steps: ["Unlock and locate the feature.", "Use as designed for daily smart travel."], techInfo: "Detailed specifications for this feature are being rolled out with our latest travel drops." };
    if (stepsEl) {
      stepsEl.innerHTML = details.steps.map(step => `<li>${step}</li>`).join('');
    }
    if (techEl) {
      techEl.textContent = details.techInfo;
    }

    // 5. Query and render compatible products
    const grid = document.getElementById('compatibleGrid');
    if (grid) {
      const compatProducts = H.PRODUCTS.filter(p => p.smartFeatures && p.smartFeatures.includes(id));
      if (compatProducts.length > 0) {
        grid.innerHTML = compatProducts.map(p => H.cardHTML(p)).join('');
        H.bindGrid(grid);
        H.observeCards();
        H.refreshIcons(grid);
      } else {
        grid.innerHTML = `<p class="shop-empty">No current models contain this feature. Stay tuned for our next travel collection drop.</p>`;
      }
    }
  });
})();
