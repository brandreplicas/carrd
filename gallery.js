"use strict";
(function (window, document, undef) {
    var msg = encodeURIComponent("Hi Fashluxee,\nI would like to talk about this item: \n\n ");
    var phone = "919503021689";
    var wsl = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + msg;
    var vdos = /(mp4|3gp|ogg|avi|mov|wmv|flv|webm|mkv)/;
    var poto = /(png|jpg|jpeg|gif|webp|bmp|tiff|svg)/;
    var mail_to = "mailto:brandreplicastore@gmail.com?subject=Catalog%20Product%20Enquiry&body=";
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
    var cath = null;
    var catbar = null;
    var tgl = null;
    let go_left = -1;
    let go_right = 1;

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
        document.body.appendChild(lazyJs);
    }

    var push_medias = function (data) {
        moreLocked = false;
        console.log("medias", data);
        if (!data.length) {
            noteEl.classList.add("d-none");
            lastEl.classList.add("d-none");
            if (!pos) {
                resEl.classList.remove("d-none");
            } else {
                hadEl.classList.remove("d-none");
            }
            return;
        }
        pos += data.length;
        data.forEach((src) => {
            var media = "";
            if (!poto.test(src)) {
                return;
            }
            let file = src.split("/").pop();
            let link = encodeURIComponent(src);
            let wa_link = wsl + link;
            let email = mail_to + msg + link;
            let uuid = generateUUIDNoHyphens();
            let url = src;
            try {
                let urls = JSON.parse(src);
                src = urls;
            } catch (e) {
                src = url;
            }
            let group = Array.isArray(src) && src.length > 1;
            if (group) {
                let show = 0;
                put_group(src, uuid, show);
                src = src[show];
            }
            let html = [
                '<div class="gallery-item" tabindex="0">',
                '<img id="',
                uuid,
                '" class="gallery-image"/>',
                '<div class="foot">'
            ];
            if (group) {
                html.push(
                    ...[
                        '<a aria-label="go left" class="icon left d-none" href="#!" onclick="left_img(\'',
                        uuid,
                        '\')" data-for="',
                        uuid,
                        '" data-direction="',go_left,
                        '"><img alt="left" src="left.svg" width="30"/></a>'
                    ]
                );
            }
            html.push(
                ...[
                    '<a aria-label="chat" class="icon chat" target="_blank" href="',
                    wa_link,
                    '"><img alt="chat" src="chat.svg" width="30"/></a>',
                    '<a aria-label="email" class="icon email" target="_blank" href="',
                    email,
                    '"><img alt="email" src="email.svg" width="30"/></a>',
                    '<a aria-label="download" class="icon eye" target="_blank" download="',
                    file,
                    '" href="',
                    src,
                    '"><img alt="download" src="download.svg" width="30"/></a>'
                ]
            );
            if (group) {
                html.push(
                    ...[
                        '<a aria-label="go right" class="icon right" href="#!" onclick="right_img(\'',
                        uuid,
                        '\')" data-for="',
                        uuid,
                        '" data-direction="',go_right,
                        '"><img alt="right" src="right.svg" width="30"/></a>'
                    ]
                );
            }
            html.push(...["</div>", "</div>"]);
            listEl.innerHTML += html.join("");
            lazy_img(src, uuid);
        });
        scroller();
    };

    var push_categories = function (data) {
        console.log("categories", data);
        let catEl = document.querySelector("#cat");
        var first = null;
        data.forEach((item) => {
            var list = document.createElement("li");
            catEl.appendChild(list);
            var a = document.createElement("a");
            list.appendChild(a);
            a.className = "d-link";
            a.href = "#";
            a.textContent = item.text;
            a.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                on_category_changed(item);
                return false;
            };
            if (!first) {
                first = a;
            }
        });
        first.click();
    };

    function outViewport(el) {
        var rect = el.getBoundingClientRect();
        return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
    }

    function loadMore() {
        if (moreLocked || !cath || !cat_item) {
            return;
        }
        moreLocked = true;
        var cat_id = cat_item.value;
        loadNewScript([medUrl, "?pos=", pos, "&cat_id=", cat_id, "&ts=", Date.now()].join(""));
    }

    function scroller() {
        if (lastEl && outViewport(lastEl)) return;
        loadMore();
    }

    function generateUUIDNoHyphens() {
        let array = new Uint8Array(16);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(array); // Use crypto if available
        } else {
            // Fallback for older browsers
            for (let i = 0; i < 16; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
        }

        // Set UUID version (4) and variant bits
        array[6] = (array[6] & 0x0f) | 0x40;
        array[8] = (array[8] & 0x3f) | 0x80;

        // Convert to hex string without hyphens
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    }

    function on_category_changed(item) {
        cat_item = item;
        pos = 0;
        cath.textContent = cat_item.text;
        listEl.innerHTML = "";
        catbar.classList.remove("left-0");
        noteEl.classList.remove("d-none");
        lastEl.classList.remove("d-none");
        resEl.classList.add("d-none");
        hadEl.classList.add("d-none");
        loadMore();
    }

    function tgl_sidebar(show) {
        tgl.checked = show;
    }

    function page_init() {
        listEl = document.querySelector(".gallery");
        lastEl = document.querySelector(".loader");
        noteEl = document.querySelector("#load-note");
        resEl = document.querySelector("#no-result");
        hadEl = document.querySelector("#last-result");
        cath = document.querySelector("#cath");
        catbar = document.querySelector(".sidebar.cat");
        tgl = document.querySelector("#toggle");
        cath.addEventListener("click", (e) => {
            e.preventDefault();
            let open = "left-0";
            if (catbar.classList.contains(open)) {
                catbar.classList.remove(open);
            } else {
                catbar.classList.add(open);
            }
            return false;
        });
        loadNewScript(catUrl);
    }

    function lazy_img(src, id) {
        var el = document.getElementById(id);
        el.src = "fashluxee-logo-transformed.png";
        el.alt = src;
        var img = new Image();
        img.onload = function () {
            el.src = src;
        };
        img.src = src;
    }

    const groups = {};

    function put_group(urls, uuid, show) {
        groups[uuid] = { urls, show };
    }

    function update_img(uuid, direction) {
        const group = groups[uuid];
        if (!group) return;

        const { urls } = group;
        let { show } = group;

        const newIndex = show + direction;
        if (newIndex < 0 || newIndex >= urls.length) return;

        const src = urls[newIndex];
        if (!src) return;

        group.show = newIndex;
        lazy_img(src, uuid);
        if(go_left === direction){
            toggle_img_arrows(uuid, go_right, true);
        }
        if(go_right === direction){
            toggle_img_arrows(uuid, go_left, true);
        }
        if (newIndex === 0){
            toggle_img_arrows(uuid, go_left, false);
        }
        if(newIndex === urls.length-1){
            toggle_img_arrows(uuid, go_right, false);
        }
    }

    function toggle_img_arrows(uuid, direction, to_show){
        let arrow = document.querySelector('a[data-for="'+uuid+'"][data-direction="'+direction+'"]');
        let _class = 'd-none';
        arrow.classList.add(_class);
        if(to_show)arrow.classList.remove(_class);
    }
    
    function left_img(uuid) {
        update_img(uuid, go_left);
    }

    function right_img(uuid) {
        update_img(uuid, go_right);
    }

    window.push_medias = push_medias;
    window.push_categories = push_categories;
    window.left_img = left_img;
    window.right_img = right_img;
    document.addEventListener("scroll", scroller, false);
    document.addEventListener("DOMContentLoaded", page_init, false);
})(window, document);
