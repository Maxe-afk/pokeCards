import { useEffect, useState } from "react";
import { PokemonCard } from "../model/PokemonCard";

const pokemonCards: PokemonCard[] = [
  new PokemonCard("Salamèche", "Salamèche.png", 150, ["fire"]),
];

export const FetchApi = () => {
  const [cards, setCards] = useState(pokemonCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.pokemontcg.io/v2/cards?q=set.id:base4&pageSize=250"
        );

        if (!response.ok) {
          throw new Error("Error");
        }
        const result = await response.json();
        console.log(result);
        const newPokemons: PokemonCard[] = [];
        result.data.map((newEntry) => {
          newPokemons.push(
            new PokemonCard(
              newEntry.name,
              newEntry.images.large,
              newEntry.cardmarket.prices.averageSellPrice,
              newEntry.types
            )
          );
        });
        setCards(newPokemons);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h1>Données récupérées :</h1>
      {cards.length > 0 &&
        cards.map((card) => (
          <div key={card.name}>
            <h2>{card.name}</h2>
            <img src={card.picture} />
            <p>{card.price}€</p>
          </div>
        ))}
    </div>
  );
};
