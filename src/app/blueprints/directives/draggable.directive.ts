import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import interact from 'interactjs';

@Directive({
    selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {

    @Input()
    objectData: any;

    @Input()
    options: any;

    @Output()
    draggableClick = new EventEmitter();

    @Output()
    dragging = new EventEmitter();

    private currentlyDragged = false;

    constructor(private element: ElementRef) {}

    @HostListener('click', ['$event'])
    public onClick(event: any): void {
        if (!this.currentlyDragged) {
            this.draggableClick.emit(event);
        }
    }

    ngOnInit(): void {
        interact(this.element.nativeElement)
            .draggable(Object.assign({}, this.options || {}))
            .on('dragmove', (event) => {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);

                target.classList.add('getting-dragged');
                this.currentlyDragged = true;
                (window as any).dragData = {x, y, id: this.objectData.id};
                this.dragging.emit({x, y, id: this.objectData.id});
                event.target.style.transform = 'none';
                event.target.removeAttribute('data-x');
                event.target.removeAttribute('data-y');
                event.target.classList.remove('getting-dragged');
                // update the posiion attributes
                setTimeout(() => {
                    (window as any).dragData = null;
                    this.currentlyDragged = false;
                });
            })
            .on('dragend', (event) => {
                event.target.style.transform = 'none';
                event.target.removeAttribute('data-x');
                event.target.removeAttribute('data-y');
                event.target.classList.remove('getting-dragged');
                // update the posiion attributes
                setTimeout(() => {
                    (window as any).dragData = null;
                    this.currentlyDragged = false;
                });
            });
    }
}
