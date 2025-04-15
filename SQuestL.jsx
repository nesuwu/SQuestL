import React, { useState, useCallback } from 'react';
import { render, Box, Text, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';

const missions = [
    {
        Q: "Zacznij od podstaw: Wyciągnij wszystkie dane z tabeli 'inventory'.",
        P: '^SELECT \\* FROM inventory;?$', H: "SELECT * FROM inventory;",
        flavor: "Magiczne inwentarze lubią się gubić. Zacznijmy od inwentaryzacji."
    },
    {
        Q: "Zaktualizuj ilość produktu 'Dark Roast' na 42 w tabeli 'coffee'.",
        P: "^UPDATE coffee SET amount = 42 WHERE name = 'Dark Roast';?$", H: "UPDATE coffee SET amount = 42 WHERE name = 'Dark Roast';",
        flavor: "Kawa to podstawa. Bez niej system padnie!"
    },
    {
        Q: "Dodaj nową pozycję do tabeli 'books': 'Necronomicon', autor 'Unknown'.",
        P: "^INSERT INTO books \\(title, author\\) VALUES \\('Necronomicon', 'Unknown'\\);?$", H: "INSERT INTO books (title, author) VALUES ('Necronomicon', 'Unknown');",
        flavor: "Biblioteka bez Necronomiconu? To nie przejdzie."
    },
    {
        Q: "Usuń rekord klienta o ID 13 z tabeli 'clients'.",
        P: "^DELETE FROM clients WHERE id = 13;?$", H: "DELETE FROM clients WHERE id = 13;",
        flavor: "Klient 13 to pechowy numer. Lepiej go usunąć."
    },
    {
        Q: "Wyciągnij kolumny name i level z tabeli 'wizards'.",
        P: "^SELECT name, level FROM wizards;?$", H: "SELECT name, level FROM wizards;",
        flavor: "Czas sprawdzić poziom magii w zespole."
    },
    {
        Q: "Zaktualizuj status 'cursed' na 'false' w tabeli 'artifacts' dla artifact_id 66.",
        P: "^UPDATE artifacts SET cursed = false WHERE artifact_id = 66;?$", H: "UPDATE artifacts SET cursed = false WHERE artifact_id = 66;",
        flavor: "Artefakt #66 jest przeklęty. Odczaruj go!"
    },
    {
        Q: "Zlicz ilu jest użytkowników w tabeli 'users'.",
        P: "^SELECT COUNT\\(\\*\\) FROM users;?$", H: "SELECT COUNT(*) FROM users;",
        flavor: "Ilu ludzi korzysta z systemu? Sprawdźmy."
    },
    {
        Q: "Pokaż tylko produkty, których cena przekracza 100 z tabeli 'products'.",
        P: "^SELECT \\* FROM products WHERE price > 100;?$", H: "SELECT * FROM products WHERE price > 100;",
        flavor: "Czas na audyt drogich produktów."
    },
    {
        Q: "Pobierz tylko klientów z miasta 'Gotham' z tabeli 'clients'.",
        P: "^SELECT \\* FROM clients WHERE city = 'Gotham';?$", H: "SELECT * FROM clients WHERE city = 'Gotham';",
        flavor: "Gotham... coś tu śmierdzi."
    },
    {
        Q: "Zmień nazwę użytkownika z ID 5 na 'rootkitty' w tabeli 'users'.",
        P: "^UPDATE users SET username = 'rootkitty' WHERE id = 5;?$", H: "UPDATE users SET username = 'rootkitty' WHERE id = 5;",
        flavor: "Ktoś zmienia tożsamość... Podejrzane."
    },
    {
        Q: "Wstaw do tabeli 'music' nowy wpis: tytuł 'Hexbeat', artysta 'Void.exe'.",
        P: "^INSERT INTO music \\(title, artist\\) VALUES \\('Hexbeat', 'Void\\.exe'\\);?$", H: "INSERT INTO music (title, artist) VALUES ('Hexbeat', 'Void.exe');",
        flavor: "Nowy hit na playlistę serwerowni!"
    },
    {
        Q: "Usuń wszystkie dane z tabeli 'temp_data'.",
        P: "^DELETE FROM temp_data;?$", H: "DELETE FROM temp_data;",
        flavor: "Czas posprzątać tymczasowe dane."
    },
    {
        Q: "Ktoś podmienił dane! Przywróć status 'active' dla wszystkich użytkowników w tabeli 'users'.",
        P: "^UPDATE users SET status = 'active';?$", H: "UPDATE users SET status = 'active';",
        flavor: "Sabotaż! Przywróć porządek."
    },
    {
        Q: "Zlicz ile jest przeklętych artefaktów w tabeli 'artifacts'.",
        P: "^SELECT COUNT\\(\\*\\) FROM artifacts WHERE cursed = true;?$", H: "SELECT COUNT(*) FROM artifacts WHERE cursed = true;",
        flavor: "Ile klątw jeszcze zostało?"
    },
    {
        Q: "Wyświetl wszystkich użytkowników posortowanych malejąco po XP.",
        P: "^SELECT \\* FROM users ORDER BY xp DESC;?$", H: "SELECT * FROM users ORDER BY xp DESC;",
        flavor: "Kto jest najlepszym magiem SQL?"
    },
    {
        Q: "Ostatnia misja! Znajdź użytkownika o najwyższym poziomie w tabeli 'wizards'.",
        P: "^SELECT \\* FROM wizards ORDER BY level DESC LIMIT 1;?$", H: "SELECT * FROM wizards ORDER BY level DESC LIMIT 1;",
        flavor: "Czas poznać arcymaga... i sabotażystę!"
    }
];

function highlightSQL(sql) {
    return (
        <Text>
            {sql.split(/(\s+)/).map((word, i) => {
                if (/^(SELECT|FROM|WHERE|UPDATE|SET|INSERT|INTO|VALUES|DELETE|COUNT|AS|ORDER BY|GROUP BY|LIMIT|OFFSET|JOIN|ON|INNER|LEFT|RIGHT|FULL|DISTINCT)$/i.test(word))
                    return <Text key={i} color="blueBright" bold>{word}</Text>;
                if (/^(AND|OR|NOT|NULL|TRUE|FALSE)$/i.test(word))
                    return <Text key={i} color="magentaBright">{word}</Text>;
                if (/^(COUNT|SUM|AVG|MIN|MAX)$/i.test(word))
                    return <Text key={i} color="cyanBright">{word}</Text>;
                if (/^'.*'$/.test(word))
                    return <Text key={i} color="yellowBright">{word}</Text>;
                if (/^\d+$/.test(word))
                    return <Text key={i} color="greenBright">{word}</Text>;
                if (/^(=|<>|!=|<=|>=|<|>)$/.test(word))
                    return <Text key={i} color="redBright">{word}</Text>;
                return <Text key={i}>{word}</Text>;
            })}
        </Text>
    );
}

const tableStructures = {
    inventory: "Tabela inventory: (id, name, amount)",
    coffee: "Tabela coffee: (id, name, amount)",
    books: "Tabela books: (id, title, author)",
    clients: "Tabela clients: (id, name, city)",
    wizards: "Tabela wizards: (id, name, level)",
    artifacts: "Tabela artifacts: (artifact_id, name, cursed)",
    users: "Tabela users: (id, username, status, xp)",
    products: "Tabela products: (id, name, price)",
    music: "Tabela music: (id, title, artist)",
    temp_data: "Tabela temp_data:e (id, value)"
};

function getTableForMission(mission) {
    const regex = /FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)|INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)|UPDATE\s+([a-zA-Z_][a-zA-Z0-9_]*)|DELETE\s+FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/i;
    const match = mission.P.match(regex);
    if (match) {
        for (let i = 1; i < match.length; ++i) {
            if (match[i]) return match[i];
        }
    }
    for (const table of Object.keys(tableStructures)) {
        if (mission.Q.includes(`'${table}'`) || mission.Q.includes(`"${table}"`) || mission.Q.includes(table)) {
            return table;
        }
    }
    return null;
}

