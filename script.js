'use strict';
(function(){
    var msg = encodeURIComponent('Hi Fashluxee,\nI would like to talk about this item: \n\n ');
    var phone = '919503021689';
    var wsl = 'https://api.whatsapp.com/send?phone='+phone+'&text='+msg;
    var vdos = /(mp4|3gp|ogg|avi|mov|wmv|flv|webm|mkv)/;
    var poto = /(png|jpg|jpeg|gif|webp|bmp|tiff|svg)/;
    var pos = -1;
    var mail_to='mailto:brandreplicastore@gmail.com?cc=tanzil.memon03@gmail.com&subject=Catalog%20Product%20Enquiry&body=';
    var listEl = null;
    var lastEl = null;
    var catEl = null;
    var noteEl = null;
    var resEl = null;
    var hadEl = null;
    var datUrl = 'http://tecq.free.nf/cors';
    var catUrl = datUrl + '/category-list.php';
    var medUrl = datUrl + '/media-list.php';
    var pos = 0;
    var moreLocked = false;
    var lazyJs = null;

    function loadNewScript(src) {
      const newSrc = `$src?v=${Date.now()}`;
      lazyJs.src = newSrc;
    }

    function push_medias(data){
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
             if(poto.test(src)){
                media = ['<img src="',src,'" class="gallery-image"/>'].join('');
            } else if(vdos.test(src)){
                media = [
                '<video class="gallery-image" autoplay="" muted="" playsinline="" loop="">',
                    '<source src="',src,'" />',
                '</video>'
                ].join('');
            }
            var link = encodeURIComponent(src);
            var wa_link = wsl + link;
            var email = mail_to + msg + link;
            listEl.innerHTML += [
                '<div class="gallery-item" tabindex="0">',
                media,
                '<div class="gallery-item-info">',
                    '<a class="d-link" target="_blank" href="',src,'">View</a><br/>',
                    '<a class="d-link" target="_blank" href="',wa_link,'">WhatsApp</a>',
                    '<a class="d-link" target="_blank" href="',email,'">Email</a>',
                '</div>',
                '</div>'
            ].join('');
        });
        scroller();
    }

    function push_categories(data){
        console.log('categories',data);
        data.forEach(item => {
            var option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            catEl.appendChild(option);
        });
        loadMore();
    }

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
        if(moreLocked){
            return;
        }
        moreLocked = true;
        var cat_id = catEl.value;
        loadNewScript([medUrl,'?pos=',pos,'&cat_id=',cat_id,'&ts=',Date.now()].join(''))
    }

    function scroller() {
        if (outViewport(lastEl))return;
        loadMore();
    }

    document.addEventListener("scroll", scroller, false);

    catEl.addEventListener("change", function(){
        pos = 0;
        listEl.innerHTML = '';
        noteEl.classList.remove('d-none');
        lastEl.classList.remove('d-none');
        resEl.classList.add('d-none');
        hadEl.classList.add('d-none');
        loadMore();
    }, false);

    document.addEventListener("DOMContentLoaded", function(){
        listEl = document.querySelector('.gallery');
        lastEl = document.querySelector('.loader');
        catEl = document.querySelector('#cat');
        noteEl = document.querySelector('#load-note');
        resEl = document.querySelector('#no-result');
        hadEl = document.querySelector('#last-result');
        lazyJs = document.querySelector('#lazyJs');
        loadNewScript(catUrl);
    }, false);   
})();
