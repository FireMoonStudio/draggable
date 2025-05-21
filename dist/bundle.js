(function () {
    'use strict';

    window.addEventListener('DOMContentLoaded', () => {
        class Draggable {
            constructor(selector) {
                this.elements = document.querySelectorAll(selector);
                this.dragging = null;
                this.init();
            }

            init() {
                this.elements.forEach(el => {
                    // إذا لم يكن للعنصر موقع مناسب، عيّنه
                    const style = window.getComputedStyle(el);
                    if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
                        el.style.position = 'absolute';
                    }

                    // إبطال السلوك الافتراضي للسحب القياسي
                    el.addEventListener('dragstart', e => e.preventDefault());

                    // إعداد المستمعين للفأرة واللمس
                    el.addEventListener('mousedown', e => this.startDrag(e, el));
                    el.addEventListener('touchstart', e => {
                        e.preventDefault();
                        this.startDrag(e.touches[0], el);
                    }, { passive: false });
                });

                document.addEventListener('mousemove', e => this.onDrag(e));
                document.addEventListener('touchmove', e => {
                    if (this.dragging) {
                        e.preventDefault();
                        this.onDrag(e.touches[0]);
                    }
                }, { passive: false });

                document.addEventListener('mouseup', () => this.endDrag());
                document.addEventListener('touchend', () => this.endDrag());
            }

            startDrag(e, el) {
                e.preventDefault();
                this.dragging = el;
                this.offsetX = e.clientX - el.offsetLeft;
                this.offsetY = e.clientY - el.offsetTop;
            }

            onDrag(e) {
                if (!this.dragging) return;
                let x = e.clientX - this.offsetX;
                let y = e.clientY - this.offsetY;

                // حافظ على العنصر داخل إطار النافذة
                const maxX = window.innerWidth - this.dragging.offsetWidth;
                const maxY = window.innerHeight - this.dragging.offsetHeight;
                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));

                this.dragging.style.left = `${x}px`;
                this.dragging.style.top = `${y}px`;
            }

            endDrag() {
                this.dragging = null;
            }
        }

        new Draggable('[data-draggable="true"]');
    });


})();