const TitleCard = ({ xp }) => {
    let msg = '';
    let color = 'gray';
    if (xp >= 150) {
        msg = '🏆 Tytuł: SGI – Sztuczna Generalna Inteligencja';
        color = 'magenta';
    } else if (xp >= 100) {
        msg = '🤖 Tytuł: SI – Ekspert Optymalizacji';
        color = 'cyan';
    } else if (xp >= 60) {
        msg = '🧠 Tytuł: SI – Analityk Systemowy';
        color = 'blue';
    } else if (xp >= 30) {
        msg = '🔎 Tytuł: Algorytm Samorozwijający';
        color = 'green';
    } else {
        msg = '📉 Awaria produkcji... próbuj dalej';
        color = 'gray';
    }
    return <Box justifyContent="center"><Text backgroundColor={color} color="white">{msg}</Text></Box>;
};

const StatusBar = ({ xp, streak }) => (
    <Box justifyContent="center" marginY={1}>
        <Text backgroundColor="magenta" color="white">{` XP: ${xp} | Seria: ${streak} `}</Text>
    </Box>
);

const Boxed = ({ children, color = 'white' }) => (
    <Box
        borderStyle="double"
        borderColor={color}
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        marginBottom={1}
    >
        {children}
    </Box>
);

const TaskLayout = ({ Q, xp, streak, flavor, ...mission }) => {
    const table = getTableForMission(mission);
    return (
        <>
            <Boxed color="cyan">
                <Box width="100%" flexDirection="column" alignItems="center">
                    <Box justifyContent="center">
                        <Text color="cyanBright">█ MISJA: </Text>
                        <Text>{Q}</Text>
                    </Box>
                    {table && (
                        <Box marginTop={1} flexDirection="column" alignItems="center">
                            <Text color="yellowBright">Struktura tabeli:</Text>
                            <Text color="gray">{tableStructures[table]}</Text>
                        </Box>
                    )}
                </Box>
            </Boxed>
            <Boxed color="gray">
                <Text color="gray">{flavor}</Text>
            </Boxed>
            <StatusBar xp={xp} streak={streak} />
        </>
    );
};

