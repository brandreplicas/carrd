'use strict';
(function(window, document, undef){
    var msg = encodeURIComponent('Hi Fashluxee,\nI would like to talk about this item: \n\n ');
    var phone = '919503021689';
    var wsl = 'https://api.whatsapp.com/send?phone='+phone+'&text='+msg;
    var vdos = /(mp4|3gp|ogg|avi|mov|wmv|flv|webm|mkv)/;
    var poto = /(png|jpg|jpeg|gif|webp|bmp|tiff|svg)/;
    var pos = -1;
    var mail_to='mailto:brandreplicastore@gmail.com?subject=Catalog%20Product%20Enquiry&body=';
    var listEl = null;
    var lastEl = null;
    var cat_item = null;
    var noteEl = null;
    var resEl = null;
    var hadEl = null;
    var datUrl = 'https://luxury.pythonanywhere.com';
    var catUrl = datUrl + '/category-list';
    var medUrl = datUrl + '/media-list';
    var pos = 0;
    var moreLocked = false;
    var cath = null;
		var catbar = null;
    var tgl = null;

    function loadNewScript(src) {
      var sel = 'lazy-js';
      var lazyJs = document.querySelector('.'+sel);
      if(lazyJs && lazyJs.parentNode){
        var pe = lazyJs.parentNode;
        pe.removeChild(lazyJs);
      }
      lazyJs = document.createElement('script');
      lazyJs.type = 'text/javascript';
      lazyJs.className = sel;
      lazyJs.src = src+'?v='+Date.now();
      document.body.appendChild(lazyJs);
    }

    var push_medias = function (data){
        moreLocked = false;
        console.log('medias',data);
        if(!data.length){
            noteEl.classList.add('d-none');
            lastEl.classList.add('d-none');
            if(!pos){
                resEl.classList.remove('d-none');
            } else {
                hadEl.classList.remove('d-none');
            }
            return;
        }
        pos += data.length;
        data.forEach(src => {
            var media = '';
             if(!poto.test(src)){
                return;
            }
            let file = src.split('/').pop();
            let link = encodeURIComponent(src);
            let wa_link = wsl + link;
            let email = mail_to + msg + link;
            let uuid = crypto.randomUUID().replaceAll('-','');
            let url = src;
            try{
                let urls = JSON.parse(src);
                src = urls;
            }catch(e){
                src = url;
            }
            let group = (Array.isArray(src) && src.length > 1);
            if(group){
                let show = 0;
                put_group(src, uuid, show);
                src = src[show];
            }
            let html = [
                '<div class="gallery-item" tabindex="0">',
                    '<img id="',uuid,'" class="gallery-image"/>',
                    '<div class="foot">'
            ];
            if(group){
                html.push(...[
                        '<a class="icon left" href="#!" onclick="left_img(\'',uuid,'\')" data-for="',uuid,'"><img src="left.svg" width="30"/></a>',
                ]);
            }
            html.push(...[
                        '<a class="icon chat" target="_blank" href="',wa_link,'"><img src="chat.svg" width="30"/></a>',
                        '<a class="icon email" target="_blank" href="',email,'"><img src="email.svg" width="30"/></a>',
                        '<a class="icon eye" target="_blank" download="',file,'" href="',src,'"><img src="download.svg" width="30"/></a>'
            ]);
            if(group){
                html.push(...[
                        '<a class="icon right" href="#!" onclick="right_img(\'',uuid,'\')" data-for="',uuid,'"><img src="right.svg" width="30"/></a>',
                ]);
            }
            html.push(...[
                    '</div>',
                '</div>'
            ]);
            listEl.innerHTML += html.join('');
            lazy_img(src, uuid);
        });
        scroller();
    };

    var push_categories = function (data){
        console.log('categories',data);
        let catEl = document.querySelector('#cat');
        var first = null;
        data.forEach(item => {
            var list = document.createElement('li');
            catEl.appendChild(list);
            var a = document.createElement('a');
            list.appendChild(a);
            a.className =  'd-link';
            a.href =  "#";
            a.setAttribute('data-val',item.value);
            a.setAttribute('data-txt',item.text);
            a.textContent = item.text;
            a.onclick = on_category_changed;
            if(!first){
                first = a;
            }
        });
        first.click();
    };

    function outViewport(el){
        var rect = el.getBoundingClientRect();
        return (
            rect.bottom < 0 || 
            rect.right < 0 || 
            rect.left > window.innerWidth || 
            rect.top > window.innerHeight
        );
    }

    function loadMore(){
        if(moreLocked || !cath || !cat_item){
            return;
        }
        moreLocked = true;
        var cat_id = cat_item.val;
        loadNewScript([medUrl,'?pos=',pos,'&cat_id=',cat_id,'&ts=',Date.now()].join(''))
    }

    function scroller() {
        if (outViewport(lastEl))return;
        loadMore();
    }

    function on_category_changed(e){
        e.preventDefault();
        cat_item = {'val':this.getAttribute('data-val'),'txt':this.getAttribute('data-txt')};
        pos = 0;
        cath.textContent = cat_item.txt;
        listEl.innerHTML = '';
        catbar.classList.remove('left-0');
        noteEl.classList.remove('d-none');
        lastEl.classList.remove('d-none');
        resEl.classList.add('d-none');
        hadEl.classList.add('d-none');
        loadMore();
        return false;
    }

    function tgl_sidebar(show){
        tgl.checked = show;
    }

    function page_init(){
        listEl = document.querySelector('.gallery');
        lastEl = document.querySelector('.loader');
        noteEl = document.querySelector('#load-note');
        resEl = document.querySelector('#no-result');
        hadEl = document.querySelector('#last-result');
        cath = document.querySelector('#cath');
        catbar = document.querySelector('.sidebar.cat');
        tgl = document.querySelector('#toggle');
        cath.addEventListener('click', e => {
            e.preventDefault();
            let open = 'left-0';
            if(catbar.classList.contains(open)){
                catbar.classList.remove(open);
            } else{
                catbar.classList.add(open);	
            }
            return false;
        });
        loadNewScript(catUrl);
    }

    function lazy_img(src, id){
        document.getElementById(id).src = 'fashluxee-logo-transformed.png';
        var img = new Image();
        img.onload = function(){
            document.getElementById(id).src = src;
        };
        img.src = src;
    }

    var groups = {};
    function put_group(urls, uuid, show){
        groups[uuid] = {
            'urls':urls,
            'show':show
        }
    }

    function left_img(uuid){
        var group = groups[uuid];
        if(!group) return;
        var show = group.show;
        if(0 === show) return;
        show -= 1;
        var urls = group.urls;
        var src = urls[show];
        if(!src) return;
        group.show = show;
        groups[uuid] = group;
        lazy_img(src, uuid);
    }

    function right_img(uuid){
        var group = groups[uuid];
        if(!group) return;
        var urls = group.urls;
        var show = group.show;
        var maxi = urls.length - 1;
        if(maxi === show) return;
        show += 1;
        var src = urls[show];
        if(!src) return;
        group.show = show;
        groups[uuid] = group;
        lazy_img(src, uuid);
    }

    window.push_medias = push_medias;
    window.push_categories = push_categories;
    window.left_img = left_img;
    window.right_img = right_img;
    document.addEventListener("scroll", scroller, false);
    document.addEventListener("DOMContentLoaded", page_init, false);
})(window, document);
