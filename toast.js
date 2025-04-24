'use strict';
    function createToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
          toast.style.animation = 'slideOut 0.5s ease forwards';
          setTimeout(() => toast.remove(), 500);
        }, 4000);
      }