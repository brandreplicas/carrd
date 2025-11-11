"use strict";
(function (window, document, undef) {
  var msg = encodeURIComponent(
    "Hi Fashluxee,\nI would like to talk about this item: \n\n "
  );
  var phone = "919503021689";
  var wsl = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + msg;
  var poto = /(png|jpg|jpeg|gif|webp|bmp|tiff|svg)/;
  var mail_to =
    "mailto:brandreplicastore@gmail.com?subject=Catalog%20Product%20Enquiry&body=";
  var listEl = null;
  var lastEl = null;
  var cat_item = null;
  var noteEl = null;
  var resEl = null;
  var hadEl = null;
  var datUrl = "https://luxury.pythonanywhere.com";
  var catUrl = datUrl + "/category-list";
  var medUrl = datUrl + "/media-list";
  var pos = 0;
  var moreLocked = false;
  let go_left = -1;
  let go_right = 1;

  const lightboxState = {
    currentIndex: 0,
    currentGroup: null,
    currentUuid: null,
    images: [],
  };

  const autoSlideConfig = {
    enabled: true,
    interval: 3000,
    pauseOnHover: true,
  };

  const autoSlideIntervals = new Map();
  const slideStates = new Map();
  const groups = {};

  window.openLightbox = function (uuid, imageIndex = 0) {
    console.log(
      "openLightbox called with uuid:",
      uuid,
      "imageIndex:",
      imageIndex
    );
    const group = groups[uuid];
    if (!group) {
      const imgElement = document.getElementById(uuid);
      if (!imgElement) {
        console.log("Image element not found:", uuid);
        return;
      }

      lightboxState.images = [imgElement.src];
      lightboxState.currentIndex = 0;
      lightboxState.currentGroup = null;
      lightboxState.currentUuid = uuid;
    } else {
      lightboxState.images = group.urls;
      lightboxState.currentIndex = imageIndex;
      lightboxState.currentGroup = group;
      lightboxState.currentUuid = uuid;
    }

    showLightbox();
  };

  function showLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCounter = document.getElementById("lightbox-counter");
    const lightboxDownload = document.getElementById("lightbox-download");
    const lightboxWhatsapp = document.getElementById("lightbox-whatsapp");
    const lightboxEmail = document.getElementById("lightbox-email");

    if (lightboxState.images.length === 0) {
      console.log("No images to show in lightbox");
      return;
    }

    console.log("Showing lightbox with", lightboxState.images.length, "images");

    lightboxImage.style.opacity = "0";

    const currentImage = lightboxState.images[lightboxState.currentIndex];
    const img = new Image();

    img.onload = function () {
      lightboxImage.src = currentImage;
      lightboxImage.alt = `Product image ${lightboxState.currentIndex + 1}`;
      lightboxImage.style.opacity = "1";

      lightboxCounter.textContent = `${lightboxState.currentIndex + 1} / ${
        lightboxState.images.length
      }`;

      const fileName = currentImage.split("/").pop();
      lightboxDownload.href = currentImage;
      lightboxDownload.download = fileName;

      const encodedImage = encodeURIComponent(currentImage);
      lightboxWhatsapp.href = wsl + encodedImage;
      lightboxEmail.href = mail_to + msg + encodedImage;
    };

    img.onerror = function () {
      console.log("Failed to load lightbox image:", currentImage);
      lightboxImage.src = "fashluxee-logo-transformed.png";
      lightboxImage.style.opacity = "1";
    };

    img.src = currentImage;

    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleLightboxKeydown);
  }

  window.closeLightbox = function () {
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleLightboxKeydown);
  };

  window.lightboxNext = function () {
    if (lightboxState.images.length <= 1) return;

    lightboxState.currentIndex =
      (lightboxState.currentIndex + 1) % lightboxState.images.length;
    showLightbox();
  };

  window.lightboxPrev = function () {
    if (lightboxState.images.length <= 1) return;

    lightboxState.currentIndex =
      lightboxState.currentIndex === 0
        ? lightboxState.images.length - 1
        : lightboxState.currentIndex - 1;
    showLightbox();
  };

  function handleLightboxKeydown(e) {
    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        lightboxPrev();
        break;
      case "ArrowRight":
        lightboxNext();
        break;
    }
  }

  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxClose = document.querySelector(".lightbox-close");

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }

    console.log("Lightbox initialized");
  }

  function loadNewScript(src) {
    var sel = "lazy-js";
    var lazyJs = document.querySelector("." + sel);
    if (lazyJs && lazyJs.parentNode) {
      var pe = lazyJs.parentNode;
      pe.removeChild(lazyJs);
    }
    lazyJs = document.createElement("script");
    lazyJs.type = "text/javascript";
    lazyJs.className = sel;
    lazyJs.src = src + "?v=" + Date.now();
    lazyJs.onerror = function () {
      showToast("Failed to load content. Please try again.", "error");
      setTimeout(() => location.reload(), 2000);
    };
    document.body.appendChild(lazyJs);
  }

  window.push_medias = function (data) {
    moreLocked = false;
    console.log("medias", data);

    if (!data.length) {
      noteEl.classList.add("d-none");
      lastEl.classList.add("d-none");
      if (!pos) {
        resEl.classList.remove("d-none");
        showToast("No items found in this category", "warning");
      } else {
        hadEl.classList.remove("d-none");
      }
      return;
    }

    pos += data.length;
    let loadedCount = 0;

    data.forEach((src, index) => {
      if (!poto.test(src)) {
        return;
      }

      let file = src.split("/").pop();
      let link = encodeURIComponent(src);
      let wa_link = wsl + link;
      let email = mail_to + msg + link;
      let uuid = new_uuid();
      let url = src;

      let parsedSrc;
      let group = false;
      let urls = [];

      try {
        parsedSrc = JSON.parse(src);
        if (Array.isArray(parsedSrc) && parsedSrc.length > 1) {
          group = true;
          urls = parsedSrc;
          src = parsedSrc[0];
        } else {
          parsedSrc = src;
        }
      } catch (e) {
        parsedSrc = src;
      }

      if (group) {
        put_group(urls, uuid, 0);
      }

      let html = [
        '<div class="gallery-item" tabindex="0" data-uuid="' + uuid + '"',
        group ? ' data-has-group="true"' : "",
        ">",
        '<div class="gallery-image-container">',
        '<div class="auto-slide-container">',
        '<img id="',
        uuid,
        '" class="gallery-image" src="fashluxee-logo-transformed.png" loading="lazy" alt="Product image" style="cursor: zoom-in;"/>',
      ];

      if (group && urls.length > 1) {
        html.push(
          "</div>",
          '<div class="slider-nav">',
          '<div class="slider-arrow left-arrow" onclick="left_img(\'' +
            uuid +
            "')\">",
          '<img alt="left" src="left.svg" width="16"/>',
          "</div>",
          '<div class="slider-arrow right-arrow" onclick="right_img(\'' +
            uuid +
            "')\">",
          '<img alt="right" src="right.svg" width="16"/>',
          "</div>",
          "</div>",
          '<div class="slider-pagination" id="pagination-' + uuid + '">'
        );

        for (let i = 0; i < urls.length; i++) {
          html.push(
            '<div class="bullet' + (i === 0 ? " active" : "") + '" ',
            "onclick=\"goToSlide('" + uuid + "', " + i + ')" ',
            'data-slide="' + i + '"></div>'
          );
        }

        html.push("</div>");
      } else {
        html.push("</div>");
      }

      html.push(
        "</div>",
        '<div class="gallery-item-info">',
        '<div class="item-actions">',
        '<a aria-label="chat on whatsapp" class="icon chat" target="_blank" href="' +
          wa_link +
          '" title="Chat on WhatsApp">',
        '<img alt="chat" src="chat.svg" width="20"/>',
        "</a>",
        '<a aria-label="send email" class="icon email" target="_blank" href="' +
          email +
          '" title="Send Email">',
        '<img alt="email" src="email.svg" width="20"/>',
        "</a>",
        '<a aria-label="download image" class="icon eye" target="_blank" download="' +
          file +
          '" href="' +
          src +
          '" title="Download Image">',
        '<img alt="download" src="download.svg" width="20"/>',
        "</a>",
        "</div>",
        "</div>",
        "</div>"
      );

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html.join("");
      const newItem = tempDiv.firstChild;
      newItem.style.opacity = "0";
      newItem.style.transform = "translateY(20px)";

      listEl.appendChild(newItem);

      const imgElement = document.getElementById(uuid);
      if (imgElement) {
        imgElement.addEventListener("click", function () {
          console.log("Image clicked, opening lightbox for:", uuid);
          openLightbox(uuid);
        });
      }

      if (group && urls.length > 1) {
        setTimeout(() => {
          initAutoSlide(uuid, urls.length);
        }, 500 + index * 100);
      }

      setTimeout(() => {
        newItem.style.transition = "all 0.5s ease";
        newItem.style.opacity = "1";
        newItem.style.transform = "translateY(0)";
      }, index * 100);

      lazy_img(src, uuid, () => {
        loadedCount++;
      });
    });

    scroller();
  };

  window.push_categories = function (data) {
    console.log("categories", data);
    let catEl = document.querySelector("#cat");
    var first = null;
    var cls = 'px-4 py-2 text-sm tracking-wider transition-colors bg-primary text-primary-foreground';
    data.forEach((item, index) => {
      if(-1 === 'All,Bags,Caps,Hats,Footwears,Watches,Belts,Eyewears,'.indexOf(item.text)) return true;
      var a = document.createElement("button");
      catEl.appendChild(a);
      a.className = cls;
      cls = "px-4 py-2 text-sm tracking-wider transition-colors bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground";
      a.textContent = item.text;
      a.ariaLabel = item.text;
      a.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        autoSlideIntervals.forEach((interval, uuid) => {
          clearInterval(interval);
        });
        autoSlideIntervals.clear();
        slideStates.clear();

        on_category_changed(item);
        return false;
      };

      if (!first) {
        first = a;
      }

      setTimeout(() => {
        a.style.transition = "all 0.3s ease";
        a.style.opacity = "1";
        a.style.transform = "translateX(0)";
      }, index * 100);
    });

    if (first) {
      setTimeout(() => first.click(), 500);
    }
  };

  function outViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.bottom < 0 ||
      rect.right < 0 ||
      rect.left > window.innerWidth ||
      rect.top > window.innerHeight
    );
  }

  function loadMore() {
    if (moreLocked || !cat_item) {
      return;
    }
    moreLocked = true;
    var cat_id = cat_item.value;

    loadNewScript(
      [medUrl, "?pos=", pos, "&cat_id=", cat_id, "&ts=", Date.now()].join("")
    );
  }

  function scroller() {
    if (lastEl && outViewport(lastEl)) return;
    loadMore();
  }

  function new_uuid() {
    let array = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  function on_category_changed(item) {
    autoSlideIntervals.forEach((interval, uuid) => {
      clearInterval(interval);
    });
    autoSlideIntervals.clear();
    slideStates.clear();

    cat_item = item;
    pos = 0;

    listEl.classList.add("loading");
    listEl.innerHTML = "";

    setTimeout(() => {
      listEl.classList.remove("loading");
    }, 1000);

    noteEl.classList.remove("d-none");
    lastEl.classList.remove("d-none");
    resEl.classList.add("d-none");
    hadEl.classList.add("d-none");
    loadMore();
  }

  function getRandomColor() {
    const colors = ["#8b4513", "#d2691e", "#a0522d", "#cd853f", "#deb887"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function page_init() {
    listEl = document.querySelector(".gallery");
    lastEl = document.querySelector(".loader");
    noteEl = document.querySelector("#load-note");
    resEl = document.querySelector("#no-result");
    hadEl = document.querySelector("#last-result");

    initLightbox();

    const loadNoteLink = noteEl.querySelector("a");
    if (loadNoteLink) {
      loadNoteLink.addEventListener("click", function (e) {
        e.preventDefault();
        loadMore();
      });
    }

    loadNewScript(catUrl);
  }

  function lazy_img(_src, _id, onLoad) {
    const imgElement = document.getElementById(_id);
    if (!imgElement) {
      console.log(`Image element not found: ${_id}`);
      if (onLoad) onLoad();
      return;
    }

    imgElement.classList.add("fade-out");

    var img = new Image();
    img.onload = function () {
      imgElement.src = _src;
      setTimeout(() => {
        imgElement.classList.remove("fade-out");
      }, 50);
      if (onLoad) onLoad();
    };

    img.onerror = function () {
      console.log(`Failed to load image: ${_src}`);
      imgElement.src = "fashluxee-logo-transformed.png";
      setTimeout(() => {
        imgElement.classList.remove("fade-out");
      }, 50);
      if (onLoad) onLoad();
    };

    img.src = _src;
  }

  function put_group(urls, uuid, show) {
    groups[uuid] = {
      urls: urls,
      show: show,
    };
    console.log(`Stored group for ${uuid} with ${urls.length} images`);
  }

  window.left_img = function (uuid) {
    update_img(uuid, go_left);
  };

  window.right_img = function (uuid) {
    update_img(uuid, go_right);
  };

  window.goToSlide = function (uuid, slideIndex) {
    const group = groups[uuid];
    const state = slideStates.get(uuid);

    if (!group || !state) {
      console.log(`No group or state found for ${uuid}`);
      return;
    }

    if (slideIndex < 0 || slideIndex >= state.totalSlides) {
      console.log(`Invalid slide index: ${slideIndex}`);
      return;
    }

    const currentIndex = state.currentSlide;
    if (currentIndex === slideIndex) {
      console.log(`Already on slide ${slideIndex}`);
      return;
    }

    console.log(`Navigating from slide ${currentIndex} to ${slideIndex}`);

    state.currentSlide = slideIndex;
    group.show = slideIndex;

    const src = group.urls[slideIndex];
    if (!src) {
      console.log(`No source found for slide ${slideIndex}`);
      return;
    }

    lazy_img(src, uuid);

    updatePagination(uuid, slideIndex);
  };

  function update_img(uuid, direction) {
    const state = slideStates.get(uuid);
    if (!state) {
      console.log(`No state found for ${uuid}`);
      return;
    }

    const group = groups[uuid];
    if (!group) {
      console.log(`No group found for ${uuid}`);
      return;
    }

    let newIndex = state.currentSlide + direction;

    if (newIndex < 0) {
      newIndex = group.urls.length - 1;
    } else if (newIndex >= group.urls.length) {
      newIndex = 0;
    }

    console.log(
      `Manual navigation: Moving from ${state.currentSlide} to ${newIndex}`
    );
    goToSlide(uuid, newIndex);
  }

  function initAutoSlide(uuid, totalSlides) {
    if (!autoSlideConfig.enabled || totalSlides <= 1) return;

    const item = document.querySelector(`[data-uuid="${uuid}"]`);
    if (!item) return;

    console.log(
      `Initializing auto-slide for ${uuid} with ${totalSlides} slides`
    );

    slideStates.set(uuid, {
      currentSlide: 0,
      totalSlides: totalSlides,
      isPaused: false,
    });

    startAutoSlide(uuid);

    item.addEventListener("mouseenter", () => handleHover(uuid, true));
    item.addEventListener("mouseleave", () => handleHover(uuid, false));
    item.addEventListener("touchstart", () => handleHover(uuid, true));
    item.addEventListener("touchend", () => handleHover(uuid, false));
  }

  function handleHover(uuid, isEnter) {
    const state = slideStates.get(uuid);
    if (!state) return;

    if (isEnter) {
      state.isPaused = true;
      clearAutoSlide(uuid);
    } else {
      state.isPaused = false;
      startAutoSlide(uuid);
    }
  }

  function startAutoSlide(uuid) {
    const state = slideStates.get(uuid);
    if (!state || state.isPaused) return;

    clearAutoSlide(uuid);

    const intervalId = setInterval(() => {
      const currentState = slideStates.get(uuid);
      if (!currentState || currentState.isPaused) return;

      let nextSlide = currentState.currentSlide + 1;

      if (nextSlide >= currentState.totalSlides) {
        nextSlide = 0;
      }

      console.log(
        `Auto-slide: Moving from ${currentState.currentSlide} to ${nextSlide}`
      );
      goToSlide(uuid, nextSlide);
    }, autoSlideConfig.interval);

    autoSlideIntervals.set(uuid, intervalId);
  }

  function clearAutoSlide(uuid) {
    const intervalId = autoSlideIntervals.get(uuid);
    if (intervalId) {
      clearInterval(intervalId);
      autoSlideIntervals.delete(uuid);
    }
  }

  function updatePagination(uuid, activeIndex) {
    const pagination = document.getElementById(`pagination-${uuid}`);
    if (!pagination) {
      console.log(`No pagination found for ${uuid}`);
      return;
    }

    const bullets = pagination.querySelectorAll(".bullet");
    bullets.forEach((bullet, index) => {
      if (index === activeIndex) {
        bullet.classList.add("active");
      } else {
        bullet.classList.remove("active");
      }
    });
  }

  function showToast(message, type = "info", duration = 4000) {
    const toastContainer =
      document.querySelector(".toast-container") || createToastContainer();
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.5s ease forwards";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, duration);
  }

  function createToastContainer() {
    const container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
  }

  document.addEventListener("scroll", scroller, false);
  document.addEventListener("DOMContentLoaded", page_init, false);
})(window, document);
