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
    var catEl = null;
    var noteEl = null;
    var resEl = null;
    var hadEl = null;
    var datUrl = 'https://luxury.pythonanywhere.com';
    var catUrl = datUrl + '/category-list';
    var medUrl = datUrl + '/media-list';
    var vcard_url = datUrl + '/upload-vcard';
    var pos = 0;
    var moreLocked = false;
    var cath = null;
    var tgl = null;
    var invite = null;

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
                        '<a class="d-link" target="_blank" href="',wa_link,'">WhatsApp</a>',
                        '<a class="d-link" target="_blank" href="',email,'">Email</a>',
                    '</div>',
                '</div>'
            ].join('');
        });
        scroller();
    };

    var push_categories = function (data){
        console.log('categories',data);
        data.forEach(item => {
            var option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            catEl.appendChild(option);
        });
        update_cat_text();
        loadMore();
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

    function update_cat_text(){
        cath.textContent = catEl.options[catEl.selectedIndex].text;
    }

    function on_category_changed(e){
        e.preventDefault();
        tgl_sidebar(false);
        pos = 0;
        listEl.innerHTML = '';
        update_cat_text();
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

    function on_invite(e){
        e.preventDefault();
        tgl_sidebar(false);
        const file = invite.files[0];
        if(!file){
            createToast('Missing attachment','warning');
            return false;
        }
        if(!file.size){
            createToast('Attachment is blank','warning');
            return false;
        }
        if(!file.name.endsWith('.vcf')){
            createToast('Attachment is not supported','warning');
            return false;
        }

        createToast('Inviting contacts ...','info');
        const formData = new FormData();
        formData.append("vcard", file);

        fetch(vcard_url, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(reply => createToast(reply.message, reply.status))
        .catch(err => createToast('Invitation failed','error'));
        invite.value='';
        return false;
    }

    function page_init(){
        listEl = document.querySelector('.gallery');
        lastEl = document.querySelector('.loader');
        catEl = document.querySelector('#cat');
        noteEl = document.querySelector('#load-note');
        resEl = document.querySelector('#no-result');
        hadEl = document.querySelector('#last-result');
        cath = document.querySelector('#cath');
        tgl = document.querySelector('#toggle');
        invite = document.querySelector('#vcfFile');
        catEl.addEventListener("change", on_category_changed, false);
        cath.addEventListener('click', e => {
            e.preventDefault();
            tgl_sidebar(!tgl.checked);
            return false;
        });
        invite.addEventListener('change', on_invite, false);
        loadNewScript(catUrl);
    }
    function createToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
  
        container.appendChild(toast);
  
        // Auto remove toast after 4s with slideOut animation
        setTimeout(() => {
          toast.style.animation = 'slideOut 0.5s ease forwards';
          setTimeout(() => toast.remove(), 500);
        }, 4000);
      }
    window.push_medias = push_medias;
    window.push_categories = push_categories;
    document.addEventListener("scroll", scroller, false);
    document.addEventListener("DOMContentLoaded", page_init, false);   
})(window, document);