const EditorAndHint = ({ sqlInput, hint, onChange, onSubmit, showHint }) => {
    const showInput = typeof onChange === "function";
    return (
        <Box flexDirection="column" marginBottom={1}>
            <Box>
                <Text color="greenBright">💾 SQL Editor: </Text>
                <Box>
                    {highlightSQL(sqlInput.length === 0 ? ' ' : sqlInput)}
                </Box>
                {showInput && (
                    <Box height={0} width={0} overflow="hidden">
                        <TextInput value={sqlInput} onChange={onChange} onSubmit={onSubmit} />
                    </Box>
                )}
            </Box>
            {showHint && (
                <Box marginTop={1} flexDirection="column">
                    <Text color="yellowBright">💡 Podpowiedź:</Text>
                    {highlightSQL(hint)}
                </Box>
            )}
        </Box>
    );
};

const Instructions = ({ onDone }) => {
    useInput((input, key) => {
        if (key.return) onDone();
    });
    return (
        <Boxed color="cyan">
            <Text color="cyanBright">Instrukcja gry SQ(uest)L:</Text>
            <Text>1. Odpowiadaj na pytania wpisując poprawne zapytania SQL.</Text>
            <Text>2. W każdej chwili możesz wpisać <Text color="yellowBright">hint</Text> aby zobaczyć podpowiedź.</Text>
            <Text>3. Wpisz <Text color="yellowBright">skip</Text> aby pominąć misję (XP -5).</Text>
            <Text>4. Wpisz <Text color="yellowBright">exit</Text> aby zakończyć grę.</Text>
            <Text>5. SQL jest podświetlany kolorami dla lepszej czytelności.</Text>
            <Text color="gray">[Naciśnij Enter, aby wrócić]</Text>
        </Boxed>
    );
};

