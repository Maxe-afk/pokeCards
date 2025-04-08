import Styles from "../components/SearchBar.module.css";

type Props = {
  onSearch: (query: string) => void;
};

export const Searchbar = ({ onSearch }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <form class={Styles.form}>
      <input
        type="text"
        onChange={handleChange}
        placeholder="Rechercher une carte"
      />
    </form>
  );
};
