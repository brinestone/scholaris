import { PlotData } from '@/models/plot-data';
import { Component, computed, effect, ElementRef, inject, input, OnDestroy, signal, ViewChild } from '@angular/core';
import { axisBottom, extent, line, scaleLinear, select } from 'd3';

@Component({
  selector: 'sc-line-plot',
  standalone: true,
  imports: [],
  templateUrl: './line-plot.component.html',
  styleUrl: './line-plot.component.scss'
})
export class LinePlot implements OnDestroy {
  // readonly gx = viewChild<ElementRef<SVGGeometryElement>>('gx') as Signal<ElementRef<SVGGeometryElement>>
  // readonly gy = viewChild<ElementRef<SVGGeometryElement>>('gy') as Signal<ElementRef<SVGGeometryElement>>;
  @ViewChild('gx', { static: true })
  readonly gx!: ElementRef<SVGGElement>;
  @ViewChild('gy', { static: true })
  readonly gy!: ElementRef<SVGGElement>;

  readonly ref: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  readonly dimensions = signal({ width: this.ref.nativeElement.clientWidth, height: this.ref.nativeElement.clientHeight });
  readonly marginBottom = input(30);
  readonly marginTop = input(20);
  readonly marginLeft = input(40);
  readonly marginRight = input(20);
  readonly data = input<PlotData[]>([]);

  readonly bounds = computed(() => {
    const xValues = this.data().flatMap(([x]) => x);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const yValues = this.data().flatMap(([_, y]) => y);

    return {
      x: extent(xValues),
      y: extent(yValues)
    }
  })

  readonly x = computed(() => {
    const [minX, maxX] = this.bounds().x;
    return scaleLinear([minX ?? 0, maxX ?? 0], [this.marginLeft(), this.dimensions().width - this.marginLeft()])
  });
  readonly y = computed(() => {
    const [minY, maxY] = this.bounds().y;
    return scaleLinear([minY ?? 0, maxY ?? 0], [this.dimensions().height - this.marginBottom(), this.marginTop()]);
  });
  readonly plotLine = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return line<PlotData>(([x]) => x, ([_, y]) => y)(this.data());
  });

  private dimensionsObserver: ResizeObserver;
  constructor() {
    this.dimensionsObserver = new ResizeObserver(([{ contentRect }]) => {
      this.dimensions.set({
        width: contentRect.width,
        height: contentRect.height
      })
    });
    this.dimensionsObserver.observe(this.ref.nativeElement);

    effect(() => select(this.gx.nativeElement).call(axisBottom(this.x()) as any))
    effect(() => select(this.gy.nativeElement).call(axisBottom(this.y()) as any))
  }

  ngOnDestroy(): void {
    this.dimensionsObserver.unobserve(this.ref.nativeElement);
  }
}