const StoryIntro = ({ onContinue }) => {
    useInput((input, key) => {
        if (key.return) onContinue();
    });
    return (
        <Boxed color="magenta">
            <Text color="magentaBright">██ NULL&VOID Inc. — 2099, Cyber-Miasto - NeoPoznań ██</Text>
            <Text color="whiteBright">
                Jesteś zaawansowanym AI, powołanym do analizy i naprawy bazy danych firmy po serii sabotaży.
            </Text>
            <Text color="cyanBright">
                Twoja misja: Rozwiązuj kolejne zadania SQL, przywróć porządek w danych i odkryj, kto jest sabotażystą!
            </Text>
            <Text color="yellowBright">Wskazówki:</Text>
            <Text>- Wpisz <Text color="yellowBright">hint</Text> by zobaczyć podpowiedź</Text>
            <Text>- Wpisz <Text color="yellowBright">skip</Text> by pominąć misję (XP -5)</Text>
            <Text>- Wpisz <Text color="yellowBright">exit</Text> by zakończyć grę</Text>
            <Text color="gray">[Naciśnij Enter, aby kontynuować]</Text>
        </Boxed>
    );
};

const Ending = ({ xp, sabotagerRevealed, onDone }) => {
    useInput((input, key) => {
        if (key.return) onDone();
    });
    let msg, color;
    if (xp >= 120 && sabotagerRevealed) {
        msg = '🎉 Udało Ci się! Jako SI wykryłaś, że sabotażystą był... Twój stary proces monitorujący! (Znowu działał niezgodnie z algorytmem.)\n\nGratulacje, AI-Detektywie!';
        color = 'greenBright';
    } else if (xp >= 80) {
        msg = 'Baza uratowana, ale sabotażysta wciąż ukrywa się w systemie...';
        color = 'cyanBright';
    } else {
        msg = 'Baza ledwo zipie. Czas na optymalizację i aktualizację SI!';
        color = 'redBright';
    }
    return (
        <>
            <Boxed color={color}>
                <Text color={color}>{msg}</Text>
            </Boxed>
            <TitleCard xp={xp} />
            <Text color="gray">[Naciśnij Enter, aby zakończyć]</Text>
        </>
    );
};

const MainMenu = ({ onSelect }) => {
    const items = [
        { label: '▶ Start', value: 'start' },
        { label: '📖 Instrukcja', value: 'instrukcja' },
        { label: '⏻ Wyjście', value: 'exit' }
    ];
    return (
        <Box flexDirection="column">
            <Boxed color="magenta">
                <Text color="magentaBright">█████████████████████████████</Text>
                <Text color="magentaBright">     SQ(uest)L</Text>
                <Text color="magentaBright">█████████████████████████████</Text>
            </Boxed>
            <Text color="gray">Witamy w firmie: NULL&VOID Inc.</Text>
            <Text color="whiteBright">
                Jesteś SI do spraw bezpieczeństwa danych. Twoje zadanie: przeanalizuj bazę SQL i znajdź sabotażystę!
            </Text>
            <Text color="yellowBright">(SQL, algorytmy i wykrywanie oszustów.)</Text>
            <Box marginTop={1}>
                <SelectInput items={items} onSelect={item => onSelect(item.value)} />
            </Box>
        </Box>
    );
};

