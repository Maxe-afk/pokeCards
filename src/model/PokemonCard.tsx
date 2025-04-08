export class PokemonCard {
  constructor(
    public id: string,
    public name: string,
    public picture: string,
    public price: number,
    public types: string[]
  ) {}
}
