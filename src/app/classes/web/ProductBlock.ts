export class ProductBlock {
  index?: number | undefined;
  title?: string | undefined;
  img?: string | undefined;
  description?: string | undefined;
  link?: string | undefined;

  constructor(
    index?: number | undefined,
    title?: string | undefined,
    img?: string | undefined,
    description?: string | undefined,
    link?: string | undefined
  ) {
    this.index = index ? index : undefined;
    this.title = title ? title : undefined;
    this.img = img ? img : undefined;
    this.description = description ? description : undefined;
    this.link = link ? link : undefined;
  }
}