const Mission = ({ mission, xp, streak, onResult }) => {
    const didClear = React.useRef(false);
    if (!didClear.current && typeof process !== 'undefined' && process.stdout && process.stdout.write) {
        process.stdout.write('\x1Bc');
        didClear.current = true;
    }

    const [sqlInput, setSqlInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [awaitingRetry, setAwaitingRetry] = useState(false);
    const { exit } = useApp();

    React.useEffect(() => {
        setSqlInput('');
        setShowHint(false);
        setFeedback(null);
        setAwaitingRetry(false);
        didClear.current = false;
    }, [mission]);

    const handleSubmit = useCallback((value) => {
        const answer = value.trim();
        if (answer.toLowerCase() === 'hint') {
            setShowHint(true);
            setSqlInput('');
            return;
        }
        if (answer.toLowerCase() === 'skip') {
            onResult('skip');
            return;
        }
        if (answer.toLowerCase() === 'exit') {
            onResult('exit');
            return;
        }
        const regex = new RegExp(mission.P, 'i');
        if (regex.test(answer)) {
            setFeedback({ correct: true });
        } else {
            setFeedback({ correct: false });
            setAwaitingRetry(true);
        }
    }, [mission, onResult]);

    useInput((input, key) => {
        if (awaitingRetry && (input === 'y' || input === 'Y')) {
            setFeedback(null);
            setAwaitingRetry(false);
            setSqlInput('');
        } else if (awaitingRetry && (input === 'n' || input === 'N')) {
            onResult('skip');
        }
    });

    React.useEffect(() => {
        if (feedback && feedback.correct) {
            const timer = setTimeout(() => onResult(true), 800);
            return () => clearTimeout(timer);
        }
    }, [feedback, onResult]);

    if (feedback && feedback.correct) {
        return (
            <>
                <TaskLayout {...mission} xp={xp} streak={streak} />
                <EditorAndHint sqlInput={sqlInput} hint={mission.H} showHint={false} />
                <Boxed color="greenBright">
                    <Text color="greenBright">✅ Poprawne! XP++</Text>
                </Boxed>
            </>
        );
    }

    if (feedback && !feedback.correct) {
        return (
            <>
                <TaskLayout {...mission} xp={xp} streak={streak} />
                <EditorAndHint sqlInput={sqlInput} hint={mission.H} showHint={showHint} />
                <Boxed color="redBright">
                    <Text color="redBright">❌ To nie to, co chciałem, ale doceniam twój zapał.</Text>
                    <Text color="whiteBright">Spróbować jeszcze raz? (y/n)</Text>
                </Boxed>
            </>
        );
    }

    return (
        <>
            <TaskLayout {...mission} xp={xp} streak={streak} />
            <EditorAndHint
                sqlInput={sqlInput}
                hint={mission.H}
                showHint={showHint}
                onChange={setSqlInput}
                onSubmit={handleSubmit}
            />
            <Text color="gray">[Enter = zatwierdź, hint/skip/exit]</Text>
        </>
    );
};

const Game = () => {
    const [screen, setScreen] = useState('menu');
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [missionIdx, setMissionIdx] = useState(0);
    const [sabotagerRevealed, setSabotagerRevealed] = useState(false);

    const handleMenu = (choice) => {
        if (choice === 'start') {
            setXp(0);
            setStreak(0);
            setMissionIdx(0);
            setSabotagerRevealed(false);
            setScreen('intro');
        }
        else if (choice === 'instrukcja') setScreen('instrukcja');
        else if (choice === 'exit') process.exit(0);
    };

    const handleInstructionsDone = () => setScreen('menu');
    const handleIntroDone = () => setScreen('mission');

    const handleMissionResult = (result) => {
        if (result === 'exit') {
            setScreen('menu');
            setXp(0); setStreak(0); setMissionIdx(0); setSabotagerRevealed(false);
            return;
        }
        if (result === 'skip') {
            setXp(xp => Math.max(0, xp - 5));
            setStreak(0);
            setMissionIdx(idx => idx + 1);
            return;
        }
        if (result === true) {
            setXp(xp => xp + 10);
            setStreak(streak => streak + 1);
            if (missionIdx === missions.length - 1) setSabotagerRevealed(true);
            setMissionIdx(idx => idx + 1);
            return;
        }
        if (result === false) {
            setStreak(0);
            setMissionIdx(idx => idx + 1);
        }
    };

    if (screen === 'menu') return <MainMenu onSelect={handleMenu} />;
    if (screen === 'instrukcja') return <Instructions onDone={handleInstructionsDone} />;
    if (screen === 'intro') return <StoryIntro onContinue={handleIntroDone} />;
    if (screen === 'mission') {
        if (missionIdx >= missions.length)
            return <Ending xp={xp} sabotagerRevealed={sabotagerRevealed} onDone={() => setScreen('menu')} />;
        return (
            <Mission
                mission={missions[missionIdx]}
                xp={xp}
                streak={streak}
                onResult={handleMissionResult}
            />
        );
    }
    return null;
};

render(<Game />);