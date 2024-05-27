import { useState, useEffect } from "react";

export default function Pokedex() {
    const [id, setId] = useState(387); // ID inicial do Pokémon
    const [pokemon, setPokemon] = useState(null);
    const [shiny, setShiny] = useState(false); // Estado para visualização shiny
    const [form, setForm] = useState(null); // Estado para a forma atual do Pokémon
    const [forms, setForms] = useState([]); // Estado para as formas disponíveis

    const fetchData = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            setPokemon(data);

            // Verifica se o Pokémon possui múltiplas formas
            if (data.forms.length > 1) {
                const formsData = await Promise.all(data.forms.map(async (form) => {
                    const formResponse = await fetch(form.url);
                    return await formResponse.json();
                }));
                setForms(formsData);
                setForm(formsData[0]); // Define a primeira forma como a forma inicial
            } else {
                setForms([]);
                setForm(null);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const nextPokemon = () => {
        if (id < 493) { // Limite superior baseado na região de Sinnoh
            setId(id + 1);
            setShiny(false); // Resetar visualização shiny ao mudar de Pokémon
        }
    };

    const previousPokemon = () => {
        if (id > 387) {
            setId(id - 1);
            setShiny(false); // Resetar visualização shiny ao mudar de Pokémon
        }
    };

    const toggleShiny = () => {
        setShiny(!shiny);
    };

    const nextForm = () => {
        if (forms.length > 1) {
            const currentIndex = forms.indexOf(form);
            const nextIndex = (currentIndex + 1) % forms.length;
            setForm(forms[nextIndex]);
        }
    };

    const previousForm = () => {
        if (forms.length > 1) {
            const currentIndex = forms.indexOf(form);
            const previousIndex = (currentIndex - 1 + forms.length) % forms.length;
            setForm(forms[previousIndex]);
        }
    };

    return (
        <div className="container-pokemon">
            {pokemon && (
                <div className="pokemon">
                    <h1>Pokedex Sinnoh</h1>
                    <p>{form ? form.name : pokemon.name}</p>
                    {/* <p>Peso: {pokemon.weight}g</p> */}
                    <img
                        id="imgPoke"
                        src={
                            shiny
                                ? form ? form.sprites.front_shiny : pokemon.sprites.front_shiny
                                : form ? form.sprites.front_default : pokemon.sprites.front_default
                        }
                        alt={form ? form.name : pokemon.name}
                    />
                    <div className="buttons">
                    <button onClick={previousPokemon}>Anterior</button>
                    <button onClick={nextPokemon}>Próximo</button>
                    <button onClick={toggleShiny}>
                        {shiny ? "Normal" : "Shiny"}
                    </button>
                    {forms.length > 1 && (
                        <>
                            <button onClick={previousForm}>Forma Anterior</button>
                            <button onClick={nextForm}>Próxima Forma</button>
                        </>
                    )}
                    </div>
                    {/* <p>{id}</p> */}
                </div>
            )}
        </div>
    );
}