import {useCallback, useEffect, useState} from "react";
import {UnixTimestampToDate} from "./Games";
export default function Table(data : any) {
    const [game,
        setGame] = useState([]);
    const [sortConfig,
        setSortConfig] = useState("");
    useEffect(useCallback(() => {
        try {
            setGame(data['data']);
        } catch (error) {
            window.alert(error.message);
        }
    }, [game]), []);
    function sortByName() {
        const dataSort = [...game].sort((a, b) => {
            return sortConfig === "name"
                ? a
                    .displayName
                    .localeCompare(b.displayName)
                : b
                    .displayName
                    .localeCompare(a.displayName);
        });
        setSortConfig(sortConfig === "name"
            ? ""
            : "name");
        setGame(dataSort);
    }

    function sortByDesc() {
        const dataSort = [...game].sort((a, b) => {
            return sortConfig === "desc"
                ? a
                    .description
                    .localeCompare(b.description)
                : b
                    .description
                    .localeCompare(a.description);
        });
        setSortConfig(sortConfig === "desc"
            ? ""
            : "desc");
        setGame(dataSort);
    }

    function sortByProcent() {
        const dataSort = [...game].sort((a, b) => {
            return sortConfig === "proc"
                ? a.percent - b.percent
                : b.percent - a.percent;
        });
        setSortConfig(sortConfig === "proc"
            ? ""
            : "proc");
        setGame(dataSort);
    }

    function sortByData() {
        const dataSort = [...game].sort((a, b) => {
            if (a.unlocktime === 0 && b.unlocktime === 0) {
                return 0;
            }
            if (a.unlocktime === 0) {
                return 1;
            }
            if (b.unlocktime === 0) {
                return -1;
            }
            return sortConfig === "data"
                ? a.unlocktime - b.unlocktime
                : b.unlocktime - a.unlocktime;
        });
        setSortConfig(sortConfig === "data"
            ? ""
            : "data");
        setGame(dataSort);
    }

    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th onClick={sortByName}>Название</th>
                    <th onClick={sortByDesc}>Описание</th>
                    <th onClick={sortByProcent}>Процент у игроков</th>
                    <th onClick={sortByData}>Дата получения</th>
                </tr>
            </thead>
            <tbody>
            {game.map((achivment : any) => (
                <tr
                    className={achivment.percent <= 5
                    ? "rare1"
                    : ""}>
                    <td style={{
                        width: "3em"
                    }}>
                        <img
                            style={{
                            width: "2.5em"
                        }}
                            className={achivment.percent <= 5
                            ? "rare1"
                            : achivment.percent <= 20
                                ? "rare2"
                                : achivment.percent <= 45
                                    ? "rare3"
                                    : achivment.percent <= 60
                                        ? "rare4"
                                        : "rare5"}
                            src={achivment.achieved
                            ? achivment.icon
                            : achivment.icongray}></img>
                    </td>
                    <td>{achivment.displayName}</td>
                    <td>{achivment.description}</td>
                    <td>{(parseFloat(achivment.percent)).toFixed(2)}
                        %</td>
                    <td>{UnixTimestampToDate(achivment.unlocktime) == "1970.1.1"
                            ? "-"
                            : UnixTimestampToDate(achivment.unlocktime)}</td>
                </tr>
            ))}</tbody>

        </table>
    );
};